#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = process.cwd();
const SNAPSHOT_PATH = path.join(ROOT_DIR, "research-snapshots", "toccata", "latest.json");

function shortSha(value) {
  return value ? value.slice(0, 12) : "unknown";
}

function formatPull(pull) {
  if (!pull) {
    return "unavailable";
  }
  if (!pull.ok) {
    return `error: ${pull.error || pull.status || "unknown"}`;
  }
  const draft = pull.draft ? " draft" : "";
  return `${pull.state}${draft}, base ${pull.baseRefName}, head ${shortSha(pull.headSha)}, updated ${pull.updatedAt}`;
}

function formatNetwork(source) {
  if (!source) {
    return "unavailable";
  }
  if (!source.ok) {
    return `error: ${source.error || source.status || "unknown"}`;
  }
  return `ok, virtualDaaScore ${source.virtualDaaScore}, blockCount ${source.blockCount}`;
}

function findPull(snapshot, repo, number) {
  return snapshot.github?.pulls?.find((pull) => pull.repo === repo && pull.number === number);
}

function findNetwork(snapshot, label) {
  return snapshot.kaspaNetwork?.find((source) => source.label === label);
}

function buildPullRows(snapshot) {
  return (snapshot.github?.pulls || []).map((pull) => {
    const status = pull.ok ? `${pull.state}${pull.draft ? " draft" : ""}` : "error";
    const base = pull.ok ? pull.baseRefName : pull.error;
    const updated = pull.ok ? pull.updatedAt : "";
    return `| ${pull.label} | ${status} | ${base} | ${shortSha(pull.headSha)} | ${updated} |`;
  });
}

function buildOutput(snapshot) {
  const zk = findPull(snapshot, "kaspanet/rusty-kaspa", 1013);
  const tn10 = findNetwork(snapshot, "TN10 blockdag");
  const tn12 = findNetwork(snapshot, "TN12 blockdag");

  return `# Kaspa Toccata Knowledge Drill

Snapshot: ${snapshot.checkedAt}
Facts hash: \`${snapshot.factsHash}\`
Changed since previous: ${snapshot.changedSincePrevious}

## Current Source Pulse

| Signal | State | Base | Head | Updated |
| --- | --- | --- | --- | --- |
${buildPullRows(snapshot).join("\n")}

Testnet pulse:

- TN10: ${formatNetwork(tn10)}
- TN12: ${formatNetwork(tn12)}

Mainnet rule:

- ${snapshot.policy?.mainnetClaimRule || "Mainnet claims require explicit mainnet evidence."}
- ${snapshot.policy?.testnetClaimRule || "Testnet observations are testnet-only."}

## Five-Minute Recall

Answer these without opening notes, then check against the snapshot and corpus:

1. What exact evidence separates TN10/TN12 Toccata behavior from mainnet activation?
2. What does PR #1000 currently prove, and what does it not prove?
3. What changed or needs attention in PR #1013? Current status: ${formatPull(zk)}.
4. Which Toccata-related KIPs are still PRs rather than merged KIPs?
5. What wallet UX would prevent a covenant spend from looking like an ordinary payment?

## Deep Drills

1. Evidence ladder: Write a claim about Toccata, then label every supporting source as release, branch, PR, KIP PR, docs, research, tooling, or testnet signal.
2. Covenant lineage: Sketch tables for covenant ID, genesis outpoint, continuation edge, authorizing input, accepted transaction, and reorg status.
3. Wallet preview: Design the smallest signing screen that shows consumed covenant state, successor state, proof requirements, and irreversible constraints.
4. ZK readiness: Compare Groth16-style and RISC0/Succinct-style verifier risks across proof size, verification cost, dependency maturity, and transaction payload shape.
5. Sequencing commitments: Describe what a lane-aware indexer must store to serve an O(activity) witness API.
6. vProg scope: Model one app with read sets, write sets, proof cadence, witness storage, pruning risk, and scope explosion risk.

## Red-Team Prompts

Reject or qualify each claim:

1. "Toccata is live on mainnet because TN10 passed its activation score."
2. "A KIP PR marked open is final protocol behavior."
3. "A merged PR is merged to master even when its base branch is a feature branch."
4. "A covenant ID proves the state transition is semantically valid."
5. "A testnet SilverScript demo is production wallet support."
6. "A proof verifier opcode removes the need to reason about witness availability or verification cost."

## Builder Sprint

Today, build or update one small artifact:

1. A source diff note for PR #1013 if its head changed.
2. A covenant lineage schema note with failure cases.
3. A wallet signing preview wireframe in text.
4. A TN10/TN12 smoke-test run using \`research-snapshots/toccata/rpc-smoke-tests.md\`.
5. A one-page "what can be built now vs what must wait" table.

Carry-forward rule:

- If a drill reveals uncertainty, add it to the Toccata playbook or source monitor instead of leaving it as memory.
`;
}

async function main() {
  const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, "utf8"));
  process.stdout.write(buildOutput(snapshot));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
