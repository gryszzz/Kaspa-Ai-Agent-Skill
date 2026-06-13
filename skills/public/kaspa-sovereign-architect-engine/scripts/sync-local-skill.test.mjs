#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const syncScript = path.join(scriptDir, "sync-local-skill.mjs");

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "kaspa-skill-sync-"));
  const repo = path.join(root, "repo");
  const local = path.join(root, "local");
  const state = path.join(root, "state", "sync.json");
  mkdirSync(repo, { recursive: true });
  return { root, repo, local, state };
}

function write(root, relativePath, content) {
  const target = path.join(root, relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function run(args, paths) {
  const result = spawnSync(process.execPath, [
    syncScript,
    ...args,
    "--repo-dir",
    paths.repo,
    "--local-dir",
    paths.local,
    "--state",
    paths.state,
  ], { encoding: "utf8" });
  return {
    ...result,
    report: result.stdout ? JSON.parse(result.stdout) : null,
  };
}

test("defaults to dry-run and synchronizes repository files to a missing local directory", () => {
  const paths = fixture();
  try {
    write(paths.repo, "SKILL.md", "canonical\n");

    const preview = run(["--to-local"], paths);
    assert.equal(preview.status, 1);
    assert.equal(preview.report.dryRun, true);
    assert.equal(preview.report.actions[0].operation, "copy");
    assert.equal(existsSync(paths.local), false);

    const apply = run(["--to-local", "--apply"], paths);
    assert.equal(apply.status, 0, apply.stderr);
    assert.equal(readFileSync(path.join(paths.local, "SKILL.md"), "utf8"), "canonical\n");
    assert.equal(existsSync(paths.state), true);

    const check = run(["--check"], paths);
    assert.equal(check.status, 0, check.stderr);
    assert.equal(check.report.drift, false);
  } finally {
    rmSync(paths.root, { recursive: true, force: true });
  }
});

test("synchronizes an authored local improvement back to the repository", () => {
  const paths = fixture();
  try {
    write(paths.repo, "SKILL.md", "baseline\n");
    assert.equal(run(["--to-local", "--apply"], paths).status, 0);
    write(paths.local, "SKILL.md", "local improvement\n");

    const result = run(["--from-local", "--apply"], paths);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(path.join(paths.repo, "SKILL.md"), "utf8"), "local improvement\n");
  } finally {
    rmSync(paths.root, { recursive: true, force: true });
  }
});

test("propagates source deletions after a shared baseline exists", () => {
  const paths = fixture();
  try {
    write(paths.repo, "SKILL.md", "baseline\n");
    write(paths.repo, "references/old.md", "remove me\n");
    assert.equal(run(["--to-local", "--apply"], paths).status, 0);
    unlinkSync(path.join(paths.repo, "references", "old.md"));

    const result = run(["--to-local", "--apply"], paths);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(path.join(paths.local, "references", "old.md")), false);
  } finally {
    rmSync(paths.root, { recursive: true, force: true });
  }
});

test("excludes caches, logs, environment files, snapshots, dependencies, and editor files", () => {
  const paths = fixture();
  try {
    write(paths.repo, "SKILL.md", "baseline\n");
    write(paths.repo, ".env", "SECRET=value\n");
    write(paths.repo, "debug.log", "noise\n");
    write(paths.repo, "node_modules/pkg/index.js", "noise\n");
    write(paths.repo, "research-snapshots/latest.json", "{}\n");
    write(paths.repo, ".vscode/settings.json", "{}\n");

    const result = run(["--to-local"], paths);
    assert.equal(result.status, 1);
    assert.deepEqual(result.report.entries.map((entry) => entry.path), ["SKILL.md"]);
    assert.match(result.report.repo.ignored.join("\n"), /\.env/);
    assert.match(result.report.repo.ignored.join("\n"), /node_modules\//);
    assert.match(result.report.repo.ignored.join("\n"), /research-snapshots\//);
  } finally {
    rmSync(paths.root, { recursive: true, force: true });
  }
});

test("blocks two-sided conflicts and permits explicit forced resolution with backup", () => {
  const paths = fixture();
  try {
    write(paths.repo, "SKILL.md", "baseline\n");
    assert.equal(run(["--to-local", "--apply"], paths).status, 0);
    write(paths.repo, "SKILL.md", "repo edit\n");
    write(paths.local, "SKILL.md", "local edit\n");

    const blocked = run(["--from-local", "--apply"], paths);
    assert.equal(blocked.status, 2);
    assert.deepEqual(blocked.report.conflicts, ["SKILL.md"]);
    assert.equal(readFileSync(path.join(paths.repo, "SKILL.md"), "utf8"), "repo edit\n");

    const forced = run(["--from-local", "--apply", "--force", "--backup"], paths);
    assert.equal(forced.status, 0, forced.stderr);
    assert.equal(readFileSync(path.join(paths.repo, "SKILL.md"), "utf8"), "local edit\n");
    assert.equal(readFileSync(path.join(forced.report.backupPath, "SKILL.md"), "utf8"), "repo edit\n");
  } finally {
    rmSync(paths.root, { recursive: true, force: true });
  }
});

test("reports a missing local directory and only creates it for to-local apply", () => {
  const paths = fixture();
  try {
    write(paths.repo, "SKILL.md", "baseline\n");

    const check = run(["--check"], paths);
    assert.equal(check.status, 1);
    assert.equal(check.report.local.exists, false);

    const fromLocal = run(["--from-local", "--apply"], paths);
    assert.equal(fromLocal.status, 2);
    assert.match(fromLocal.report.error, /local skill directory is missing/);

    const toLocal = run(["--to-local", "--apply"], paths);
    assert.equal(toLocal.status, 0, toLocal.stderr);
    assert.equal(existsSync(path.join(paths.local, "SKILL.md")), true);
  } finally {
    rmSync(paths.root, { recursive: true, force: true });
  }
});
