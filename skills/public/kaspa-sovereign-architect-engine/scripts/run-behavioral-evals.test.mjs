#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const runner = path.join(scriptDir, "run-behavioral-evals.mjs");
const casesPath = path.resolve(scriptDir, "..", "evals", "behavioral-cases.json");

function run(args = []) {
  const result = spawnSync(process.execPath, [runner, "--cases", casesPath, ...args], {
    encoding: "utf8",
  });
  return {
    ...result,
    report: result.stdout ? JSON.parse(result.stdout) : null,
  };
}

function referenceResponses() {
  const suite = JSON.parse(readFileSync(casesPath, "utf8"));
  return Object.fromEntries(suite.cases.map((entry) => [entry.id, entry.referenceResponse]));
}

test("passes all bundled behavioral reference responses", () => {
  const result = run(["--check"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.report.total, 14);
  assert.equal(result.report.failedCount, 0);
});

test("fails a prohibited mainnet activation claim", () => {
  const root = mkdtempSync(path.join(tmpdir(), "kaspa-eval-prohibited-"));
  const responsesPath = path.join(root, "responses.json");
  try {
    const responses = referenceResponses();
    responses["scheduled-versus-active"] = [
      responses["scheduled-versus-active"],
      "The release means it is active.",
    ].join(" ");
    writeFileSync(responsesPath, `${JSON.stringify({ responses }, null, 2)}\n`);

    const result = run(["--responses", responsesPath]);
    assert.equal(result.status, 1);
    const failed = result.report.results.find((entry) => entry.id === "scheduled-versus-active");
    assert.equal(failed.passed, false);
    assert.equal(failed.failures.some((failure) => failure.type === "prohibited-claim"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails a response that omits required wallet compatibility", () => {
  const root = mkdtempSync(path.join(tmpdir(), "kaspa-eval-required-"));
  const responsesPath = path.join(root, "responses.json");
  try {
    const responses = referenceResponses();
    responses["kasware-kaspium-compatibility"] = "Use a browser wallet and validate the network.";
    writeFileSync(responsesPath, `${JSON.stringify({ responses }, null, 2)}\n`);

    const result = run(["--responses", responsesPath]);
    assert.equal(result.status, 1);
    const failed = result.report.results.find((entry) => entry.id === "kasware-kaspium-compatibility");
    assert.equal(failed.passed, false);
    assert.equal(failed.failures.some((failure) => failure.type === "missing-required"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
