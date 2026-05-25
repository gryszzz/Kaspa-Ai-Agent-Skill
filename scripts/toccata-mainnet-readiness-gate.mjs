#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = process.cwd();
const DEFAULT_SNAPSHOT = path.join(ROOT_DIR, "research-snapshots", "toccata", "latest.json");

function readArgValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function findPull(snapshot, repo, number) {
  return snapshot.github?.pulls?.find((pull) => pull.repo === repo && pull.number === number) || null;
}

function findToccataMainnetReleaseTag(snapshot) {
  return (
    snapshot.github?.refs?.find(
      (ref) =>
        ref.repo === "kaspanet/rusty-kaspa" &&
        ref.kind === "tags" &&
        ref.ok &&
        /toccata/i.test(ref.name) &&
        !/tn\d+/i.test(ref.name),
    ) || null
  );
}

function gate(id, title, complete, evidence, requiredEvidence) {
  return {
    id,
    title,
    complete: Boolean(complete),
    evidence,
    requiredEvidence,
  };
}

function evaluate(snapshot) {
  const toccataPr = findPull(snapshot, "kaspanet/rusty-kaspa", 1000);
  const releaseTag = findToccataMainnetReleaseTag(snapshot);
  const testnetNetworks = (snapshot.kaspaNetwork || []).map((source) => source.networkName).filter(Boolean);
  const docsOk = (snapshot.webSources || []).some(
    (source) => source.ok && source.label === "Kaspa programmability overview",
  );

  const gates = [
    gate(
      "release_tag",
      "Mainnet release tag",
      Boolean(releaseTag),
      releaseTag ? `${releaseTag.name} ${releaseTag.sha}` : "No non-testnet Toccata release tag is tracked.",
      "A Rusty Kaspa release tag or signed release explicitly naming mainnet Toccata behavior.",
    ),
    gate(
      "activation_schedule",
      "Activation schedule",
      snapshot.verdict?.mainnetActivation && snapshot.verdict.mainnetActivation !== "not_verified_by_monitor",
      snapshot.verdict?.mainnetActivation || "not_verified_by_monitor",
      "An explicit mainnet activation height, DAA score, timestamp, or release note from primary sources.",
    ),
    gate(
      "merged_code_path",
      "Merged production code path",
      Boolean(toccataPr?.merged),
      toccataPr
        ? `PR #1000 is ${toccataPr.state}${toccataPr.merged ? " and merged" : ""} against ${toccataPr.baseRefName}.`
        : "PR #1000 is unavailable in the snapshot.",
      "Merged Rusty Kaspa code path or equivalent production branch evidence.",
    ),
    gate(
      "network_endpoint_evidence",
      "Mainnet endpoint evidence",
      testnetNetworks.includes("kaspa-mainnet"),
      testnetNetworks.length ? `Observed networks: ${testnetNetworks.join(", ")}.` : "No network endpoint evidence.",
      "Healthy mainnet endpoint checks that return the expected mainnet network name and current state.",
    ),
    gate(
      "wallet_indexer_support",
      "Wallet and indexer support",
      false,
      "No audited wallet/indexer support artifact is tracked by this gate.",
      "Wallet preview, signing support, indexer schema, reorg handling, and support matrix aligned with activated behavior.",
    ),
    gate(
      "docs_alignment",
      "Docs alignment",
      false,
      docsOk ? "Programmability docs are reachable, but this gate has no mainnet activation document." : "Programmability docs unavailable.",
      "Official docs or release notes that align with release tag, activation schedule, code path, and endpoint evidence.",
    ),
  ];

  const completeCount = gates.filter((entry) => entry.complete).length;
  return {
    snapshotCheckedAt: snapshot.checkedAt || null,
    factsHash: snapshot.factsHash || null,
    decision: completeCount === gates.length ? "ready_to_claim_mainnet" : "do_not_claim_mainnet",
    completeCount,
    requiredCount: gates.length,
    gates,
  };
}

async function main() {
  const snapshotPath = readArgValue("--snapshot") || DEFAULT_SNAPSHOT;
  const check = process.argv.includes("--check");
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
  const report = evaluate(snapshot);

  if (check) {
    if (report.decision !== "do_not_claim_mainnet" && report.completeCount !== report.requiredCount) {
      console.error("check failed: readiness gate produced an inconsistent mainnet decision");
      process.exitCode = 1;
      return;
    }
    console.log(
      `mainnet readiness gate check passed: ${report.decision}, ${report.completeCount}/${report.requiredCount} gate(s) complete.`,
    );
    return;
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
