#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const defaultLedgerPath = path.join(repoRoot, "READINESS_APPROVALS.md");
const requiredComponents = ["wallet", "indexer", "miner", "explorer", "app"];
const allowedStatuses = new Set(["approved", "integration_evidence_only", "local_fixture_only", "not_approved"]);
const allowedEvidenceTypes = new Set([
  "maintainer_approval",
  "reproducible_integration_test",
  "public_api_capture",
  "deterministic_local_fixture",
  "pending",
]);

function parseArgs(argv) {
  const options = { ledgerPath: defaultLedgerPath };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        break;
      case "--ledger":
        options.ledgerPath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${argv[index]}`);
    }
  }
  return options;
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function ledgerSection(content) {
  const start = content.indexOf("## Ledger");
  if (start === -1) return "";
  const rest = content.slice(start);
  const nextHeading = rest.slice("## Ledger".length).search(/\n##\s+/);
  if (nextHeading === -1) return rest;
  return rest.slice(0, "## Ledger".length + nextHeading);
}

function parseLedgerRows(content) {
  const section = ledgerSection(content);
  const rows = [];
  for (const line of section.split(/\r?\n/)) {
    if (!line.startsWith("|")) continue;
    if (/^\|\s*-+/.test(line)) continue;
    const cells = splitRow(line);
    if (cells[0] === "Component") continue;
    if (cells.length !== 8) continue;
    rows.push({
      component: cells[0],
      status: cells[1],
      evidenceType: cells[2],
      source: cells[3],
      date: cells[4],
      exactClaim: cells[5],
      evidenceLink: cells[6],
      boundary: cells[7],
    });
  }
  return rows;
}

function isBlank(value) {
  return !value || value === "N/A" || value === "-";
}

function validateLedger(content) {
  const failures = [];
  if (!/Do not claim wallet, indexer, miner, explorer, or application readiness/i.test(content)) {
    failures.push("ledger must include the no-readiness-overclaim rule");
  }

  const rows = parseLedgerRows(content);
  const currentRows = rows.filter((row) => requiredComponents.includes(row.component));
  for (const component of requiredComponents) {
    if (!currentRows.some((row) => row.component === component)) {
      failures.push(`missing ledger row for ${component}`);
    }
  }

  for (const row of currentRows) {
    if (!allowedStatuses.has(row.status)) {
      failures.push(`${row.component} has unsupported status ${row.status}`);
    }
    if (!allowedEvidenceTypes.has(row.evidenceType)) {
      failures.push(`${row.component} has unsupported evidence type ${row.evidenceType}`);
    }
    if (isBlank(row.exactClaim)) failures.push(`${row.component} exact claim is required`);
    if (isBlank(row.boundary)) failures.push(`${row.component} boundary is required`);

    if (row.status === "approved") {
      if (row.evidenceType !== "maintainer_approval" && row.evidenceType !== "reproducible_integration_test") {
        failures.push(`${row.component} approved status needs maintainer approval or reproducible integration test`);
      }
      for (const field of ["source", "date", "evidenceLink"]) {
        if (isBlank(row[field])) failures.push(`${row.component} approved row missing ${field}`);
      }
    }

    if (row.status === "not_approved" && row.evidenceType !== "pending") {
      failures.push(`${row.component} not_approved rows must use pending evidence type`);
    }

    if (row.status === "integration_evidence_only" && isBlank(row.evidenceLink)) {
      failures.push(`${row.component} integration evidence row must include an evidence link or command`);
    }

    if (row.status === "local_fixture_only" && !/local/i.test(row.boundary)) {
      failures.push(`${row.component} local_fixture_only row must state the local-only boundary`);
    }
  }

  return { rows: currentRows, failures };
}

function main() {
  try {
    const options = parseArgs(process.argv);
    const content = readFileSync(options.ledgerPath, "utf8");
    const { rows, failures } = validateLedger(content);
    const report = {
      schemaVersion: 1,
      passed: failures.length === 0,
      ledger: path.relative(repoRoot, options.ledgerPath),
      components: rows.map((row) => ({ component: row.component, status: row.status, evidenceType: row.evidenceType })),
      approvedCount: rows.filter((row) => row.status === "approved").length,
      failures,
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(report.passed ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();
