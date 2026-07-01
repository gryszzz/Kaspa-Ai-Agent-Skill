#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const appLabDir = path.join(repoRoot, "fixtures", "toccata", "app-lab");
const defaultFixture = path.join(appLabDir, "vault-escrow.json");
const requiredAppTypes = ["vault_escrow", "stateful_registry", "atomic_swap"];
const requiredCaseTypes = ["valid", "invalid", "replay", "reorg_rollback", "wrong_network"];

function parseArgs(argv) {
  const options = { fixturePath: defaultFixture, checkAll: false };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        break;
      case "--check-all":
        options.checkAll = true;
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

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function fixturePaths() {
  return readdirSync(appLabDir)
    .filter((entry) => entry.endsWith(".json"))
    .sort()
    .map((entry) => path.join(appLabDir, entry));
}

function validateWalletPreview(fixture, failures) {
  const preview = fixture.walletPreview || {};
  if (preview.previewType !== "covenant_state_transition") {
    failures.push("walletPreview.previewType must be covenant_state_transition");
  }
  if (!/not a normal send/i.test(preview.warning || "")) {
    failures.push("walletPreview.warning must say this is not a normal send");
  }
  if (preview.network !== fixture.network) failures.push("walletPreview.network must match fixture network");
  if (preview.covenantId !== fixture.covenantId) failures.push("walletPreview.covenantId must match fixture covenantId");
  for (const field of ["consumedState", "successorState", "proofRequirements", "signingDecision"]) {
    if (!preview[field]) failures.push(`walletPreview.${field} is required`);
  }
  if (!Array.isArray(preview.walletCompatibility) || !preview.walletCompatibility.includes("Kasware")) {
    failures.push("walletPreview.walletCompatibility must include Kasware");
  }
  if (!preview.walletCompatibility?.includes("Kaspium")) {
    failures.push("walletPreview.walletCompatibility must include Kaspium");
  }
  if (!Array.isArray(preview.signingDecision?.blockedIf) || preview.signingDecision.blockedIf.length === 0) {
    failures.push("walletPreview.signingDecision.blockedIf must list blockers");
  }
}

function validateTransitionShape(fixture, transition, failures) {
  if (!transition.id) failures.push("transition.id is required");
  if (!requiredCaseTypes.includes(transition.caseType)) {
    failures.push(`transition ${transition.id || "unknown"} has unsupported caseType ${transition.caseType}`);
  }

  if (transition.caseType === "valid") {
    if (transition.network !== fixture.network) failures.push(`${transition.id} network must match fixture network`);
    if (transition.txVersion !== 1) failures.push(`${transition.id} txVersion must be 1`);
    if (transition.consumedOutpoint !== fixture.initialState?.currentTip) {
      failures.push(`${transition.id} must consume the initial current tip`);
    }
    if (!transition.successor?.outpoint) failures.push(`${transition.id} successor.outpoint is required`);
    if (transition.successor?.covenantId !== fixture.covenantId) {
      failures.push(`${transition.id} successor covenantId must match fixture covenantId`);
    }
    if (!Number.isInteger(transition.authorizingInputIndex)) {
      failures.push(`${transition.id} authorizingInputIndex must be an integer`);
    }
    if (!Number.isInteger(transition.computeBudget) || transition.computeBudget <= 0) {
      failures.push(`${transition.id} computeBudget must be positive`);
    }
    if (!Number.isInteger(transition.storageMass) || transition.storageMass <= 0) {
      failures.push(`${transition.id} storageMass must be positive`);
    }
    if (!Number.isInteger(transition.feeSompi) || transition.feeSompi < 0) {
      failures.push(`${transition.id} feeSompi must be explicit`);
    }
    if (!Number.isInteger(transition.changeSompi) || transition.changeSompi < 0) {
      failures.push(`${transition.id} changeSompi must be explicit`);
    }
    if (!transition.proofRequirements) failures.push(`${transition.id} proofRequirements are required`);
  }

  if (["invalid", "replay", "wrong_network"].includes(transition.caseType)) {
    if (transition.rejected !== true) failures.push(`${transition.id} must be rejected`);
    if (!transition.rejectionReason) failures.push(`${transition.id} rejectionReason is required`);
  }

  if (transition.caseType === "wrong_network" && transition.network === fixture.network) {
    failures.push(`${transition.id} wrong_network case must use a different network`);
  }

  if (transition.caseType === "reorg_rollback") {
    if (!transition.removedOutpoint) failures.push(`${transition.id} removedOutpoint is required`);
    if (!transition.rollbackToOutpoint) failures.push(`${transition.id} rollbackToOutpoint is required`);
  }
}

function reduceAppLabFixture(fixture) {
  const failures = [];
  if (fixture.schemaVersion !== 1) failures.push("schemaVersion must be 1");
  if (fixture.fixtureType !== "toccata_app_lab_case") failures.push("fixtureType must be toccata_app_lab_case");
  if (!requiredAppTypes.includes(fixture.appType)) failures.push(`unsupported appType ${fixture.appType}`);
  if (!/local_fixture_only/i.test(fixture.evidenceStatus || "")) {
    failures.push("evidenceStatus must label the fixture as local_fixture_only");
  }
  if (!fixture.network?.startsWith("kaspa-")) failures.push("network must be explicit");
  if (!fixture.covenantId) failures.push("covenantId is required");
  if (!fixture.initialState?.currentTip) failures.push("initialState.currentTip is required");
  validateWalletPreview(fixture, failures);

  const transitions = Array.isArray(fixture.transitions) ? fixture.transitions : [];
  if (transitions.length === 0) failures.push("transitions[] is required");
  const observedCaseTypes = new Set(transitions.map((transition) => transition.caseType));
  for (const caseType of requiredCaseTypes) {
    if (!observedCaseTypes.has(caseType)) failures.push(`missing ${caseType} transition`);
  }

  let currentTip = fixture.initialState?.currentTip || null;
  const spent = new Set();
  const report = {
    appType: fixture.appType,
    network: fixture.network,
    covenantId: fixture.covenantId,
    acceptedTransitions: 0,
    rejectedTransitions: 0,
    reorgRollbacks: 0,
    finalTip: currentTip,
    transitionResults: [],
  };

  for (const transition of transitions) {
    validateTransitionShape(fixture, transition, failures);
    const result = { id: transition.id, caseType: transition.caseType, status: "unchecked" };

    if (transition.caseType === "valid") {
      if (transition.consumedOutpoint !== currentTip) {
        failures.push(`${transition.id} consumed ${transition.consumedOutpoint}, expected current tip ${currentTip}`);
        result.status = "failed";
      } else if (spent.has(transition.consumedOutpoint)) {
        failures.push(`${transition.id} consumed already-spent outpoint ${transition.consumedOutpoint}`);
        result.status = "failed";
      } else {
        spent.add(transition.consumedOutpoint);
        currentTip = transition.successor.outpoint;
        report.acceptedTransitions += 1;
        result.status = "accepted";
      }
    }

    if (["invalid", "replay", "wrong_network"].includes(transition.caseType)) {
      report.rejectedTransitions += 1;
      result.status = "rejected";
    }

    if (transition.caseType === "reorg_rollback") {
      if (transition.removedOutpoint !== currentTip) {
        failures.push(`${transition.id} removed ${transition.removedOutpoint}, expected current tip ${currentTip}`);
        result.status = "failed";
      } else {
        currentTip = transition.rollbackToOutpoint;
        report.reorgRollbacks += 1;
        result.status = "rolled_back";
      }
    }

    report.transitionResults.push(result);
  }

  report.finalTip = currentTip;
  const expected = fixture.expected || {};
  for (const [field, actual] of Object.entries({
    acceptedTransitions: report.acceptedTransitions,
    rejectedTransitions: report.rejectedTransitions,
    reorgRollbacks: report.reorgRollbacks,
    finalTip: report.finalTip,
  })) {
    if (expected[field] !== undefined && expected[field] !== actual) {
      failures.push(`expected ${field} ${expected[field]}, got ${actual}`);
    }
  }

  return { report, failures };
}

function checkFixture(filePath) {
  const fixture = loadJson(filePath);
  const result = reduceAppLabFixture(fixture);
  return { filePath, fixture, ...result };
}

function main() {
  try {
    const options = parseArgs(process.argv);
    if (options.checkAll) {
      const results = fixturePaths().map(checkFixture);
      const failures = results.flatMap((result) =>
        result.failures.map((failure) => `${path.relative(repoRoot, result.filePath)}: ${failure}`),
      );
      const appTypes = [...new Set(results.map((result) => result.fixture.appType))].sort();
      for (const requiredType of requiredAppTypes) {
        if (!appTypes.includes(requiredType)) failures.push(`missing appType ${requiredType}`);
      }
      const report = {
        schemaVersion: 1,
        passed: failures.length === 0,
        fixtureCount: results.length,
        appTypes,
        failures,
      };
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
      process.exit(report.passed ? 0 : 1);
    }

    const result = checkFixture(options.fixturePath);
    const report = {
      schemaVersion: 1,
      passed: result.failures.length === 0,
      fixture: path.relative(repoRoot, result.filePath),
      result: result.report,
      failures: result.failures,
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(report.passed ? 0 : 1);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();
