# Toccata R&D Playbook

Use this playbook when analyzing Toccata, covenants, SilverScript, ZK opcodes, sequencing commitments, Based Apps, or vProgs.

## Goal

Build an evidence-first Toccata research loop that is faster and sharper than surface-level ecosystem commentary.

Builder guide: `docs/toccata.md` in the repo, or
`references/repo-docs/toccata.md` in release downloads.

Upgrade-readiness docs page: `docs/kaspa/toccata-upgrade-readiness.md` in the repo, or `references/repo-docs/kaspa/toccata-upgrade-readiness.md` in release downloads.

Mastery track: `docs/kaspa/toccata-mastery-track.md` in the repo, or
`references/repo-docs/kaspa/toccata-mastery-track.md` in release downloads.

Repository source of truth: for `gryszzz/Kaspa-Ai-Agent-Skill`, use
`docs/toccata.md`, `docs/kaspa/`, and `docs/toccata-evidence-ladder.md` as the
builder-facing requirement set. Packaged releases may expose the same material
under `docs/` or `references/repo-docs/`.

Pre-change citation gate: before proposing or implementing covenant-related
changes, cite the specific local requirement that governs the work. Acceptable
anchors include this playbook, `docs/toccata-evidence-ladder.md`, and focused
notes such as `docs/toccata.md`, `docs/kaspa/covenant-lineage-indexer.md`,
`docs/kaspa/wallet-covenant-signing-preview.md`,
`docs/kaspa/sequencing-witness-api.md`, or
`docs/kaspa/mainnet-readiness-gate.md`.

Official/repo-backed source gate: for Toccata engineering, use Rusty Kaspa
release tags, the Toccata Guide, Rusty Kaspa proto files, KIP-16/17/20/21, and
Go Kaspad v0.12.23 for legacy compatibility. Do not use community summaries as
technical truth.

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
10. Live mainnet/TN10/TN12 REST checks
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
- final activation DAA, current mainnet DAA, and whether the threshold has been reached
- recent branch-delta commits and engineering impact lanes
- state of Rusty Kaspa PR #1000
- state of Rusty Kaspa PR #1013
- KIP-16, KIP-17, KIP-20, KIP-21 PR states and document statuses
- mainnet, TN10, and TN12 live DAA scores when claiming activation behavior

## Current Source Watchlist

Current June 6, 2026 posture from `research-snapshots/toccata/latest.md`:

- `v2.0.0` is the final Rusty Kaspa Toccata release, published on 2026-06-05.
- Mainnet activation is scheduled for DAA `474,165,565`, roughly 2026-06-30 16:15 UTC. The live mainnet endpoint was still below that threshold in the 2026-06-06 snapshot.
- P2P protocol version 10 becomes mandatory 24 hours before activation.
- The latest `master` delta includes `storage_mass`/`storageMass`, `compute_commit`, required RPC storage mass decoding, wallet covenant-binding generation, WASM script-builder flags, required mempool request arguments, activation configuration, and unknown-script-version hardening.
- `tn10-toc3` is a TN10 Toccata ZK hardening pre-release published on 2026-05-27. Its notes schedule activation for May 28, 2026 around 16:00 UTC at DAA score 476,232,000.
- PR #1000 is closed and merged against `master`.
- PR #1013 is closed and merged against `tn10`.
- KIP-16, KIP-17, KIP-20, and KIP-21 PRs are closed and merged to `kaspanet/kips` `master`; their merged document statuses indicate implemented/activated on TN10.
- Protocol activation is still blocked until the live mainnet DAA reaches the release threshold; wallet/indexer readiness remains a separate audit.
- The node database upgrade is one-way; rollback to a pre-Toccata node requires a resync.
- Pools and miners must preserve output covenant data and input compute commitments from block-template receipt through block submission.

2026-06-30 source pulse:

- Latest stable Rusty Kaspa is `v2.0.1`, a mainnet Toccata maintenance release published on 2026-06-15.
- `v2.0.0` remains the mainnet Toccata release that scheduled activation at
  DAA `474,165,565`, roughly 2026-06-30 16:15 UTC. At
  2026-06-30T13:29:37Z, live mainnet returned `networkName=kaspa-mainnet` and
  `virtualDaaScore=474063735`, so that audit was scheduled/pre-activation.
  The post-activation pulse below supersedes this status.
- Current Rusty Kaspa heads: `master` `98a4ccd8d200853787f227bd4536ac540cf34957`, `toccata` `0ae28f939e61994a11eb8eb6dd775255e2924afb`, `tn10` `e5f6d1f7c86f3a3afbe97dbb75e72a0a3ff66a57`, `tn12` `ab4c51afde90dc6e0bce3f782d0a18af5da29434`.
- The current Toccata Guide is `https://github.com/kaspanet/rusty-kaspa/blob/master/docs/toccata-guide.md`. Avoid malformed search-wrapper links; use GitHub release, raw, or blob URLs directly.
- The Toccata Guide names the fee policy `100 sompi * max(compute grams, 2 * transaction bytes)` and labels it node/mempool policy, not consensus. It also names `RpcTransaction.storage_mass`, JSON/WASM `storageMass`, `RpcTransactionInput.computeBudget`, `RpcTransactionOutput.covenant`, and `RpcUtxoEntry.covenant_id`.

2026-06-30 post-activation pulse:

- The source monitor now verifies Toccata protocol activation on mainnet:
  `networkName=kaspa-mainnet`, `virtualDaaScore=474391519`, activation DAA
  `474165565`, checked at 2026-06-30T22:39:08Z.
- The readiness gate decision is `ready_to_claim_mainnet_protocol_active` with
  `6/6` protocol gates.
- Wallet/indexer readiness remains blocked as a separate claim:
  `do_not_claim_wallet_indexer_ready`.
- Use active-mainnet wording only when citing the live endpoint audit date,
  returned network name, observed DAA, activation DAA, and source snapshot hash.

Rusty Kaspa:

- PR #1000: `Toccata`, branch `toccata` into `master`, closed/merged on 2026-06-02
- PR #1013: `ZK opcode updates`, branch `zk-updates` into `tn10`, closed/merged on 2026-05-27
- branch `toccata`
- branch `tn10`
- branch `tn12`
- tag `v1.3.0-toc.5`
- tag `v2.0.0`
- tag `v2.0.1`
- tag `tn10-toc3`
- tag `tn10-toc2`
- latest stable tag and activation schedule

Role prompts:

- Node operators: upgrade target, one-way DB migration, Testnet-10 testing,
  live network-name and DAA activation verification.
- Wallet builders: fee estimation, signing preview, storage mass, compute
  budget, covenant transitions, Kasware/Kaspium compatibility, no key exposure.
- Pool/miner integrators: preserve post-Toccata block-template and transaction
  fields through solved-block submission.
- Indexers/explorers: parse transaction version `1`, `computeBudget`,
  `covenant`, `covenant_id`, and `storageMass`/`storage_mass`.
- KaspaScript/covenant builders: start from KIP-17 and KIP-20; model genesis,
  continuation, non-forgeability, and invalid transitions.
- ZK/lane-proof researchers: start from KIP-16 and KIP-21; avoid invented
  proof systems, opcodes, or roadmap status.
- Mastery mode: run `node scripts/toccata-protocol-drill.mjs --check` after
  updating protocol-sensitive docs, references, or training cases.

### Transaction And Node-Interaction Changes

Use this checklist when adapting SDKs, wallets, indexers, exchanges, pools, or
manual transaction tooling for Toccata:

- Prefer Rusty Kaspa `v2.0.1` or newer for Toccata work. Use Go `kaspad`
  `v0.12.23` only when supporting legacy Go wallet/node workflows, and label it
  as the deprecated Go node.
- Regenerate gRPC/protobuf bindings after reading the Toccata Guide and updated
  proto files; do not patch generated structs by hand.
- Replace `RpcTransaction.mass` with `RpcTransaction.storage_mass`.
- In JSON/JavaScript/WASM paths, use `storageMass`. Accept deprecated `mass`
  only for backward compatibility, and reject input where both are present with
  conflicting values.
- Carry `RpcTransactionInput.computeBudget` through parsing, validation,
  signing previews, block templates, custom mining-job messages, and submission.
- Carry `RpcTransactionOutput.covenant` and `RpcUtxoEntry.covenant_id` through
  raw transaction storage, UTXO models, lineage indexing, API responses, and
  proof/evidence views.
- Preserve transaction version `1`, block header version, storage mass,
  compute budget, output covenant binding, and covenant IDs in pool and miner
  `GetBlockTemplate` -> job distribution -> solved block reconstruction ->
  `SubmitBlock` flows.
- Treat the post-Toccata minimum standard fee as node policy:
  `100 sompi * max(compute grams, 2 * transaction bytes)`. Do not call it a
  consensus rule; zero-fee transactions remain consensus-valid even when direct
  node submission or relay policy rejects them.

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
- `TransactionInput.compute_commit`
- `Transaction.storage_mass` / JSON-WASM `storageMass` compatibility
- SilverScript compiler output

Builder output:

- state-machine templates
- covenant lineage indexer
- wallet signing preview for successor outputs
- invalid transition tests

Bundled release checks:

```bash
node --test scripts/toccata-source-monitor.test.mjs
node scripts/toccata-source-monitor.mjs --check
node scripts/covenant-lineage-prototype.mjs --check-all
```

### ZK

Track:

- KIP-16 `OpZkPrecompile`
- Groth16 verifier path
- RISC0 Succinct verifier path
- PR #1013 changes
- final `v2.0.0` verifier and pricing behavior
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
- Diff current branch heads against the previous snapshot by engineering impact lane.
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
