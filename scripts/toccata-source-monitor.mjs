#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  classifyUpstreamChanges,
  evaluateMainnetActivation,
  parseToccataActivation,
  validateToccataSnapshot,
} from "./lib/toccata-intelligence.mjs";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, "research-snapshots", "toccata");
const LATEST_JSON = path.join(OUTPUT_DIR, "latest.json");
const LATEST_MD = path.join(OUTPUT_DIR, "latest.md");
const CHECKED_AT = new Date().toISOString();
const WRITE_IF_CHANGED = process.argv.includes("--write-if-changed");
const CHECK_ONLY = process.argv.includes("--check");

function resolveGithubToken() {
  if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
    return process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  }

  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

const GITHUB_TOKEN = resolveGithubToken();

const githubPulls = [
  {
    repo: "kaspanet/rusty-kaspa",
    number: 1000,
    label: "Toccata implementation",
    interpretation: "Main branch-aware implementation signal. Open PR is not mainnet activation.",
  },
  {
    repo: "kaspanet/rusty-kaspa",
    number: 1013,
    label: "ZK opcode updates",
    interpretation: "Fast testnet hard-fork signal for ZK opcode consensus deltas.",
  },
  {
    repo: "kaspanet/kips",
    number: 31,
    label: "KIP-16",
    interpretation: "KIP proposal status must be separated from merged protocol behavior.",
  },
  {
    repo: "kaspanet/kips",
    number: 32,
    label: "KIP-17",
    interpretation: "KIP proposal status must be separated from merged protocol behavior.",
  },
  {
    repo: "kaspanet/kips",
    number: 35,
    label: "KIP-20",
    interpretation: "KIP proposal status must be separated from merged protocol behavior.",
  },
  {
    repo: "kaspanet/kips",
    number: 36,
    label: "KIP-21",
    interpretation: "KIP proposal status must be separated from merged protocol behavior.",
  },
  {
    repo: "kaspanet/kips",
    number: 37,
    label: "KIP-22",
    interpretation: "Adjacent proposal signal for Toccata-era programmability tracking.",
  },
  {
    repo: "kaspanet/kips",
    number: 40,
    label: "KIP-23",
    interpretation: "Adjacent proposal signal for Toccata-era programmability tracking.",
  },
];

const githubRefs = [
  { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "master" },
  { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "toccata" },
  { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "tn10" },
  { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "tn12" },
  { repo: "kaspanet/rusty-kaspa", kind: "tags", name: "tn10-toc2" },
  { repo: "kaspanet/rusty-kaspa", kind: "tags", name: "tn10-toc3" },
  { repo: "kaspanet/rusty-kaspa", kind: "tags", name: "v1.3.0-toc.5" },
  { repo: "kaspanet/rusty-kaspa", kind: "tags", name: "v2.0.0" },
  { repo: "kaspanet/rusty-kaspa", kind: "tags", name: "v1.1.0" },
  { repo: "kaspanet/kips", kind: "heads", name: "master" },
  { repo: "kaspanet/docs", kind: "heads", name: "main" },
  { repo: "kaspanet/silverscript", kind: "heads", name: "master" },
  { repo: "kaspanet/vprogs", kind: "heads", name: "master" },
];

const branchDeltaSources = githubRefs.filter((ref) => ref.kind === "heads");

const githubReleases = [
  {
    repo: "kaspanet/rusty-kaspa",
    tag: "v2.0.0",
    label: "Final Toccata mainnet release",
    interpretation: "Final release and activation schedule evidence; active behavior still requires the mainnet DAA threshold.",
  },
  {
    repo: "kaspanet/rusty-kaspa",
    tag: "v1.3.0-toc.5",
    label: "Toccata mainnet pre-activation pre-release",
    interpretation: "Mainnet sanity-testing release; not mainnet activation.",
  },
  {
    repo: "kaspanet/rusty-kaspa",
    tag: "tn10-toc3",
    label: "TN10 Toccata ZK hardening",
    interpretation: "Testnet-10 hardening activation evidence only.",
  },
  {
    repo: "kaspanet/rusty-kaspa",
    tag: "tn10-toc2",
    label: "TN10 Toccata hardfork rehearsal",
    interpretation: "Earlier Testnet-10 activation schedule evidence.",
  },
  {
    repo: "kaspanet/rusty-kaspa",
    tag: "v1.1.0",
    label: "Pre-Toccata stable baseline",
    interpretation: "Stable integration baseline; do not confuse with Toccata pre-release.",
  },
];

const webSources = [
  {
    label: "Rusty Kaspa Toccata node guide",
    url: "https://raw.githubusercontent.com/kaspanet/rusty-kaspa/v2.0.0/docs/toccata-guide.md",
  },
  {
    label: "Kaspa programmability overview",
    url: "https://docs.kaspa.org/programmability",
  },
  {
    label: "Kaspa covenants docs",
    url: "https://docs.kaspa.org/programmability/covenants",
  },
  {
    label: "Kaspa inline ZK docs",
    url: "https://docs.kaspa.org/programmability/inline-zk",
  },
  {
    label: "Kaspa based apps docs",
    url: "https://docs.kaspa.org/programmability/based-apps",
  },
  {
    label: "Kaspa full vProgs docs",
    url: "https://docs.kaspa.org/programmability/full-vprogs",
  },
  {
    label: "Formal vProg computation DAG model",
    url: "https://research.kas.pa/t/zoom-in-a-formal-backbone-model-for-the-vprog-computation-dag/407",
  },
  {
    label: "vProgs pruning safety",
    url: "https://research.kas.pa/t/pruning-safety-in-the-vprogs-architecture/411",
  },
  {
    label: "Proof stitching framework",
    url: "https://research.kas.pa/t/a-basic-framework-for-proofs-stitching/323",
  },
  {
    label: "Based ZK rollups over Kaspa",
    url: "https://research.kas.pa/t/on-the-design-of-based-zk-rollups-over-kaspas-utxo-based-dag-consensus/208",
  },
];

const networkSources = [
  {
    label: "Mainnet blockdag",
    url: "https://api.kaspa.org/info/blockdag",
    expectedNetworkName: "kaspa-mainnet",
  },
  {
    label: "TN10 blockdag",
    url: "https://api-tn10.kaspa.org/info/blockdag",
    expectedNetworkName: "kaspa-testnet-10",
  },
  {
    label: "TN12 blockdag",
    url: "https://api-tn12.kaspa.org/info/blockdag",
    expectedNetworkName: "kaspa-testnet-12",
  },
];

const apiHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "gryszzz-kaspa-toccata-source-monitor",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (GITHUB_TOKEN) {
  apiHeaders.Authorization = `Bearer ${GITHUB_TOKEN}`;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function splitRepo(repo) {
  const [owner, name] = repo.split("/");
  return { owner, name };
}

function shortSha(value) {
  return value ? value.slice(0, 12) : "";
}

function webFingerprintBasis({ etag, lastModified, contentLength, contentSha256 }) {
  if (etag) {
    return `etag:${etag}`;
  }
  if (lastModified) {
    return `last-modified:${lastModified};bytes:${contentLength}`;
  }
  return `sha256:${contentSha256}`;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 25_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url, options = {}) {
  try {
    const response = await fetchWithTimeout(url, options);
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      return {
        ok: false,
        status: response.status,
        url,
        error: `Invalid JSON: ${error.message}`,
        bodyHash: sha256(text),
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        url,
        error: data?.message || response.statusText,
      };
    }

    return {
      ok: true,
      status: response.status,
      url,
      data,
      etag: response.headers.get("etag") || null,
      lastModified: response.headers.get("last-modified") || null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      url,
      error: error.message,
    };
  }
}

async function fetchText(url, options = {}) {
  try {
    const response = await fetchWithTimeout(url, options);
    const text = await response.text();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        url,
        error: response.statusText,
        bodyHash: sha256(text),
      };
    }

    return {
      ok: true,
      status: response.status,
      url,
      text,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      url,
      error: error.message,
    };
  }
}

async function fetchGithubPages(url) {
  const results = [];
  let page = 1;

  while (page <= 10) {
    const separator = url.includes("?") ? "&" : "?";
    const result = await fetchJson(`${url}${separator}per_page=100&page=${page}`, { headers: apiHeaders });
    if (!result.ok) {
      return result;
    }

    results.push(...result.data);
    if (!Array.isArray(result.data) || result.data.length < 100) {
      break;
    }
    page += 1;
  }

  return {
    ok: true,
    status: 200,
    url,
    data: results,
  };
}

async function fetchTextFingerprint(source) {
  try {
    const response = await fetchWithTimeout(source.url, {
      headers: {
        "User-Agent": "gryszzz-kaspa-toccata-source-monitor",
      },
    });
    const text = await response.text();
    const etag = response.headers.get("etag") || null;
    const lastModified = response.headers.get("last-modified") || null;
    const contentLength = text.length;
    const contentSha256 = sha256(text);
    const fingerprintBasis = webFingerprintBasis({
      etag,
      lastModified,
      contentLength,
      contentSha256,
    });

    return {
      ...source,
      ok: response.ok,
      status: response.status,
      etag,
      lastModified,
      contentLength,
      contentSha256,
      fingerprintBasis,
      sourceFingerprint: sha256(fingerprintBasis),
    };
  } catch (error) {
    return {
      ...source,
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

function addSignal(signals, condition, label) {
  if (condition) {
    signals.add(label);
  }
}

function detectFileSignals(file) {
  const filename = file.filename || "";
  const haystack = `${filename}\n${file.patch || ""}`.toLowerCase();
  const signals = new Set();

  addSignal(signals, haystack.includes("params.rs") || haystack.includes("forkactivation") || haystack.includes("activation"), "consensus activation/config");
  addSignal(signals, haystack.includes("transaction_validator") || haystack.includes("utxo_context"), "transaction validation");
  addSignal(signals, haystack.includes("txscript") || haystack.includes("opcode") || haystack.includes("engineflags"), "txscript opcode/runtime");
  addSignal(signals, haystack.includes("zk_precompile") || haystack.includes("opzkprecompile"), "ZK precompile");
  addSignal(signals, haystack.includes("groth16"), "Groth16 verifier");
  addSignal(signals, haystack.includes("risc0") || haystack.includes("succinct"), "RISC0/Succinct verifier");
  addSignal(signals, haystack.includes("pricing") || haystack.includes("resource_meter") || haystack.includes("script_units"), "pricing/resource meter");
  addSignal(signals, filename.includes("/tests/") || filename.includes("/benches/") || filename.endsWith("_test.rs"), "tests/benches");
  addSignal(signals, haystack.includes("rpc") || haystack.includes("wasm") || haystack.includes("js-bindings") || haystack.includes("protowire"), "RPC/WASM bindings");
  addSignal(signals, /^kip-\d+\.md$/i.test(filename), "KIP document");
  addSignal(signals, filename.toLowerCase().endsWith(".md") || filename.toLowerCase() === "readme.md", "docs");

  return [...signals];
}

function summarizePullFiles(files) {
  const contentSignals = new Set();
  let additions = 0;
  let deletions = 0;

  const summarizedFiles = files.map((file) => {
    additions += file.additions || 0;
    deletions += file.deletions || 0;
    for (const signal of detectFileSignals(file)) {
      contentSignals.add(signal);
    }

    return {
      filename: file.filename,
      status: file.status,
      additions: file.additions || 0,
      deletions: file.deletions || 0,
      changes: file.changes || 0,
    };
  });

  const topFiles = [...summarizedFiles]
    .sort((a, b) => b.changes - a.changes)
    .slice(0, 6);

  return {
    fileCount: summarizedFiles.length,
    additions,
    deletions,
    contentSignals: [...contentSignals].sort(),
    topFiles,
    fileFingerprint: sha256(
      JSON.stringify(
        summarizedFiles.map((file) => ({
          filename: file.filename,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
        })),
      ),
    ),
  };
}

function parseKipMetadata(text) {
  const metadata = {};
  const keys = {
    KIP: "kip",
    Layer: "layer",
    Title: "title",
    Authors: "authors",
    Status: "status",
    Created: "created",
  };
  for (const [key, property] of Object.entries(keys)) {
    const match = text.match(new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, "im"));
    if (match) {
      metadata[property] = match[1].trim();
    }
  }
  return metadata;
}

async function readKipDocumentStatus(files) {
  const kipFile = files.find((file) => /^kip-\d+\.md$/i.test(file.filename));
  if (!kipFile?.raw_url) {
    return null;
  }

  const result = await fetchText(kipFile.raw_url, {
    headers: {
      "User-Agent": "gryszzz-kaspa-toccata-source-monitor",
    },
  });

  if (!result.ok) {
    return {
      filename: kipFile.filename,
      ok: false,
      status: result.status,
      error: result.error,
    };
  }

  const metadata = parseKipMetadata(result.text);
  return {
    filename: kipFile.filename,
    ok: true,
    kip: metadata.kip || null,
    layer: metadata.layer || null,
    title: metadata.title || null,
    documentStatus: metadata.status || null,
    created: metadata.created || null,
  };
}

async function readGithubPullFiles(entry) {
  const { owner, name } = splitRepo(entry.repo);
  const result = await fetchGithubPages(`https://api.github.com/repos/${owner}/${name}/pulls/${entry.number}/files`);

  if (!result.ok) {
    return {
      ok: false,
      status: result.status,
      error: result.error,
      summary: {
        fileCount: 0,
        additions: 0,
        deletions: 0,
        contentSignals: [],
        topFiles: [],
        fileFingerprint: null,
      },
      kipDocument: null,
    };
  }

  const files = result.data.map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions || 0,
    deletions: file.deletions || 0,
    changes: file.changes || 0,
    raw_url: file.raw_url || null,
    patch: file.patch || "",
  }));

  return {
    ok: true,
    summary: summarizePullFiles(files),
    kipDocument: entry.repo === "kaspanet/kips" ? await readKipDocumentStatus(files) : null,
  };
}

async function readGithubPull(entry) {
  const { owner, name } = splitRepo(entry.repo);
  const result = await fetchJson(
    `https://api.github.com/repos/${owner}/${name}/pulls/${entry.number}`,
    { headers: apiHeaders },
  );

  if (!result.ok) {
    return { ...entry, ok: false, status: result.status, error: result.error };
  }

  const pull = result.data;
  const files = await readGithubPullFiles(entry);
  return {
    ...entry,
    ok: true,
    state: pull.state,
    merged: Boolean(pull.merged_at),
    draft: Boolean(pull.draft),
    title: pull.title,
    url: pull.html_url,
    baseRefName: pull.base?.ref || null,
    headRefName: pull.head?.ref || null,
    headSha: pull.head?.sha || null,
    updatedAt: pull.updated_at,
    createdAt: pull.created_at,
    mergedAt: pull.merged_at,
    diffSummary: files.summary,
    diffSummaryOk: files.ok,
    diffSummaryError: files.error || null,
    kipDocument: files.kipDocument,
  };
}

async function readGithubRef(entry) {
  const { owner, name } = splitRepo(entry.repo);
  const refName = encodeURIComponent(entry.name).replace(/%2F/g, "/");
  const result = await fetchJson(
    `https://api.github.com/repos/${owner}/${name}/git/ref/${entry.kind}/${refName}`,
    { headers: apiHeaders },
  );

  if (!result.ok) {
    return { ...entry, ok: false, status: result.status, error: result.error };
  }

  return {
    ...entry,
    ok: true,
    sha: result.data.object?.sha || null,
    objectType: result.data.object?.type || null,
    url: `https://github.com/${entry.repo}/tree/${entry.name}`,
  };
}

async function readGithubBranchDelta(entry, refs, previousSnapshot) {
  const currentRef = refs.find(
    (ref) => ref.repo === entry.repo && ref.kind === entry.kind && ref.name === entry.name,
  );
  const previousRef = previousSnapshot?.github?.refs?.find(
    (ref) => ref.repo === entry.repo && ref.kind === entry.kind && ref.name === entry.name,
  );
  const previousDelta = previousSnapshot?.github?.branchDeltas?.find(
    (delta) => delta.repo === entry.repo && delta.branch === entry.name,
  );
  const base = {
    repo: entry.repo,
    branch: entry.name,
    label: `${entry.repo} ${entry.name}`,
    beforeSha: previousRef?.sha || null,
    afterSha: currentRef?.sha || null,
  };

  if (!currentRef?.ok) {
    return { ...base, ok: false, status: currentRef?.status || 0, error: currentRef?.error || "current ref unavailable" };
  }
  if (!previousRef?.ok || !previousRef.sha) {
    return { ...base, ok: true, status: "baseline_created", commits: [], files: [], impacts: [] };
  }
  if (previousRef.sha === currentRef.sha) {
    if (previousDelta?.afterSha === currentRef.sha && previousDelta.commits?.length) {
      const carriedCommits = previousDelta.commits.map((commit) => ({
        ...commit,
        message: (commit.message || "").split("\n")[0],
      }));
      return {
        ...previousDelta,
        status: "last_observed_change",
        commits: carriedCommits,
        impacts: classifyUpstreamChanges(previousDelta.files || [], carriedCommits),
      };
    }
    return { ...base, ok: true, status: "unchanged", commits: [], files: [], impacts: [] };
  }

  const { owner, name } = splitRepo(entry.repo);
  const result = await fetchJson(
    `https://api.github.com/repos/${owner}/${name}/compare/${previousRef.sha}...${currentRef.sha}`,
    { headers: apiHeaders },
  );
  if (!result.ok) {
    return { ...base, ok: false, status: result.status, error: result.error };
  }

  const commits = (result.data.commits || []).map((commit) => ({
    sha: commit.sha || null,
    committedAt: commit.commit?.committer?.date || commit.commit?.author?.date || null,
    message: (commit.commit?.message || "").split("\n")[0],
    url: commit.html_url || null,
  }));
  const files = (result.data.files || []).map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions || 0,
    deletions: file.deletions || 0,
    changes: file.changes || 0,
    patch: file.patch || "",
  }));

  return {
    ...base,
    ok: true,
    status: result.data.status || "changed",
    aheadBy: result.data.ahead_by || 0,
    behindBy: result.data.behind_by || 0,
    totalCommits: result.data.total_commits || commits.length,
    fileCount: files.length,
    additions: files.reduce((total, file) => total + file.additions, 0),
    deletions: files.reduce((total, file) => total + file.deletions, 0),
    filesTruncated: files.length >= 300,
    commits,
    files: files.map(({ patch, ...file }) => file),
    impacts: classifyUpstreamChanges(files, commits),
    url: `https://github.com/${entry.repo}/compare/${previousRef.sha}...${currentRef.sha}`,
  };
}

function releaseHighlights(body) {
  if (!body) {
    return [];
  }
  const lines = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const priorityLines = lines.filter(
    (line) =>
      line.startsWith("- ") ||
      line.startsWith("## ") ||
      /activation|activate|hard fork|daa score|toccata|upgrade/i.test(line),
  );
  return (priorityLines.length ? priorityLines : lines).slice(0, 8);
}

async function readGithubRelease(entry) {
  const { owner, name } = splitRepo(entry.repo);
  const tag = encodeURIComponent(entry.tag);
  const result = await fetchJson(`https://api.github.com/repos/${owner}/${name}/releases/tags/${tag}`, {
    headers: apiHeaders,
  });

  if (!result.ok) {
    return { ...entry, ok: false, status: result.status, error: result.error };
  }

  const release = result.data;
  const body = release.body || "";
  const snapshotRelease = {
    ...entry,
    ok: true,
    name: release.name || null,
    tagName: release.tag_name || entry.tag,
    prerelease: Boolean(release.prerelease),
    draft: Boolean(release.draft),
    publishedAt: release.published_at || null,
    targetCommitish: release.target_commitish || null,
    url: release.html_url || `https://github.com/${entry.repo}/releases/tag/${entry.tag}`,
    bodySha256: sha256(body),
    bodyHighlights: releaseHighlights(body),
  };
  snapshotRelease.activation = parseToccataActivation({ ...snapshotRelease, body });
  return snapshotRelease;
}

async function readNetworkSource(entry) {
  const result = await fetchJson(entry.url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "gryszzz-kaspa-toccata-source-monitor",
    },
  });

  if (!result.ok) {
    return { ...entry, ok: false, status: result.status, error: result.error };
  }

  return {
    ...entry,
    ok: true,
    status: result.status,
    networkName: result.data.networkName ?? null,
    virtualDaaScore: result.data.virtualDaaScore ?? null,
    blockCount: result.data.blockCount ?? null,
    headerCount: result.data.headerCount ?? null,
    tipHashes: Array.isArray(result.data.tipHashes) ? result.data.tipHashes : [],
  };
}

function buildVerdict({ pulls, refs, releases, kaspaNetwork }) {
  const toccataPr = pulls.find((pull) => pull.repo === "kaspanet/rusty-kaspa" && pull.number === 1000);
  const mainRef = refs.find((ref) => ref.repo === "kaspanet/rusty-kaspa" && ref.kind === "heads" && ref.name === "master");
  const toccataRef = refs.find((ref) => ref.repo === "kaspanet/rusty-kaspa" && ref.kind === "heads" && ref.name === "toccata");
  const finalRelease = releases.find((release) => release.repo === "kaspanet/rusty-kaspa" && release.tag === "v2.0.0");
  const mainnet = kaspaNetwork.find((source) => source.label === "Mainnet blockdag");
  const activation = evaluateMainnetActivation(finalRelease, mainnet);
  const activationLabel =
    activation.state === "active"
      ? `verified active at mainnet DAA ${activation.currentDaaScore}, activation threshold ${activation.daaScore}`
      : activation.state === "scheduled"
        ? `scheduled for mainnet DAA ${activation.daaScore} (${activation.scheduleText || "UTC estimate unavailable"}); current mainnet is below threshold`
        : activation.state === "scheduled_endpoint_unverified"
          ? `scheduled for mainnet DAA ${activation.daaScore}, but mainnet endpoint evidence is unavailable`
          : "not_verified_by_monitor";

  return {
    mainnetActivation: activationLabel,
    activation,
    implementationStatus: toccataPr?.ok
      ? `PR #1000 is ${toccataPr.state}${toccataPr.merged ? " and merged" : ""} against ${toccataPr.baseRefName}.`
      : "PR #1000 status unavailable.",
    branchStatus:
      mainRef?.ok && toccataRef?.ok
        ? `rusty-kaspa master ${shortSha(mainRef.sha)}, toccata ${shortSha(toccataRef.sha)}.`
        : "rusty-kaspa branch status incomplete.",
    caution: [
      "Do not equate open PRs with merged production behavior.",
      "A final release and activation schedule do not mean the activation DAA has been reached.",
      "Separate protocol activation from wallet, pool, indexer, explorer, and application readiness.",
    ],
  };
}

function applyPreviousPullMetadataFallback(snapshot, previousSnapshot) {
  if (!previousSnapshot?.github?.pulls) {
    return;
  }

  const previousPulls = keyedMap(previousSnapshot.github.pulls, (pull) => `${pull.repo}#${pull.number}`);
  for (const pull of snapshot.github.pulls) {
    const previousPull = previousPulls.get(`${pull.repo}#${pull.number}`);
    if (!previousPull || previousPull.headSha !== pull.headSha) {
      continue;
    }

    if (!pull.diffSummaryOk && previousPull.diffSummaryOk && previousPull.diffSummary) {
      pull.diffSummary = previousPull.diffSummary;
      pull.diffSummaryOk = true;
      pull.diffSummaryError = `reused previous summary after fetch failure: ${pull.diffSummaryError || "unknown"}`;
    }

    if (!pull.kipDocument?.ok && previousPull.kipDocument?.ok) {
      pull.kipDocument = previousPull.kipDocument;
    }
  }
}

function applyPreviousGithubFetchFallback({ pulls, refs }, previousSnapshot) {
  const warnings = [];
  if (!previousSnapshot?.github) {
    return warnings;
  }

  const previousPulls = keyedMap(previousSnapshot.github.pulls, (pull) => `${pull.repo}#${pull.number}`);
  for (let index = 0; index < pulls.length; index += 1) {
    const pull = pulls[index];
    if (pull.ok) {
      continue;
    }
    const previousPull = previousPulls.get(`${pull.repo}#${pull.number}`);
    if (previousPull?.ok) {
      warnings.push(`${pull.label}: reused previous PR state after fetch failure (${pull.error || pull.status || "unknown"}).`);
      pulls[index] = previousPull;
    }
  }

  const previousRefs = keyedMap(previousSnapshot.github.refs, (ref) => `${ref.repo}:${ref.kind}/${ref.name}`);
  for (let index = 0; index < refs.length; index += 1) {
    const ref = refs[index];
    if (ref.ok) {
      continue;
    }
    const previousRef = previousRefs.get(`${ref.repo}:${ref.kind}/${ref.name}`);
    if (previousRef?.ok) {
      warnings.push(`${ref.repo} ${ref.kind}/${ref.name}: reused previous ref after fetch failure (${ref.error || ref.status || "unknown"}).`);
      refs[index] = previousRef;
    }
  }

  return warnings;
}

function applyPreviousReleaseFetchFallback({ releases }, previousSnapshot) {
  const warnings = [];
  if (!previousSnapshot?.github?.releases) {
    return warnings;
  }

  const previousReleases = keyedMap(previousSnapshot.github.releases, (release) => `${release.repo}:${release.tag}`);
  for (let index = 0; index < releases.length; index += 1) {
    const release = releases[index];
    if (release.ok) {
      continue;
    }
    const previousRelease = previousReleases.get(`${release.repo}:${release.tag}`);
    if (previousRelease?.ok) {
      warnings.push(`${release.label}: reused previous release state after fetch failure (${release.error || release.status || "unknown"}).`);
      releases[index] = previousRelease;
    }
  }
  return warnings;
}

function markdownTable(headers, rows) {
  const headerLine = `| ${headers.join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? "").replaceAll("\n", " ")).join(" | ")} |`);
  return [headerLine, divider, ...body].join("\n");
}

function keyedMap(items, keyFn) {
  return new Map((items || []).map((item) => [keyFn(item), item]));
}

function statusLabel(item) {
  if (!item) {
    return "missing";
  }
  return item.ok ? "ok" : `error:${item.status || item.error || "unknown"}`;
}

function maybeAddChange(changes, label, before, after) {
  if (before !== after) {
    changes.push(`${label} ${before ?? "none"} -> ${after ?? "none"}`);
  }
}

function buildChangeSummary(previous, current) {
  if (!previous) {
    return {
      previousCheckedAt: null,
      currentCheckedAt: current.checkedAt,
      previousFactsHash: null,
      currentFactsHash: current.factsHash,
      changedSincePrevious: true,
      sections: {
        facts: ["No previous snapshot was available for comparison."],
        githubPulls: [],
        releases: [],
        refs: [],
        network: [],
        webSources: [],
      },
    };
  }

  const sections = {
    facts: [],
    githubPulls: [],
    releases: [],
    refs: [],
    network: [],
    webSources: [],
  };

  maybeAddChange(sections.facts, "factsHash", previous.factsHash, current.factsHash);

  const previousPulls = keyedMap(previous.github?.pulls, (pull) => `${pull.repo}#${pull.number}`);
  for (const pull of current.github.pulls) {
    const previousPull = previousPulls.get(`${pull.repo}#${pull.number}`);
    if (!previousPull) {
      sections.githubPulls.push(`${pull.label}: new tracked PR ${pull.repo}#${pull.number}.`);
      continue;
    }

    const changes = [];
    maybeAddChange(changes, "status", statusLabel(previousPull), statusLabel(pull));
    maybeAddChange(changes, "state", previousPull.state, pull.state);
    maybeAddChange(changes, "draft", previousPull.draft, pull.draft);
    maybeAddChange(changes, "base", previousPull.baseRefName, pull.baseRefName);
    maybeAddChange(changes, "head", shortSha(previousPull.headSha), shortSha(pull.headSha));
    maybeAddChange(changes, "updated", previousPull.updatedAt, pull.updatedAt);
    maybeAddChange(changes, "fileFingerprint", shortSha(previousPull.diffSummary?.fileFingerprint), shortSha(pull.diffSummary?.fileFingerprint));
    maybeAddChange(changes, "contentSignals", (previousPull.diffSummary?.contentSignals || []).join(", "), (pull.diffSummary?.contentSignals || []).join(", "));
    maybeAddChange(changes, "KIP document status", previousPull.kipDocument?.documentStatus, pull.kipDocument?.documentStatus);

    if (changes.length) {
      sections.githubPulls.push(`${pull.label}: ${changes.join("; ")}.`);
    }
  }

  const previousReleases = keyedMap(previous.github?.releases, (release) => `${release.repo}:${release.tag}`);
  for (const release of current.github.releases || []) {
    const previousRelease = previousReleases.get(`${release.repo}:${release.tag}`);
    if (!previousRelease) {
      sections.releases.push(`${release.label}: new tracked release ${release.repo}@${release.tag}.`);
      continue;
    }

    const changes = [];
    maybeAddChange(changes, "status", statusLabel(previousRelease), statusLabel(release));
    maybeAddChange(changes, "publishedAt", previousRelease.publishedAt, release.publishedAt);
    maybeAddChange(changes, "prerelease", previousRelease.prerelease, release.prerelease);
    maybeAddChange(changes, "target", previousRelease.targetCommitish, release.targetCommitish);
    maybeAddChange(changes, "bodySha", shortSha(previousRelease.bodySha256), shortSha(release.bodySha256));

    if (changes.length) {
      sections.releases.push(`${release.label}: ${changes.join("; ")}.`);
    }
  }

  const previousRefs = keyedMap(previous.github?.refs, (ref) => `${ref.repo}:${ref.kind}/${ref.name}`);
  for (const ref of current.github.refs) {
    const previousRef = previousRefs.get(`${ref.repo}:${ref.kind}/${ref.name}`);
    if (!previousRef) {
      sections.refs.push(`${ref.repo} ${ref.kind}/${ref.name}: new tracked reference.`);
      continue;
    }

    const changes = [];
    maybeAddChange(changes, "status", statusLabel(previousRef), statusLabel(ref));
    maybeAddChange(changes, "sha", shortSha(previousRef.sha), shortSha(ref.sha));
    maybeAddChange(changes, "type", previousRef.objectType, ref.objectType);

    if (changes.length) {
      sections.refs.push(`${ref.repo} ${ref.kind}/${ref.name}: ${changes.join("; ")}.`);
    }
  }

  const previousNetwork = keyedMap(previous.kaspaNetwork, (source) => source.label);
  for (const source of current.kaspaNetwork) {
    const previousSource = previousNetwork.get(source.label);
    if (!previousSource) {
      sections.network.push(`${source.label}: new tracked endpoint.`);
      continue;
    }

    const changes = [];
    maybeAddChange(changes, "status", statusLabel(previousSource), statusLabel(source));
    maybeAddChange(changes, "networkName", previousSource.networkName, source.networkName);
    maybeAddChange(changes, "virtualDaaScore", previousSource.virtualDaaScore, source.virtualDaaScore);
    maybeAddChange(changes, "blockCount", previousSource.blockCount, source.blockCount);
    maybeAddChange(changes, "headerCount", previousSource.headerCount, source.headerCount);

    if (changes.length) {
      sections.network.push(`${source.label}: ${changes.join("; ")}.`);
    }
  }

  const previousWebSources = keyedMap(previous.webSources, (source) => source.label);
  for (const source of current.webSources) {
    const previousSource = previousWebSources.get(source.label);
    if (!previousSource) {
      sections.webSources.push(`${source.label}: new tracked source.`);
      continue;
    }

    const changes = [];
    maybeAddChange(changes, "status", statusLabel(previousSource), statusLabel(source));
    maybeAddChange(changes, "fingerprint", shortSha(previousSource.sourceFingerprint), shortSha(source.sourceFingerprint));
    maybeAddChange(changes, "bytes", previousSource.contentLength, source.contentLength);

    if (changes.length) {
      sections.webSources.push(`${source.label}: ${changes.join("; ")}.`);
    }
  }

  if (!sections.facts.length) {
    sections.facts.push("No stable monitored fact changes detected.");
  }

  return {
    previousCheckedAt: previous.checkedAt || null,
    currentCheckedAt: current.checkedAt,
    previousFactsHash: previous.factsHash || null,
    currentFactsHash: current.factsHash,
    changedSincePrevious: previous.factsHash !== current.factsHash,
    sections,
  };
}

function markdownList(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- No changes detected.";
}

function fileSummaryCell(summary) {
  if (!summary) {
    return "";
  }
  const fileLabel = summary.fileCount === 1 ? "file" : "files";
  return `${summary.fileCount} ${fileLabel}, +${summary.additions}/-${summary.deletions}`;
}

function signalsCell(summary) {
  return summary?.contentSignals?.length ? summary.contentSignals.join(", ") : "";
}

function topFilesCell(summary) {
  if (!summary?.topFiles?.length) {
    return "";
  }
  return summary.topFiles
    .map((file) => `${file.filename} (+${file.additions}/-${file.deletions})`)
    .join("; ");
}

function kipStatusCell(pull) {
  if (!pull.kipDocument) {
    return "";
  }
  if (!pull.kipDocument.ok) {
    return `error: ${pull.kipDocument.error || pull.kipDocument.status || "unknown"}`;
  }
  const status = pull.kipDocument.documentStatus || "unknown";
  return `${pull.kipDocument.filename}: ${status}`;
}

function buildChangeSummaryMarkdown(summary) {
  return `## Changes Since Previous Snapshot

Previous snapshot: ${summary.previousCheckedAt || "none"}

Current snapshot: ${summary.currentCheckedAt}

### Stable Facts

${markdownList(summary.sections.facts)}

### GitHub Pull Requests and KIP PR States

${markdownList(summary.sections.githubPulls)}

### GitHub Releases

${markdownList(summary.sections.releases)}

### GitHub References

${markdownList(summary.sections.refs)}

### Network Signals

${markdownList(summary.sections.network)}

### Web Source Fingerprints

${markdownList(summary.sections.webSources)}
`;
}

function buildFetchWarningsMarkdown(warnings) {
  if (!warnings?.length) {
    return "";
  }

  return `## Fetch Warnings

${markdownList(warnings)}

`;
}

function buildBranchDeltaDetails(branchDeltas) {
  const changed = branchDeltas.filter((delta) => delta.ok && !["unchanged", "baseline_created"].includes(delta.status));
  if (!changed.length) {
    return "No changed branch delta required behavior classification.";
  }

  return changed
    .map((delta) => {
      const commits = delta.commits
        .slice(0, 12)
        .map((commit) => `- \`${shortSha(commit.sha)}\` ${commit.message.split("\n")[0]}`)
        .join("\n");
      const impacts = delta.impacts.length
        ? delta.impacts
            .map(
              (impact) =>
                `- **${impact.label}:** ${impact.builderImpact} Matched: ${[
                  ...impact.matchedCommits,
                  ...impact.matchedFiles,
                ]
                  .slice(0, 8)
                  .map((value) => `\`${value}\``)
                  .join(", ")}.`,
            )
            .join("\n")
        : "- No configured engineering impact lane matched.";

      return `### ${delta.label}

Commits:

${commits || "- Commit details unavailable."}

Engineering impact:

${impacts}`;
    })
    .join("\n\n");
}

function buildMarkdown(snapshot) {
  const pullRows = snapshot.github.pulls.map((pull) => [
    pull.label,
    pull.ok ? pull.state : "error",
    pull.ok ? pull.baseRefName : pull.error,
    pull.ok ? shortSha(pull.headSha) : "",
    pull.ok ? pull.updatedAt : "",
    pull.ok ? `[source](${pull.url})` : "",
  ]);

  const diffRows = snapshot.github.pulls.map((pull) => [
    pull.label,
    pull.diffSummaryOk ? fileSummaryCell(pull.diffSummary) : `error: ${pull.diffSummaryError || "unknown"}`,
    pull.diffSummaryOk ? signalsCell(pull.diffSummary) : "",
    pull.diffSummaryOk ? topFilesCell(pull.diffSummary) : "",
    kipStatusCell(pull),
  ]);

  const refRows = snapshot.github.refs.map((ref) => [
    `${ref.repo} ${ref.kind}/${ref.name}`,
    ref.ok ? shortSha(ref.sha) : "error",
    ref.ok ? ref.objectType : ref.error,
  ]);

  const releaseRows = (snapshot.github.releases || []).map((release) => [
    release.label,
    release.ok ? release.tagName : "error",
    release.ok ? (release.prerelease ? "yes" : "no") : release.error,
    release.ok ? release.publishedAt : "",
    release.ok ? release.targetCommitish : "",
    release.ok ? release.bodyHighlights.join("; ") : "",
    release.ok ? `[source](${release.url})` : "",
  ]);

  const branchDeltaRows = (snapshot.github.branchDeltas || []).map((delta) => [
    delta.label,
    delta.ok ? delta.status : "error",
    delta.ok ? `${shortSha(delta.beforeSha)} -> ${shortSha(delta.afterSha)}` : delta.error,
    delta.ok ? delta.totalCommits || 0 : "",
    delta.ok ? `${delta.fileCount || 0}${delta.filesTruncated ? "+" : ""}` : "",
    delta.ok ? (delta.impacts || []).map((impact) => impact.label).join(", ") : "",
    delta.url ? `[compare](${delta.url})` : "",
  ]);

  const networkRows = snapshot.kaspaNetwork.map((source) => [
    source.label,
    source.ok ? "ok" : "error",
    source.ok ? source.networkName : "",
    source.ok ? source.virtualDaaScore : source.error,
    source.ok ? source.blockCount : "",
  ]);

  const webRows = snapshot.webSources.map((source) => [
    source.label,
    source.ok ? source.status : "error",
    source.ok ? source.contentLength : source.error,
    source.ok ? shortSha(source.sourceFingerprint) : "",
    `[source](${source.url})`,
  ]);

  return `# Toccata Source Snapshot

Generated: ${snapshot.checkedAt}

Facts hash: \`${snapshot.factsHash}\`

## Verdict

- Mainnet activation: ${snapshot.verdict.mainnetActivation}
- Mainnet DAA observed: ${snapshot.verdict.activation.currentDaaScore ?? "unavailable"}
- Activation DAA: ${snapshot.verdict.activation.daaScore ?? "unavailable"}
- Implementation status: ${snapshot.verdict.implementationStatus}
- Branch status: ${snapshot.verdict.branchStatus}
- Caution: ${snapshot.verdict.caution.join(" ")}

${buildFetchWarningsMarkdown(snapshot.fetchWarnings)}
${buildChangeSummaryMarkdown(snapshot.changeSummary)}

## GitHub Pull Requests

${markdownTable(["Signal", "State", "Base", "Head SHA", "Updated", "Link"], pullRows)}

## PR Diff Summaries

${markdownTable(["Signal", "Files", "Content signals", "Top changed files", "KIP document status"], diffRows)}

## GitHub Releases

${markdownTable(["Signal", "Tag", "Pre-release", "Published", "Target", "Highlights", "Link"], releaseRows)}

## GitHub References

${markdownTable(["Reference", "SHA", "Type"], refRows)}

## Upstream Branch Deltas

${markdownTable(["Source", "Status", "Range", "Commits", "Files", "Engineering impact", "Link"], branchDeltaRows)}

${buildBranchDeltaDetails(snapshot.github.branchDeltas || [])}

## Network Signals

${markdownTable(["Source", "Status", "Network", "Virtual DAA", "Block count"], networkRows)}

## Web Source Fingerprints

${markdownTable(["Source", "HTTP", "Bytes", "Fingerprint", "Link"], webRows)}
`;
}

async function loadPreviousSnapshot() {
  try {
    return JSON.parse(await readFile(LATEST_JSON, "utf8"));
  } catch {
    return null;
  }
}

function buildFactsHash(snapshot) {
  const stableNetworkFacts = snapshot.kaspaNetwork.map((source) => ({
    label: source.label,
    url: source.url,
    ok: source.ok,
    status: source.status,
    networkName: source.networkName || null,
    error: source.error || null,
  }));

  const stableWebFacts = snapshot.webSources.map((source) => ({
    label: source.label,
    url: source.url,
    ok: source.ok,
    status: source.status,
    fingerprintBasis: source.fingerprintBasis || null,
    sourceFingerprint: source.sourceFingerprint || null,
    error: source.error || null,
  }));

  const comparable = {
    github: {
      pulls: snapshot.github.pulls,
      refs: snapshot.github.refs,
      releases: snapshot.github.releases,
    },
    kaspaNetwork: stableNetworkFacts,
    webSources: stableWebFacts,
    verdict: {
      mainnetActivation: snapshot.verdict.mainnetActivation,
      implementationStatus: snapshot.verdict.implementationStatus,
      branchStatus: snapshot.verdict.branchStatus,
      caution: snapshot.verdict.caution,
      activation: {
        state: snapshot.verdict.activation?.state || "not_verified",
        releaseTag: snapshot.verdict.activation?.releaseTag || null,
        releasePublishedAt: snapshot.verdict.activation?.releasePublishedAt || null,
        daaScore: snapshot.verdict.activation?.daaScore || null,
        scheduleText: snapshot.verdict.activation?.scheduleText || null,
        endpointVerified: Boolean(snapshot.verdict.activation?.endpointVerified),
      },
    },
  };
  return sha256(JSON.stringify(comparable));
}

async function main() {
  const previousSnapshot = await loadPreviousSnapshot();
  if (CHECK_ONLY) {
    const errors = validateToccataSnapshot(previousSnapshot || {});
    if (errors.length) {
      for (const error of errors) {
        console.error(`check failed: ${error}`);
      }
      process.exitCode = 1;
      return;
    }
    console.log(
      `Toccata source snapshot check passed: schema ${previousSnapshot.schemaVersion}, activation ${previousSnapshot.verdict.activation.state}.`,
    );
    return;
  }

  const [pulls, refs, releases, kaspaNetwork, fingerprints] = await Promise.all([
    Promise.all(githubPulls.map(readGithubPull)),
    Promise.all(githubRefs.map(readGithubRef)),
    Promise.all(githubReleases.map(readGithubRelease)),
    Promise.all(networkSources.map(readNetworkSource)),
    Promise.all(webSources.map(fetchTextFingerprint)),
  ]);
  const fetchWarnings = applyPreviousGithubFetchFallback({ pulls, refs }, previousSnapshot);
  fetchWarnings.push(...applyPreviousReleaseFetchFallback({ releases }, previousSnapshot));
  const branchDeltas = await Promise.all(
    branchDeltaSources.map((entry) => readGithubBranchDelta(entry, refs, previousSnapshot)),
  );
  fetchWarnings.push(
    ...branchDeltas
      .filter((delta) => !delta.ok)
      .map((delta) => `${delta.label}: branch delta unavailable (${delta.error || delta.status || "unknown"}).`),
  );

  const snapshot = {
    schemaVersion: 2,
    checkedAt: CHECKED_AT,
    policy: {
      sourceTier: "primary-source-first",
      mainnetClaimRule:
        "mainnet activation requires a final release, explicit activation DAA, merged production code, and mainnet endpoint evidence at or above the threshold",
      testnetClaimRule: "TN10/TN12 observations are testnet-only until corroborated by mainnet evidence",
    },
    github: { pulls, refs, releases, branchDeltas },
    kaspaNetwork,
    webSources: fingerprints,
    fetchWarnings,
    verdict: buildVerdict({ pulls, refs, releases, kaspaNetwork }),
  };
  applyPreviousPullMetadataFallback(snapshot, previousSnapshot);
  snapshot.factsHash = buildFactsHash(snapshot);
  snapshot.previousFactsHash = previousSnapshot?.factsHash || null;
  snapshot.changedSincePrevious = snapshot.previousFactsHash !== snapshot.factsHash;
  snapshot.changeSummary = buildChangeSummary(previousSnapshot, snapshot);

  if (WRITE_IF_CHANGED && !snapshot.changedSincePrevious) {
    console.log("No monitored fact changes; leaving existing snapshot files untouched.");
    console.log(`Facts hash: ${snapshot.factsHash}`);
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(LATEST_JSON, `${JSON.stringify(snapshot, null, 2)}\n`);
  await writeFile(LATEST_MD, buildMarkdown(snapshot));

  console.log(`Toccata snapshot written to ${path.relative(ROOT_DIR, LATEST_JSON)}`);
  console.log(`Facts hash: ${snapshot.factsHash}`);
  console.log(`Changed since previous: ${snapshot.changedSincePrevious}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
