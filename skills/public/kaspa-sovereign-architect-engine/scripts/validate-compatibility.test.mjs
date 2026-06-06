#!/usr/bin/env node

import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");
const validator = path.join(scriptDir, "validate-compatibility.mjs");
const exporter = path.join(scriptDir, "export-adapters.sh");

function run(command, args, cwd = skillDir) {
  return spawnSync(command, args, {
    cwd,
    encoding: "utf8",
  });
}

test("validates every supported adapter", () => {
  const result = run(process.execPath, [validator, "--all"]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Compatibility validation passed/);
});

test("rejects an adapter that drops a required wallet contract", () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "kaspa-skill-contract-"));
  const copiedSkill = path.join(tempRoot, path.basename(skillDir));

  try {
    cpSync(skillDir, copiedSkill, { recursive: true });
    const cursorPath = path.join(copiedSkill, "agents", "cursor.mdc");
    const cursor = readFileSync(cursorPath, "utf8").replaceAll("Kasware", "browser wallet");
    writeFileSync(cursorPath, cursor);

    const result = run(process.execPath, [path.join(copiedSkill, "scripts", "validate-compatibility.mjs"), "--all"]);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /missing shared contract rule: Kasware compatibility/);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("exports a self-contained adapter bundle", () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "kaspa-adapter-export-"));

  try {
    const result = run("bash", [exporter, tempRoot]);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    for (const relativePath of [
      "SKILL.md",
      "manifest.json",
      "agents/openai.yaml",
      "assets/kaspa-ai-agent-skill-logo.svg",
      "references/source-trust-policy.md",
    ]) {
      assert.equal(readFileSync(path.join(tempRoot, relativePath), "utf8").length > 0, true);
    }
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
