#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(scriptPath), "..");
const repoRoot = path.resolve(rootDir, "../../..");
const manifestPath = path.join(rootDir, "manifest.json");
const openaiPath = path.join(rootDir, "agents", "openai.yaml");
const logoPath = path.join(rootDir, "assets", "kaspa-ai-agent-skill-logo.svg");

const requiredTargets = ["codex", "openai", "anthropic", "cursor", "openclaw", "gemini", "generic"];
const contractChecks = [
  ["UTXO-first architecture", /UTXO[- ]first/i],
  ["DAG-aware correctness", /DAG[- ]aware/i],
  ["explicit fee handling", /explicit[\s\S]{0,40}fees?|fees?[\s\S]{0,40}explicit/i],
  ["key safety", /key\s+(?:handling|boundaries)|private keys?|seeds?/i],
  ["Kasware compatibility", /Kasware/],
  ["Kaspium compatibility", /Kaspium/],
  ["mainnet address prefix", /kaspa:/],
  ["testnet address prefix", /kaspatest:/],
  ["release and activation separation", /release[\s\S]{0,180}scheduled activation[\s\S]{0,180}(?:verified )?(?:network )?activation/i],
  ["ecosystem readiness separation", /ecosystem readiness/i],
  ["primary-source verification", /primary[- ]sources?/i],
  ["protocol source ladder", /TRAINING_SOURCES\.md|source-trust references/i],
  ["verification requirement", /verif|tests?/i],
];
const adapterDetailChecks = [
  ["dated Toccata release", /v2\.0\.0/],
  ["dated activation DAA", /474,?165,?565/],
  ["transaction storage-mass field", /storageMass|storage_mass/],
  ["transaction compute-commit field", /compute_commit|ComputeCommit/],
];

function ok(msg) {
  console.log(`[ok] ${msg}`);
}

function fail(msg) {
  console.error(`[fail] ${msg}`);
  process.exitCode = 1;
}

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}

function assertFile(p, label) {
  if (!fs.existsSync(p)) {
    fail(`${label} missing: ${p}`);
    return false;
  }
  const stat = fs.statSync(p);
  if (!stat.isFile() || stat.size === 0) {
    fail(`${label} is empty or not a file: ${p}`);
    return false;
  }
  ok(`${label} present: ${p}`);
  return true;
}

function parseArgs(argv) {
  const args = { all: false, target: null };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--all") args.all = true;
    if (argv[i] === "--target" && i + 1 < argv.length) args.target = argv[i + 1];
  }
  return args;
}

function validateManifest() {
  if (!assertFile(manifestPath, "manifest.json")) return null;
  let manifest;
  try {
    manifest = JSON.parse(readFile(manifestPath));
  } catch (err) {
    fail(`manifest.json parse error: ${err.message}`);
    return null;
  }

  if (!manifest.name || !manifest.version || !Array.isArray(manifest.targets)) {
    fail("manifest.json missing required keys: name, version, targets[]");
    return null;
  }
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    fail(`manifest.json version is not semver: ${manifest.version}`);
  }

  const targetIds = manifest.targets.map((t) => t.id);
  for (const id of requiredTargets) {
    if (!targetIds.includes(id)) {
      fail(`manifest.json missing target id: ${id}`);
    }
  }
  ok("manifest.json schema looks valid");
  return manifest;
}

function validateOpenAIYaml() {
  if (!assertFile(openaiPath, "OpenAI adapter")) return;
  const content = readFile(openaiPath);
  for (const token of ["interface:", "display_name:", "default_prompt:"]) {
    if (!content.includes(token)) fail(`openai.yaml missing token: ${token}`);
  }

  const iconMatch = content.match(/icon_small:\s*["'](.+)["']/);
  if (iconMatch) {
    const rootRelative = path.resolve(rootDir, iconMatch[1]);
    const adapterRelative = path.resolve(path.dirname(openaiPath), iconMatch[1]);
    const iconPath = fs.existsSync(rootRelative) ? rootRelative : adapterRelative;
    assertFile(iconPath, "openai icon_small");
  } else {
    fail("openai.yaml missing icon_small path");
  }

  if (assertFile(logoPath, "Kaspa AI Agent Skill logo asset")) {
    ok("logo asset is present for adapters");
  }
}

function validateSharedContract(content, label) {
  let valid = true;
  for (const [rule, pattern] of contractChecks) {
    if (!pattern.test(content)) {
      fail(`${label} missing shared contract rule: ${rule}`);
      valid = false;
    }
  }
  if (valid) {
    ok(`${label} includes the shared Kaspa/Toccata contract`);
  }
}

function validateAdapterProgressiveDisclosure(content, label) {
  let valid = true;
  for (const [detail, pattern] of adapterDetailChecks) {
    if (pattern.test(content)) {
      fail(`${label} embeds ${detail}; load it from references instead`);
      valid = false;
    }
  }
  if (valid) {
    ok(`${label} keeps changing protocol detail in references`);
  }
}

function validateTarget(targetId, manifest) {
  const target = manifest.targets.find((t) => t.id === targetId);
  if (!target) {
    fail(`target not found in manifest: ${targetId}`);
    return;
  }

  const entryPath = path.join(rootDir, target.entry);
  if (!assertFile(entryPath, `target:${targetId} entry`)) return;
  const content = readFile(entryPath);
  validateSharedContract(content, `target:${targetId}`);
  if (targetId !== "codex") {
    validateAdapterProgressiveDisclosure(content, `target:${targetId}`);
  }

  switch (targetId) {
    case "codex":
      if (!content.includes("Required Output Contract")) {
        fail("codex skill missing 'Required Output Contract' section");
      } else {
        ok("codex skill contract found");
      }
      if (content.split(/\r?\n/).length > 500) {
        fail("codex skill exceeds the 500-line progressive-disclosure limit");
      } else {
        ok("codex skill stays within the progressive-disclosure line limit");
      }
      if (!content.includes("references/knowledge-map.md")) {
        fail("codex skill does not route knowledge through references/knowledge-map.md");
      } else {
        ok("codex skill routes detailed knowledge through the knowledge map");
      }
      break;
    case "openai":
      validateOpenAIYaml();
      break;
    case "anthropic":
      if (!/System Architecture \(text\s+diagram\)/.test(content)) {
        fail("anthropic adapter missing required output structure");
      } else {
        ok("anthropic adapter includes output structure");
      }
      break;
    case "cursor":
      if (!content.includes("---") || !content.includes("description:")) {
        fail("cursor adapter missing frontmatter");
      } else {
        ok("cursor adapter frontmatter present");
      }
      break;
    case "openclaw":
      if (!content.includes("Required Output Structure")) {
        fail("openclaw adapter missing required output contract");
      } else {
        ok("openclaw adapter includes output contract");
      }
      break;
    case "gemini":
      if (!content.includes("Gemini CLI")) {
        fail("gemini adapter missing Gemini CLI usage guidance");
      } else if (!content.includes("Required Output Structure")) {
        fail("gemini adapter missing required output contract");
      } else {
        ok("gemini adapter includes output contract");
      }
      break;
    case "generic":
      if (!content.includes("Every response must include")) {
        fail("generic adapter missing required response contract");
      } else {
        ok("generic adapter response contract present");
      }
      break;
    default:
      fail(`unrecognized target: ${targetId}`);
  }
}

function validateScripts() {
  const bashInstall = path.join(rootDir, "scripts", "install-codex.sh");
  const geminiInstall = path.join(rootDir, "scripts", "install-gemini.sh");
  const openclawInstall = path.join(rootDir, "scripts", "install-openclaw.sh");
  const pwshInstall = path.join(rootDir, "scripts", "install-codex.ps1");
  const exportScript = path.join(rootDir, "scripts", "export-adapters.sh");
  const packageScript = path.join(rootDir, "scripts", "package-release.sh");
  const syncScript = path.join(rootDir, "scripts", "sync-local-skill.mjs");
  const evalScript = path.join(rootDir, "scripts", "run-behavioral-evals.mjs");
  const txPlanLintScript = path.join(rootDir, "scripts", "lint-transaction-plan.mjs");

  assertFile(bashInstall, "install-codex.sh");
  assertFile(geminiInstall, "install-gemini.sh");
  assertFile(openclawInstall, "install-openclaw.sh");
  assertFile(pwshInstall, "install-codex.ps1");
  assertFile(exportScript, "export-adapters.sh");
  assertFile(packageScript, "package-release.sh");
  assertFile(syncScript, "sync-local-skill.mjs");
  assertFile(evalScript, "run-behavioral-evals.mjs");
  assertFile(txPlanLintScript, "lint-transaction-plan.mjs");
}

function validateReferences() {
  const knowledgeMap = path.join(rootDir, "references", "knowledge-map.md");
  const toccataPlaybook = path.join(rootDir, "references", "toccata-rd-playbook.md");
  const toccataDocCandidates = [
    path.join(repoRoot, "docs", "toccata.md"),
    path.join(rootDir, "docs", "toccata.md"),
    path.join(rootDir, "references", "repo-docs", "toccata.md"),
  ];
  const toccataDoc = toccataDocCandidates.find((candidate) => fs.existsSync(candidate));
  if (!assertFile(knowledgeMap, "knowledge map")) return;
  const content = readFile(knowledgeMap);
  for (const reference of [
    "source-trust-policy.md",
    "sources.md",
    "kaspa-research-radar.md",
    "toccata-rd-playbook.md",
    "repo-audit-checklist.md",
    "transaction-plan-safety.md",
    "live-source-intelligence.md",
    "core-research-track.md",
    "local-skill-sync.md",
  ]) {
    if (!content.includes(reference)) {
      fail(`knowledge map missing reference: ${reference}`);
    }
  }

  for (const repositorySource of [
    "docs/toccata.md",
    "docs/kaspa",
    "docs/toccata-evidence-ladder.md",
    "references/repo-docs/kaspa",
  ]) {
    if (!content.includes(repositorySource)) {
      fail(`knowledge map missing Toccata source-truth route: ${repositorySource}`);
    }
  }

  if (!assertFile(toccataPlaybook, "Toccata R&D playbook")) return;
  const playbook = readFile(toccataPlaybook);
  for (const sourceTruthRule of [
    "docs/toccata.md",
    "docs/kaspa",
    "docs/toccata-evidence-ladder.md",
    "Pre-change citation gate",
  ]) {
    if (!playbook.includes(sourceTruthRule)) {
      fail(`Toccata R&D playbook missing source-truth rule: ${sourceTruthRule}`);
    }
  }

  if (!toccataDoc) {
    fail("Toccata builder guide missing: expected docs/toccata.md or packaged equivalent");
    return;
  }
  assertFile(toccataDoc, "Toccata builder guide");
  const guide = readFile(toccataDoc);
  for (const required of [
    "v2.0.1",
    "v2.0.0",
    "KIP-16",
    "KIP-17",
    "KIP-20",
    "KIP-21",
    "OpZkPrecompile",
    "100 sompi * max(compute grams, 2 * transaction bytes)",
    "storageMass",
    "storage_mass",
    "computeBudget",
    "covenant_id",
    "GetBlockRewardInfo",
    "GetSeqCommitLaneProof",
    "Node Operators",
    "Wallet Builders",
    "Pool And Miner Integrators",
    "Indexers And Explorers",
    "KaspaScript And Covenant Builders",
    "ZK And Lane-Proof Researchers",
    "No full EVM-style smart-contract claims",
  ]) {
    if (!guide.includes(required)) {
      fail(`Toccata builder guide missing required content: ${required}`);
    }
  }
}

function validateEvals() {
  const evalCases = path.join(rootDir, "evals", "behavioral-cases.json");
  assertFile(evalCases, "behavioral evaluation cases");
}

function main() {
  const args = parseArgs(process.argv);
  const manifest = validateManifest();
  if (!manifest) process.exit(1);

  const targets = args.all
    ? requiredTargets
    : args.target
      ? [args.target]
      : requiredTargets;

  for (const targetId of targets) {
    validateTarget(targetId, manifest);
  }
  validateScripts();
  validateReferences();
  validateEvals();

  if (process.exitCode && process.exitCode !== 0) {
    console.error("Compatibility validation failed.");
    process.exit(process.exitCode);
  }
  console.log("Compatibility validation passed.");
}

main();
