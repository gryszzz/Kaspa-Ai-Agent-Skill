#!/usr/bin/env node
import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyUpstreamChanges,
  evaluateMainnetActivation,
  parseToccataActivation,
  validateToccataSnapshot,
} from "./lib/toccata-intelligence.mjs";

const release = {
  repo: "kaspanet/rusty-kaspa",
  tag: "v2.0.0",
  tagName: "v2.0.0",
  ok: true,
  prerelease: false,
  draft: false,
  name: "Mainnet Toccata Release - v2.0.0",
  publishedAt: "2026-06-05T12:09:13Z",
  bodyHighlights: [
    "The hard fork is scheduled to activate on mainnet at DAA score `474,165,565`, roughly on June 30, 2026, at 16:15 UTC.",
  ],
};

test("parses the final Toccata activation schedule", () => {
  assert.deepEqual(parseToccataActivation(release), {
    daaScore: 474165565,
    scheduleText: "June 30, 2026, at 16:15 UTC",
  });
});

test("keeps scheduled mainnet behavior separate from active behavior", () => {
  const scheduled = evaluateMainnetActivation(release, {
    ok: true,
    networkName: "kaspa-mainnet",
    virtualDaaScore: "452893713",
  });
  assert.equal(scheduled.state, "scheduled");
  assert.equal(scheduled.remainingDaaScore, 21271852);

  const active = evaluateMainnetActivation(release, {
    ok: true,
    networkName: "kaspa-mainnet",
    virtualDaaScore: "474165565",
  });
  assert.equal(active.state, "active");
  assert.equal(active.remainingDaaScore, 0);
});

test("classifies upstream changes into engineering impact lanes", () => {
  const impacts = classifyUpstreamChanges(
    [
      { filename: "consensus/core/src/config/params.rs", patch: "toccata_activation ForkActivation" },
      { filename: "rpc/core/src/model/tx.rs", patch: "storageMass mass must match" },
      { filename: "wallet/core/src/tx/generator/generator.rs", patch: "include covenant bindings" },
      { filename: "crypto/txscript/src/lib.rs", patch: "unknown script version" },
    ],
    [
      { message: "Set Toccata to activate on mainnet" },
      { message: "Rename input.mass -> input.compute_commit" },
    ],
  );
  const ids = impacts.map((impact) => impact.id);

  assert(ids.includes("activation-p2p"));
  assert(ids.includes("transaction-wire-format"));
  assert(ids.includes("covenant-lineage"));
  assert(ids.includes("rpc-wasm-sdk"));
  assert(ids.includes("wallet-pskt"));
  assert(ids.includes("security-hardening"));
});

test("reports full impact counts while capping evidence samples", () => {
  const impacts = classifyUpstreamChanges(
    Array.from({ length: 10 }, (_, index) => ({
      filename: `rpc/core/src/model/tx-${index}.rs`,
      patch: "storage_mass",
    })),
    [],
  );
  const rpcImpact = impacts.find((impact) => impact.id === "rpc-wasm-sdk");

  assert.equal(rpcImpact?.fileCount, 10);
  assert.equal(rpcImpact?.matchedFiles.length, 8);
});

test("validates the upgraded snapshot contract", () => {
  const snapshot = {
    schemaVersion: 2,
    github: {
      releases: [release],
      branchDeltas: [],
    },
    kaspaNetwork: [{ ok: true, networkName: "kaspa-mainnet" }],
    verdict: {
      activation: {
        daaScore: 474165565,
      },
    },
  };

  assert.deepEqual(validateToccataSnapshot(snapshot), []);
});
