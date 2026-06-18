# Transaction Plan Safety

Use this reference when reviewing payment builders, wallet flows, transaction
plans, signing UX, fee handling, or any prompt that asks whether a Kaspa
transaction is safe to build, sign, or broadcast.

## Reviewable Plan Shape

Prefer explicit JSON plans before code or signing:

```json
{
  "network": "testnet",
  "purpose": "pay one recipient and return change",
  "inputs": [
    { "txid": "hex", "index": 0, "sompi": 200000000 }
  ],
  "outputs": [
    { "address": "kaspatest:...", "sompi": 150000000, "label": "recipient" },
    { "address": "kaspatest:...", "sompi": 49000000, "label": "change" }
  ],
  "feeSompi": 1000000,
  "broadcast": false,
  "acknowledgements": ["unsigned testnet plan"]
}
```

Accept either `feeSompi` or `fee_sompi`. If both are present and disagree,
reject the plan.

## Non-Negotiable Checks

- Reject seed phrases, private keys, xprv values, recovery words, wallet files,
  raw signatures, and signed transaction blobs in prompts, fixtures, or plans.
- Require an explicit network and purpose.
- Require explicit inputs, outputs, amount units, and fee in sompi.
- Require explicit change output when known inputs exceed outputs plus fee.
- Require address prefixes to match network intent:
  - mainnet: `kaspa:`
  - testnet/TN networks: `kaspatest:`
- Keep `broadcast` false for skill-reviewed plans.
- Treat mainnet as high risk and require explicit acknowledgements before
  calling a plan ready for human wallet review.
- Do not call a transaction plan safe just because it lints. Linting is the
  structural gate before deeper SDK, node, wallet, and policy validation.

## Linter

Run:

```bash
node scripts/lint-transaction-plan.mjs path/to/plan.json
node scripts/lint-transaction-plan.mjs --check
```

The linter checks structure, secrets, network/address mismatch, fee fields,
value accounting, change output presence, mainnet acknowledgements, and the
no-broadcast default.

## Answering Pattern

When auditing a plan, report:

1. verdict and risk level
2. linter result
3. value conservation check
4. network/address check
5. signing and broadcast boundary
6. missing SDK/node/wallet verification
7. exact next testnet command or fixture to run
