#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const defaultSourcesPath = path.join(repoRoot, "fixtures", "toccata", "ecosystem-readiness-sources.json");
const defaultSnapshotPath = path.join(repoRoot, "research-snapshots", "toccata", "ecosystem-readiness-latest.json");
const defaultMarkdownPath = path.join(repoRoot, "research-snapshots", "toccata", "ecosystem-readiness-latest.md");
const defaultLiveFixturePath = path.join(repoRoot, "fixtures", "toccata", "live-covenant-indexer-mainnet-latest.json");

function parseArgs(argv) {
  const options = {
    sourcesPath: defaultSourcesPath,
    snapshotPath: defaultSnapshotPath,
    markdownPath: defaultMarkdownPath,
    liveFixturePath: defaultLiveFixturePath,
    write: false,
    check: false,
  };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--write":
        options.write = true;
        break;
      case "--check":
        options.check = true;
        break;
      case "--sources":
        options.sourcesPath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      case "--snapshot":
        options.snapshotPath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      case "--live-fixture":
        options.liveFixturePath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${argv[index]}`);
    }
  }
  return options;
}

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "kaspa-toccata-readiness-audit",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  return { ok: response.ok, status: response.status, body, text };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/plain",
      "User-Agent": "kaspa-toccata-readiness-audit",
    },
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, text };
}

function termsFound(text, terms) {
  const lower = text.toLowerCase();
  return terms.filter((term) => lower.includes(term.toLowerCase()));
}

function isScannablePath(filePath) {
  return (
    /\.(md|json|toml|ya?ml|rs|ts|tsx|js|jsx|go|dart|py|proto|txt)$/i.test(filePath) ||
    /(^|\/)(Dockerfile|Makefile|Cargo\.lock|package-lock\.json|pubspec\.lock)$/i.test(filePath)
  );
}

async function fetchRepoTree(repo, defaultBranch) {
  return fetchJson(`https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`);
}

async function scanSourceEvidence(source, defaultBranch, proofTerms) {
  const tree = await fetchRepoTree(source.repo, defaultBranch);
  if (!tree.ok || !Array.isArray(tree.body?.tree)) {
    return {
      treeOk: false,
      status: tree.status,
      scannedFiles: 0,
      matchedFiles: [],
    };
  }

  const candidateFiles = tree.body.tree
    .filter((entry) => entry.type === "blob" && entry.size <= 250000 && isScannablePath(entry.path))
    .filter((entry) => termsFound(entry.path, proofTerms).length > 0 || /readme|release|changelog|toccata|covenant|mass|compute/i.test(entry.path))
    .slice(0, 120);

  const matchedFiles = [];
  for (const entry of candidateFiles) {
    const raw = await fetchText(
      `https://raw.githubusercontent.com/${source.repo}/${encodeURIComponent(defaultBranch)}/${entry.path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
    );
    if (!raw.ok) continue;
    const terms = [...new Set([...termsFound(entry.path, proofTerms), ...termsFound(raw.text, proofTerms)])];
    if (terms.length === 0) continue;
    const lines = raw.text.split(/\r?\n/);
    const lineNumbers = [];
    for (const [index, line] of lines.entries()) {
      if (termsFound(line, proofTerms).length > 0) lineNumbers.push(index + 1);
      if (lineNumbers.length >= 8) break;
    }
    matchedFiles.push({
      path: entry.path,
      terms,
      lineNumbers,
      contentHash: sha256(raw.text),
    });
    if (matchedFiles.length >= 12) break;
  }

  return {
    treeOk: true,
    status: tree.status,
    scannedFiles: candidateFiles.length,
    matchedFiles,
  };
}

async function auditSource(source, proofTerms) {
  const repoUrl = `https://api.github.com/repos/${source.repo}`;
  const repo = await fetchJson(repoUrl);
  if (!repo.ok) {
    return {
      ...source,
      ok: false,
      status: repo.status,
      readiness: "source_unavailable",
      evidenceTermsFound: [],
    };
  }

  const defaultBranch = repo.body?.default_branch || "master";
  const readme = await fetchText(`https://raw.githubusercontent.com/${source.repo}/${defaultBranch}/README.md`);
  const release = await fetchJson(`https://api.github.com/repos/${source.repo}/releases/latest`);
  const evidenceText = [
    repo.body?.description || "",
    readme.ok ? readme.text : "",
    release.ok ? release.body?.body || release.body?.name || "" : "",
  ].join("\n");
  const found = termsFound(evidenceText, proofTerms);
  const sourceEvidence = await scanSourceEvidence(source, defaultBranch, proofTerms);
  const sourceTerms = [...new Set(sourceEvidence.matchedFiles.flatMap((entry) => entry.terms))];
  const allTerms = [...new Set([...found, ...sourceTerms])];
  const readiness = sourceEvidence.matchedFiles.length
    ? "repo_contains_toccata_evidence_review_required"
    : found.length
      ? "mentions_toccata_terms_review_required"
    : "source_available_no_toccata_readiness_proof";

  return {
    ...source,
    ok: true,
    status: repo.status,
    defaultBranch,
    pushedAt: repo.body?.pushed_at || null,
    updatedAt: repo.body?.updated_at || null,
    latestRelease: release.ok
      ? {
          tagName: release.body?.tag_name || null,
          publishedAt: release.body?.published_at || null,
          url: release.body?.html_url || null,
        }
      : null,
    readmeOk: readme.ok,
    evidenceTermsFound: allTerms,
    textEvidenceTermsFound: found,
    sourceEvidence,
    evidenceHash: sha256(evidenceText),
    readiness,
  };
}

function validateSnapshot(snapshot) {
  const failures = [];
  if (snapshot.schemaVersion !== 1) failures.push("schemaVersion must be 1");
  if (!snapshot.checkedAt) failures.push("checkedAt is required");
  if (!Array.isArray(snapshot.sources) || snapshot.sources.length === 0) failures.push("sources[] is required");
  if (snapshot.verdict?.doNotClaimWalletIndexerReady !== true) {
    failures.push("verdict.doNotClaimWalletIndexerReady must stay true until readiness is proven");
  }
  if (
    snapshot.reproducibleIntegrationTests &&
    !snapshot.reproducibleIntegrationTests.every((entry) => entry.status && entry.command && entry.evidencePath)
  ) {
    failures.push("reproducibleIntegrationTests entries require status, command, and evidencePath");
  }
  return failures;
}

function renderMarkdown(snapshot) {
  const rows = snapshot.sources
    .map(
      (source) =>
        `| ${source.label} | ${source.role} | ${source.ok ? "ok" : "error"} | ${source.readiness} | ${(source.evidenceTermsFound || []).join(", ") || "none"} | ${(source.sourceEvidence?.matchedFiles || [])
          .slice(0, 3)
          .map((entry) => `${entry.path} (${entry.terms.join(",")})`)
          .join("<br>") || "none"} |`,
    )
    .join("\n");
  const integrationRows = (snapshot.reproducibleIntegrationTests || [])
    .map(
      (entry) =>
        `| ${entry.label} | ${entry.componentRole} | ${entry.status} | \`${entry.command}\` | ${entry.evidencePath} | ${entry.boundary} |`,
    )
    .join("\n");
  return `# Toccata Ecosystem Readiness Audit

Checked: ${snapshot.checkedAt}

Verdict: \`${snapshot.verdict.doNotClaimWalletIndexerReady ? "do_not_claim_wallet_indexer_ready" : "review_required"}\`

This audit checks configured public repositories for source availability and
Toccata-related evidence terms. It does not prove wallet, indexer, miner,
explorer, or application readiness.

| Source | Role | Source | Readiness | Evidence terms | Evidence samples |
| --- | --- | --- | --- | --- | --- |
${rows}

## Reproducible Integration Evidence

These checks are stronger than repository keyword matches, but they still do
not prove wallet, miner, explorer, application, or ecosystem-wide readiness.

| Check | Role | Status | Command | Evidence | Boundary |
| --- | --- | --- | --- | --- | --- |
${integrationRows || "| none | none | missing | none | none | no reproducible integration evidence captured yet |"}
`;
}

function buildIntegrationEvidence(options) {
  try {
    const fixture = loadJson(options.liveFixturePath);
    const tx = fixture.acceptedTransactions?.[0];
    if (
      fixture.fixtureType !== "live_covenant_indexer_capture" ||
      fixture.networkName !== "kaspa-mainnet" ||
      !tx?.toccata_fields?.covenant_ids?.length
    ) {
      return [];
    }
    return [
      {
        id: "kaspa-rest-api-live-covenant-export",
        label: "Kaspa REST API live covenant export",
        componentRole: "explorer_api_indexer",
        status: "passed",
        command: "node scripts/toccata-live-covenant-export.mjs --check",
        evidencePath: path.relative(repoRoot, options.liveFixturePath),
        sourceUrl: fixture.source?.url || null,
        transactionId: tx.transaction_id,
        covenantIds: tx.toccata_fields.covenant_ids,
        boundary:
          "Proves this public REST/indexer source exposed one accepted mainnet covenant transaction; does not prove wallet, miner, explorer, or ecosystem-wide readiness.",
      },
    ];
  } catch {
    return [];
  }
}

async function buildSnapshot(options) {
  const config = loadJson(options.sourcesPath);
  const sources = [];
  for (const source of config.sources) {
    sources.push(await auditSource(source, config.proofTerms));
  }
  const snapshot = {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    sourcePolicy: config.auditPolicy,
    sources,
    reproducibleIntegrationTests: buildIntegrationEvidence(options),
    verdict: {
      doNotClaimWalletIndexerReady: true,
      reason:
        "Repository availability, keyword evidence, and one-source integration checks are not sufficient to prove ecosystem-wide readiness.",
    },
  };
  snapshot.factsHash = sha256(JSON.stringify(snapshot.sources));
  return snapshot;
}

async function main() {
  try {
    const options = parseArgs(process.argv);
    if (options.check && !options.write) {
      const snapshot = loadJson(options.snapshotPath);
      const failures = validateSnapshot(snapshot);
      process.stdout.write(
        `${JSON.stringify({ schemaVersion: 1, passed: failures.length === 0, failures }, null, 2)}\n`,
      );
      process.exit(failures.length === 0 ? 0 : 1);
    }

    const snapshot = await buildSnapshot(options);
    const failures = validateSnapshot(snapshot);
    if (options.write) {
      mkdirSync(path.dirname(options.snapshotPath), { recursive: true });
      writeFileSync(options.snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
      writeFileSync(options.markdownPath, renderMarkdown(snapshot));
    }
    process.stdout.write(`${JSON.stringify({ ...snapshot, validationFailures: failures }, null, 2)}\n`);
    process.exit(failures.length === 0 ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();
