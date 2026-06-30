#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const defaultSnapshotPath = path.join(repoRoot, "research-snapshots", "toccata", "zk-proof-cost-baseline.json");

function parseArgs(argv) {
  const options = { snapshotPath: defaultSnapshotPath };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        break;
      case "--snapshot":
        options.snapshotPath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${argv[index]}`);
    }
  }
  return options;
}

function validate(snapshot) {
  const failures = [];
  if (snapshot.schemaVersion !== 1) failures.push("schemaVersion must be 1");
  if (snapshot.snapshotType !== "zk_proof_cost_baseline") failures.push("snapshotType must be zk_proof_cost_baseline");
  if (!Array.isArray(snapshot.measurements)) failures.push("measurements[] is required");
  if (snapshot.status === "pending_no_measurements" && snapshot.measurements.length !== 0) {
    failures.push("pending_no_measurements must not contain measurements");
  }
  if (snapshot.status === "measured") {
    for (const [index, entry] of snapshot.measurements.entries()) {
      for (const field of [
        "proofSystem",
        "programIdentity",
        "proofPayloadBytes",
        "publicInputBytes",
        "verificationCost",
        "validProofResult",
        "invalidProofResult",
        "malformedProofResult",
        "dependencyVersions",
        "networkName",
      ]) {
        if (entry[field] === undefined || entry[field] === null || entry[field] === "") {
          failures.push(`measurement ${index} missing ${field}`);
        }
      }
    }
  }
  return failures;
}

function main() {
  try {
    const options = parseArgs(process.argv);
    const snapshot = JSON.parse(readFileSync(options.snapshotPath, "utf8"));
    const failures = validate(snapshot);
    process.stdout.write(
      `${JSON.stringify(
        {
          schemaVersion: 1,
          passed: failures.length === 0,
          status: snapshot.status,
          measurementCount: snapshot.measurements?.length || 0,
          failures,
        },
        null,
        2,
      )}\n`,
    );
    process.exit(failures.length === 0 ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();

