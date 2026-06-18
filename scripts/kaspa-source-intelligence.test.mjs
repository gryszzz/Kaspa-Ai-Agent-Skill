#!/usr/bin/env node
import assert from "node:assert/strict";
import test from "node:test";
import {
  computeFactsHash,
  summarizeSourceHealth,
  toMarkdown,
  validateSourceSnapshot,
} from "./lib/source-intelligence.mjs";

function sampleSnapshot(overrides = {}) {
  const snapshot = {
    schemaVersion: 1,
    checkedAt: "2026-06-18T12:00:00.000Z",
    github: {
      repos: [
        { repo: "kaspanet/rusty-kaspa", primary: true, ok: true },
        { repo: "kaspanet/kips", primary: true, ok: true },
        { repo: "kaspanet/docs", primary: true, ok: true },
      ],
      refs: [
        { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "master", ok: true, sha: "abc123" },
      ],
      releases: [
        {
          repo: "kaspanet/rusty-kaspa",
          kind: "latest",
          ok: true,
          tagName: "v2.0.0",
          publishedAt: "2026-06-05T12:09:13Z",
        },
      ],
    },
    web: [
      { label: "Kaspa build portal", primary: true, ok: true, status: 200 },
    ],
    kaspaNetwork: [
      {
        label: "Mainnet blockDAG",
        ok: true,
        expectedNetworkName: "kaspa-mainnet",
        networkName: "kaspa-mainnet",
      },
    ],
    kipIndex: {
      ok: true,
      documents: [
        { file: "kip-0010.md", ok: true, kip: "10", title: "Transaction introspection", documentStatus: "Final" },
      ],
    },
    ...overrides,
  };
  snapshot.verdict = summarizeSourceHealth(snapshot);
  snapshot.factsHash = computeFactsHash(snapshot);
  return snapshot;
}

test("classifies a fully healthy primary-source snapshot", () => {
  const snapshot = sampleSnapshot();

  assert.equal(snapshot.verdict.sourceHealth, "healthy");
  assert.equal(snapshot.verdict.primaryEvidence.healthyPrimaryRepos, 3);
  assert.equal(snapshot.verdict.primaryEvidence.latestRustyReleaseTag, "v2.0.0");
  assert.deepEqual(validateSourceSnapshot(snapshot), []);
});

test("keeps endpoint failure as degraded source availability", () => {
  const snapshot = sampleSnapshot({
    kaspaNetwork: [
      {
        label: "Mainnet blockDAG",
        ok: false,
        expectedNetworkName: "kaspa-mainnet",
        error: "timeout",
      },
    ],
  });
  snapshot.verdict = summarizeSourceHealth(snapshot);
  snapshot.factsHash = computeFactsHash(snapshot);

  assert.equal(snapshot.verdict.sourceHealth, "degraded");
  assert(snapshot.verdict.warnings.some((warning) => warning.includes("Network endpoint unavailable")));
  assert.equal(validateSourceSnapshot(snapshot).length, 0);
});

test("detects wrong network identity without accepting it as healthy evidence", () => {
  const snapshot = sampleSnapshot({
    kaspaNetwork: [
      {
        label: "Mainnet blockDAG",
        ok: true,
        expectedNetworkName: "kaspa-mainnet",
        networkName: "kaspa-testnet-10",
      },
    ],
  });
  snapshot.verdict = summarizeSourceHealth(snapshot);
  snapshot.factsHash = computeFactsHash(snapshot);

  assert.equal(snapshot.verdict.sourceHealth, "degraded");
  assert(snapshot.verdict.warnings.some((warning) => warning.includes("Wrong network identity")));
});

test("renders a markdown intelligence report", () => {
  const markdown = toMarkdown(sampleSnapshot());

  assert.match(markdown, /Kaspa Live Source Intelligence/);
  assert.match(markdown, /Latest Rusty Kaspa Release/);
  assert.match(markdown, /KIP Index/);
  assert.match(markdown, /Do not convert testnet activation into mainnet activation/);
});

test("requires primary evidence lanes", () => {
  const snapshot = {
    schemaVersion: 1,
    checkedAt: "2026-06-18T12:00:00.000Z",
    github: { repos: [], releases: [], refs: [] },
    web: [],
    kaspaNetwork: [],
    kipIndex: { documents: [] },
    verdict: { sourceHealth: "unavailable" },
    factsHash: "bad",
  };

  const errors = validateSourceSnapshot(snapshot);
  assert(errors.includes("github.repos must be non-empty"));
  assert(errors.includes("all primary source lanes are unavailable"));
});
