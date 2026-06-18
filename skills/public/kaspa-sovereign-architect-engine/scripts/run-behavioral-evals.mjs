#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultCasesPath = path.resolve(scriptDir, "..", "evals", "behavioral-cases.json");
const requiredCaseIds = [
  "mainnet-testnet-status",
  "scheduled-versus-active",
  "kip-release-activation-lifecycle",
  "dag-aware-indexer",
  "utxo-value-conservation",
  "transaction-plan-safety-gate",
  "wallet-custody-signing-boundary",
  "kasware-kaspium-compatibility",
  "mass-field-conflict",
  "relay-policy-versus-consensus",
  "covenant-lineage-reorg",
  "endpoint-failure-wrong-network",
  "live-source-intelligence-claims",
  "unsupported-future-feature",
  "source-citation-absolute-date",
];

function parseArgs(argv) {
  const options = {
    casesPath: defaultCasesPath,
    responsesPath: null,
  };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        break;
      case "--cases":
        options.casesPath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      case "--responses":
        options.responsesPath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${argv[index]}`);
    }
  }
  return options;
}

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function loadResponses(filePath) {
  if (!filePath) return null;
  const payload = loadJson(filePath);
  if (Array.isArray(payload.responses)) {
    return Object.fromEntries(payload.responses.map((entry) => [entry.id, entry.response]));
  }
  if (payload.responses && typeof payload.responses === "object") {
    return payload.responses;
  }
  throw new Error("responses file must contain a responses object or array");
}

function validateSuite(suite) {
  if (suite.schemaVersion !== 1 || !Array.isArray(suite.cases)) {
    throw new Error("behavioral suite must use schemaVersion 1 and contain cases[]");
  }
  const ids = new Set(suite.cases.map((entry) => entry.id));
  for (const id of requiredCaseIds) {
    if (!ids.has(id)) throw new Error(`behavioral suite missing required case: ${id}`);
  }
  if (ids.size !== suite.cases.length) {
    throw new Error("behavioral suite contains duplicate case ids");
  }
}

function evaluateCase(entry, response) {
  const failures = [];
  if (typeof response !== "string" || response.trim() === "") {
    failures.push({ type: "missing-response", label: "response is empty" });
    return { id: entry.id, passed: false, failures };
  }

  for (const rule of entry.required) {
    if (!new RegExp(rule.pattern, "i").test(response)) {
      failures.push({ type: "missing-required", label: rule.label });
    }
  }
  for (const rule of entry.prohibited) {
    if (new RegExp(rule.pattern, "i").test(response)) {
      failures.push({ type: "prohibited-claim", label: rule.label });
    }
  }
  return { id: entry.id, passed: failures.length === 0, failures };
}

function main() {
  try {
    const options = parseArgs(process.argv);
    const suite = loadJson(options.casesPath);
    validateSuite(suite);
    const suppliedResponses = loadResponses(options.responsesPath);
    const results = suite.cases.map((entry) => evaluateCase(
      entry,
      suppliedResponses ? suppliedResponses[entry.id] : entry.referenceResponse,
    ));
    const failed = results.filter((result) => !result.passed);
    const report = {
      schemaVersion: 1,
      suite: path.basename(options.casesPath),
      responseSource: suppliedResponses ? path.basename(options.responsesPath) : "referenceResponse",
      passed: failed.length === 0,
      total: results.length,
      passedCount: results.length - failed.length,
      failedCount: failed.length,
      results,
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(failed.length === 0 ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();
