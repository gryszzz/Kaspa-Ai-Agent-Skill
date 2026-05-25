# Toccata R&D Playbook

Use this playbook when analyzing Toccata, covenants, SilverScript, ZK opcodes, sequencing commitments, Based Apps, or vProgs.

## Goal

Build an evidence-first Toccata research loop that is faster and sharper than surface-level ecosystem commentary.

Do not claim superiority over upstream developers. The practical edge is:

- verifying earlier from primary code and PRs
- separating feature branches from `master`
- testing on TN10 and TN12
- converting source evidence into wallet, indexer, and app build plans
- keeping explicit unknowns instead of repeating hype

## Evidence Ladder

1. Stable release notes and tags
2. `rusty-kaspa` `master`, `toccata`, `tn10`, and `tn12` branch heads
3. Rusty Kaspa PRs, with `baseRefName` recorded
4. KIP files merged to `kaspanet/kips` `master`
5. KIP PRs, with document status recorded
6. Official Kaspa docs and docs source files
7. Kaspa Research posts
8. SilverScript and vProgs repositories
9. Live TN10/TN12 REST checks
10. Community commentary, videos, posts, and summaries

Rules:

- Code beats docs when docs are stale.
- A PR merged into a feature branch is not a `master` merge.
- A KIP PR is not a final KIP until merged into `kaspanet/kips` `master`.
- A testnet activation is not mainnet activation.
- A working compiler or example is not production readiness.

## Required Snapshot Fields

Every serious Toccata report must record:

- audit date in UTC
- `rusty-kaspa` `master` hash
- `rusty-kaspa` `toccata` hash
- `rusty-kaspa` `tn10` and `tn12` hashes when relevant
- latest stable `rusty-kaspa` release tag
- Toccata release or pre-release tags
- state of Rusty Kaspa PR #1000
- state of Rusty Kaspa PR #1013
- KIP-16, KIP-17, KIP-20, KIP-21 PR states and document statuses
- TN10 and TN12 live DAA scores when claiming activation behavior

## Current Source Watchlist

Rusty Kaspa:

- PR #1000: `Toccata`, branch `toccata` into `master`
- PR #1013: `ZK opcode updates`, branch `zk-updates` into `tn10`
- branch `toccata`
- branch `tn10`
- branch `tn12`
- tag `tn10-toc2`
- latest stable tag

KIPs:

- PR #31: KIP-16, ZK precompile opcodes
- PR #32: KIP-17, covenants and improved scripting
- PR #35: KIP-20, covenant IDs
- PR #36: KIP-21, partitioned sequencing commitments

Official docs:

- Kaspa build/developer page
- Programmability overview
- Covenants
- Inline ZK
- Based Apps
- Full vProgs
- Docs source files under `content/docs/programmability`

Research:

- Concrete vProgs architecture proposal
- Formal vProg computation DAG model
- Pruning safety in vProgs
- Proof stitching framework
- Based ZK rollups over Kaspa UTXO DAG consensus
- Inclusion-time proving tension in multileader consensus

Tooling:

- SilverScript repo and docs
- vProgs repo
- open ZK SDK and rollup example PRs

## Feature Buckets

### Covenants

Track:

- KIP-17 opcode coverage
- KIP-20 covenant ID data model
- genesis covenant ID hashing
- UTXO lineage rules
- P2SH/state encoding conventions
- transaction version and covenant binding rules
- SilverScript compiler output

Builder output:

- state-machine templates
- covenant lineage indexer
- wallet signing preview for successor outputs
- invalid transition tests

### ZK

Track:

- KIP-16 `OpZkPrecompile`
- Groth16 verifier path
- RISC0 Succinct verifier path
- PR #1013 changes
- pricing and runtime resource metering
- proof data shape and transaction size constraints

Builder output:

- proof-bearing transaction examples
- verifier-cost calculator
- dependency risk notes for cryptographic libraries
- proof system choice matrix

### Sequencing Commitments

Track:

- KIP-21 lane extraction
- active lane root
- sequencing state root
- accepted ID commitment changes
- `OpChainblockSeqCommit`
- O(activity) proof model

Builder output:

- lane-aware indexer model
- proof witness API shape
- block context commitment explorer fields
- app-lane monitoring dashboard

### Based Apps and vProgs

Track:

- vProgs repo architecture
- account read/write scope model
- proof epoch and scope compression
- pruning safety requirements
- cross-vProg sync composition
- source availability and zk-SBOM ideas

Builder output:

- execution DAG simulator
- scope-cost estimator
- proof cadence policy
- app-to-app composability checklist

## R&D Development Roadmap

Phase 1: Evidence engine

- Implement a repeatable source audit command.
- Record branch hashes and PR states.
- Diff `toccata` against `master` by feature bucket.
- Store snapshots with UTC timestamps.

Phase 2: Covenant lab

- Run SilverScript tests and examples.
- Compile simple covenant templates.
- Build invalid-successor and malformed-binding tests.
- Map emitted scripts to opcodes.

Phase 3: Indexer upgrade

- Add covenant fields to raw transaction and UTXO models.
- Track covenant lineage by `covenant_id`.
- Track authorizing input and genesis output sets.
- Track accepted transaction lane context.

Phase 4: Wallet UX upgrade

- Render covenant spends as state transitions, not plain transfers.
- Show consumed state, successor state, covenant ID, and proof requirements.
- Warn when a spend creates constraints the user may not understand.

Phase 5: ZK lab

- Track PR #1013 and ZK SDK PRs.
- Build proof data schema notes.
- Prototype proof-bearing transaction payloads on testnet only.
- Benchmark proof verification cost against script-unit budgets.

Phase 6: vProg simulator

- Model accounts, read sets, write sets, witnesses, proof submissions, and scope.
- Measure proof cadence effects.
- Detect scope explosion and pruning risk.
- Convert results into app architecture rules.

## Local Knowledge Drill

Use this loop when the task is to improve Kaspa knowledge, prepare for Toccata, or locally train the skill:

```bash
node scripts/toccata-source-monitor.mjs --write-if-changed
node scripts/kaspa-knowledge-drill.mjs
```

The drill is retrieval practice over the current source snapshot. It should produce:

- a current source pulse
- recall questions
- deep drills
- red-team prompts
- one builder sprint artifact

Treat missed or uncertain answers as repo tasks. Update the monitor, corpus, or playbook so the next run gets sharper.

## Failure Modes To Study First

- Confusing feature branch merges with `master` merges.
- Confusing TN10/TN12 activation with mainnet activation.
- Treating KIP PR text as final KIP text.
- Wallets displaying covenant spends as ordinary sends.
- Indexers missing covenant lineage or authorizing input.
- Proof verification dependency bugs.
- Sequencing witnesses unavailable after pruning.
- vProg scope growth causing hidden execution costs.
- Overstated proof gas or execution mass creating denial-of-service pressure.
- App builders choosing covenants for shared mutable state that belongs in Based Apps.

## Strategic Edge

The fastest path to deep advantage is not to predict price or repeat "smart contracts." It is to build tools that answer:

- What is actually live?
- What changed in code?
- What can be built on TN10 or TN12 today?
- What waits for mainnet?
- What breaks for wallets and indexers?
- Which app patterns are naturally Kaspa-native?
- Which proof and state models create hidden operational costs?
