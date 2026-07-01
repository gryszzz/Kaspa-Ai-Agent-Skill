#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const defaultFixturePath = path.join(repoRoot, "fixtures", "toccata", "live-covenant-indexer-fixture.template.json");

function parseArgs(argv) {
  const options = { fixturePath: defaultFixturePath };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        break;
      case "--fixture":
        options.fixturePath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${argv[index]}`);
    }
  }
  return options;
}

function validateFixture(fixture) {
  const failures = [];
  if (fixture.schemaVersion !== 1) failures.push("schemaVersion must be 1");
  if (!["template_only", "live_covenant_indexer_capture"].includes(fixture.fixtureType)) {
    failures.push("fixtureType must be template_only or live_covenant_indexer_capture");
  }
  if (fixture.fixtureType === "live_covenant_indexer_capture") {
    if (!fixture.capturedAt) failures.push("capturedAt is required for live captures");
    if (!fixture.networkName) failures.push("networkName is required for live captures");
    if (!fixture.source?.url && !fixture.source?.commit) failures.push("source URL or commit is required");
    if (!Array.isArray(fixture.acceptedTransactions) || fixture.acceptedTransactions.length === 0) {
      failures.push("acceptedTransactions[] must contain at least one live transaction");
    }
    if (!Array.isArray(fixture.covenantLineages)) failures.push("covenantLineages[] is required");
    if (fixture.activationEvidence?.observedDaa < fixture.activationEvidence?.activationDaa) {
      failures.push("observedDaa must be at or above activationDaa for live captures");
    }
    const hasCovenantTx = (fixture.acceptedTransactions || []).some((tx) => {
      const inputs = Array.isArray(tx.inputs) ? tx.inputs : [];
      const outputs = Array.isArray(tx.outputs) ? tx.outputs : [];
      const toccataFields = tx.toccata_fields || tx.toccataFields || {};
      return (
        toccataFields.covenant_ids?.length > 0 ||
        inputs.some((input) => input.covenant_id) ||
        outputs.some((output) => output.covenant_id)
      );
    });
    if (!hasCovenantTx) failures.push("live captures must include at least one covenant_id");
    const hasAcceptedContext = (fixture.acceptedTransactions || []).every(
      (tx) => tx.is_accepted === true && tx.accepting_block_hash && tx.accepting_block_blue_score,
    );
    if (!hasAcceptedContext) failures.push("live captures must preserve accepted block context");
    if (!/not wallet.+readiness/i.test(fixture.readinessBoundary || fixture.notes || "")) {
      failures.push("live captures must preserve the wallet/indexer readiness boundary");
    }
  }
  return failures;
}

function main() {
  try {
    const options = parseArgs(process.argv);
    const fixture = JSON.parse(readFileSync(options.fixturePath, "utf8"));
    const failures = validateFixture(fixture);
    const report = {
      schemaVersion: 1,
      passed: failures.length === 0,
      fixtureType: fixture.fixtureType,
      captured: fixture.fixtureType === "live_covenant_indexer_capture",
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
