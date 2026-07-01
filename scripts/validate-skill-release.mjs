#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(scriptDir, "..");

function parseArgs(argv) {
  const options = {
    repoRoot: defaultRepoRoot,
    checkRemote: false,
  };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        break;
      case "--check-remote":
        options.checkRemote = true;
        break;
      case "--repo-root":
        options.repoRoot = path.resolve(argv[index + 1]);
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${argv[index]}`);
    }
  }
  return options;
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function requireCondition(condition, message, failures) {
  if (!condition) failures.push(message);
}

function validateLocal(repoRoot) {
  const failures = [];
  const skillRoot = path.join(repoRoot, "skills", "public", "kaspa-sovereign-architect-engine");
  const manifest = readJson(path.join(skillRoot, "manifest.json"));
  const releaseMetadata = readJson(path.join(repoRoot, "release-metadata.json"));
  const readme = readFileSync(path.join(repoRoot, "README.md"), "utf8");
  const systemArchitecture = readFileSync(path.join(repoRoot, "SYSTEM_ARCHITECTURE.md"), "utf8");
  const trainingSources = readFileSync(path.join(repoRoot, "TRAINING_SOURCES.md"), "utf8");
  const readinessApprovals = readFileSync(path.join(repoRoot, "READINESS_APPROVALS.md"), "utf8");
  const toccataGuide = readFileSync(path.join(repoRoot, "docs", "toccata.md"), "utf8");
  const masteryTrack = readFileSync(path.join(repoRoot, "docs", "kaspa", "toccata-mastery-track.md"), "utf8");
  const appLabDoc = readFileSync(path.join(repoRoot, "docs", "kaspa", "kaspa-app-lab.md"), "utf8");
  const toccataSnapshot = readJson(path.join(repoRoot, "research-snapshots", "toccata", "latest.json"));
  const ecosystemReadiness = readJson(
    path.join(repoRoot, "research-snapshots", "toccata", "ecosystem-readiness-latest.json"),
  );
  const liveCovenantFixture = readJson(
    path.join(repoRoot, "fixtures", "toccata", "live-covenant-indexer-mainnet-latest.json"),
  );
  const zkBenchmark = readJson(path.join(repoRoot, "research-snapshots", "toccata", "zk-proof-cost-baseline.json"));
  const protocolDrills = readJson(path.join(repoRoot, "fixtures", "toccata", "protocol-drills.json"));
  const adversarialProtocolDrills = readJson(
    path.join(repoRoot, "fixtures", "toccata", "protocol-drill-adversarial-responses.json"),
  );
  const appLabFixtureDir = path.join(repoRoot, "fixtures", "toccata", "app-lab");
  const appLabFixtures = readdirSync(appLabFixtureDir)
    .filter((entry) => entry.endsWith(".json"))
    .sort()
    .map((entry) => readJson(path.join(appLabFixtureDir, entry)));
  const version = manifest.version;
  const versionTag = `v${version}`;

  requireCondition(/^\d+\.\d+\.\d+$/.test(version), `manifest version is not semver: ${version}`, failures);
  requireCondition(
    releaseMetadata.repositoryVersion === version,
    `release metadata repositoryVersion ${releaseMetadata.repositoryVersion} != manifest ${version}`,
    failures,
  );
  requireCondition(
    releaseMetadata.repositoryReleaseStatus === "unpublished",
    "repository release status must remain unpublished before tagging",
    failures,
  );
  requireCondition(
    releaseMetadata.publishedRelease !== versionTag,
    "published release must be tracked separately from the unpublished repository version",
    failures,
  );

  const notesPath = path.join(repoRoot, releaseMetadata.nextReleaseNotes);
  const notes = readFileSync(notesPath, "utf8");
  requireCondition(
    releaseMetadata.nextReleaseNotes === `release-notes/${versionTag}.md`,
    `next release notes path does not match ${versionTag}`,
    failures,
  );
  requireCondition(notes.includes(versionTag), `release notes heading missing ${versionTag}`, failures);
  requireCondition(/has not been\s+published|not yet published/i.test(notes), "release notes must say the repository version is unpublished", failures);
  requireCondition(notes.includes(releaseMetadata.publishedRelease), "release notes missing current published release", failures);

  requireCondition(
    readme.includes(`**Published release:** \`${releaseMetadata.publishedRelease}\``),
    "README published release declaration is stale",
    failures,
  );
  requireCondition(
    readme.includes(`**Repository skill version:** \`${versionTag}\``),
    "README repository version declaration is stale",
    failures,
  );
  requireCondition(
    readme.includes(`Latest published release notes: [\`${releaseMetadata.publishedRelease}\`]`),
    "README latest published release notes link is stale",
    failures,
  );
  requireCondition(
    readme.includes(`Next repository release notes: [\`${versionTag}\`]`),
    "README next release notes link is stale",
    failures,
  );
  requireCondition(
    readme.includes("TRAINING_SOURCES.md"),
    "README must link TRAINING_SOURCES.md",
    failures,
  );
  requireCondition(
    readme.includes("SYSTEM_ARCHITECTURE.md"),
    "README must link SYSTEM_ARCHITECTURE.md",
    failures,
  );
  requireCondition(
    readme.includes("READINESS_APPROVALS.md"),
    "README must link READINESS_APPROVALS.md",
    failures,
  );
  requireCondition(
    readme.includes("docs/toccata.md"),
    "README must link docs/toccata.md",
    failures,
  );
  requireCondition(
    readme.includes("docs/kaspa/kaspa-app-lab.md"),
    "README must link docs/kaspa/kaspa-app-lab.md",
    failures,
  );
  for (const architectureRule of [
    "Plan-Act-Verify",
    "AGENT_TRACE.md",
    "Autonomous wallet identity is not enabled by default",
  ]) {
    requireCondition(
      systemArchitecture.includes(architectureRule),
      `SYSTEM_ARCHITECTURE.md missing rule: ${architectureRule}`,
      failures,
    );
  }
  for (const sourceUrl of [
    "https://docs.kaspa.org/",
    "https://github.com/kaspanet/rusty-kaspa",
    "https://github.com/kaspanet/kips",
    "https://kaspa.org/build",
    "https://github.com/Kaspathon/KaspaDev-Resources",
    "https://wiki.kaspa.org/",
    "https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.1",
    "https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0",
    "https://github.com/kaspanet/rusty-kaspa/blob/master/docs/toccata-guide.md",
    "https://github.com/kaspanet/kips/blob/master/kip-0016.md",
    "https://github.com/kaspanet/kips/blob/master/kip-0017.md",
    "https://github.com/kaspanet/kips/blob/master/kip-0020.md",
    "https://github.com/kaspanet/kips/blob/master/kip-0021.md",
    "https://github.com/kaspanet/kaspad/releases/tag/v0.12.23",
    "https://github.com/kaspanet/rusty-kaspa/blob/master/rpc/grpc/core/proto/messages.proto",
    "https://github.com/kaspanet/rusty-kaspa/blob/master/rpc/grpc/core/proto/rpc.proto",
  ]) {
    requireCondition(
      trainingSources.includes(sourceUrl),
      `TRAINING_SOURCES.md missing source URL: ${sourceUrl}`,
      failures,
    );
  }
  requireCondition(
    /never guess DAA/i.test(trainingSources),
    "TRAINING_SOURCES.md must prohibit guessing DAA",
    failures,
  );
  for (const toccataRequirement of [
    "v2.0.1",
    "KIP-16",
    "KIP-17",
    "KIP-20",
    "KIP-21",
    "100 sompi * max(compute grams, 2 * transaction bytes)",
    "storageMass",
    "computeBudget",
    "covenant_id",
    "GetSeqCommitLaneProof",
    "No full EVM-style smart-contract claims",
  ]) {
    requireCondition(
      toccataGuide.includes(toccataRequirement),
      `docs/toccata.md missing requirement: ${toccataRequirement}`,
      failures,
    );
  }
  for (const masteryRequirement of [
    "Research -> Encode -> Eval -> Build -> Verify -> Record",
    "Protocol",
    "Covenants",
    "Indexers",
    "Wallets",
    "ZK",
    "Sequencing",
    "Readiness boundary",
    "node scripts/toccata-protocol-drill.mjs --check",
    "node scripts/toccata-app-lab.mjs --check-all",
    "node scripts/toccata-readiness-approvals-check.mjs --check",
  ]) {
    requireCondition(
      masteryTrack.includes(masteryRequirement),
      `docs/kaspa/toccata-mastery-track.md missing requirement: ${masteryRequirement}`,
      failures,
    );
  }
  for (const appLabRequirement of [
    "local post-Toccata covenant engineering fixtures",
    "not mainnet evidence",
    "vault_escrow",
    "stateful_registry",
    "atomic_swap",
    "wrong_network",
    "node scripts/toccata-app-lab.mjs --check-all",
    "node scripts/toccata-readiness-approvals-check.mjs --check",
  ]) {
    requireCondition(
      appLabDoc.includes(appLabRequirement),
      `docs/kaspa/kaspa-app-lab.md missing requirement: ${appLabRequirement}`,
      failures,
    );
  }
  requireCondition(
    /Do not claim wallet, indexer, miner, explorer, or application readiness/i.test(readinessApprovals),
    "READINESS_APPROVALS.md must prohibit readiness overclaims",
    failures,
  );
  for (const component of ["wallet", "indexer", "miner", "explorer", "app"]) {
    requireCondition(
      readinessApprovals.includes(`| ${component} |`),
      `READINESS_APPROVALS.md missing ${component} row`,
      failures,
    );
  }
  requireCondition(
    protocolDrills.schemaVersion === 1 && Array.isArray(protocolDrills.cases) && protocolDrills.cases.length >= 8,
    "protocol drill fixture must contain at least 8 schemaVersion 1 cases",
    failures,
  );
  requireCondition(appLabFixtures.length >= 3, "App Lab must include at least 3 fixture families", failures);
  for (const appType of ["vault_escrow", "stateful_registry", "atomic_swap"]) {
    requireCondition(
      appLabFixtures.some((fixture) => fixture.appType === appType && /local_fixture_only/i.test(fixture.evidenceStatus)),
      `App Lab missing local-only fixture type: ${appType}`,
      failures,
    );
  }
  for (const drillId of [
    "activation-claim-boundary",
    "transaction-field-migration",
    "fee-policy-layering",
    "covenant-lineage-indexer",
    "wallet-signing-preview-boundary",
    "sequencing-lane-proof-boundary",
    "zk-proof-cost-boundary",
    "protocol-answer-shape",
  ]) {
    requireCondition(
      protocolDrills.cases.some((entry) => entry.id === drillId),
      `protocol drill fixture missing case: ${drillId}`,
      failures,
    );
    requireCondition(
      typeof adversarialProtocolDrills.responses?.[drillId] === "string" &&
        adversarialProtocolDrills.responses[drillId].trim().length > 0,
      `adversarial protocol drill fixture missing response: ${drillId}`,
      failures,
    );
  }
  requireCondition(
    toccataSnapshot.verdict?.activation?.state === "active",
    "Toccata snapshot must verify active mainnet protocol status",
    failures,
  );
  requireCondition(
    Number(toccataSnapshot.verdict?.activation?.currentDaaScore || 0) >=
      Number(toccataSnapshot.verdict?.activation?.daaScore || Number.POSITIVE_INFINITY),
    "Toccata snapshot current DAA must be at or above activation DAA",
    failures,
  );
  requireCondition(
    toccataSnapshot.kaspaNetwork?.some((source) => source.ok && source.networkName === "kaspa-mainnet"),
    "Toccata snapshot must include healthy kaspa-mainnet endpoint evidence",
    failures,
  );
  requireCondition(
    ecosystemReadiness.verdict?.doNotClaimWalletIndexerReady === true,
    "ecosystem readiness snapshot must keep wallet/indexer readiness unclaimed",
    failures,
  );
  requireCondition(
    Array.isArray(ecosystemReadiness.sources) && ecosystemReadiness.sources.length >= 4,
    "ecosystem readiness snapshot must include audited component sources",
    failures,
  );
  requireCondition(
    ecosystemReadiness.sources?.some((source) => source.sourceEvidence?.matchedFiles?.length > 0),
    "ecosystem readiness snapshot must include source-level evidence samples",
    failures,
  );
  requireCondition(
    ecosystemReadiness.reproducibleIntegrationTests?.some(
      (entry) => entry.id === "kaspa-rest-api-live-covenant-export" && entry.status === "passed",
    ),
    "ecosystem readiness snapshot must include the live covenant export integration evidence",
    failures,
  );
  requireCondition(
    liveCovenantFixture.fixtureType === "live_covenant_indexer_capture" &&
      liveCovenantFixture.networkName === "kaspa-mainnet" &&
      liveCovenantFixture.acceptedTransactions?.[0]?.toccata_fields?.covenant_ids?.length > 0,
    "live covenant fixture must contain a mainnet covenant export",
    failures,
  );
  requireCondition(
    ["pending_no_measurements", "measured_partial", "measured"].includes(zkBenchmark.status),
    "ZK benchmark snapshot must have a valid status",
    failures,
  );
  requireCondition(
    zkBenchmark.status !== "pending_no_measurements" || zkBenchmark.measurements?.length === 0,
    "pending ZK benchmark snapshot must not contain fake measurements",
    failures,
  );
  requireCondition(
    zkBenchmark.status !== "measured_partial" || zkBenchmark.remainingGaps?.length > 0,
    "partial ZK benchmark snapshot must list remaining gaps",
    failures,
  );

  const adapterDir = path.join(skillRoot, "agents");
  for (const fileName of readdirSync(adapterDir).sort()) {
    const content = readFileSync(path.join(adapterDir, fileName), "utf8");
    const staleVersion = content.match(/\bv1\.\d+\.\d+\b/);
    requireCondition(
      !staleVersion,
      `adapter ${fileName} embeds package version ${staleVersion?.[0]}`,
      failures,
    );
  }

  const packageScript = readFileSync(path.join(skillRoot, "scripts", "package-release.sh"), "utf8");
  requireCondition(
    packageScript.includes('VERSION="$(node -e'),
    "package script must derive its version from manifest.json",
    failures,
  );
  requireCondition(
    packageScript.includes("TRAINING_SOURCES.md"),
    "package script must bundle TRAINING_SOURCES.md into release artifacts",
    failures,
  );
  requireCondition(
    packageScript.includes("docs/toccata.md"),
    "package script must bundle docs/toccata.md into release artifacts",
    failures,
  );
  requireCondition(
    packageScript.includes("toccata-mastery-track.md"),
    "package script must bundle docs/kaspa/toccata-mastery-track.md into release artifacts",
    failures,
  );
  requireCondition(
    packageScript.includes("toccata-protocol-drill.mjs"),
    "package script must bundle toccata-protocol-drill.mjs into release artifacts",
    failures,
  );
  for (const bundledName of [
    "captured-responses",
    "ecosystem-readiness-latest.json",
    "live-covenant-indexer-mainnet-latest.md",
    "zk-proof-cost-baseline.json",
    "toccata-captured-responses-check.mjs",
    "toccata-ecosystem-readiness-audit.mjs",
    "toccata-evidence-lanes.test.mjs",
    "toccata-live-fixture-check.mjs",
    "toccata-live-covenant-export.mjs",
    "toccata-zk-benchmark-check.mjs",
  ]) {
    requireCondition(
      packageScript.includes(bundledName),
      `package script must bundle ${bundledName} into release artifacts`,
      failures,
    );
  }
  requireCondition(
    packageScript.includes("SYSTEM_ARCHITECTURE.md"),
    "package script must bundle SYSTEM_ARCHITECTURE.md into release artifacts",
    failures,
  );
  requireCondition(
    packageScript.includes("READINESS_APPROVALS.md"),
    "package script must bundle READINESS_APPROVALS.md into release artifacts",
    failures,
  );
  for (const bundledName of [
    "kaspa-app-lab.md",
    "toccata-app-lab.mjs",
    "toccata-readiness-approvals-check.mjs",
  ]) {
    requireCondition(
      packageScript.includes(bundledName),
      `package script must bundle ${bundledName} into release artifacts`,
      failures,
    );
  }

  return {
    failures,
    manifestVersion: version,
    publishedRelease: releaseMetadata.publishedRelease,
    repositoryStatus: releaseMetadata.repositoryReleaseStatus,
  };
}

async function validateRemote(publishedRelease) {
  const response = await fetch("https://api.github.com/repos/gryszzz/Kaspa-Ai-Agent-Skill/releases/latest", {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "kaspa-skill-release-validator",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub release lookup failed: HTTP ${response.status}`);
  }
  const latest = await response.json();
  return {
    expected: publishedRelease,
    actual: latest.tag_name,
    publishedAt: latest.published_at,
    url: latest.html_url,
    matches: latest.tag_name === publishedRelease,
  };
}

async function main() {
  try {
    const options = parseArgs(process.argv);
    const local = validateLocal(options.repoRoot);
    const report = {
      schemaVersion: 1,
      passed: local.failures.length === 0,
      ...local,
      remote: null,
    };

    if (options.checkRemote) {
      report.remote = await validateRemote(local.publishedRelease);
      if (!report.remote.matches) {
        report.failures.push(
          `published release metadata ${report.remote.expected} != GitHub latest ${report.remote.actual}`,
        );
        report.passed = false;
      }
    }

    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(report.passed ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

await main();
