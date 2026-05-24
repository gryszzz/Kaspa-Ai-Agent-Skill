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

async function fetchTextFingerprint(source) {
  try {
    const response = await fetchWithTimeout(source.url, {
      headers: {
        "User-Agent": "gryszzz-kaspa-toccata-source-monitor",
      },
    });
    const text = await response.text();
    return {
      ...source,
      ok: response.ok,
      status: response.status,
      etag: response.headers.get("etag") || null,
      lastModified: response.headers.get("last-modified") || null,
      contentLength: text.length,
      contentSha256: sha256(text),
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

function markdownTable(headers, rows) {
  const headerLine = `| ${headers.join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? "").replaceAll("\n", " ")).join(" | ")} |`);
  return [headerLine, divider, ...body].join("\n");
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

  const refRows = snapshot.github.refs.map((ref) => [
    `${ref.repo} ${ref.kind}/${ref.name}`,
    ref.ok ? shortSha(ref.sha) : "error",
    ref.ok ? ref.objectType : ref.error,
  ]);

  const networkRows = snapshot.kaspaNetwork.map((source) => [
    source.label,
    source.ok ? "ok" : "error",
    source.ok ? source.virtualDaaScore : source.error,
    source.ok ? source.blockCount : "",
  ]);

  const webRows = snapshot.webSources.map((source) => [
    source.label,
    source.ok ? source.status : "error",
    source.ok ? source.contentLength : source.error,
    source.ok ? shortSha(source.contentSha256) : "",
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

## GitHub Pull Requests

${markdownTable(["Signal", "State", "Base", "Head SHA", "Updated", "Link"], pullRows)}

## GitHub References

${markdownTable(["Reference", "SHA", "Type"], refRows)}

## Testnet Signals

${markdownTable(["Source", "Status", "Virtual DAA", "Block count"], networkRows)}

## Web Source Fingerprints

${markdownTable(["Source", "HTTP", "Bytes", "SHA-256", "Link"], webRows)}
`;
}

async function loadPreviousFactsHash() {
  try {
    const previous = JSON.parse(await readFile(LATEST_JSON, "utf8"));
    return previous.factsHash || null;
  } catch {
    return null;
  }
}

function buildFactsHash(snapshot) {
  const comparable = {
    github: snapshot.github,
    kaspaNetwork: snapshot.kaspaNetwork,
    webSources: snapshot.webSources,
    verdict: snapshot.verdict,
  };
  return sha256(JSON.stringify(comparable));
}

async function main() {
  const [pulls, refs, kaspaNetwork, fingerprints] = await Promise.all([
    Promise.all(githubPulls.map(readGithubPull)),
    Promise.all(githubRefs.map(readGithubRef)),
    Promise.all(networkSources.map(readNetworkSource)),
    Promise.all(webSources.map(fetchTextFingerprint)),
  ]);

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
    verdict: buildVerdict({ pulls, refs }),
  };
  snapshot.factsHash = buildFactsHash(snapshot);
  snapshot.previousFactsHash = await loadPreviousFactsHash();
  snapshot.changedSincePrevious = snapshot.previousFactsHash !== snapshot.factsHash;

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
