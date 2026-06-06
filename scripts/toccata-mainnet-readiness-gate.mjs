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

function findTrackedMainnetToccataRelease(snapshot) {
  const releases = snapshot.github?.releases || [];
  const finalRelease = releases.find(
    (entry) =>
      entry.repo === "kaspanet/rusty-kaspa" &&
      entry.ok &&
      !entry.prerelease &&
      !entry.draft &&
      !/^tn\d+/i.test(entry.tagName || entry.tag || "") &&
      /toccata|v2\.0\.0/i.test(`${entry.label || ""} ${entry.name || ""} ${entry.tagName || entry.tag || ""}`),
  );
  if (finalRelease) {
    return finalRelease;
  }

  const release = releases.find(
    (entry) =>
      entry.repo === "kaspanet/rusty-kaspa" &&
      entry.ok &&
      !/^tn\d+/i.test(entry.tagName || entry.tag || "") &&
      /toccata|toc\./i.test(`${entry.label || ""} ${entry.name || ""} ${entry.tagName || entry.tag || ""}`),
  );
  if (release) {
    return release;
  }

  return (
    snapshot.github?.refs?.find(
      (ref) =>
        ref.repo === "kaspanet/rusty-kaspa" &&
        ref.kind === "tags" &&
        ref.ok &&
        /toccata|toc\./i.test(ref.name) &&
        !/tn\d+/i.test(ref.name),
    ) || null
  );
}

function isActivationRelease(release) {
  if (!release?.ok || release.prerelease || release.draft) {
    return false;
  }
  const haystack = `${release.name || ""}\n${release.bodyHighlights?.join("\n") || ""}`.toLowerCase();
  return !haystack.includes("pre-activation") && !haystack.includes("does not activate");
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
  const releaseTag = findTrackedMainnetToccataRelease(snapshot);
  const activation = snapshot.verdict?.activation || {};
  const mainnet = (snapshot.kaspaNetwork || []).find(
    (source) => source.ok && source.networkName === "kaspa-mainnet",
  );
  const docsOk = (snapshot.webSources || []).some(
    (source) => source.ok && source.label === "Rusty Kaspa Toccata node guide",
  );

  const gates = [
    gate(
      "release_tag",
      "Mainnet release tag",
      isActivationRelease(releaseTag),
      releaseTag?.tagName
        ? `${releaseTag.tagName} published ${releaseTag.publishedAt || "unknown date"}; ${
            releaseTag.prerelease ? "pre-release/pre-activation evidence only" : "release evidence"
          }.`
        : releaseTag
          ? `${releaseTag.name} ${releaseTag.sha}; release notes unavailable in snapshot.`
          : "No non-testnet Toccata release or tag is tracked.",
      "A final Rusty Kaspa release tag or signed release explicitly naming mainnet Toccata activation behavior.",
    ),
    gate(
      "activation_schedule",
      "Activation schedule",
      Boolean(activation.daaScore),
      activation.daaScore
        ? `DAA ${activation.daaScore}; ${activation.scheduleText || "UTC estimate unavailable"}.`
        : "not_verified_by_monitor",
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
      Boolean(mainnet),
      mainnet
        ? `Observed kaspa-mainnet at virtual DAA ${mainnet.virtualDaaScore}.`
        : "No healthy kaspa-mainnet endpoint evidence.",
      "Healthy mainnet endpoint checks that return the expected mainnet network name and current state.",
    ),
    gate(
      "activation_reached",
      "Activation DAA reached",
      activation.state === "active",
      activation.currentDaaScore && activation.daaScore
        ? `Current mainnet DAA ${activation.currentDaaScore}; activation DAA ${activation.daaScore}.`
        : "Current and activation DAA evidence is incomplete.",
      "A healthy mainnet endpoint at or above the final release activation DAA.",
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
      docsOk,
      docsOk ? "The versioned Rusty Kaspa Toccata node guide is tracked." : "Versioned Toccata node guide unavailable.",
      "Official docs or release notes that align with release tag, activation schedule, code path, and endpoint evidence.",
    ),
  ];

  const protocolGateIds = new Set([
    "release_tag",
    "activation_schedule",
    "merged_code_path",
    "network_endpoint_evidence",
    "activation_reached",
    "docs_alignment",
  ]);
  const protocolGates = gates.filter((entry) => protocolGateIds.has(entry.id));
  const protocolCompleteCount = protocolGates.filter((entry) => entry.complete).length;
  const completeCount = gates.filter((entry) => entry.complete).length;
  return {
    snapshotCheckedAt: snapshot.checkedAt || null,
    factsHash: snapshot.factsHash || null,
    decision:
      protocolCompleteCount === protocolGates.length
        ? "ready_to_claim_mainnet_protocol_active"
        : "do_not_claim_mainnet_protocol_active",
    ecosystemDecision:
      completeCount === gates.length
        ? "ready_to_claim_wallet_indexer_ready"
        : "do_not_claim_wallet_indexer_ready",
    protocolCompleteCount,
    protocolRequiredCount: protocolGates.length,
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
    if (
      report.decision === "ready_to_claim_mainnet_protocol_active" &&
      report.protocolCompleteCount !== report.protocolRequiredCount
    ) {
      console.error("check failed: readiness gate produced an inconsistent protocol activation decision");
      process.exitCode = 1;
      return;
    }
    if (report.ecosystemDecision === "ready_to_claim_wallet_indexer_ready" && report.completeCount !== report.requiredCount) {
      console.error("check failed: readiness gate produced an inconsistent ecosystem readiness decision");
      process.exitCode = 1;
      return;
    }
    console.log(
      `mainnet readiness gate check passed: ${report.decision}, ${report.protocolCompleteCount}/${report.protocolRequiredCount} protocol gate(s); ${report.ecosystemDecision}.`,
    );
    return;
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
