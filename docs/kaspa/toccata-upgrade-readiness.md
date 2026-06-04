# Toccata Upgrade Readiness

Generated: 2026-06-04

This page is the builder readiness map for the Toccata upgrade track. It separates what is here, what is coming, what changes for builders, and how this repo stays precise and network-aware.

## Current Verified Posture

Use the live source monitor before repeating any status claim:

```bash
node scripts/toccata-source-monitor.mjs --write-if-changed
node scripts/kaspa-knowledge-drill.mjs
```

As of the latest local snapshot:

- Mainnet activation is not verified by this repository.
- Rusty Kaspa PR #1000 is closed and merged against `master` as of 2026-06-02.
- Rusty Kaspa PR #1013 is closed and merged against `tn10` as of 2026-05-27.
- Rusty Kaspa release `v1.3.0-toc.5`, published 2026-06-03, is a mainnet pre-activation pre-release for sanity testing. It explicitly does not activate Toccata on mainnet and expects one more final upgrade.
- Rusty Kaspa release `tn10-toc3`, published 2026-05-27, is TN10 Toccata ZK hardening evidence. Its release notes schedule TN10 activation for May 28, 2026 around 16:00 UTC at DAA score 476,232,000.
- TN10 and TN12 endpoint observations are testnet-only signals.
- KIP-16, KIP-17, KIP-20, and KIP-21 PRs are closed and merged into `kaspanet/kips` `master`; their document statuses indicate implemented/activated on TN10.

## What Is Here

Testnet-visible or source-visible work:

- Merged `master` implementation evidence for Toccata through PR #1000, plus branch/tag evidence that must still be interpreted network-by-network.
- Toccata branch evidence for covenants, covenant IDs, ZK opcode work, sequencing commitments, and related transaction/RPC surfaces.
- Mainnet pre-activation release evidence through `v1.3.0-toc.5`, including the upcoming higher RPC minimum standard fee policy: `100 sompi * max(compute grams, 2 * transaction bytes)`.
- TN10 ZK hardening release evidence through `tn10-toc3`.
- TN10 and TN12 `/info/blockdag` endpoint checks for live testnet context.
- Official docs describing programmability areas: covenants, inline ZK, Based Apps, and future vProgs.
- SilverScript and vProgs repositories as builder preparation and research/tooling signals.

Builder implication:

- Build watch-only, testnet-first prototypes.
- Keep network labels visible everywhere.
- Build indexers and wallets as if field names and semantics may still move.
- Treat examples as learning assets, not production readiness.

## What Is Coming

Expected areas to keep watching:

- Final mainnet activation evidence: release, activation schedule, merged code path, and final branch/tag state.
- Successor release after `v1.3.0-toc.5`, especially final activation wording and any mainnet DAA/height/time schedule.
- Any successor PRs after PR #1000 and PR #1013, especially fee policy, RPC/WASM, wallet, indexer, and ZK hardening deltas.
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

- "is verified on mainnet" only after explicit mainnet evidence.
- "is active on TN10/TN12" only after endpoint and source checks.
- "exists on branch" only with branch name and commit hash.
- "is proposed" for KIP PR text.
- "is described in docs" for docs-only claims.
- "is experimental" for tooling that has not been audited or production-proven.

Avoid these claims unless proven:

- "Toccata is live on mainnet."
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

- Diff PR #1000 and PR #1013.
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
- Release-note tracking for stable, Toccata pre-activation, and TN10 activation tags.
- Mainnet readiness gate that treats `v1.3.0-toc.5` as pre-activation evidence rather than final activation evidence.
- Evidence ladder docs.
- TN10/TN12 smoke-test notes.
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
- Compatibility CI that runs the drill, lineage checks, vProg simulator, endpoint checker, and mainnet gate.

Next high-leverage upgrades:

- Add focused behavior extraction for `v1.3.0-toc.5` release notes, especially fee policy, RPC submission behavior, gRPC/protobuf compatibility, and one-way DB upgrade risk.
- Add a Kaspa crate compatibility smoke fixture that can point at Toccata git tags and verify SDK-facing APIs without rewriting the whole app stack.
- Add wallet and indexer fixtures for the Toccata opcode/covenant surface: covenant IDs, successor outputs, authorization inputs, sequencing commitments, and fee-policy previews.
- Extend PR diff summaries from changed-file signals into focused changed-behavior notes.
- Add wallet-preview golden test cases from the covenant lineage fixtures.
- Add live multi-endpoint source-node lists once trusted TN10/TN12 peers are available.
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
- TN10/TN12 smoke tests: [`../../research-snapshots/toccata/rpc-smoke-tests.md`](../../research-snapshots/toccata/rpc-smoke-tests.md)
- Readiness drills: [`../../training-corpus/kaspa-toccata-readiness-drills-2026.md`](../../training-corpus/kaspa-toccata-readiness-drills-2026.md)
