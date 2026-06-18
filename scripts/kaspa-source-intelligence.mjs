#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  computeFactsHash,
  sha256,
  summarizeSourceHealth,
  toMarkdown,
  validateSourceSnapshot,
} from "./lib/source-intelligence.mjs";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, "research-snapshots", "source-intelligence");
const LATEST_JSON = path.join(OUTPUT_DIR, "latest.json");
const LATEST_MD = path.join(OUTPUT_DIR, "latest.md");
const CHECKED_AT = new Date().toISOString();

const githubRepos = [
  { repo: "kaspanet/rusty-kaspa", label: "Rusty Kaspa node and SDK", primary: true },
  { repo: "kaspanet/kips", label: "Kaspa Improvement Proposals", primary: true },
  { repo: "kaspanet/docs", label: "Official Kaspa docs source", primary: true },
  { repo: "kaspanet/kaspad", label: "Deprecated Go node", primary: false, deprecated: true },
  { repo: "michaelsutton/kdapp", label: "Kdapp reference work", primary: false },
  { repo: "kaspanet/silverscript", label: "SilverScript", primary: false, experimental: true },
  { repo: "kaspanet/vprogs", label: "vProgs", primary: false, experimental: true },
];

const githubRefs = [
  { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "master" },
  { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "toccata" },
  { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "tn10" },
  { repo: "kaspanet/rusty-kaspa", kind: "heads", name: "tn12" },
  { repo: "kaspanet/kips", kind: "heads", name: "master" },
  { repo: "kaspanet/docs", kind: "heads", name: "main" },
  { repo: "kaspanet/silverscript", kind: "heads", name: "master" },
  { repo: "kaspanet/vprogs", kind: "heads", name: "master" },
];

const githubReleases = [
  { repo: "kaspanet/rusty-kaspa", kind: "latest", label: "Latest Rusty Kaspa release" },
];

const webSources = [
  { label: "Kaspa build portal", url: "https://kaspa.org/build", primary: true },
  { label: "Kaspa docs home", url: "https://docs.kaspa.org", primary: true },
  { label: "Kaspa programmability docs", url: "https://docs.kaspa.org/programmability", primary: true },
  { label: "Kaspa covenants docs", url: "https://docs.kaspa.org/programmability/covenants", primary: true },
  { label: "Kaspa Research categories", url: "https://research.kas.pa/categories", primary: false },
  {
    label: "vProgs architecture proposal",
    url: "https://research.kas.pa/t/concrete-proposal-for-a-synchronously-composable-verifiable-programs-architecture/387",
    primary: false,
  },
];

const networkSources = [
  {
    label: "Mainnet blockDAG",
    url: "https://api.kaspa.org/info/blockdag",
    expectedNetworkName: "kaspa-mainnet",
  },
  {
    label: "TN10 blockDAG",
    url: "https://api-tn10.kaspa.org/info/blockdag",
    expectedNetworkName: "kaspa-testnet-10",
  },
  {
    label: "TN12 blockDAG",
    url: "https://api-tn12.kaspa.org/info/blockdag",
    expectedNetworkName: "kaspa-testnet-12",
  },
];

function parseArgs(argv) {
  const options = {
    check: false,
    markdown: false,
    write: false,
    writeIfChanged: false,
    timeoutMs: 20_000,
    maxKips: 80,
  };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case "--check":
        options.check = true;
        break;
      case "--markdown":
        options.markdown = true;
        break;
      case "--write":
        options.write = true;
        break;
      case "--write-if-changed":
        options.writeIfChanged = true;
        break;
      case "--timeout-ms":
        options.timeoutMs = Number(argv[index + 1]);
        index += 1;
        break;
      case "--max-kips":
        options.maxKips = Number(argv[index + 1]);
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${arg}`);
    }
  }
  return options;
}

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
const apiHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "gryszzz-kaspa-source-intelligence",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (GITHUB_TOKEN) {
  apiHeaders.Authorization = `Bearer ${GITHUB_TOKEN}`;
}

function splitRepo(repo) {
  const [owner, name] = repo.split("/");
  return { owner, name };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url, options = {}, timeoutMs = 20_000) {
  try {
    const response = await fetchWithTimeout(url, options, timeoutMs);
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

async function fetchTextFingerprint(source, timeoutMs) {
  try {
    const response = await fetchWithTimeout(
      source.url,
      {
        headers: {
          "User-Agent": "gryszzz-kaspa-source-intelligence",
        },
      },
      timeoutMs,
    );
    const text = await response.text();
    const contentSha256 = sha256(text);
    return {
      ...source,
      ok: response.ok,
      status: response.status,
      etag: response.headers.get("etag") || null,
      lastModified: response.headers.get("last-modified") || null,
      contentLength: text.length,
      contentSha256,
      sourceFingerprint: sha256(`${source.url}:${response.status}:${contentSha256}`),
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

async function readGithubRepo(entry, timeoutMs) {
  const { owner, name } = splitRepo(entry.repo);
  const result = await fetchJson(`https://api.github.com/repos/${owner}/${name}`, { headers: apiHeaders }, timeoutMs);
  if (!result.ok) {
    return { ...entry, ok: false, status: result.status, error: result.error };
  }
  const repo = result.data;
  return {
    ...entry,
    ok: true,
    status: result.status,
    url: repo.html_url,
    defaultBranch: repo.default_branch || null,
    archived: Boolean(repo.archived),
    disabled: Boolean(repo.disabled),
    pushedAt: repo.pushed_at || null,
    updatedAt: repo.updated_at || null,
    openIssuesCount: repo.open_issues_count ?? null,
    stargazersCount: repo.stargazers_count ?? null,
    visibility: repo.visibility || null,
  };
}

async function readGithubRef(entry, timeoutMs) {
  const { owner, name } = splitRepo(entry.repo);
  const refName = encodeURIComponent(entry.name).replace(/%2F/g, "/");
  const result = await fetchJson(
    `https://api.github.com/repos/${owner}/${name}/git/ref/${entry.kind}/${refName}`,
    { headers: apiHeaders },
    timeoutMs,
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

async function readGithubRelease(entry, timeoutMs) {
  const { owner, name } = splitRepo(entry.repo);
  const url = entry.kind === "latest"
    ? `https://api.github.com/repos/${owner}/${name}/releases/latest`
    : `https://api.github.com/repos/${owner}/${name}/releases/tags/${entry.tag}`;
  const result = await fetchJson(url, { headers: apiHeaders }, timeoutMs);
  if (!result.ok) {
    return { ...entry, ok: false, status: result.status, error: result.error };
  }
  const release = result.data;
  return {
    ...entry,
    ok: true,
    tagName: release.tag_name || entry.tag || null,
    name: release.name || "",
    url: release.html_url,
    targetCommitish: release.target_commitish || null,
    draft: Boolean(release.draft),
    prerelease: Boolean(release.prerelease),
    publishedAt: release.published_at || null,
    createdAt: release.created_at || null,
    assetCount: Array.isArray(release.assets) ? release.assets.length : 0,
    bodyHash: sha256(release.body || ""),
  };
}

function parseKipMetadata(text, file) {
  const keys = {
    KIP: "kip",
    Layer: "layer",
    Title: "title",
    Authors: "authors",
    Status: "documentStatus",
    Created: "created",
  };
  const metadata = { file };
  for (const [key, property] of Object.entries(keys)) {
    const match = text.match(new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, "im"));
    if (match) {
      metadata[property] = match[1].trim();
    }
  }
  return metadata;
}

async function readKipIndex(timeoutMs, maxKips) {
  const contents = await fetchJson(
    "https://api.github.com/repos/kaspanet/kips/contents",
    { headers: apiHeaders },
    timeoutMs,
  );
  if (!contents.ok || !Array.isArray(contents.data)) {
    return {
      ok: false,
      status: contents.status,
      error: contents.error || "KIP contents unavailable",
      documents: [],
    };
  }

  const kipFiles = contents.data
    .filter((entry) => /^kip-\d+\.md$/i.test(entry.name || "") && entry.download_url)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .slice(0, maxKips);

  const documents = await Promise.all(kipFiles.map(async (entry) => {
    const result = await fetchWithTimeout(
      entry.download_url,
      {
        headers: {
          "User-Agent": "gryszzz-kaspa-source-intelligence",
        },
      },
      timeoutMs,
    ).then(async (response) => ({
      ok: response.ok,
      status: response.status,
      text: await response.text(),
    })).catch((error) => ({
      ok: false,
      status: 0,
      error: error.message,
      text: "",
    }));

    if (!result.ok) {
      return {
        file: entry.name,
        ok: false,
        status: result.status,
        error: result.error || "download failed",
        url: entry.html_url,
      };
    }
    return {
      ...parseKipMetadata(result.text, entry.name),
      ok: true,
      status: result.status,
      url: entry.html_url,
      contentSha256: sha256(result.text),
    };
  }));

  return {
    ok: true,
    status: contents.status,
    url: "https://github.com/kaspanet/kips",
    trackedCount: documents.length,
    documents,
  };
}

async function readNetworkSource(source, timeoutMs) {
  const result = await fetchJson(source.url, {}, timeoutMs);
  if (!result.ok) {
    return {
      ...source,
      ok: false,
      status: result.status,
      error: result.error,
    };
  }
  const data = result.data || {};
  const networkName = data.networkName || data.network || data.networkId || null;
  return {
    ...source,
    ok: true,
    status: result.status,
    networkName,
    virtualDaaScore: data.virtualDaaScore ?? data.virtualDaaScoreBlueScore ?? data.virtualDaaScoreBlueWork ?? null,
    blockCount: data.blockCount ?? null,
    headerCount: data.headerCount ?? null,
    sourceFingerprint: sha256(JSON.stringify(data)),
  };
}

async function readPreviousJson() {
  try {
    return JSON.parse(await readFile(LATEST_JSON, "utf8"));
  } catch {
    return null;
  }
}

async function buildSnapshot(options) {
  const [repos, refs, releases, web, kaspaNetwork, kipIndex] = await Promise.all([
    Promise.all(githubRepos.map((entry) => readGithubRepo(entry, options.timeoutMs))),
    Promise.all(githubRefs.map((entry) => readGithubRef(entry, options.timeoutMs))),
    Promise.all(githubReleases.map((entry) => readGithubRelease(entry, options.timeoutMs))),
    Promise.all(webSources.map((entry) => fetchTextFingerprint(entry, options.timeoutMs))),
    Promise.all(networkSources.map((entry) => readNetworkSource(entry, options.timeoutMs))),
    readKipIndex(options.timeoutMs, options.maxKips),
  ]);

  const previous = await readPreviousJson();
  const snapshot = {
    schemaVersion: 1,
    checkedAt: CHECKED_AT,
    previousFactsHash: previous?.factsHash || null,
    github: {
      repos,
      refs,
      releases,
    },
    web,
    kaspaNetwork,
    kipIndex,
  };
  snapshot.verdict = summarizeSourceHealth(snapshot);
  snapshot.factsHash = computeFactsHash(snapshot);
  snapshot.changedSincePrevious = previous?.factsHash ? previous.factsHash !== snapshot.factsHash : null;
  snapshot.validationErrors = validateSourceSnapshot(snapshot);
  return snapshot;
}

async function writeSnapshot(snapshot, options) {
  const json = `${JSON.stringify(snapshot, null, 2)}\n`;
  const markdown = toMarkdown(snapshot);
  if (options.writeIfChanged) {
    const previous = await readPreviousJson();
    if (previous?.factsHash === snapshot.factsHash) {
      return false;
    }
  }
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(LATEST_JSON, json);
  await writeFile(LATEST_MD, markdown);
  return true;
}

async function main() {
  try {
    const options = parseArgs(process.argv);
    const snapshot = await buildSnapshot(options);

    if (options.write || options.writeIfChanged) {
      await writeSnapshot(snapshot, options);
    }

    process.stdout.write(options.markdown ? toMarkdown(snapshot) : `${JSON.stringify(snapshot, null, 2)}\n`);
    const failed = options.check && snapshot.validationErrors.length > 0;
    process.exit(failed ? 1 : 0);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

await main();
