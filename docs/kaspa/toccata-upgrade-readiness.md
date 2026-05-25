# Toccata Upgrade Readiness

Generated: 2026-05-25

This page is the builder readiness map for the Toccata upgrade track. It separates what is here, what is coming, what changes for builders, and how this repo stays precise and network-aware.

## Current Verified Posture

Use the live source monitor before repeating any status claim:

```bash
node scripts/toccata-source-monitor.mjs --write-if-changed
node scripts/kaspa-knowledge-drill.mjs
```

As of the latest local snapshot:

- Mainnet activation is not verified by this repository.
- Rusty Kaspa PR #1000 is the draft `toccata` to `master` implementation path.
- Rusty Kaspa PR #1013 tracks ZK opcode updates against `tn10`.
- TN10 and TN12 endpoint observations are testnet-only signals.
- KIP-16, KIP-17, KIP-20, and KIP-21 are tracked as KIP PRs unless the source monitor proves they merged into `kaspanet/kips` `master`.

## What Is Here

Testnet-visible or source-visible work:

- Toccata branch evidence for covenants, covenant IDs, ZK opcode work, sequencing commitments, and related transaction/RPC surfaces.
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
- PR #1000 transition from draft/open into a final merge path or successor PR.
- PR #1013 and any further ZK opcode consensus updates.
- KIP PR status changes and document-status edits.
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
- Evidence ladder docs.
- TN10/TN12 smoke-test notes.
- Covenant lineage indexer notes.
- Local knowledge drill.
- Compatibility CI that runs the drill.

Next high-leverage upgrades:

- KIP document-status extraction into the source monitor.
- PR #1013 diff summaries by changed files and changed opcode behavior.
- A wallet covenant-signing preview doc.
- A ZK proof-cost matrix.
- A sequencing witness API sketch.
- A vProg scope simulator prototype.

## References

- Toccata source snapshot: [`../../research-snapshots/toccata/latest.md`](../../research-snapshots/toccata/latest.md)
- Evidence ladder: [`../toccata-evidence-ladder.md`](../toccata-evidence-ladder.md)
- Covenant lineage indexer notes: [`./covenant-lineage-indexer.md`](./covenant-lineage-indexer.md)
- TN10/TN12 smoke tests: [`../../research-snapshots/toccata/rpc-smoke-tests.md`](../../research-snapshots/toccata/rpc-smoke-tests.md)
- Readiness drills: [`../../training-corpus/kaspa-toccata-readiness-drills-2026.md`](../../training-corpus/kaspa-toccata-readiness-drills-2026.md)
