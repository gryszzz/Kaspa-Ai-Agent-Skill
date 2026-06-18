#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const lintScript = path.join(scriptDir, "lint-transaction-plan.mjs");

function run(args = []) {
  const result = spawnSync(process.execPath, [lintScript, ...args], {
    encoding: "utf8",
  });
  return {
    ...result,
    report: result.stdout ? JSON.parse(result.stdout) : null,
  };
}

function withPlan(plan, fn) {
  const root = mkdtempSync(path.join(tmpdir(), "kaspa-tx-plan-"));
  const planPath = path.join(root, "plan.json");
  try {
    writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);
    return fn(planPath);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("self-check accepts safe plan and rejects unsafe plan", () => {
  const result = run(["--check"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.report.passed, true);
  assert.equal(result.report.safe.passed, true);
  assert.equal(result.report.unsafe.passed, false);
});

test("accepts an unsigned testnet plan with explicit change", () => {
  const plan = {
    network: "testnet",
    purpose: "pay a recipient",
    inputs: [{ txid: "abc", index: 0, sompi: 200000000 }],
    outputs: [
      { address: "kaspatest:qrecipient", sompi: 150000000, label: "recipient" },
      { address: "kaspatest:qchange", sompi: 49000000, label: "change" },
    ],
    feeSompi: 1000000,
    broadcast: false,
  };

  withPlan(plan, (planPath) => {
    const result = run([planPath]);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(result.report.passed, true);
    assert.equal(result.report.errors.length, 0);
  });
});

test("rejects secrets, broadcast, wrong address network, and missing mainnet acknowledgement", () => {
  const plan = {
    network: "mainnet",
    purpose: "unsafe plan",
    mnemonic: "redacted words",
    inputs: [{ txid: "abc", index: 0, sompi: 1000000 }],
    outputs: [{ address: "kaspatest:qwrong", sompi: 1000000, label: "recipient" }],
    feeSompi: 0,
    broadcast: true,
  };

  withPlan(plan, (planPath) => {
    const result = run([planPath]);
    assert.equal(result.status, 1);
    const codes = result.report.errors.map((entry) => entry.code);
    assert.ok(codes.includes("secret-field"));
    assert.ok(codes.includes("wrong-address-network"));
    assert.ok(codes.includes("broadcast-not-false"));
    assert.ok(codes.includes("mainnet-acknowledgement"));
  });
});

test("rejects conflicting fee field aliases", () => {
  const plan = {
    network: "testnet",
    purpose: "conflicting fee aliases",
    inputs: [{ txid: "abc", index: 0, sompi: 2000 }],
    outputs: [{ address: "kaspatest:qrecipient", sompi: 1000, label: "recipient" }],
    feeSompi: 1,
    fee_sompi: 2,
    broadcast: false,
  };

  withPlan(plan, (planPath) => {
    const result = run([planPath]);
    assert.equal(result.status, 1);
    assert.ok(result.report.errors.some((entry) => entry.code === "conflicting-fee"));
  });
});
