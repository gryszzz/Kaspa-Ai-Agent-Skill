# Toccata Upgrade Readiness

Generated: 2026-06-06

This page is the builder readiness map for the Toccata upgrade track. It separates what is here, what is coming, what changes for builders, and how this repo stays precise and network-aware.

## Current Verified Posture

Use the live source monitor before repeating any status claim:

```bash
node scripts/toccata-source-monitor.mjs --write-if-changed
node scripts/kaspa-knowledge-drill.mjs
node scripts/toccata-protocol-drill.mjs --check
```

Historical 2026-06-06 posture:

- Rusty Kaspa `v2.0.0`, published 2026-06-05, is the final Toccata mainnet release.
- Toccata is scheduled to activate at mainnet DAA `474,165,565`, roughly 2026-06-30 16:15 UTC.
- The 2026-06-06 snapshot observed mainnet below the activation threshold, so Toccata must still be described as scheduled, not active.
- Rusty Kaspa PR #1000 is closed and merged against `master` as of 2026-06-02.
- Rusty Kaspa PR #1013 is closed and merged against `tn10` as of 2026-05-27.
- Release `v1.3.0-toc.5` remains useful pre-activation history; `v2.0.0` supersedes it as the final release.
- Rusty Kaspa release `tn10-toc3`, published 2026-05-27, is TN10 Toccata ZK hardening evidence. Its release notes schedule TN10 activation for May 28, 2026 around 16:00 UTC at DAA score 476,232,000.
- Mainnet, TN10, and TN12 endpoint observations must be checked by returned `networkName`; TN12 returned an upstream `HTTP 500` during the latest snapshot and is not silently treated as healthy.
- KIP-16, KIP-17, KIP-20, and KIP-21 PRs are closed and merged into `kaspanet/kips` `master`; their document statuses indicate implemented/activated on TN10.

Supplemental check, 2026-06-30T13:29:37Z:

- Rusty Kaspa `v2.0.1`, published 2026-06-15, is the latest stable mainnet Toccata release.
- Rusty Kaspa `v2.0.0` remains the release that defines the mainnet activation DAA `474,165,565`.
- At that audit, live mainnet returned `networkName=kaspa-mainnet` and
  `virtualDaaScore=474063735`, still below activation threshold. This line is
  historical; the post-activation check below supersedes it.
- Current Rusty Kaspa heads: `master` `98a4ccd8d200853787f227bd4536ac540cf34957`, `toccata` `0ae28f939e61994a11eb8eb6dd775255e2924afb`, `tn10` `e5f6d1f7c86f3a3afbe97dbb75e72a0a3ff66a57`, and `tn12` `ab4c51afde90dc6e0bce3f782d0a18af5da29434`.

Post-activation check, 2026-06-30T22:39:08Z:

- Toccata protocol activation is verified on mainnet by live endpoint evidence:
  `networkName=kaspa-mainnet` and `virtualDaaScore=474391519`, above
  activation DAA `474165565`.
- `node scripts/toccata-mainnet-readiness-gate.mjs --check` now returns
  `ready_to_claim_mainnet_protocol_active` with `6/6` protocol gates.
- The ecosystem gate remains `do_not_claim_wallet_indexer_ready`; wallet,
  indexer, miner, explorer, and app readiness still require separate audits.
- Current source snapshot facts hash:
  `4713fa066387bd080e9e30bcac80de0b8b41c77544cdce96555ac3c2702acb36`.

## What Is Here

Released, mainnet-active, testnet-visible, or source-visible work:

- Merged `master` implementation evidence for Toccata through PR #1000, plus branch/tag evidence that must still be interpreted network-by-network.
- Toccata branch evidence for covenants, covenant IDs, ZK opcode work, sequencing commitments, and related transaction/RPC surfaces.
- Final release and activation schedule evidence through `v2.0.0`, plus live
  mainnet activation evidence from the post-threshold source snapshot.
- Stable maintenance evidence through `v2.0.1`; this is the current
  implementation target, while mainnet activation remains proven by live DAA
  threshold evidence.
- Higher node relay/RPC minimum fee policy: `100 sompi * max(compute grams, 2 * transaction bytes)`. This is policy, not consensus validity.
- Transaction API migration: Rust/protobuf `storage_mass`, JSON/JavaScript `storageMass`, legacy JSON `mass` alias, and `TransactionInput.compute_commit`.
- Pool/miner requirement to preserve `TransactionOutput.covenant` and `TransactionInput.compute_commit` from block templates through block submission.
- One-way node database upgrade; rollback requires resync.
- TN10 ZK hardening release evidence through `tn10-toc3`.
- TN10 and TN12 `/info/blockdag` endpoint checks for live testnet context.
- Official docs describing programmability areas: covenants, inline ZK, Based Apps, and future vProgs.
- SilverScript and vProgs repositories as builder preparation and research/tooling signals.

Builder implication:

- Build watch-only, testnet-first prototypes.
- Keep network labels visible everywhere.
- Update indexers and wallets to the final release contracts and keep compatibility tests for aliases and required fields.
- Treat examples as learning assets, not production readiness.

## What Is Coming

Expected areas to keep watching:

- Post-release fixes and branch deltas, especially transaction serialization, RPC/WASM, wallet/PSKT, mempool, mining template, and security behavior.
- KIP document-status edits after KIP-16, KIP-17, KIP-20, and KIP-21 are merged.
- Wallet, WASM, RPC, PSKT, explorer, and indexer support for covenant fields.
- Sequencing commitment and vProg research turning into stable builder APIs.

Builder implication:

- Design adapters and data schemas with migration room.
- Store raw evidence alongside normalized fields.
- Keep feature gates per network and per source status.
- Make every UI claim explain whether it is mainnet, TN10, TN12, branch-only, or docs-only.

## What Changes For Builders

Covenants:

- App state can be represented through constrained UTXO transitions.
- Indexers must track covenant IDs, genesis outputs, continuation edges, authorizing inputs, accepted transaction context, and reorg state.
- Wallets must show covenant spends as state transitions, not ordinary sends.
- Transaction generators must preserve covenant bindings instead of dropping them.

Transaction and API compatibility:

- New Rust/protobuf integrations use `storage_mass`; JSON/JavaScript integrations use `storageMass`.
- JSON currently emits both `mass` and `storageMass`; deserialization accepts either, but rejects conflicting values.
- Version 1 inputs carry `compute_commit`/compute-budget semantics rather than the old ambiguous input `mass` name.
- WASM mempool request arguments that are required by the current API must not be omitted.

ZK:

- Proof-bearing transaction patterns become relevant.
- Verification cost, proof size, payload shape, and verifier dependency risk become builder concerns.
- Do not assume a verifier opcode removes witness availability or proof-system risk.

Sequencing commitments:

- Lane-aware indexing and witness APIs become important.
- Apps need to know which activity belongs to their lane or scope.
- Pruning and witness availability become product reliability problems.

Based Apps and vProgs:

- Shared-state apps may belong outside simple L1 covenant flows.
- Future vProg-style models require read/write set discipline, proof cadence planning, and scope explosion controls.

## Network-Awareness Rules

Every Toccata-related artifact should carry:

- `network`: mainnet, TN10, TN12, simnet, devnet, or unknown.
- `source_status`: mainnet verified, testnet verified, branch verified, PR verified, KIP proposal, docs/research signal, experimental tooling, or unknown.
- `audit_date`: absolute UTC timestamp.
- `source_ref`: URL, commit hash, PR number, or endpoint.

Never mix:

- TN10 and TN12 rows.
- Testnet evidence and mainnet claims.
- KIP PR text and merged KIP files.
- Protocol code and wallet/indexer support.
- App metadata and consensus-derived lineage.

## Accuracy Contract

Use precise verbs:

- "is scheduled on mainnet" only for historical or pre-threshold snapshots.
- "is active on mainnet" only when citing a healthy mainnet endpoint at or
  above the activation DAA.
- "is active on TN10/TN12" only after endpoint and source checks.
- "exists on branch" only with branch name and commit hash.
- "is proposed" for KIP PR text.
- "is described in docs" for docs-only claims.
- "is experimental" for tooling that has not been audited or production-proven.

Avoid these claims unless proven:

- "Toccata is live on mainnet" without citing live DAA evidence.
- "KIP PRs are final."
- "Wallets support covenant signing."
- "RPC providers expose final covenant fields."
- "A covenant ID validates app semantics."
- "ZK proof verification is production-safe."

## Master Builder Loop

Daily:

- Refresh the source monitor.
- Run the knowledge drill.
- Write one corrected claim with evidence labels.

Weekly:

- Review the monitor's branch-delta impact lanes.
- Update the covenant lineage indexer note.
- Update the wallet signing preview assumptions.
- Update the ZK proof-cost and dependency matrix.
- Update the app classification list: covenant, inline ZK, Based App, future vProg, or wait.

Before building:

- Select the target network.
- Define which fields are consensus-derived, RPC-derived, app-derived, or user-provided.
- Add migration notes for branch/API drift.
- Add failure modes for stale RPC, reorgs, pruning, missing metadata, and wallet misunderstanding.

## Repo Readiness Checklist

Already in place:

- Source monitor and snapshots.
- Release-note tracking for final, pre-activation, and TN10 activation tags.
- Mainnet readiness gate that separates protocol activation from wallet/indexer readiness.
- Mainnet DAA progress tracking and branch-delta engineering classification.
- Deterministic source-intelligence tests.
- Evidence ladder docs.
- Mainnet/TN10/TN12 smoke-test notes.
- Covenant lineage indexer notes.
- PR diff summaries with changed-file counts and semantic content signals.
- KIP document-status extraction from tracked KIP PR files.
- Covenant lineage prototype reducer with adversarial fixtures and reorg rollback checks.
- Wallet covenant-signing preview mock.
- ZK proof-cost matrix.
- Sequencing witness API sketch.
- vProg scope simulator.
- Multi-endpoint network checker.
- Mainnet readiness gate.
- Local knowledge drill.
- Protocol mastery drill.
- Compatibility CI that runs the drill, lineage checks, vProg simulator, endpoint checker, and mainnet gate.

Next high-leverage upgrades:

- Add downstream compatibility fixtures for `storageMass`, legacy `mass`, `compute_commit`, covenant bindings, and required mempool request arguments.
- Add a Kaspa crate compatibility smoke fixture that can point at Toccata git tags and verify SDK-facing APIs without rewriting the whole app stack.
- Add wallet and indexer fixtures for the Toccata opcode/covenant surface: covenant IDs, successor outputs, authorization inputs, sequencing commitments, and fee-policy previews.
- Extend PR diff summaries from changed-file signals into focused changed-behavior notes.
- Add wallet-preview golden test cases from the covenant lineage fixtures.
- Add live multi-endpoint source-node lists once trusted mainnet/TN10/TN12 peers are available.
- Add proof-cost benchmark snapshots when verifier pricing stabilizes.
- Add witness API contract tests once an indexer implementation exists.

## References

- Toccata source snapshot: [`../../research-snapshots/toccata/latest.md`](../../research-snapshots/toccata/latest.md)
- Evidence ladder: [`../toccata-evidence-ladder.md`](../toccata-evidence-ladder.md)
- Covenant lineage indexer notes: [`./covenant-lineage-indexer.md`](./covenant-lineage-indexer.md)
- Wallet covenant-signing preview: [`./wallet-covenant-signing-preview.md`](./wallet-covenant-signing-preview.md)
- ZK proof-cost matrix: [`./zk-proof-cost-matrix.md`](./zk-proof-cost-matrix.md)
- Sequencing witness API sketch: [`./sequencing-witness-api.md`](./sequencing-witness-api.md)
- vProg scope simulator: [`./vprog-scope-simulator.md`](./vprog-scope-simulator.md)
- Mainnet readiness gate: [`./mainnet-readiness-gate.md`](./mainnet-readiness-gate.md)
- Toccata mastery track: [`./toccata-mastery-track.md`](./toccata-mastery-track.md)
- Mainnet/TN10/TN12 smoke tests: [`../../research-snapshots/toccata/rpc-smoke-tests.md`](../../research-snapshots/toccata/rpc-smoke-tests.md)
- Readiness drills: [`../../training-corpus/kaspa-toccata-readiness-drills-2026.md`](../../training-corpus/kaspa-toccata-readiness-drills-2026.md)
