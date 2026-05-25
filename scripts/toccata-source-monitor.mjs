#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, "research-snapshots", "toccata");
const LATEST_JSON = path.join(OUTPUT_DIR, "latest.json");
const LATEST_MD = path.join(OUTPUT_DIR, "latest.md");
const CHECKED_AT = new Date().toISOString();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const WRITE_IF_CHANGED = process.argv.includes("--write-if-changed");

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
  { repo: "kaspanet/rusty-kaspa", kind: "tags", name: "v1.1.0" },
  { repo: "kaspanet/kips", kind: "heads", name: "master" },
  { repo: "kaspanet/docs", kind: "heads", name: "main" },
  { repo: "kaspanet/silverscript", kind: "heads", name: "master" },
  { repo: "kaspanet/vprogs", kind: "heads", name: "master" },
];

const webSources = [
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
    label: "TN10 blockdag",
    url: "https://api-tn10.kaspa.org/info/blockdag",
  },
  {
    label: "TN12 blockdag",
    url: "https://api-tn12.kaspa.org/info/blockdag",
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

function buildVerdict({ pulls, refs }) {
  const toccataPr = pulls.find((pull) => pull.repo === "kaspanet/rusty-kaspa" && pull.number === 1000);
  const mainRef = refs.find((ref) => ref.repo === "kaspanet/rusty-kaspa" && ref.kind === "heads" && ref.name === "master");
  const toccataRef = refs.find((ref) => ref.repo === "kaspanet/rusty-kaspa" && ref.kind === "heads" && ref.name === "toccata");

  return {
    mainnetActivation: "not_verified_by_monitor",
    implementationStatus: toccataPr?.ok
      ? `PR #1000 is ${toccataPr.state}${toccataPr.merged ? " and merged" : ""} against ${toccataPr.baseRefName}.`
      : "PR #1000 status unavailable.",
    branchStatus:
      mainRef?.ok && toccataRef?.ok
        ? `rusty-kaspa master ${shortSha(mainRef.sha)}, toccata ${shortSha(toccataRef.sha)}.`
        : "rusty-kaspa branch status incomplete.",
    caution: [
      "Do not equate open PRs with merged production behavior.",
      "Do not equate TN10/TN12 observations with mainnet activation.",
      "Use branch hashes, PR base refs, KIP merge state, and docs hashes together before making claims.",
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
        refs: [],
        network: [],
        webSources: [],
      },
    };
  }

  const sections = {
    facts: [],
    githubPulls: [],
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

### GitHub References

${markdownList(summary.sections.refs)}

### Testnet Signals

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
- Implementation status: ${snapshot.verdict.implementationStatus}
- Branch status: ${snapshot.verdict.branchStatus}
- Caution: ${snapshot.verdict.caution.join(" ")}

${buildFetchWarningsMarkdown(snapshot.fetchWarnings)}
${buildChangeSummaryMarkdown(snapshot.changeSummary)}

## GitHub Pull Requests

${markdownTable(["Signal", "State", "Base", "Head SHA", "Updated", "Link"], pullRows)}

## PR Diff Summaries

${markdownTable(["Signal", "Files", "Content signals", "Top changed files", "KIP document status"], diffRows)}

## GitHub References

${markdownTable(["Reference", "SHA", "Type"], refRows)}

## Testnet Signals

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
    github: snapshot.github,
    kaspaNetwork: stableNetworkFacts,
    webSources: stableWebFacts,
    verdict: snapshot.verdict,
  };
  return sha256(JSON.stringify(comparable));
}

async function main() {
  const previousSnapshot = await loadPreviousSnapshot();
  const [pulls, refs, kaspaNetwork, fingerprints] = await Promise.all([
    Promise.all(githubPulls.map(readGithubPull)),
    Promise.all(githubRefs.map(readGithubRef)),
    Promise.all(networkSources.map(readNetworkSource)),
    Promise.all(webSources.map(fetchTextFingerprint)),
  ]);
  const fetchWarnings = applyPreviousGithubFetchFallback({ pulls, refs }, previousSnapshot);

  const snapshot = {
    schemaVersion: 1,
    checkedAt: CHECKED_AT,
    policy: {
      sourceTier: "primary-source-first",
      mainnetClaimRule: "mainnet activation requires explicit mainnet release, activation, or merged production evidence",
      testnetClaimRule: "TN10/TN12 observations are testnet-only until corroborated by mainnet evidence",
    },
    github: { pulls, refs },
    kaspaNetwork,
    webSources: fingerprints,
    fetchWarnings,
    verdict: buildVerdict({ pulls, refs }),
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
