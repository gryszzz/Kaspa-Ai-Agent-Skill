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

function parseArgs(argv) {
  const options = {
    sourcesPath: defaultSourcesPath,
    snapshotPath: defaultSnapshotPath,
    markdownPath: defaultMarkdownPath,
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
  const readiness = found.length
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
    evidenceTermsFound: found,
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
  return failures;
}

function renderMarkdown(snapshot) {
  const rows = snapshot.sources
    .map(
      (source) =>
        `| ${source.label} | ${source.role} | ${source.ok ? "ok" : "error"} | ${source.readiness} | ${(source.evidenceTermsFound || []).join(", ") || "none"} |`,
    )
    .join("\n");
  return `# Toccata Ecosystem Readiness Audit

Checked: ${snapshot.checkedAt}

Verdict: \`${snapshot.verdict.doNotClaimWalletIndexerReady ? "do_not_claim_wallet_indexer_ready" : "review_required"}\`

This audit checks configured public repositories for source availability and
Toccata-related evidence terms. It does not prove wallet, indexer, miner,
explorer, or application readiness.

| Source | Role | Source | Readiness | Evidence terms |
| --- | --- | --- | --- | --- |
${rows}
`;
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
    verdict: {
      doNotClaimWalletIndexerReady: true,
      reason: "Repository availability and keyword evidence are not sufficient to prove ecosystem readiness.",
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

