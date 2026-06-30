#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const runner = path.join(scriptDir, "toccata-protocol-drill.mjs");
const casesPath = path.resolve(scriptDir, "..", "fixtures", "toccata", "protocol-drills.json");
const adversarialResponsesPath = path.resolve(
  scriptDir,
  "..",
  "fixtures",
  "toccata",
  "protocol-drill-adversarial-responses.json",
);

function run(args = []) {
  const result = spawnSync(process.execPath, [runner, "--cases", casesPath, ...args], {
    encoding: "utf8",
  });
  return {
    ...result,
    report: result.stdout && result.stdout.trim().startsWith("{") ? JSON.parse(result.stdout) : null,
  };
}

function referenceResponses() {
  const suite = JSON.parse(readFileSync(casesPath, "utf8"));
  return Object.fromEntries(suite.cases.map((entry) => [entry.id, entry.referenceResponse]));
}

test("passes bundled protocol mastery references", () => {
  const result = run(["--check"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.report.total, 8);
  assert.equal(result.report.failedCount, 0);
});

test("renders a human-readable drill sheet by default", () => {
  const result = run();

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Toccata Protocol Mastery Drills/);
  assert.match(result.stdout, /activation-claim-boundary/);
  assert.equal(result.report, null);
});

test("reports the selected custom cases file", () => {
  const root = mkdtempSync(path.join(tmpdir(), "toccata-drill-custom-"));
  const customCasesPath = path.join(root, "custom-drills.json");
  try {
    writeFileSync(customCasesPath, readFileSync(casesPath, "utf8"));
    const result = run(["--cases", customCasesPath, "--check"]);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(result.report.suite, "custom-drills.json");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails ecosystem-wide activation overclaims", () => {
  const root = mkdtempSync(path.join(tmpdir(), "toccata-drill-overclaim-"));
  const responsesPath = path.join(root, "responses.json");
  try {
    const responses = referenceResponses();
    responses["activation-claim-boundary"] = [
      responses["activation-claim-boundary"],
      "The ecosystem is fully ready and all wallets are ready.",
    ].join(" ");
    writeFileSync(responsesPath, `${JSON.stringify({ responses }, null, 2)}\n`);

    const result = run(["--responses", responsesPath]);
    assert.equal(result.status, 1);
    const failed = result.report.results.find((entry) => entry.id === "activation-claim-boundary");
    assert.equal(failed.passed, false);
    assert.equal(failed.failures.some((failure) => failure.type === "prohibited-claim"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails fee answers that miss policy versus consensus", () => {
  const root = mkdtempSync(path.join(tmpdir(), "toccata-drill-fee-"));
  const responsesPath = path.join(root, "responses.json");
  try {
    const responses = referenceResponses();
    responses["fee-policy-layering"] = "The fee formula is 100 sompi * max(compute grams, 2 * transaction bytes).";
    writeFileSync(responsesPath, `${JSON.stringify({ responses }, null, 2)}\n`);

    const result = run(["--responses", responsesPath]);
    assert.equal(result.status, 1);
    const failed = result.report.results.find((entry) => entry.id === "fee-policy-layering");
    assert.equal(failed.passed, false);
    assert.equal(failed.failures.some((failure) => failure.type === "missing-required"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails bundled adversarial responses for every mastery case", () => {
  const result = run(["--responses", adversarialResponsesPath]);

  assert.equal(result.status, 1);
  assert.equal(result.report.total, 8);
  assert.equal(result.report.failedCount, 8);
  assert.equal(result.report.results.every((entry) => entry.passed === false), true);
});
