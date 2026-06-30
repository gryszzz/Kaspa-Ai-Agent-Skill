# Toccata Mastery Track

Status: post-activation builder training system.

Purpose: make the Kaspa Sovereign Architect excellent at Toccata work by
turning source-grounded protocol knowledge into repeatable drills, build
artifacts, and verification habits.

Use this track with the repository source ladder:

- [`../../TRAINING_SOURCES.md`](../../TRAINING_SOURCES.md)
- [`../toccata.md`](../toccata.md)
- [`../toccata-evidence-ladder.md`](../toccata-evidence-ladder.md)
- [`./toccata-upgrade-readiness.md`](./toccata-upgrade-readiness.md)
- [`../../skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md`](../../skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md)

## Current Protocol Boundary

Toccata protocol activation is verified on mainnet by the 2026-06-30T22:39:08Z
source snapshot:

```text
networkName=kaspa-mainnet
observed virtualDaaScore=474391519
activation DAA=474165565
decision=ready_to_claim_mainnet_protocol_active
```

This does not prove wallet, indexer, miner, explorer, or application
readiness. Keep those as separate audits.

## Mastery Loop

Run this loop whenever the skill is asked to become sharper, safer, or more
autonomous:

```text
Research -> Encode -> Eval -> Build -> Verify -> Record
```

- Research: start from official docs, Rusty Kaspa, KIPs, Toccata Guide, and
  live source snapshots.
- Encode: add or update the smallest doc, fixture, script, or reference that
  preserves the rule.
- Eval: add a behavioral or protocol drill case that would fail if the agent
  overclaims.
- Build: implement a small reusable artifact, not a one-off answer.
- Verify: run deterministic tests, source gates, and package smoke when the
  release surface changes.
- Record: write durable trace entries for live evidence, repeated failures, or
  release/package verification.

## Mastery Tracks

### Protocol

Know release, activation, policy, RPC, and field-shape boundaries.

Required questions:

- What source proves release status?
- What source proves mainnet protocol activation?
- Which fields changed for transaction/RPC handling?
- Which rules are node or mempool policy rather than consensus?
- What remains unknown or ecosystem-specific?

Artifacts:

- `docs/toccata.md`
- `docs/toccata-evidence-ladder.md`
- `docs/kaspa/mainnet-readiness-gate.md`
- `scripts/toccata-mainnet-readiness-gate.mjs`
- `scripts/toccata-protocol-drill.mjs`

### Covenants

Design covenant state as constrained UTXO transitions, not EVM-style global
contract state.

Required questions:

- What is the covenant genesis?
- What is the covenant ID?
- Which input authorizes the transition?
- What successor output is created?
- How does the indexer rollback and replay after a reorg?
- What invalid transition test would catch a bad builder pattern?

Artifacts:

- `docs/kaspa/covenant-lineage-indexer.md`
- `fixtures/toccata/covenant-lineage-*.json`
- `scripts/covenant-lineage-prototype.mjs`

### Indexers

Treat ordering, lineage, replay, and source identity as first-class data.

Required questions:

- What accepted transaction context is stored?
- How are duplicate events made idempotent?
- How are checkpoints and reorg reconciliation represented?
- Which fields are consensus-derived, RPC-derived, app-derived, or cached?
- How is wrong-network data prevented from mixing with mainnet?

Artifacts:

- `docs/kaspa/covenant-lineage-indexer.md`
- `docs/kaspa/sequencing-witness-api.md`
- `scripts/covenant-lineage-prototype.mjs`

### Wallets

Make covenant and proof actions visibly different from ordinary sends.

Required questions:

- Does the preview show network, consumed state, successor state, covenant ID,
  proof requirements, recipient-like outputs, fee, and change?
- Are Kasware and Kaspium paths preserved?
- Are `kaspa:` and `kaspatest:` prefixes validated?
- Are seeds, private keys, and hidden signing flows excluded?
- Is the user signing an explicit state transition rather than a vague send?

Artifacts:

- `docs/kaspa/wallet-covenant-signing-preview.md`
- `skills/public/kaspa-sovereign-architect-engine/references/transaction-plan-safety.md`
- `skills/public/kaspa-sovereign-architect-engine/scripts/lint-transaction-plan.mjs`

### ZK

Treat proof verification as a cost, dependency, payload, and witness problem.

Required questions:

- Which KIP or Rusty Kaspa code path grounds the proof claim?
- What proof type, program identity, image ID, journal or public inputs, and
  payload shape are visible to the wallet/indexer?
- What malformed, invalid, and maximum-sized proof cases are tested?
- What pricing, resource-metering, and denial-of-service assumptions are
  proven rather than guessed?

Artifacts:

- `docs/kaspa/zk-proof-cost-matrix.md`
- `docs/toccata.md`

### Sequencing

Model lanes, witnesses, accepted transaction context, and pruning risk before
claiming app-level ordering guarantees.

Required questions:

- What lane does the activity belong to?
- Which accepted transaction context produced the lane state?
- Is witness availability available, partial, delayed, missing, unverified, or
  pruned?
- Does the API expose stale, reorged, or pruned state honestly?

Artifacts:

- `docs/kaspa/sequencing-witness-api.md`
- `docs/kaspa/vprog-scope-simulator.md`
- `scripts/vprog-scope-simulator.mjs`

### Operations

Keep source, endpoint, release, and package checks reproducible.

Required questions:

- Which release tag and audit date are being cited?
- What did the endpoint return for `networkName`?
- Is the current DAA above the activation DAA?
- Did the package smoke include docs, snapshots, scripts, and tests?
- What status remains explicitly unknown?

Artifacts:

- `scripts/toccata-source-monitor.mjs`
- `scripts/toccata-network-check.mjs`
- `scripts/validate-skill-release.mjs`
- `AGENT_TRACE.md`

### Applications

Classify the app before choosing the protocol surface.

Required questions:

- Is this a covenant app, inline ZK app, Based App, vProg-shaped app, or a
  watch-only/indexer app?
- What state lives on-chain versus off-chain?
- What witness, proof, indexing, wallet, and fallback paths are required?
- What claims must stay out of the UI until proven?

Artifacts:

- `docs/kaspa/vprog-scope-simulator.md`
- `scripts/vprog-scope-simulator.mjs`
- `training-corpus/kaspa-toccata-readiness-drills-2026.md`

## Required Answer Shape

For protocol-sensitive work, answer in this shape before recommending code:

```text
Claim:
Source:
Protocol status:
Readiness boundary:
Verification command:
What I will not claim:
```

Example:

```text
Claim: Toccata protocol activation is verified on mainnet.
Source: docs/toccata-evidence-ladder.md and research-snapshots/toccata/latest.json.
Protocol status: mainnet protocol-active by kaspa-mainnet DAA evidence.
Readiness boundary: wallet, indexer, miner, explorer, and app readiness remain separate.
Verification command: node scripts/toccata-mainnet-readiness-gate.mjs --check
What I will not claim: that every wallet, indexer, explorer, miner, or app is ready.
```

## Drill Commands

Run the human-readable knowledge drill:

```bash
node scripts/kaspa-knowledge-drill.mjs
```

Run the machine-checkable protocol drill:

```bash
node scripts/toccata-protocol-drill.mjs --check
```

Run the protocol drill tests:

```bash
node --test scripts/toccata-protocol-drill.test.mjs
```

## Promotion Rule

A Toccata idea becomes a reusable builder pattern only when it has all of
these:

- source citation from the evidence ladder
- explicit network and activation status
- wallet/indexer/readiness boundary
- fixture or drill case
- deterministic verification command
- trace or docs update when live evidence or release/package state changes

