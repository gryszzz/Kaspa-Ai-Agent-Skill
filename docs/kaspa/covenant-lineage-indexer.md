# Covenant Lineage Indexer Notes

This design note sketches a Toccata-era covenant lineage indexer. It is builder-facing and deliberately testnet-scoped until mainnet activation and final wallet/indexer support are verified.

## Scope

Goal:

- Track covenant-bound UTXOs and continuation flows.
- Make covenant state queryable by `covenant_id`, genesis output, current tip output, and accepted transaction context.
- Preserve enough evidence to recover from reorgs, pruning boundaries, RPC errors, and app metadata gaps.

Non-goals:

- Do not claim Toccata mainnet activation.
- Do not treat KIP PRs as final merged KIPs.
- Do not assume a covenant ID proves semantic transition validity by itself.
- Do not design custody or signing logic.

## Evidence Status

As of the local Toccata source-monitor workflow:

- TN10 and TN12 observations are testnet-only evidence.
- Rusty Kaspa PR and branch state must be checked before using any covenant field as current behavior.
- KIP-17 and KIP-20 are high-signal covenant sources, but their PR and document status must be recorded separately from implementation and activation.
- Wallet and app support must be verified independently from node or protocol code.

Use the evidence ladder in [`../toccata-evidence-ladder.md`](../toccata-evidence-ladder.md) before turning this note into production claims.

## Data Model

Raw chain tables:

```text
accepted_transaction
  tx_id
  accepting_block_hash
  accepting_daa_score
  network
  observed_at
  is_reorged
  source_node

transaction_input
  tx_id
  input_index
  previous_outpoint_tx_id
  previous_outpoint_index
  sequence
  signature_script_hash

transaction_output
  tx_id
  output_index
  value_sompi
  script_public_key_hash
  covenant_binding_hash
  covenant_id
  is_covenant_bound
```

Covenant lineage tables:

```text
covenant_lineage
  covenant_id
  network
  genesis_tx_id
  genesis_output_index
  first_seen_daa_score
  last_seen_daa_score
  current_tip_tx_id
  current_tip_output_index
  status

covenant_transition
  covenant_id
  spending_tx_id
  consumed_tx_id
  consumed_output_index
  successor_tx_id
  successor_output_index
  authorizing_input_index
  accepting_block_hash
  accepting_daa_score
  transition_status

covenant_reorg_event
  covenant_id
  tx_id
  previous_status
  new_status
  detected_at
  reason
```

App metadata tables:

```text
covenant_app_metadata
  covenant_id
  app_namespace
  schema_version
  metadata_uri
  metadata_hash
  trust_level
  last_verified_at
```

## Ingestion Flow

1. Read accepted transactions from a trusted node or indexer feed.
2. Store raw transaction inputs and outputs idempotently.
3. Detect covenant-bound outputs from covenant binding fields and covenant IDs when exposed.
4. For each covenant-bound output, classify it as genesis or continuation.
5. Link continuation outputs to consumed covenant outputs through the authorizing input.
6. Update the lineage tip only after accepted transaction context is recorded.
7. Reconcile on reorg, pruning, or source-node mismatch.

## Required Signals

Minimum signals:

- accepted transaction ID
- accepting block hash or equivalent acceptance context
- DAA score or ordering context
- transaction inputs and previous outpoints
- transaction outputs
- covenant binding fields
- covenant ID on UTXO or output when available
- source network name
- source node identity and sync status

Useful but not sufficient alone:

- app metadata
- wallet-provided labels
- explorer display strings
- user-submitted covenant names

## Indexer Invariants

- Every transition must point to one consumed covenant output.
- Every successor output must be tied to an accepted transaction.
- A covenant ID groups lineage; it does not prove the app-level state transition was semantically correct.
- Reorg handling must be able to demote accepted transitions and restore previous tips.
- Missing app metadata must not erase covenant lineage.
- Testnet lineage must be stored with explicit `network` values so TN10, TN12, and future mainnet data cannot mix.

## Query API Sketch

```text
GET /covenants/:covenant_id
  returns lineage summary, current tip, network, and confidence state

GET /covenants/:covenant_id/transitions
  returns ordered transition edges with accepted transaction context

GET /transactions/:tx_id/covenant-effects
  returns consumed covenant outputs, successor outputs, and unresolved metadata

GET /covenants/:covenant_id/reorgs
  returns reorg and reconciliation events
```

## Risks

- Wrong network mixing: TN10/TN12 data must never be displayed as mainnet.
- Branch drift: field names and semantics can change before final mainnet release.
- Reorg confusion: lineages can appear to fork if stale accepted state is not demoted.
- Metadata loss: app labels can disappear even when covenant lineage remains recoverable.
- Wallet UX risk: users may sign constrained state transitions while believing they are ordinary payments.
- RPC trust: a single provider can be stale, censored, or misconfigured.
- KIP drift: proposal text can change while implementation PRs continue moving.

## Open Questions

- Which exact RPC and WASM bindings will expose covenant fields at final activation?
- What canonical status should distinguish genesis, continuation, abandoned, reorged, and pruned lineage states?
- How should indexers prove they did not confuse lineage after pruning or partial backfill?
- What minimal wallet preview should be required before signing a covenant spend?
- Which fields should be considered consensus-derived versus app-provided metadata?

## Next Prototype

1. Build a fixture format with accepted transactions, inputs, outputs, covenant IDs, and reorg events.
2. Implement a pure reducer that turns fixtures into `covenant_lineage` and `covenant_transition` rows.
3. Add adversarial fixtures for wrong network, missing metadata, duplicate transitions, and reorg rollback.
4. Connect the reducer to TN10/TN12 data only after the field shape is verified from current source snapshots.

Current prototype:

```bash
node scripts/covenant-lineage-prototype.mjs --check
node scripts/covenant-lineage-prototype.mjs
```

The default fixture is `fixtures/toccata/covenant-lineage-basic.json`. It models a genesis covenant output followed by two accepted continuation transitions on `kaspa-testnet-12`.
