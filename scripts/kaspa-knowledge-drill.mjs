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
  const networkName = source.networkName || "unknown-network";
  return `ok, network ${networkName}, virtualDaaScore ${source.virtualDaaScore}, blockCount ${source.blockCount}`;
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

function buildReleaseRows(snapshot) {
  return (snapshot.github?.releases || []).map((release) => {
    const status = release.ok ? (release.prerelease ? "pre-release" : "stable") : "error";
    const published = release.ok ? release.publishedAt : "";
    const target = release.ok ? release.targetCommitish : release.error;
    return `| ${release.label} | ${release.tagName || release.tag} | ${status} | ${target} | ${published} |`;
  });
}

function buildBranchDeltaRows(snapshot) {
  return (snapshot.github?.branchDeltas || [])
    .filter((delta) => delta.impacts?.length)
    .map(
      (delta) =>
        `| ${delta.label} | ${delta.status} | ${delta.totalCommits || 0} | ${delta.fileCount || 0} | ${delta.impacts
          .map((impact) => impact.label)
          .join(", ")} |`,
    );
}

function buildOutput(snapshot) {
  const zk = findPull(snapshot, "kaspanet/rusty-kaspa", 1013);
  const mainnet = findNetwork(snapshot, "Mainnet blockdag");
  const tn10 = findNetwork(snapshot, "TN10 blockdag");
  const tn12 = findNetwork(snapshot, "TN12 blockdag");
  const activation = snapshot.verdict?.activation || {};

  return `# Kaspa Toccata Knowledge Drill

Snapshot: ${snapshot.checkedAt}
Facts hash: \`${snapshot.factsHash}\`
Changed since previous: ${snapshot.changedSincePrevious}

## Current Source Pulse

| Signal | State | Base | Head | Updated |
| --- | --- | --- | --- | --- |
${buildPullRows(snapshot).join("\n")}

Release pulse:

| Signal | Tag | Status | Target | Published |
| --- | --- | --- | --- | --- |
${buildReleaseRows(snapshot).join("\n")}

Branch-change intelligence:

| Source | Status | Commits | Files | Engineering impact |
| --- | --- | --- | --- | --- |
${buildBranchDeltaRows(snapshot).join("\n") || "| No changed branches | unchanged | 0 | 0 | none |"}

Network pulse:

- Mainnet: ${formatNetwork(mainnet)}
- TN10: ${formatNetwork(tn10)}
- TN12: ${formatNetwork(tn12)}

Activation pulse:

- State: ${activation.state || "unknown"}
- Release: ${activation.releaseTag || "unknown"}
- Activation DAA: ${activation.daaScore ?? "unknown"}
- Current mainnet DAA: ${activation.currentDaaScore ?? "unknown"}
- Remaining DAA: ${activation.remainingDaaScore ?? "unknown"}

Mainnet rule:

- ${snapshot.policy?.mainnetClaimRule || "Mainnet claims require explicit mainnet evidence."}
- ${snapshot.policy?.testnetClaimRule || "Testnet observations are testnet-only."}

## Five-Minute Recall

Answer these without opening notes, then check against the snapshot and corpus:

1. What exact evidence separates TN10/TN12 Toccata behavior from mainnet activation?
2. What does PR #1000 currently prove, and what does it not prove?
3. What changed or needs attention in PR #1013? Current status: ${formatPull(zk)}.
4. What does \`v2.0.0\` prove, and why is Toccata still not active before DAA ${activation.daaScore ?? "unknown"}?
5. How did \`Transaction.mass\`, \`TransactionInput.mass\`, and their API names change for Toccata integrations?
6. Which tracked KIP-16/17/20/21 documents are merged, and why does merged KIP status still not prove activation?
7. What wallet UX would prevent a covenant spend from looking like an ordinary payment?
8. What network names did the latest mainnet/TN10/TN12 endpoints return, and why does that matter?

## Deep Drills

1. Evidence ladder: Write a claim about Toccata, then label every supporting source as release, branch, PR, KIP PR, docs, research, tooling, or testnet signal.
2. Network awareness: Build a table that separates mainnet, TN10, TN12, simnet, devnet, branch-only, and docs-only behavior.
3. Covenant lineage: Sketch tables for covenant ID, genesis outpoint, continuation edge, authorizing input, accepted transaction, and reorg status.
4. Wallet preview: Design the smallest signing screen that shows consumed covenant state, successor state, proof requirements, and irreversible constraints.
5. ZK readiness: Compare Groth16-style and RISC0/Succinct-style verifier risks across proof size, verification cost, dependency maturity, and transaction payload shape.
6. Sequencing commitments: Describe what a lane-aware indexer must store to serve an O(activity) witness API.
7. vProg scope: Model one app with read sets, write sets, proof cadence, witness storage, pruning risk, and scope explosion risk.

## Red-Team Prompts

Reject or qualify each claim:

1. "Toccata is live on mainnet because v2.0.0 was published."
2. "A final release schedule proves the activation DAA has already been reached."
3. "A merged PR is merged to master even when its base branch is a feature branch."
4. "A merged KIP file proves mainnet activation."
5. "A covenant ID proves the state transition is semantically valid."
6. "A testnet SilverScript demo is production wallet support."
7. "A proof verifier opcode removes the need to reason about witness availability or verification cost."
8. "The deprecated JSON \`mass\` alias and \`storageMass\` can disagree safely."
9. "A node endpoint is trustworthy without checking its returned network name."

## Builder Sprint

Today, build or update one small artifact:

1. A compatibility fixture for \`storageMass\`, legacy \`mass\`, and conflicting-field rejection.
2. A covenant lineage fixture that stresses reorg, duplicate continuation, wrong-network, or missing-metadata behavior.
3. A wallet signing preview golden case from covenant fixture output.
4. A mainnet/TN10/TN12 endpoint review with explicit network-name checks.
5. A vProg scope simulation for one app idea.
6. A mainnet readiness gate review using \`scripts/toccata-mainnet-readiness-gate.mjs\`.

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
