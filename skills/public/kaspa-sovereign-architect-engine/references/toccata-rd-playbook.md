# Toccata R&D Playbook

Use this playbook when analyzing Toccata, covenants, SilverScript, ZK opcodes, sequencing commitments, Based Apps, or vProgs.

## Goal

Build an evidence-first Toccata research loop that is faster and sharper than surface-level ecosystem commentary.

Upgrade-readiness docs page: `docs/kaspa/toccata-upgrade-readiness.md` in the repo, or `references/repo-docs/kaspa/toccata-upgrade-readiness.md` in release downloads.

Do not claim superiority over upstream developers. The practical edge is:

- verifying earlier from primary code and PRs
- separating feature branches from `master`
- testing on TN10 and TN12
- converting source evidence into wallet, indexer, and app build plans
- keeping explicit unknowns instead of repeating hype

## Evidence Ladder

Reader-facing docs page: `docs/toccata-evidence-ladder.md` in the repo, or `references/repo-docs/toccata-evidence-ladder.md` in release downloads.

1. Stable release notes and tags
2. Toccata pre-release notes and tags, with activation/pre-activation wording preserved
3. `rusty-kaspa` `master`, `toccata`, `tn10`, and `tn12` branch heads
4. Rusty Kaspa PRs, with `baseRefName` recorded
5. KIP files merged to `kaspanet/kips` `master`
6. KIP PRs, with document status recorded
7. Official Kaspa docs and docs source files
8. Kaspa Research posts
9. SilverScript and vProgs repositories
10. Live TN10/TN12 REST checks
11. Community commentary, videos, posts, and summaries

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
- Toccata release or pre-release tags, including whether each tag is activation or pre-activation evidence
- state of Rusty Kaspa PR #1000
- state of Rusty Kaspa PR #1013
- KIP-16, KIP-17, KIP-20, KIP-21 PR states and document statuses
- TN10 and TN12 live DAA scores when claiming activation behavior

## Current Source Watchlist

Current June 4, 2026 posture from `research-snapshots/toccata/latest.md`:

- `v1.3.0-toc.5` is a Rusty Kaspa Toccata mainnet pre-activation pre-release published on 2026-06-03. It is mainnet sanity-testing evidence and explicitly not mainnet activation evidence.
- `tn10-toc3` is a TN10 Toccata ZK hardening pre-release published on 2026-05-27. Its notes schedule activation for May 28, 2026 around 16:00 UTC at DAA score 476,232,000.
- PR #1000 is closed and merged against `master`.
- PR #1013 is closed and merged against `tn10`.
- KIP-16, KIP-17, KIP-20, and KIP-21 PRs are closed and merged to `kaspanet/kips` `master`; their merged document statuses indicate implemented/activated on TN10.
- Mainnet activation is still `not_verified_by_monitor`; run the mainnet readiness gate before making any mainnet claim.

Rusty Kaspa:

- PR #1000: `Toccata`, branch `toccata` into `master`, closed/merged on 2026-06-02
- PR #1013: `ZK opcode updates`, branch `zk-updates` into `tn10`, closed/merged on 2026-05-27
- branch `toccata`
- branch `tn10`
- branch `tn12`
- tag `v1.3.0-toc.5`
- tag `tn10-toc3`
- tag `tn10-toc2`
- latest stable tag

KIPs:

- KIP-16 merged file and PR #31: ZK precompile opcodes
- KIP-17 merged file and PR #32: covenants and improved scripting
- KIP-20 merged file and PR #35: covenant IDs
- KIP-21 merged file and PR #36: partitioned sequencing commitments

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

Builder-facing lineage note: `docs/kaspa/covenant-lineage-indexer.md` in the repo, or `references/repo-docs/kaspa/covenant-lineage-indexer.md` in release downloads.

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

Bundled release checks:

```bash
node scripts/covenant-lineage-prototype.mjs --check-all
```

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

Bundled release reference:

- `references/repo-docs/kaspa/zk-proof-cost-matrix.md`

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

Bundled release reference:

- `references/repo-docs/kaspa/sequencing-witness-api.md`

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

Bundled release checks:

```bash
node scripts/vprog-scope-simulator.mjs --check
```

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
