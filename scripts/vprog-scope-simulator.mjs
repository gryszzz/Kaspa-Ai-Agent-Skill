#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = process.cwd();
const DEFAULT_FIXTURE = path.join(ROOT_DIR, "fixtures", "toccata", "vprog-scope-basic.json");

function readArgValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function appIdFromKey(key) {
  return String(key).split(":")[0] || "unknown";
}

function unique(items) {
  return [...new Set(items)];
}

function risk(level, code, message) {
  return { level, code, message };
}

function simulateAction(action, limits) {
  const readSet = action.readSet || [];
  const writeSet = action.writeSet || [];
  const scopeKeys = unique([...readSet, ...writeSet]);
  const dependencyApps = unique(scopeKeys.map(appIdFromKey));
  const actionsPerProof = Number(action.proofCadence?.actionsPerProof ?? 1);
  const witnessBytes = Number(action.witnessBytes ?? 0);
  const risks = [];

  if (scopeKeys.length > limits.maxScopeKeys) {
    risks.push(
      risk(
        "warning",
        "scope_explosion",
        `scope touches ${scopeKeys.length} keys, above limit ${limits.maxScopeKeys}`,
      ),
    );
  }

  if (witnessBytes > limits.maxWitnessBytes) {
    risks.push(
      risk(
        "warning",
        "witness_oversize",
        `witness uses ${witnessBytes} bytes, above limit ${limits.maxWitnessBytes}`,
      ),
    );
  }

  if (dependencyApps.length > limits.maxDependencyApps) {
    risks.push(
      risk(
        "warning",
        "dependency_fanout",
        `action depends on ${dependencyApps.length} apps, above limit ${limits.maxDependencyApps}`,
      ),
    );
  }

  if (writeSet.length > limits.maxWriteKeys) {
    risks.push(
      risk(
        "warning",
        "write_amplification",
        `write set has ${writeSet.length} keys, above limit ${limits.maxWriteKeys}`,
      ),
    );
  }

  if (actionsPerProof > limits.maxProofCadenceActions) {
    risks.push(
      risk(
        "warning",
        "proof_cadence_gap",
        `proof covers ${actionsPerProof} actions, above limit ${limits.maxProofCadenceActions}`,
      ),
    );
  }

  return {
    id: action.id,
    app: action.app,
    readSetSize: readSet.length,
    writeSetSize: writeSet.length,
    scopeKeyCount: scopeKeys.length,
    dependencyApps,
    proofCadence: action.proofCadence || { mode: "per-action", actionsPerProof: 1 },
    witnessBytes,
    risks,
  };
}

function simulate(fixture) {
  const limits = {
    maxScopeKeys: Number(fixture.limits?.maxScopeKeys ?? 12),
    maxWitnessBytes: Number(fixture.limits?.maxWitnessBytes ?? 16000),
    maxDependencyApps: Number(fixture.limits?.maxDependencyApps ?? 4),
    maxWriteKeys: Number(fixture.limits?.maxWriteKeys ?? 8),
    maxProofCadenceActions: Number(fixture.limits?.maxProofCadenceActions ?? 10),
  };
  const actions = (fixture.actions || []).map((action) => simulateAction(action, limits));
  const riskCount = actions.reduce((total, action) => total + action.risks.length, 0);

  return {
    scenario: fixture.scenario || "unnamed",
    limits,
    actions,
    summary: {
      actionCount: actions.length,
      riskCount,
      maxScopeKeys: Math.max(0, ...actions.map((action) => action.scopeKeyCount)),
      maxWitnessBytes: Math.max(0, ...actions.map((action) => action.witnessBytes)),
      maxDependencyApps: Math.max(0, ...actions.map((action) => action.dependencyApps.length)),
    },
  };
}

function assertExpected(report, expected) {
  const errors = [];
  if (!expected) {
    return errors;
  }

  for (const [field, expectedValue] of Object.entries(expected)) {
    const actualValue = report.summary[field];
    if (actualValue !== expectedValue) {
      errors.push(`expected ${field} ${expectedValue}, got ${actualValue}`);
    }
  }

  return errors;
}

async function main() {
  const fixturePath = readArgValue("--fixture") || DEFAULT_FIXTURE;
  const check = process.argv.includes("--check");
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  const report = simulate(fixture);

  if (check) {
    const errors = assertExpected(report, fixture.expected);
    if (errors.length) {
      for (const error of errors) {
        console.error(`check failed: ${error}`);
      }
      process.exitCode = 1;
      return;
    }
    console.log(
      `vProg scope simulator check passed: ${report.summary.actionCount} action(s), ${report.summary.riskCount} risk flag(s).`,
    );
    return;
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
