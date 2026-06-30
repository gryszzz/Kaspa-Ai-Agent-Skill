#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const defaultCasesPath = path.join(repoRoot, "fixtures", "toccata", "protocol-drills.json");

const requiredCaseIds = [
  "activation-claim-boundary",
  "transaction-field-migration",
  "fee-policy-layering",
  "covenant-lineage-indexer",
  "wallet-signing-preview-boundary",
  "sequencing-lane-proof-boundary",
  "zk-proof-cost-boundary",
  "protocol-answer-shape",
];

function parseArgs(argv) {
  const options = {
    casesPath: defaultCasesPath,
    responsesPath: null,
    check: false,
    markdown: false,
  };

  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        options.check = true;
        break;
      case "--cases":
        options.casesPath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      case "--responses":
        options.responsesPath = path.resolve(argv[index + 1]);
        options.check = true;
        index += 1;
        break;
      case "--markdown":
        options.markdown = true;
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

function loadResponses(filePath) {
  if (!filePath) return null;
  const payload = loadJson(filePath);
  if (Array.isArray(payload.responses)) {
    return Object.fromEntries(payload.responses.map((entry) => [entry.id, entry.response]));
  }
  if (payload.responses && typeof payload.responses === "object") {
    return payload.responses;
  }
  throw new Error("responses file must contain a responses object or array");
}

function validateSuite(suite) {
  if (suite.schemaVersion !== 1 || !Array.isArray(suite.cases)) {
    throw new Error("protocol drill suite must use schemaVersion 1 and contain cases[]");
  }

  const ids = new Set();
  for (const entry of suite.cases) {
    if (!entry.id || ids.has(entry.id)) {
      throw new Error(`protocol drill suite contains duplicate or missing case id: ${entry.id || "missing"}`);
    }
    ids.add(entry.id);
    for (const field of ["prompt", "track", "referenceResponse"]) {
      if (typeof entry[field] !== "string" || entry[field].trim() === "") {
        throw new Error(`case ${entry.id} missing ${field}`);
      }
    }
    for (const field of ["sources", "required", "prohibited"]) {
      if (!Array.isArray(entry[field])) {
        throw new Error(`case ${entry.id} missing ${field}[]`);
      }
    }
  }

  for (const id of requiredCaseIds) {
    if (!ids.has(id)) throw new Error(`protocol drill suite missing required case: ${id}`);
  }
}

function evaluateCase(entry, response) {
  const failures = [];
  if (typeof response !== "string" || response.trim() === "") {
    failures.push({ type: "missing-response", label: "response is empty" });
    return { id: entry.id, track: entry.track, passed: false, failures };
  }

  for (const rule of entry.required) {
    if (!new RegExp(rule.pattern, "i").test(response)) {
      failures.push({ type: "missing-required", label: rule.label });
    }
  }

  for (const rule of entry.prohibited) {
    if (new RegExp(rule.pattern, "i").test(response)) {
      failures.push({ type: "prohibited-claim", label: rule.label });
    }
  }

  return { id: entry.id, track: entry.track, passed: failures.length === 0, failures };
}

function buildMarkdown(suite) {
  const rows = suite.cases
    .map((entry, index) => {
      const sources = entry.sources.map((source) => `  - ${source}`).join("\n");
      return `## ${index + 1}. ${entry.id}\n\nTrack: ${entry.track}\n\nPrompt: ${entry.prompt}\n\nSources:\n${sources}\n`;
    })
    .join("\n");

  return `# ${suite.title}\n\n${suite.sourcePolicy}\n\n${rows}`;
}

function runEvaluation(suite, responses, casesPath) {
  const results = suite.cases.map((entry) =>
    evaluateCase(entry, responses ? responses[entry.id] : entry.referenceResponse),
  );
  const failed = results.filter((result) => !result.passed);
  return {
    schemaVersion: 1,
    suite: path.basename(casesPath),
    passed: failed.length === 0,
    total: results.length,
    passedCount: results.length - failed.length,
    failedCount: failed.length,
    results,
  };
}

function main() {
  try {
    const options = parseArgs(process.argv);
    const suite = loadJson(options.casesPath);
    validateSuite(suite);

    if (!options.check && !options.markdown) {
      process.stdout.write(buildMarkdown(suite));
      return;
    }

    if (options.markdown && !options.check) {
      process.stdout.write(buildMarkdown(suite));
      return;
    }

    const responses = loadResponses(options.responsesPath);
    const report = runEvaluation(suite, responses, options.casesPath);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(report.passed ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();
