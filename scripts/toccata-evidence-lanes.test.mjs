#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function run(scriptName, args = []) {
  const result = spawnSync(process.execPath, [path.join(scriptDir, scriptName), ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return {
    ...result,
    report: result.stdout ? JSON.parse(result.stdout) : null,
  };
}

test("captured response fixtures pass the protocol drill", () => {
  const result = run("toccata-captured-responses-check.mjs", ["--check"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.report.passed, true);
  assert.equal(result.report.capturedFiles >= 1, true);
});

test("ecosystem readiness snapshot preserves the no-readiness claim", () => {
  const result = run("toccata-ecosystem-readiness-audit.mjs", ["--check"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.report.passed, true);

  const snapshot = JSON.parse(
    readFileSync(path.join(repoRoot, "research-snapshots", "toccata", "ecosystem-readiness-latest.json"), "utf8"),
  );
  assert.equal(snapshot.verdict.doNotClaimWalletIndexerReady, true);
  assert.equal(snapshot.sources.some((source) => source.sourceEvidence?.matchedFiles?.length > 0), true);
});

test("live fixture template passes while malformed live captures fail", () => {
  const ok = run("toccata-live-fixture-check.mjs", ["--check"]);
  assert.equal(ok.status, 0, ok.stderr || ok.stdout);

  const live = run("toccata-live-covenant-export.mjs", ["--check"]);
  assert.equal(live.status, 0, live.stderr || live.stdout);
  assert.equal(live.report.passed, true);
  assert.equal(live.report.covenantIds.length >= 1, true);

  const captured = run("toccata-live-fixture-check.mjs", [
    "--fixture",
    path.join(repoRoot, "fixtures", "toccata", "live-covenant-indexer-mainnet-latest.json"),
  ]);
  assert.equal(captured.status, 0, captured.stderr || captured.stdout);

  const root = mkdtempSync(path.join(tmpdir(), "toccata-live-fixture-"));
  const fixturePath = path.join(root, "bad-live.json");
  try {
    writeFileSync(
      fixturePath,
      `${JSON.stringify(
        {
          schemaVersion: 1,
          fixtureType: "live_covenant_indexer_capture",
          acceptedTransactions: [],
          covenantLineages: [],
        },
        null,
        2,
      )}\n`,
    );
    const bad = run("toccata-live-fixture-check.mjs", ["--fixture", fixturePath]);
    assert.equal(bad.status, 1);
    assert.match(bad.report.failures.join("\n"), /capturedAt is required/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("ZK benchmark baseline validates measured partial data and rejects fake pending measurements", () => {
  const ok = run("toccata-zk-benchmark-check.mjs", ["--check"]);
  assert.equal(ok.status, 0, ok.stderr || ok.stdout);
  assert.equal(ok.report.status, "measured_partial");
  assert.equal(ok.report.measurementCount >= 2, true);

  const root = mkdtempSync(path.join(tmpdir(), "toccata-zk-benchmark-"));
  const snapshotPath = path.join(root, "bad-zk.json");
  try {
    const snapshot = JSON.parse(
      readFileSync(path.join(repoRoot, "research-snapshots", "toccata", "zk-proof-cost-baseline.json"), "utf8"),
    );
    snapshot.status = "pending_no_measurements";
    snapshot.measurements.push({ proofSystem: "fake" });
    writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);

    const bad = run("toccata-zk-benchmark-check.mjs", ["--snapshot", snapshotPath]);
    assert.equal(bad.status, 1);
    assert.match(bad.report.failures.join("\n"), /pending_no_measurements/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
