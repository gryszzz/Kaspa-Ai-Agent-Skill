#!/usr/bin/env node

import crypto from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const defaultFixturePath = path.join(
  repoRoot,
  "fixtures",
  "toccata",
  "live-covenant-indexer-mainnet-latest.json",
);
const defaultMarkdownPath = path.join(
  repoRoot,
  "research-snapshots",
  "toccata",
  "live-covenant-indexer-mainnet-latest.md",
);
const defaultEndpoint = "https://api.kaspa.org";
const activationDaa = 474165565;
const publicRestFields = [
  "transaction_id",
  "hash",
  "version",
  "is_accepted",
  "accepting_block_hash",
  "accepting_block_blue_score",
  "accepting_block_time",
  "inputs",
  "outputs",
].join(",");

function parseArgs(argv) {
  const options = {
    endpoint: defaultEndpoint,
    fixturePath: defaultFixturePath,
    markdownPath: defaultMarkdownPath,
    windows: 1000,
    windowSize: 100,
    write: false,
    check: false,
    txid: null,
  };
  for (let index = 2; index < argv.length; index += 1) {
    switch (argv[index]) {
      case "--check":
        options.check = true;
        break;
      case "--write":
        options.write = true;
        break;
      case "--endpoint":
        options.endpoint = argv[index + 1].replace(/\/$/, "");
        index += 1;
        break;
      case "--fixture":
        options.fixturePath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      case "--markdown":
        options.markdownPath = path.resolve(argv[index + 1]);
        index += 1;
        break;
      case "--windows":
        options.windows = Number.parseInt(argv[index + 1], 10);
        index += 1;
        break;
      case "--window-size":
        options.windowSize = Number.parseInt(argv[index + 1], 10);
        index += 1;
        break;
      case "--txid":
        options.txid = argv[index + 1];
        index += 1;
        break;
      default:
        throw new Error(`unknown option: ${argv[index]}`);
    }
  }
  if (!Number.isInteger(options.windows) || options.windows <= 0) {
    throw new Error("--windows must be a positive integer");
  }
  if (!Number.isInteger(options.windowSize) || options.windowSize <= 0 || options.windowSize > 100) {
    throw new Error("--window-size must be between 1 and 100");
  }
  return options;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function byteLengthFromHex(value) {
  return typeof value === "string" ? Math.ceil(value.length / 2) : 0;
}

function numericOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

async function fetchText(url, init) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "kaspa-toccata-live-covenant-export",
      ...(init?.headers || {}),
    },
  });
  const text = await response.text();
  return { response, text };
}

async function fetchJson(url, init) {
  const { response, text } = await fetchText(url, init);
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}: ${text.slice(0, 300)}`);
  }
  return { body, text, status: response.status, url };
}

function hasCovenantFields(tx) {
  const inputs = Array.isArray(tx.inputs) ? tx.inputs : [];
  const outputs = Array.isArray(tx.outputs) ? tx.outputs : [];
  return (
    inputs.some((input) => input.covenant_id) ||
    outputs.some(
      (output) =>
        output.covenant_id ||
        (output.covenant_authorizing_input !== null && output.covenant_authorizing_input !== undefined),
    )
  );
}

function hasLineageCovenantFields(tx) {
  const inputs = Array.isArray(tx.inputs) ? tx.inputs : [];
  const outputs = Array.isArray(tx.outputs) ? tx.outputs : [];
  return (
    inputs.some((input) => input.covenant_id) &&
    outputs.some(
      (output) =>
        output.covenant_id &&
        output.covenant_authorizing_input !== null &&
        output.covenant_authorizing_input !== undefined,
    )
  );
}

function normalizeInput(input) {
  const signatureScript = input.signature_script || "";
  return {
    index: numericOrNull(input.index),
    previous_outpoint_hash: input.previous_outpoint_hash || null,
    previous_outpoint_index: numericOrNull(input.previous_outpoint_index),
    compute_budget: numericOrNull(input.compute_budget),
    covenant_id: input.covenant_id || null,
    signature_script_bytes: byteLengthFromHex(signatureScript),
    signature_script_sha256: signatureScript ? sha256(signatureScript) : null,
    signature_script_prefix: signatureScript ? signatureScript.slice(0, 32) : null,
    signature_script_suffix: signatureScript ? signatureScript.slice(-32) : null,
  };
}

function normalizeOutput(output) {
  const scriptPublicKey = output.script_public_key || "";
  return {
    index: numericOrNull(output.index),
    amount: numericOrNull(output.amount),
    script_public_key_type: output.script_public_key_type || null,
    script_public_key_address: output.script_public_key_address || null,
    script_public_key_bytes: byteLengthFromHex(scriptPublicKey),
    script_public_key_sha256: scriptPublicKey ? sha256(scriptPublicKey) : null,
    script_public_key_prefix: scriptPublicKey ? scriptPublicKey.slice(0, 32) : null,
    covenant_authorizing_input: numericOrNull(output.covenant_authorizing_input),
    covenant_id: output.covenant_id || null,
  };
}

function normalizeTx(tx, rawTxText) {
  const inputs = (Array.isArray(tx.inputs) ? tx.inputs : []).map(normalizeInput);
  const outputs = (Array.isArray(tx.outputs) ? tx.outputs : []).map(normalizeOutput);
  const covenantIds = [
    ...inputs.map((input) => input.covenant_id).filter(Boolean),
    ...outputs.map((output) => output.covenant_id).filter(Boolean),
  ];
  const authorizingInputs = outputs
    .map((output) => output.covenant_authorizing_input)
    .filter((value) => value !== null && value !== undefined);
  const computeBudgets = inputs
    .map((input) => input.compute_budget)
    .filter((value) => value !== null && value !== undefined);
  return {
    transaction_id: tx.transaction_id,
    hash: tx.hash || null,
    subnetwork_id: tx.subnetwork_id || null,
    mass: numericOrNull(tx.mass),
    payload: tx.payload || null,
    block_hash: Array.isArray(tx.block_hash) ? tx.block_hash : [],
    block_time: numericOrNull(tx.block_time),
    version: numericOrNull(tx.version),
    is_accepted: tx.is_accepted === true,
    accepting_block_hash: tx.accepting_block_hash || null,
    accepting_block_blue_score: numericOrNull(tx.accepting_block_blue_score),
    accepting_block_time: numericOrNull(tx.accepting_block_time),
    raw_response_sha256: sha256(rawTxText),
    toccata_fields: {
      covenant_ids: [...new Set(covenantIds)],
      covenant_authorizing_inputs: [...new Set(authorizingInputs)],
      compute_budgets: [...new Set(computeBudgets)],
    },
    inputs,
    outputs,
  };
}

async function fetchCurrentNetwork(endpoint) {
  const blockdag = await fetchJson(`${endpoint}/info/blockdag`);
  const blueScore = await fetchJson(`${endpoint}/info/virtual-chain-blue-score`);
  return {
    networkName: blockdag.body.networkName,
    virtualDaaScore: numericOrNull(blockdag.body.virtualDaaScore),
    blueScore: numericOrNull(blueScore.body.blueScore),
    tipHashes: Array.isArray(blockdag.body.tipHashes) ? blockdag.body.tipHashes.slice(0, 3) : [],
  };
}

async function fetchTransactionById(endpoint, transactionId) {
  const exact = await fetchJson(`${endpoint}/transactions/${transactionId}`);
  if (!exact.body?.transaction_id) {
    throw new Error(`transaction lookup did not return transaction_id for ${transactionId}`);
  }
  return { tx: exact.body, rawText: exact.text, url: exact.url };
}

async function scanForCovenantTransaction(endpoint, startBlueScore, windows, windowSize) {
  const searchUrl = `${endpoint}/transactions/search?fields=${encodeURIComponent(
    publicRestFields,
  )}&resolve_previous_outpoints=no`;
  let scannedWindows = 0;
  let scannedTransactions = 0;
  let computeBudgetTransactions = 0;
  const errors = [];

  for (let index = 0; index < windows; index += 1) {
    const lt = startBlueScore - index * windowSize;
    const gte = lt - windowSize;
    let search;
    try {
      search = await fetchJson(searchUrl, {
        method: "POST",
        body: JSON.stringify({ acceptingBlueScores: { gte, lt } }),
      });
    } catch (error) {
      errors.push({ gte, lt, error: error.message });
      continue;
    }
    const txs = Array.isArray(search.body) ? search.body : [];
    scannedWindows += 1;
    scannedTransactions += txs.length;
    computeBudgetTransactions += txs.filter((tx) =>
      (Array.isArray(tx.inputs) ? tx.inputs : []).some((input) => numericOrNull(input.compute_budget) > 0),
    ).length;
    const found = txs.find(hasLineageCovenantFields);
    if (found) {
      return {
        found,
        searchUrl,
        searchWindow: { gte, lt },
        searchedFromBlueScore: startBlueScore,
        scannedWindows,
        scannedTransactions,
        computeBudgetTransactions,
        errors,
      };
    }
  }
  return {
    found: null,
    searchUrl,
    searchWindow: { gte: startBlueScore - windows * windowSize, lt: startBlueScore },
    searchedFromBlueScore: startBlueScore,
    scannedWindows,
    scannedTransactions,
    computeBudgetTransactions,
    errors,
  };
}

function buildLineages(transaction) {
  const outputsByIndex = new Map(transaction.outputs.map((output) => [output.index, output]));
  return transaction.inputs
    .filter((input) => input.covenant_id)
    .map((input) => {
      const successor = transaction.outputs.find((output) => output.covenant_id === input.covenant_id) || null;
      const authorizingInputIndex = successor ? successor.covenant_authorizing_input : null;
      return {
        covenant_id: input.covenant_id,
        network: "kaspa-mainnet",
        consumed_outpoint: {
          transaction_id: input.previous_outpoint_hash,
          index: input.previous_outpoint_index,
        },
        spending_transaction_id: transaction.transaction_id,
        successor_output: successor
          ? {
              transaction_id: transaction.transaction_id,
              index: successor.index,
              script_public_key_type: successor.script_public_key_type,
              amount: successor.amount,
            }
          : null,
        authorizing_input_index: authorizingInputIndex,
        authorizing_input_matches_consumed_covenant:
          authorizingInputIndex !== null ? outputsByIndex.has(authorizingInputIndex) || authorizingInputIndex === input.index : null,
        accepting_block_hash: transaction.accepting_block_hash,
        accepting_block_blue_score: transaction.accepting_block_blue_score,
        transition_status: "observed_from_public_indexer_export",
        semantic_validity: "not_inferred_from_indexer_export",
      };
    });
}

function buildFixture({ network, scan, exact, options }) {
  const normalized = normalizeTx(exact.tx, exact.rawText);
  const fixture = {
    schemaVersion: 1,
    fixtureType: "live_covenant_indexer_capture",
    capturedAt: new Date().toISOString(),
    networkName: network.networkName,
    source: {
      kind: "public_rest_indexer_export",
      url: exact.url,
      searchUrl: scan?.searchUrl || null,
      openApiUrl: `${options.endpoint}/openapi.json`,
      implementation: "https://github.com/kaspa-ng/kaspa-rest-server",
      operator: "Kaspa public REST API",
    },
    activationEvidence: {
      requiredNetworkName: "kaspa-mainnet",
      activationDaa,
      observedDaa: network.virtualDaaScore,
      observedBlueScore: network.blueScore,
      tipHashes: network.tipHashes,
    },
    acquisition: scan
      ? {
          searchedFromBlueScore: scan.searchedFromBlueScore,
          searchWindow: scan.searchWindow,
          scannedWindows: scan.scannedWindows,
          scannedTransactions: scan.scannedTransactions,
          computeBudgetTransactions: scan.computeBudgetTransactions,
          errors: scan.errors,
        }
      : {
          txid: normalized.transaction_id,
          scannedWindows: 0,
          scannedTransactions: 1,
        },
    acceptedTransactions: [normalized],
    covenantLineages: buildLineages(normalized),
    readinessBoundary:
      "This is a real public mainnet transaction/indexer export with Toccata covenant fields. It proves field visibility for this source and transaction only; it is not wallet, explorer, miner, or ecosystem-wide readiness approval.",
  };
  fixture.factsHash = sha256(JSON.stringify(fixture.acceptedTransactions));
  return fixture;
}

function validateFixture(fixture) {
  const failures = [];
  if (fixture.schemaVersion !== 1) failures.push("schemaVersion must be 1");
  if (fixture.fixtureType !== "live_covenant_indexer_capture") {
    failures.push("fixtureType must be live_covenant_indexer_capture");
  }
  if (!fixture.capturedAt) failures.push("capturedAt is required");
  if (fixture.networkName !== "kaspa-mainnet") failures.push("networkName must be kaspa-mainnet");
  if (!fixture.source?.url) failures.push("source.url is required");
  if (fixture.activationEvidence?.observedDaa < activationDaa) {
    failures.push("observedDaa must be at or above Toccata activation DAA");
  }
  const transactions = Array.isArray(fixture.acceptedTransactions) ? fixture.acceptedTransactions : [];
  if (transactions.length === 0) failures.push("acceptedTransactions[] must not be empty");
  for (const [index, tx] of transactions.entries()) {
    if (!tx.transaction_id || !/^[0-9a-f]{64}$/i.test(tx.transaction_id)) {
      failures.push(`acceptedTransactions[${index}].transaction_id must be a 64-char hex id`);
    }
    if (tx.version !== 1) failures.push(`acceptedTransactions[${index}].version must be 1`);
    if (tx.is_accepted !== true) failures.push(`acceptedTransactions[${index}].is_accepted must be true`);
    if (!tx.accepting_block_hash || !tx.accepting_block_blue_score) {
      failures.push(`acceptedTransactions[${index}] missing accepted block context`);
    }
    if (!tx.toccata_fields?.covenant_ids?.length) {
      failures.push(`acceptedTransactions[${index}] must include at least one covenant_id`);
    }
    if (!tx.toccata_fields?.compute_budgets?.some((value) => Number(value) > 0)) {
      failures.push(`acceptedTransactions[${index}] must include a positive compute_budget`);
    }
    if (!tx.toccata_fields?.covenant_authorizing_inputs?.some((value) => Number.isInteger(value))) {
      failures.push(`acceptedTransactions[${index}] must include covenant_authorizing_input`);
    }
  }
  if (!Array.isArray(fixture.covenantLineages) || fixture.covenantLineages.length === 0) {
    failures.push("covenantLineages[] must contain at least one observed lineage edge");
  }
  if (!/not wallet.+readiness approval/i.test(fixture.readinessBoundary || "")) {
    failures.push("readinessBoundary must avoid ecosystem readiness overclaiming");
  }
  return failures;
}

function renderMarkdown(fixture) {
  const tx = fixture.acceptedTransactions[0];
  const covenantIds = tx.toccata_fields.covenant_ids.join(", ");
  return `# Live Covenant Indexer Export

Captured: ${fixture.capturedAt}

Network: \`${fixture.networkName}\`

Source: ${fixture.source.url}

OpenAPI: ${fixture.source.openApiUrl}

Implementation: ${fixture.source.implementation}

Activation evidence:

- required network: \`${fixture.activationEvidence.requiredNetworkName}\`
- activation DAA: \`${fixture.activationEvidence.activationDaa}\`
- observed DAA: \`${fixture.activationEvidence.observedDaa}\`
- observed blue score: \`${fixture.activationEvidence.observedBlueScore}\`

Accepted transaction:

- transaction ID: \`${tx.transaction_id}\`
- hash: \`${tx.hash}\`
- version: \`${tx.version}\`
- accepted: \`${tx.is_accepted}\`
- accepting block: \`${tx.accepting_block_hash}\`
- accepting blue score: \`${tx.accepting_block_blue_score}\`
- covenant ID(s): \`${covenantIds}\`
- compute budget(s): \`${tx.toccata_fields.compute_budgets.join(", ")}\`
- covenant authorizing input(s): \`${tx.toccata_fields.covenant_authorizing_inputs.join(", ")}\`
- normalized transaction facts hash: \`${fixture.factsHash}\`
- raw transaction response hash: \`${tx.raw_response_sha256}\`

Boundary:

${fixture.readinessBoundary}

Verify:

\`\`\`bash
node scripts/toccata-live-covenant-export.mjs --check
node scripts/toccata-live-fixture-check.mjs --fixture fixtures/toccata/live-covenant-indexer-mainnet-latest.json
\`\`\`
`;
}

async function buildCapture(options) {
  const network = await fetchCurrentNetwork(options.endpoint);
  let scan = null;
  let transactionId = options.txid;
  if (!transactionId) {
    scan = await scanForCovenantTransaction(options.endpoint, network.blueScore, options.windows, options.windowSize);
    if (!scan.found) {
      return {
        found: false,
        network,
        scan,
        fixture: null,
      };
    }
    transactionId = scan.found.transaction_id;
  }
  const exact = await fetchTransactionById(options.endpoint, transactionId);
  if (!hasCovenantFields(exact.tx)) {
    throw new Error(`transaction ${transactionId} does not contain covenant fields`);
  }
  const fixture = buildFixture({ network, scan, exact, options });
  const failures = validateFixture(fixture);
  return {
    found: true,
    network,
    scan,
    fixture,
    validationFailures: failures,
  };
}

async function main() {
  try {
    const options = parseArgs(process.argv);
    if (options.check && !options.write) {
      const fixture = JSON.parse(readFileSync(options.fixturePath, "utf8"));
      const failures = validateFixture(fixture);
      process.stdout.write(
        `${JSON.stringify(
          {
            schemaVersion: 1,
            passed: failures.length === 0,
            fixturePath: path.relative(repoRoot, options.fixturePath),
            transactionId: fixture.acceptedTransactions?.[0]?.transaction_id || null,
            covenantIds: fixture.acceptedTransactions?.[0]?.toccata_fields?.covenant_ids || [],
            failures,
          },
          null,
          2,
        )}\n`,
      );
      process.exit(failures.length === 0 ? 0 : 1);
    }

    const result = await buildCapture(options);
    if (options.write && result.fixture) {
      mkdirSync(path.dirname(options.fixturePath), { recursive: true });
      mkdirSync(path.dirname(options.markdownPath), { recursive: true });
      writeFileSync(options.fixturePath, `${JSON.stringify(result.fixture, null, 2)}\n`);
      writeFileSync(options.markdownPath, renderMarkdown(result.fixture));
    }
    process.stdout.write(
      `${JSON.stringify(
        {
          schemaVersion: 1,
          found: result.found,
          networkName: result.network.networkName,
          observedDaa: result.network.virtualDaaScore,
          scan: result.scan
            ? {
                searchedFromBlueScore: result.scan.searchedFromBlueScore,
                searchWindow: result.scan.searchWindow,
                scannedWindows: result.scan.scannedWindows,
                scannedTransactions: result.scan.scannedTransactions,
                computeBudgetTransactions: result.scan.computeBudgetTransactions,
                errors: result.scan.errors,
              }
            : null,
          transactionId: result.fixture?.acceptedTransactions?.[0]?.transaction_id || null,
          covenantIds: result.fixture?.acceptedTransactions?.[0]?.toccata_fields?.covenant_ids || [],
          validationFailures: result.validationFailures || [],
        },
        null,
        2,
      )}\n`,
    );
    process.exit(result.validationFailures?.length ? 1 : 0);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(2);
  }
}

main();
