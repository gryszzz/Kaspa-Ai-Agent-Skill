import { createHash } from "node:crypto";

export function sha256(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

export function shortHash(value, length = 12) {
  return value ? String(value).slice(0, length) : "";
}

function countOk(items = []) {
  return items.filter((item) => item.ok).length;
}

function countFailures(items = []) {
  return items.filter((item) => !item.ok).length;
}

function networkMismatch(item) {
  return Boolean(item.ok && item.expectedNetworkName && item.networkName !== item.expectedNetworkName);
}

function stableEvidence(snapshot) {
  return {
    github: snapshot.github,
    web: snapshot.web,
    kaspaNetwork: snapshot.kaspaNetwork,
    kipIndex: snapshot.kipIndex,
    verdict: snapshot.verdict,
  };
}

export function computeFactsHash(snapshot) {
  return sha256(JSON.stringify(stableEvidence(snapshot)));
}

export function summarizeSourceHealth(snapshot) {
  const githubRepos = snapshot.github?.repos || [];
  const releases = snapshot.github?.releases || [];
  const refs = snapshot.github?.refs || [];
  const web = snapshot.web || [];
  const network = snapshot.kaspaNetwork || [];
  const kipDocuments = snapshot.kipIndex?.documents || [];

  const primaryRepos = githubRepos.filter((repo) => repo.primary);
  const officialWeb = web.filter((item) => item.primary);
  const healthyPrimaryRepos = countOk(primaryRepos);
  const healthyPrimaryWeb = countOk(officialWeb);
  const healthyNetwork = countOk(network.filter((item) => !networkMismatch(item)));
  const latestRustyRelease = releases.find(
    (release) => release.repo === "kaspanet/rusty-kaspa" && release.kind === "latest",
  );

  const warnings = [];
  for (const repo of githubRepos.filter((item) => !item.ok)) {
    warnings.push(`GitHub source unavailable: ${repo.repo}`);
  }
  for (const page of web.filter((item) => !item.ok)) {
    warnings.push(`Web source unavailable: ${page.label}`);
  }
  for (const item of network.filter(networkMismatch)) {
    warnings.push(`Wrong network identity from ${item.label}: expected ${item.expectedNetworkName}, got ${item.networkName}`);
  }
  for (const item of network.filter((entry) => !entry.ok)) {
    warnings.push(`Network endpoint unavailable: ${item.label}`);
  }

  let sourceHealth = "unavailable";
  if (healthyPrimaryRepos >= 3 && latestRustyRelease?.ok && healthyPrimaryWeb >= 1 && healthyNetwork >= 1) {
    sourceHealth = warnings.length ? "healthy_with_warnings" : "healthy";
  } else if (healthyPrimaryRepos > 0 || healthyPrimaryWeb > 0 || healthyNetwork > 0) {
    sourceHealth = "degraded";
  }

  return {
    sourceHealth,
    counts: {
      githubRepos: githubRepos.length,
      githubReposOk: countOk(githubRepos),
      githubRepoFailures: countFailures(githubRepos),
      releases: releases.length,
      releasesOk: countOk(releases),
      refs: refs.length,
      refsOk: countOk(refs),
      webSources: web.length,
      webSourcesOk: countOk(web),
      networkSources: network.length,
      networkSourcesOk: countOk(network),
      kipDocuments: kipDocuments.length,
      kipDocumentsOk: countOk(kipDocuments),
    },
    primaryEvidence: {
      healthyPrimaryRepos,
      healthyPrimaryWeb,
      healthyNetwork,
      latestRustyReleaseTag: latestRustyRelease?.tagName || null,
      latestRustyReleasePublishedAt: latestRustyRelease?.publishedAt || null,
    },
    warnings,
    claimRules: [
      "Do not convert endpoint failure into feature absence.",
      "Do not convert testnet activation into mainnet activation.",
      "Do not convert a merged KIP into released or activated behavior.",
      "Do not convert a final release with a future DAA into active behavior.",
      "Always record source URL, checkedAt, release tag or commit, and network identity for current claims.",
    ],
  };
}

export function validateSourceSnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== "object") {
    return ["snapshot must be an object"];
  }
  if (snapshot.schemaVersion !== 1) {
    errors.push("schemaVersion must be 1");
  }
  if (!snapshot.checkedAt) {
    errors.push("checkedAt is required");
  }
  if (!Array.isArray(snapshot.github?.repos) || snapshot.github.repos.length === 0) {
    errors.push("github.repos must be non-empty");
  }
  if (!Array.isArray(snapshot.github?.releases) || snapshot.github.releases.length === 0) {
    errors.push("github.releases must be non-empty");
  }
  if (!Array.isArray(snapshot.web) || snapshot.web.length === 0) {
    errors.push("web sources must be non-empty");
  }
  if (!Array.isArray(snapshot.kaspaNetwork) || snapshot.kaspaNetwork.length === 0) {
    errors.push("kaspaNetwork sources must be non-empty");
  }
  if (!snapshot.verdict?.sourceHealth) {
    errors.push("verdict.sourceHealth is required");
  }
  if (snapshot.verdict?.sourceHealth === "unavailable") {
    errors.push("all primary source lanes are unavailable");
  }
  if (!snapshot.factsHash || !/^[0-9a-f]{64}$/i.test(snapshot.factsHash)) {
    errors.push("factsHash must be a sha256 hex digest");
  }
  return errors;
}

function tableRow(cells) {
  return `| ${cells.join(" | ")} |`;
}

export function toMarkdown(snapshot) {
  const lines = [];
  const verdict = snapshot.verdict || {};

  lines.push("# Kaspa Live Source Intelligence");
  lines.push("");
  lines.push(`Checked: ${snapshot.checkedAt}`);
  lines.push(`Facts hash: \`${snapshot.factsHash || ""}\``);
  lines.push(`Source health: **${verdict.sourceHealth || "unknown"}**`);
  lines.push("");

  lines.push("## Primary Evidence");
  lines.push("");
  lines.push(tableRow(["Lane", "Healthy", "Total"]));
  lines.push(tableRow(["---", "---:", "---:"]));
  lines.push(tableRow(["GitHub repositories", verdict.counts?.githubReposOk ?? 0, verdict.counts?.githubRepos ?? 0]));
  lines.push(tableRow(["GitHub releases", verdict.counts?.releasesOk ?? 0, verdict.counts?.releases ?? 0]));
  lines.push(tableRow(["GitHub refs", verdict.counts?.refsOk ?? 0, verdict.counts?.refs ?? 0]));
  lines.push(tableRow(["Web/docs/research", verdict.counts?.webSourcesOk ?? 0, verdict.counts?.webSources ?? 0]));
  lines.push(tableRow(["Network endpoints", verdict.counts?.networkSourcesOk ?? 0, verdict.counts?.networkSources ?? 0]));
  lines.push(tableRow(["KIP documents", verdict.counts?.kipDocumentsOk ?? 0, verdict.counts?.kipDocuments ?? 0]));
  lines.push("");

  lines.push("## Latest Rusty Kaspa Release");
  lines.push("");
  const latest = snapshot.github?.releases?.find(
    (release) => release.repo === "kaspanet/rusty-kaspa" && release.kind === "latest",
  );
  if (latest?.ok) {
    lines.push(`- Tag: [${latest.tagName}](${latest.url})`);
    lines.push(`- Published: ${latest.publishedAt || "unknown"}`);
    lines.push(`- Prerelease: ${latest.prerelease ? "yes" : "no"}`);
  } else {
    lines.push("- Latest release unavailable.");
  }
  lines.push("");

  lines.push("## GitHub Refs");
  lines.push("");
  lines.push(tableRow(["Source", "Ref", "SHA", "Status"]));
  lines.push(tableRow(["---", "---", "---", "---"]));
  for (const ref of snapshot.github?.refs || []) {
    lines.push(tableRow([
      ref.repo,
      `${ref.kind}/${ref.name}`,
      ref.sha ? `\`${shortHash(ref.sha)}\`` : "",
      ref.ok ? "ok" : `failed ${ref.status || ""}`,
    ]));
  }
  lines.push("");

  lines.push("## Network Identity");
  lines.push("");
  lines.push(tableRow(["Endpoint", "Expected", "Observed", "DAA", "Status"]));
  lines.push(tableRow(["---", "---", "---", "---:", "---"]));
  for (const item of snapshot.kaspaNetwork || []) {
    lines.push(tableRow([
      `[${item.label}](${item.url})`,
      item.expectedNetworkName || "",
      item.networkName || "",
      item.virtualDaaScore || "",
      item.ok ? "ok" : `failed ${item.status || ""}`,
    ]));
  }
  lines.push("");

  lines.push("## KIP Index");
  lines.push("");
  lines.push(tableRow(["KIP", "Status", "Title"]));
  lines.push(tableRow(["---", "---", "---"]));
  for (const kip of (snapshot.kipIndex?.documents || []).filter((entry) => entry.ok).slice(0, 40)) {
    lines.push(tableRow([
      kip.kip || kip.file,
      kip.documentStatus || "",
      kip.title || "",
    ]));
  }
  lines.push("");

  if (verdict.warnings?.length) {
    lines.push("## Warnings");
    lines.push("");
    for (const warning of verdict.warnings) {
      lines.push(`- ${warning}`);
    }
    lines.push("");
  }

  lines.push("## Claim Rules");
  lines.push("");
  for (const rule of verdict.claimRules || []) {
    lines.push(`- ${rule}`);
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}
