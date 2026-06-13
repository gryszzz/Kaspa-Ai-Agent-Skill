#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoDir = path.resolve(scriptDir, "..");
const skillName = path.basename(defaultRepoDir);
const codexHome = process.env.CODEX_HOME || path.join(homedir(), ".codex");

const ignoredDirectoryNames = new Set([
  ".cache",
  ".git",
  ".hg",
  ".idea",
  ".svn",
  ".tmp",
  ".vscode",
  "cache",
  "coverage",
  "dist",
  "node_modules",
  "research-snapshots",
  "snapshots",
  "temp",
  "tmp",
]);

const ignoredFileNames = new Set([
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",
]);

function usage() {
  return `Usage:
  node scripts/sync-local-skill.mjs --check [options]
  node scripts/sync-local-skill.mjs --to-local [--apply] [options]
  node scripts/sync-local-skill.mjs --from-local [--apply] [options]

Modes:
  --check          Report drift without selecting a write direction.
  --to-local       Synchronize the canonical repository skill to Codex.
  --from-local     Synchronize legitimate local edits into the repository.

Safety:
  --dry-run        Do not write. This is the default.
  --apply          Apply the selected synchronization direction.
  --backup         Back up the destination before applying changes.
  --force          Resolve reported conflicts in the selected direction.
  --branch NAME    Require the repository worktree to be on NAME.

Output:
  --report FILE    Also write the machine-readable JSON report to FILE.

Advanced:
  --repo-dir DIR   Override the canonical skill directory.
  --local-dir DIR  Override the installed skill directory.
  --state FILE     Override the last-successful-sync state file.
`;
}

function takeValue(argv, index, option) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function parseArgs(argv) {
  const options = {
    mode: null,
    dryRun: true,
    backup: false,
    force: false,
    branch: null,
    repoDir: defaultRepoDir,
    localDir: path.join(codexHome, "skills", "public", skillName),
    statePath: path.join(codexHome, "state", `${skillName}-sync-state.json`),
    reportPath: null,
  };

  const modes = [];
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case "--check":
        modes.push("check");
        break;
      case "--to-local":
        modes.push("to-local");
        break;
      case "--from-local":
        modes.push("from-local");
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--apply":
        options.dryRun = false;
        break;
      case "--backup":
        options.backup = true;
        break;
      case "--force":
        options.force = true;
        break;
      case "--branch":
        options.branch = takeValue(argv, index, arg);
        index += 1;
        break;
      case "--repo-dir":
        options.repoDir = path.resolve(takeValue(argv, index, arg));
        index += 1;
        break;
      case "--local-dir":
        options.localDir = path.resolve(takeValue(argv, index, arg));
        index += 1;
        break;
      case "--state":
        options.statePath = path.resolve(takeValue(argv, index, arg));
        index += 1;
        break;
      case "--report":
        options.reportPath = path.resolve(takeValue(argv, index, arg));
        index += 1;
        break;
      case "--help":
      case "-h":
        console.log(usage());
        process.exit(0);
        break;
      default:
        throw new Error(`unknown option: ${arg}`);
    }
  }

  if (modes.length > 1) {
    throw new Error("choose only one of --check, --to-local, or --from-local");
  }
  options.mode = modes[0] || "check";
  if (options.mode === "check" && !options.dryRun) {
    throw new Error("--check cannot be combined with --apply");
  }
  return options;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalized(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function shouldIgnore(relativePath, isDirectory) {
  const normalizedPath = normalized(relativePath);
  const parts = normalizedPath.split("/");
  const name = parts.at(-1);

  if (parts.some((part) => ignoredDirectoryNames.has(part))) return true;
  if (isDirectory && ignoredDirectoryNames.has(name)) return true;
  if (ignoredFileNames.has(name)) return true;
  if (name === ".env" || name.startsWith(".env.")) return true;
  if (/\.(?:log|swp|swo|tmp)$/i.test(name) || name.endsWith("~")) return true;
  if (/\.(?:zip|tar\.gz)$/i.test(name) || name === "SHA256SUMS.txt") return true;
  return false;
}

function readTree(root) {
  const files = new Map();
  const ignored = [];
  if (!existsSync(root)) {
    return { exists: false, files, ignored };
  }

  function visit(current, relativeBase) {
    const entries = readdirSync(current, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name, "en"));

    for (const entry of entries) {
      const relativePath = relativeBase
        ? path.join(relativeBase, entry.name)
        : entry.name;
      const reportPath = normalized(relativePath);
      if (shouldIgnore(relativePath, entry.isDirectory())) {
        ignored.push(entry.isDirectory() ? `${reportPath}/` : reportPath);
        continue;
      }

      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath, relativePath);
      } else if (entry.isFile()) {
        files.set(reportPath, {
          hash: sha256(readFileSync(absolutePath)),
          type: "file",
        });
      } else if (entry.isSymbolicLink()) {
        const target = readlinkSync(absolutePath);
        files.set(reportPath, {
          hash: sha256(`symlink\0${target}`),
          target,
          type: "symlink",
        });
      }
    }
  }

  visit(root, "");
  return { exists: true, files, ignored: ignored.sort() };
}

function loadState(statePath) {
  if (!existsSync(statePath)) return { exists: false, files: {} };
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  if (state.schemaVersion !== 1 || typeof state.files !== "object") {
    throw new Error(`unsupported sync state: ${statePath}`);
  }
  return { exists: true, files: state.files };
}

function classify(repoHash, localHash, baseHash) {
  if (repoHash === localHash) return "identical";
  if (baseHash === undefined) {
    if (repoHash === undefined) return "local-only";
    if (localHash === undefined) return "repo-only";
    return "unbased-drift";
  }

  const repoChanged = repoHash !== baseHash;
  const localChanged = localHash !== baseHash;
  if (repoChanged && localChanged) return "conflict";
  if (repoChanged) return repoHash === undefined ? "repo-deleted" : "repo-changed";
  if (localChanged) return localHash === undefined ? "local-deleted" : "local-changed";
  return "conflict";
}

function treeHash(files) {
  const rows = [...files.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "en"))
    .map(([relativePath, entry]) => `${relativePath}\0${entry.type}\0${entry.hash}`);
  return sha256(rows.join("\n"));
}

function getGitBranch(repoDir) {
  try {
    const root = execFileSync("git", ["-C", repoDir, "rev-parse", "--show-toplevel"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const branch = execFileSync("git", ["-C", root, "branch", "--show-current"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return { root, branch };
  } catch {
    return null;
  }
}

function buildReport(options, repoTree, localTree, state, git) {
  const allPaths = new Set([
    ...repoTree.files.keys(),
    ...localTree.files.keys(),
    ...Object.keys(state.files),
  ]);
  const entries = [];

  for (const relativePath of [...allPaths].sort((left, right) => left.localeCompare(right, "en"))) {
    const repo = repoTree.files.get(relativePath);
    const local = localTree.files.get(relativePath);
    const baseHash = state.files[relativePath];
    const status = classify(repo?.hash, local?.hash, baseHash);
    if (status === "identical") continue;
    entries.push({
      path: relativePath,
      status,
      repo: repo ? { hash: repo.hash, type: repo.type } : null,
      local: local ? { hash: local.hash, type: local.type } : null,
      baseHash: baseHash || null,
    });
  }

  const reportCore = {
    schemaVersion: 1,
    skill: skillName,
    mode: options.mode,
    dryRun: options.dryRun,
    stateAvailable: state.exists,
    repo: {
      exists: repoTree.exists,
      treeHash: repoTree.exists ? treeHash(repoTree.files) : null,
      ignored: repoTree.ignored,
    },
    local: {
      exists: localTree.exists,
      treeHash: localTree.exists ? treeHash(localTree.files) : null,
      ignored: localTree.ignored,
    },
    git: git ? { branch: git.branch } : null,
    entries,
  };

  return {
    ...reportCore,
    reportHash: sha256(JSON.stringify(reportCore)),
    drift: entries.length > 0 || repoTree.exists !== localTree.exists,
  };
}

function buildActions(options, report, repoTree, localTree, state) {
  if (options.mode === "check") return [];
  const sourceTree = options.mode === "to-local" ? repoTree : localTree;
  const destinationTree = options.mode === "to-local" ? localTree : repoTree;

  return report.entries.map((entry) => {
    const source = sourceTree.files.get(entry.path);
    const destination = destinationTree.files.get(entry.path);
    const baseHash = state.files[entry.path];
    const destinationChanged = baseHash === undefined
      ? destination !== undefined
      : destination?.hash !== baseHash;
    const conflict = destinationChanged && source?.hash !== destination?.hash;

    return {
      path: entry.path,
      operation: source ? "copy" : "delete",
      conflict,
    };
  });
}

function copyEntry(sourceRoot, destinationRoot, relativePath, entry) {
  const sourcePath = path.join(sourceRoot, relativePath);
  const destinationPath = path.join(destinationRoot, relativePath);
  mkdirSync(path.dirname(destinationPath), { recursive: true });
  rmSync(destinationPath, { recursive: true, force: true });
  if (entry.type === "symlink") {
    symlinkSync(entry.target ?? readlinkSync(sourcePath), destinationPath);
  } else {
    cpSync(sourcePath, destinationPath, { force: true, preserveTimestamps: false });
  }
}

function saveState(statePath, files) {
  const sortedFiles = Object.fromEntries(
    [...files.entries()]
      .sort(([left], [right]) => left.localeCompare(right, "en"))
      .map(([relativePath, entry]) => [relativePath, entry.hash]),
  );
  const state = {
    schemaVersion: 1,
    skill: skillName,
    treeHash: treeHash(files),
    files: sortedFiles,
  };
  mkdirSync(path.dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function emitReport(report, options) {
  const output = `${JSON.stringify(report, null, 2)}\n`;
  if (options.reportPath) {
    mkdirSync(path.dirname(options.reportPath), { recursive: true });
    writeFileSync(options.reportPath, output);
  }
  process.stdout.write(output);
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv);
  } catch (error) {
    console.error(error.message);
    console.error(usage());
    process.exit(2);
  }

  try {
    const git = getGitBranch(options.repoDir);
    if (options.branch && (!git || git.branch !== options.branch)) {
      throw new Error(
        `branch guard failed: expected ${options.branch}, found ${git?.branch || "no git worktree"}`,
      );
    }

    const repoTree = readTree(options.repoDir);
    const localTree = readTree(options.localDir);
    const state = loadState(options.statePath);
    const report = buildReport(options, repoTree, localTree, state, git);
    const actions = buildActions(options, report, repoTree, localTree, state);
    report.actions = actions;
    report.conflicts = actions.filter((action) => action.conflict).map((action) => action.path);

    if (!repoTree.exists) {
      report.error = "canonical repository skill directory is missing";
      emitReport(report, options);
      process.exit(2);
    }
    if (options.mode === "from-local" && !localTree.exists) {
      report.error = "installed local skill directory is missing";
      emitReport(report, options);
      process.exit(2);
    }
    if (options.mode === "check" || options.dryRun) {
      emitReport(report, options);
      process.exit(report.drift ? 1 : 0);
    }
    if (report.conflicts.length > 0 && !options.force) {
      report.error = "conflicts require an explicit --force direction";
      emitReport(report, options);
      process.exit(2);
    }

    const sourceRoot = options.mode === "to-local" ? options.repoDir : options.localDir;
    const destinationRoot = options.mode === "to-local" ? options.localDir : options.repoDir;
    const sourceTree = options.mode === "to-local" ? repoTree : localTree;

    if (options.backup && existsSync(destinationRoot)) {
      const backupPath = path.join(
        path.dirname(options.statePath),
        "backups",
        `${skillName}-${options.mode}-${report.reportHash.slice(0, 12)}`,
      );
      if (existsSync(backupPath)) {
        throw new Error(`backup already exists: ${backupPath}`);
      }
      mkdirSync(path.dirname(backupPath), { recursive: true });
      cpSync(destinationRoot, backupPath, { recursive: true, preserveTimestamps: false });
      report.backupPath = backupPath;
    }

    mkdirSync(destinationRoot, { recursive: true });
    for (const action of actions) {
      const destinationPath = path.join(destinationRoot, action.path);
      if (action.operation === "delete") {
        rmSync(destinationPath, { recursive: true, force: true });
      } else {
        copyEntry(sourceRoot, destinationRoot, action.path, sourceTree.files.get(action.path));
      }
    }

    const postRepo = readTree(options.repoDir);
    const postLocal = readTree(options.localDir);
    if (treeHash(postRepo.files) !== treeHash(postLocal.files)) {
      throw new Error("post-sync verification failed: trees are still different");
    }
    saveState(options.statePath, postRepo.files);
    report.applied = true;
    report.postSyncTreeHash = treeHash(postRepo.files);
    emitReport(report, options);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();
