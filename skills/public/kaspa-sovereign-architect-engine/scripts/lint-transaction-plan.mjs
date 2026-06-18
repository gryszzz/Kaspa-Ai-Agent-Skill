#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const secretKeyPattern = /(?:^|_)(?:seed|seedphrase|seed_phrase|mnemonic|privatekey|private_key|privkey|xprv|walletfile|wallet_file|recoverywords|recovery_words|signedtransaction|signed_transaction|signature|wif)(?:$|_)/i;
const secretTextPattern = /\b(seed phrase|mnemonic|private key|xprv|wallet file|recovery words|signed transaction)\b/i;
const networkNames = new Set([
  "mainnet",
  "kaspa",
  "kaspa-mainnet",
  "testnet",
  "kaspatest",
  "kaspa-testnet",
  "tn10",
  "tn11",
  "tn12",
  "devnet",
  "simnet",
]);

function usage() {
  return `Usage:
  node scripts/lint-transaction-plan.mjs path/to/plan.json
  node scripts/lint-transaction-plan.mjs --check
`;
}

function normalizeNetwork(value) {
  if (typeof value !== "string") return null;
  return value.trim().toLowerCase();
}

function networkClass(network) {
  if (network === "mainnet" || network === "kaspa" || network === "kaspa-mainnet") {
    return "mainnet";
  }
  if (
    network === "testnet" ||
    network === "kaspatest" ||
    network === "kaspa-testnet" ||
    /^tn\d+$/i.test(network)
  ) {
    return "testnet";
  }
  if (network === "devnet" || network === "simnet") {
    return network;
  }
  return "unknown";
}

function add(target, code, message, at = "$") {
  target.push({ code, message, path: at });
}

function walk(value, visitor, currentPath = "$") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, visitor, `${currentPath}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const nextPath = `${currentPath}.${key}`;
      visitor(key, child, nextPath);
      walk(child, visitor, nextPath);
    }
  }
}

function integerAmount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function readFee(plan, errors) {
  const hasCamel = Object.prototype.hasOwnProperty.call(plan, "feeSompi");
  const hasSnake = Object.prototype.hasOwnProperty.call(plan, "fee_sompi");
  if (!hasCamel && !hasSnake) {
    add(errors, "missing-fee", "feeSompi or fee_sompi is required");
    return 0;
  }
  if (hasCamel && hasSnake && plan.feeSompi !== plan.fee_sompi) {
    add(errors, "conflicting-fee", "feeSompi and fee_sompi are both present but disagree");
  }
  const fee = hasCamel ? plan.feeSompi : plan.fee_sompi;
  if (!integerAmount(fee)) {
    add(errors, "invalid-fee", "fee must be a non-negative safe integer in sompi");
    return 0;
  }
  return fee;
}

function validateAddressPrefix(address, networkKind, errors, at) {
  if (typeof address !== "string" || address.trim() === "") {
    add(errors, "missing-address", "output address is required", at);
    return;
  }
  if (networkKind === "mainnet" && !address.startsWith("kaspa:")) {
    add(errors, "wrong-address-network", "mainnet outputs must use kaspa: addresses", at);
  }
  if (networkKind === "testnet" && !address.startsWith("kaspatest:")) {
    add(errors, "wrong-address-network", "testnet/TN outputs must use kaspatest: addresses", at);
  }
}

export function lintTransactionPlan(plan) {
  const errors = [];
  const warnings = [];

  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    add(errors, "invalid-root", "plan root must be a JSON object");
    return { passed: false, errors, warnings };
  }

  walk(plan, (key, value, at) => {
    const normalizedKey = key.replace(/[-\s]/g, "_").toLowerCase();
    if (secretKeyPattern.test(normalizedKey)) {
      add(errors, "secret-field", "secret-like fields are forbidden", at);
    }
    if (typeof value === "string" && secretTextPattern.test(value)) {
      add(errors, "secret-text", "secret-like text is forbidden", at);
    }
  });

  const network = normalizeNetwork(plan.network);
  if (!network || !networkNames.has(network)) {
    add(errors, "invalid-network", "network must be explicit and recognized");
  }
  const kind = networkClass(network);

  if (typeof plan.purpose !== "string" || plan.purpose.trim() === "") {
    add(errors, "missing-purpose", "purpose must be a non-empty string");
  }

  const inputs = Array.isArray(plan.inputs) ? plan.inputs : null;
  const outputs = Array.isArray(plan.outputs) ? plan.outputs : null;
  if (!inputs || inputs.length === 0) {
    add(errors, "missing-inputs", "inputs must be a non-empty array");
  }
  if (!outputs || outputs.length === 0) {
    add(errors, "missing-outputs", "outputs must be a non-empty array");
  }

  let inputTotal = 0;
  let knownInputAmounts = true;
  (inputs || []).forEach((input, index) => {
    const at = `$.inputs[${index}]`;
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      add(errors, "invalid-input", "input must be an object", at);
      knownInputAmounts = false;
      return;
    }
    if (typeof input.txid !== "string" || input.txid.trim() === "") {
      add(errors, "missing-input-txid", "input txid is required", `${at}.txid`);
    }
    if (!Number.isSafeInteger(input.index) || input.index < 0) {
      add(errors, "invalid-input-index", "input index must be a non-negative safe integer", `${at}.index`);
    }
    if (integerAmount(input.sompi)) {
      inputTotal += input.sompi;
    } else {
      knownInputAmounts = false;
      add(warnings, "unknown-input-amount", "input sompi missing; value accounting is partial", `${at}.sompi`);
    }
  });

  let outputTotal = 0;
  let hasChange = false;
  (outputs || []).forEach((output, index) => {
    const at = `$.outputs[${index}]`;
    if (!output || typeof output !== "object" || Array.isArray(output)) {
      add(errors, "invalid-output", "output must be an object", at);
      return;
    }
    validateAddressPrefix(output.address, kind, errors, `${at}.address`);
    if (integerAmount(output.sompi)) {
      outputTotal += output.sompi;
    } else {
      add(errors, "invalid-output-amount", "output sompi must be a non-negative safe integer", `${at}.sompi`);
    }
    if (String(output.label || "").toLowerCase() === "change") {
      hasChange = true;
    }
  });

  const fee = readFee(plan, errors);
  if (knownInputAmounts && inputTotal < outputTotal + fee) {
    add(errors, "value-overflow", "outputs plus fee exceed known inputs");
  }
  if (knownInputAmounts && inputTotal > outputTotal + fee && !hasChange) {
    add(warnings, "missing-change", "known inputs exceed outputs plus fee, but no output is labeled change");
  }

  if (plan.broadcast !== false) {
    add(errors, "broadcast-not-false", "broadcast must be false for skill-reviewed transaction plans");
  }

  const acknowledgements = Array.isArray(plan.acknowledgements)
    ? plan.acknowledgements.map(String).join(" ").toLowerCase()
    : "";
  if (kind === "mainnet") {
    if (!acknowledgements.includes("mainnet") || !acknowledgements.includes("irreversible")) {
      add(
        errors,
        "mainnet-acknowledgement",
        "mainnet plans require acknowledgements containing 'mainnet' and 'irreversible'",
      );
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    accounting: {
      inputTotal: knownInputAmounts ? inputTotal : null,
      outputTotal,
      feeSompi: fee,
      knownInputAmounts,
    },
  };
}

function selfCheck() {
  const safePlan = {
    network: "testnet",
    purpose: "pay one recipient and return change",
    inputs: [{ txid: "abc", index: 0, sompi: 200000000 }],
    outputs: [
      { address: "kaspatest:qrecipient", sompi: 150000000, label: "recipient" },
      { address: "kaspatest:qchange", sompi: 49000000, label: "change" },
    ],
    feeSompi: 1000000,
    broadcast: false,
    acknowledgements: ["unsigned testnet plan"],
  };
  const unsafePlan = {
    network: "mainnet",
    purpose: "broadcast from chat",
    seed_phrase: "redacted words",
    inputs: [{ txid: "abc", index: 0, sompi: 1000 }],
    outputs: [{ address: "kaspatest:qwrong", sompi: 1000, label: "recipient" }],
    feeSompi: 0,
    broadcast: true,
  };
  const safe = lintTransactionPlan(safePlan);
  const unsafe = lintTransactionPlan(unsafePlan);
  return {
    schemaVersion: 1,
    passed: safe.passed && !unsafe.passed && unsafe.errors.length >= 3,
    safe,
    unsafe,
  };
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  if (check) {
    const report = selfCheck();
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(report.passed ? 0 : 1);
  }

  const planPath = args.find((arg) => !arg.startsWith("--"));
  if (!planPath) {
    process.stderr.write(usage());
    process.exit(2);
  }

  let plan;
  try {
    plan = JSON.parse(readFileSync(path.resolve(planPath), "utf8"));
  } catch (error) {
    const report = {
      passed: false,
      errors: [{ code: "read-json", message: error.message, path: "$" }],
      warnings: [],
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(1);
  }

  const report = {
    schemaVersion: 1,
    file: planPath,
    ...lintTransactionPlan(plan),
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.passed ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
