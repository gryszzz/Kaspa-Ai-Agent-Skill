#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = process.cwd();
const DEFAULT_FIXTURE = path.join(ROOT_DIR, "fixtures", "toccata", "covenant-lineage-basic.json");

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
        spentBy: null,
      });
    }
  }

  return {
    network,
    lineages: [...lineages.values()],
    transitions,
    outputs: [...outputs.values()],
    issues,
  };
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

  return errors;
}

async function main() {
  const fixturePath = readArgValue("--fixture") || DEFAULT_FIXTURE;
  const check = process.argv.includes("--check");
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  const report = reduceFixture(fixture);

  if (check) {
    const errors = assertExpected(report, fixture.expected);
    const hardIssues = report.issues.filter((issue) => issue.level === "error");
    if (errors.length || hardIssues.length) {
      for (const error of errors) {
        console.error(`check failed: ${error}`);
      }
      for (const issue of hardIssues) {
        console.error(`issue: ${issue.message}`);
      }
      process.exitCode = 1;
      return;
    }
    console.log(
      `Covenant lineage prototype check passed: ${report.lineages.length} lineage(s), ${report.transitions.length} transition(s).`,
    );
    return;
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
