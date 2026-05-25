#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = process.cwd();
const DEFAULT_FIXTURE = path.join(ROOT_DIR, "fixtures", "toccata", "covenant-lineage-basic.json");
const FIXTURE_DIR = path.join(ROOT_DIR, "fixtures", "toccata");

function readArgValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function outpointKey(outpoint) {
  return `${outpoint.txId}:${outpoint.index}`;
}

function outputKey(txId, index) {
  return `${txId}:${index}`;
}

function sortByDaa(transactions) {
  return [...transactions].sort((left, right) => {
    const leftScore = Number(left.accepted?.daaScore ?? 0);
    const rightScore = Number(right.accepted?.daaScore ?? 0);
    return leftScore - rightScore;
  });
}

function reduceFixture(fixture) {
  const network = fixture.network || "unknown";
  const outputs = new Map();
  const lineages = new Map();
  const transitions = [];
  const reorgEvents = [];
  const issues = [];

  for (const tx of sortByDaa(fixture.transactions || [])) {
    const txNetwork = tx.network || network;
    if (txNetwork !== network) {
      issues.push({
        level: "error",
        txId: tx.txId,
        message: `transaction network ${txNetwork} does not match fixture network ${network}`,
      });
      continue;
    }

    for (const output of tx.outputs || []) {
      if (!output.covenantId) {
        continue;
      }

      const key = outputKey(tx.txId, output.index);
      const authorizingInput = tx.inputs?.[output.authorizingInputIndex];
      if (!authorizingInput?.previousOutpoint) {
        issues.push({
          level: "error",
          txId: tx.txId,
          outputIndex: output.index,
          covenantId: output.covenantId,
          message: "covenant output is missing a valid authorizing input",
        });
        continue;
      }

      const consumedKey = outpointKey(authorizingInput.previousOutpoint);
      const consumedOutput = outputs.get(consumedKey);
      const isContinuation = consumedOutput?.covenantId === output.covenantId;
      const genesisOutpoint = isContinuation ? consumedOutput.genesisOutpoint : key;

      if (!isContinuation && lineages.has(output.covenantId)) {
        issues.push({
          level: "warning",
          txId: tx.txId,
          outputIndex: output.index,
          covenantId: output.covenantId,
          message: "new genesis-like output for an existing covenant ID",
        });
      }

      if (isContinuation && consumedOutput.spentBy) {
        issues.push({
          level: "error",
          txId: tx.txId,
          outputIndex: output.index,
          covenantId: output.covenantId,
          message: `consumed covenant output ${consumedKey} is already spent by ${consumedOutput.spentBy}`,
        });
        continue;
      }

      const lineage =
        lineages.get(output.covenantId) ||
        {
          covenantId: output.covenantId,
          network,
          genesisOutpoint,
          firstSeenDaaScore: tx.accepted?.daaScore ?? null,
          lastSeenDaaScore: tx.accepted?.daaScore ?? null,
          currentTip: key,
          status: "active",
        };

      lineage.lastSeenDaaScore = tx.accepted?.daaScore ?? lineage.lastSeenDaaScore;
      lineage.currentTip = key;
      lineages.set(output.covenantId, lineage);

      if (isContinuation) {
        consumedOutput.spentBy = key;
        transitions.push({
          covenantId: output.covenantId,
          spendingTxId: tx.txId,
          consumedOutpoint: consumedKey,
          successorOutpoint: key,
          authorizingInputIndex: output.authorizingInputIndex,
          acceptingBlockHash: tx.accepted?.blockHash ?? null,
          acceptingDaaScore: tx.accepted?.daaScore ?? null,
          transitionStatus: "accepted",
        });
      }

      outputs.set(key, {
        outpoint: key,
        txId: tx.txId,
        outputIndex: output.index,
        network,
        valueSompi: output.valueSompi ?? null,
        scriptPublicKeyHash: output.scriptPublicKeyHash ?? null,
        covenantBindingHash: output.covenantBindingHash ?? null,
        covenantId: output.covenantId,
        authorizingInputIndex: output.authorizingInputIndex,
        authorizingPreviousOutpoint: consumedKey,
        genesisOutpoint,
        acceptingBlockHash: tx.accepted?.blockHash ?? null,
        acceptingDaaScore: tx.accepted?.daaScore ?? null,
        status: "active",
        spentBy: null,
      });
    }
  }

  for (const reorg of fixture.reorgs || []) {
    const removedOutpoints = reorg.removedOutpoints || [];
    reorgEvents.push({
      id: reorg.id || null,
      removedOutpoints,
      rollbackToOutpoint: reorg.rollbackToOutpoint || null,
      acceptingBlockHash: reorg.accepted?.blockHash ?? null,
      acceptingDaaScore: reorg.accepted?.daaScore ?? null,
    });

    for (const outpoint of removedOutpoints) {
      const output = outputs.get(outpoint);
      if (!output) {
        issues.push({
          level: "warning",
          outpoint,
          message: "reorg removed an outpoint that is not present in the fixture output set",
        });
        continue;
      }

      output.status = "reorged";
      output.reorgId = reorg.id || null;

      for (const transition of transitions) {
        if (transition.successorOutpoint === outpoint) {
          transition.transitionStatus = "reorged";
        }
      }

      const lineage = lineages.get(output.covenantId);
      if (!lineage || lineage.currentTip !== outpoint) {
        continue;
      }

      const rollbackToOutpoint = reorg.rollbackToOutpoint || output.authorizingPreviousOutpoint;
      const rollbackOutput = outputs.get(rollbackToOutpoint);
      if (!rollbackOutput) {
        lineage.status = "reorged_tip_unresolved";
        issues.push({
          level: "error",
          covenantId: output.covenantId,
          outpoint,
          message: `reorg could not resolve rollback outpoint ${rollbackToOutpoint || "unknown"}`,
        });
        continue;
      }

      if (rollbackOutput.spentBy === outpoint) {
        rollbackOutput.spentBy = null;
      }
      lineage.currentTip = rollbackToOutpoint;
      lineage.status = "active_after_reorg";
      lineage.lastSeenDaaScore = reorg.accepted?.daaScore ?? lineage.lastSeenDaaScore;
    }
  }

  return {
    network,
    lineages: [...lineages.values()],
    transitions,
    reorgEvents,
    outputs: [...outputs.values()],
    issues,
  };
}

function countIssues(report, level) {
  return report.issues.filter((issue) => issue.level === level).length;
}

function assertExpected(report, expected) {
  const errors = [];
  if (!expected) {
    return errors;
  }

  if (expected.lineageCount !== undefined && report.lineages.length !== expected.lineageCount) {
    errors.push(`expected ${expected.lineageCount} lineages, got ${report.lineages.length}`);
  }

  if (expected.transitionCount !== undefined && report.transitions.length !== expected.transitionCount) {
    errors.push(`expected ${expected.transitionCount} transitions, got ${report.transitions.length}`);
  }

  if (expected.reorgCount !== undefined && report.reorgEvents.length !== expected.reorgCount) {
    errors.push(`expected ${expected.reorgCount} reorg events, got ${report.reorgEvents.length}`);
  }

  if (expected.hardIssueCount !== undefined && countIssues(report, "error") !== expected.hardIssueCount) {
    errors.push(`expected ${expected.hardIssueCount} hard issues, got ${countIssues(report, "error")}`);
  }

  if (expected.warningIssueCount !== undefined && countIssues(report, "warning") !== expected.warningIssueCount) {
    errors.push(`expected ${expected.warningIssueCount} warnings, got ${countIssues(report, "warning")}`);
  }

  for (const [covenantId, expectedTip] of Object.entries(expected.currentTips || {})) {
    const lineage = report.lineages.find((entry) => entry.covenantId === covenantId);
    if (!lineage) {
      errors.push(`missing lineage ${covenantId}`);
      continue;
    }
    if (lineage.currentTip !== expectedTip) {
      errors.push(`expected ${covenantId} tip ${expectedTip}, got ${lineage.currentTip}`);
    }
  }

  for (const [outpoint, expectedStatus] of Object.entries(expected.outputStatuses || {})) {
    const output = report.outputs.find((entry) => entry.outpoint === outpoint);
    if (!output) {
      errors.push(`missing output ${outpoint}`);
      continue;
    }
    if (output.status !== expectedStatus) {
      errors.push(`expected output ${outpoint} status ${expectedStatus}, got ${output.status}`);
    }
  }

  for (const [outpoint, expectedStatus] of Object.entries(expected.transitionStatuses || {})) {
    const transition = report.transitions.find((entry) => entry.successorOutpoint === outpoint);
    if (!transition) {
      errors.push(`missing transition to ${outpoint}`);
      continue;
    }
    if (transition.transitionStatus !== expectedStatus) {
      errors.push(`expected transition to ${outpoint} status ${expectedStatus}, got ${transition.transitionStatus}`);
    }
  }

  return errors;
}

async function checkFixture(fixturePath) {
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  const report = reduceFixture(fixture);
  const errors = assertExpected(report, fixture.expected);
  const hardIssues = report.issues.filter((issue) => issue.level === "error");
  const expectedHardIssues = fixture.expected?.hardIssueCount;

  if (expectedHardIssues === undefined && hardIssues.length) {
    for (const issue of hardIssues) {
      errors.push(issue.message);
    }
  }

  return { fixture, report, errors };
}

async function covenantFixturePaths() {
  const entries = await readdir(FIXTURE_DIR);
  return entries
    .filter((entry) => /^covenant-lineage-.+\.json$/.test(entry))
    .sort()
    .map((entry) => path.join(FIXTURE_DIR, entry));
}

async function main() {
  const fixturePath = readArgValue("--fixture") || DEFAULT_FIXTURE;
  const check = process.argv.includes("--check");
  const checkAll = process.argv.includes("--check-all");

  if (checkAll) {
    const fixturePaths = await covenantFixturePaths();
    const failures = [];
    for (const currentFixturePath of fixturePaths) {
      const { report, errors } = await checkFixture(currentFixturePath);
      if (errors.length) {
        failures.push({ fixturePath: currentFixturePath, errors });
        continue;
      }
      console.log(
        `ok ${path.relative(ROOT_DIR, currentFixturePath)}: ${report.lineages.length} lineage(s), ${report.transitions.length} transition(s), ${report.reorgEvents.length} reorg event(s).`,
      );
    }

    if (failures.length) {
      for (const failure of failures) {
        for (const error of failure.errors) {
          console.error(`${path.relative(ROOT_DIR, failure.fixturePath)}: ${error}`);
        }
      }
      process.exitCode = 1;
    }
    return;
  }

  const { fixture, report, errors } = await checkFixture(fixturePath);

  if (check) {
    if (errors.length) {
      for (const error of errors) {
        console.error(`check failed: ${error}`);
      }
      process.exitCode = 1;
      return;
    }
    console.log(
      `Covenant lineage prototype check passed: ${report.lineages.length} lineage(s), ${report.transitions.length} transition(s), ${report.reorgEvents.length} reorg event(s).`,
    );
    return;
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
