#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const validator = path.join(scriptDir, "validate-skill-release.mjs");

function run(root = repoRoot) {
  const result = spawnSync(process.execPath, [validator, "--check", "--repo-root", root], {
    encoding: "utf8",
  });
  return {
    ...result,
    report: result.stdout ? JSON.parse(result.stdout) : null,
  };
}

function copyReleaseSurface() {
  const root = mkdtempSync(path.join(tmpdir(), "kaspa-release-check-"));
  for (const relativePath of [
    "README.md",
    "SYSTEM_ARCHITECTURE.md",
    "TRAINING_SOURCES.md",
    "docs/toccata.md",
    "release-metadata.json",
    "release-notes/v1.8.0.md",
    "skills/public/kaspa-sovereign-architect-engine/manifest.json",
    "skills/public/kaspa-sovereign-architect-engine/agents",
    "skills/public/kaspa-sovereign-architect-engine/scripts/package-release.sh",
  ]) {
    const source = path.join(repoRoot, relativePath);
    const destination = path.join(root, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    cpSync(source, destination, { recursive: true });
  }
  return root;
}

test("validates release metadata, README, adapters, notes, and package version", () => {
  const result = run();

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.report.manifestVersion, "1.8.0");
  assert.equal(result.report.publishedRelease, "v1.6.2");
  assert.equal(result.report.repositoryStatus, "unpublished");
});

test("rejects manifest and release metadata version drift", () => {
  const root = copyReleaseSurface();
  try {
    const metadataPath = path.join(root, "release-metadata.json");
    const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
    metadata.repositoryVersion = "1.7.0";
    writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);

    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.report.failures.join("\n"), /repositoryVersion 1\.7\.0 != manifest 1\.8\.0/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects stale package version declarations in adapters", () => {
  const root = copyReleaseSurface();
  try {
    const adapterPath = path.join(
      root,
      "skills/public/kaspa-sovereign-architect-engine/agents/cursor.mdc",
    );
    writeFileSync(adapterPath, `${readFileSync(adapterPath, "utf8")}\nPackage v1.4.0\n`);

    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.report.failures.join("\n"), /cursor\.mdc embeds package version v1\.4\.0/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
