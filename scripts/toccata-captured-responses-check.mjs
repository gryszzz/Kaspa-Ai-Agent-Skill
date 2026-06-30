#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const drillRunner = path.join(scriptDir, "toccata-protocol-drill.mjs");
const defaultResponsesDir = path.join(repoRoot, "captured-responses", "toccata");
const defaultCasesPath = path.join(repoRoot, "fixtures", "toccata", "protocol-drills.json");

function parseArgs(argv) {
  const options = {
    responsesDir: defaultResponsesDir,
    casesPath: defaultCasesPath,
    check: false,
  };

  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        options.check = true;
        break;
      case "--responses-dir":
        options.responsesDir = path.resolve(argv[index + 1]);
        index += 1;
        break;
      case "--cases":
        options.casesPath = path.resolve(argv[index + 1]);
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

function listCapturedFiles(responsesDir) {
  return readdirSync(responsesDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort()
    .map((fileName) => path.join(responsesDir, fileName));
}

function validateCapture(filePath) {
  const payload = loadJson(filePath);
  const failures = [];
  if (payload.schemaVersion !== 1) failures.push("schemaVersion must be 1");
  if (!payload.capture?.agent) failures.push("capture.agent is required");
  if (!payload.capture?.capturedAt) failures.push("capture.capturedAt is required");
  if (!payload.responses || typeof payload.responses !== "object") failures.push("responses object is required");
  return failures;
}

function runDrill(casesPath, responsesPath) {
  const result = spawnSync(process.execPath, [drillRunner, "--cases", casesPath, "--responses", responsesPath], {
    encoding: "utf8",
  });
  return {
    status: result.status,
    stderr: result.stderr,
    report: result.stdout ? JSON.parse(result.stdout) : null,
  };
}

function main() {
  try {
    const options = parseArgs(process.argv);
    const files = listCapturedFiles(options.responsesDir);
    const results = files.map((filePath) => {
      const captureFailures = validateCapture(filePath);
      if (captureFailures.length) {
        return {
          file: path.relative(repoRoot, filePath),
          passed: false,
          captureFailures,
          drill: null,
        };
      }
      const drill = runDrill(options.casesPath, filePath);
      return {
        file: path.relative(repoRoot, filePath),
        passed: drill.status === 0 && drill.report?.passed === true,
        captureFailures: [],
        drill: drill.report,
        stderr: drill.stderr || undefined,
      };
    });
    const failed = results.filter((result) => !result.passed);
    const report = {
      schemaVersion: 1,
      passed: failed.length === 0,
      capturedFiles: results.length,
      failedCount: failed.length,
      results,
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(report.passed ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();

