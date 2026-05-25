# Sequencing Witness API Sketch

Status: API shape for lane-aware indexers and proof-serving infrastructure.

Goal: expose enough accepted transaction context, lane roots, witness availability, and pruning state for builders to reason about Toccata-era sequencing without pretending that testnet observations are mainnet guarantees.

## Design Rules

- Every response must include `networkName`.
- Every lane response must include the accepted transaction context used to compute the lane state.
- Witness availability must be explicit. Missing, pruned, delayed, and unverified are different states.
- Pruning state must be queryable before a wallet or app asks a user to sign.
- The API must not collapse lane-local evidence into global finality language.

## Endpoints

### Get Lane Roots

```http
GET /sequencing/lane-roots?network=kaspa-testnet-12&daaScore=21055042
```

```json
{
  "networkName": "kaspa-testnet-12",
  "daaScore": 21055042,
  "selectedParentHash": "block-selected-parent",
  "laneRoots": [
    {
      "laneId": "covenants:vaults",
      "laneRoot": "root-covenants-vaults",
      "acceptedTxCount": 128,
      "witnessAvailability": "available"
    },
    {
      "laneId": "zk:private-actions",
      "laneRoot": "root-zk-private-actions",
      "acceptedTxCount": 44,
      "witnessAvailability": "partial"
    }
  ]
}
```

### Get Accepted Transaction Context

```http
GET /sequencing/accepted-txs/:txId/context
```

```json
{
  "networkName": "kaspa-testnet-12",
  "txId": "tx-step-2",
  "accepted": {
    "blockHash": "block-c",
    "daaScore": 140,
    "selectedParentHash": "block-b",
    "acceptingBlockBlueScore": 1000000
  },
  "lane": {
    "laneId": "covenants:vaults",
    "position": 42,
    "priorLaneRoot": "root-before",
    "successorLaneRoot": "root-after"
  },
  "pruning": {
    "state": "not_pruned",
    "retentionHint": "full_witness_available"
  }
}
```

### Get Witness Availability

```http
GET /sequencing/witnesses/:witnessId
```

```json
{
  "networkName": "kaspa-testnet-12",
  "witnessId": "witness-cov-demo-001-tx-step-2",
  "availability": "available",
  "payloadBytes": 4096,
  "contentHash": "sha256:...",
  "covers": {
    "txId": "tx-step-2",
    "laneId": "covenants:vaults",
    "outpoints": ["tx-step-1:0", "tx-step-2:0"]
  },
  "pruning": {
    "state": "not_pruned",
    "lastVerifiedAtDaaScore": 21055042
  }
}
```

### Get Pruning State

```http
GET /sequencing/pruning-state?network=kaspa-testnet-12&laneId=covenants:vaults
```

```json
{
  "networkName": "kaspa-testnet-12",
  "laneId": "covenants:vaults",
  "pruningState": "safe_for_current_witnesses",
  "oldestRetainedDaaScore": 21040000,
  "newestVerifiedDaaScore": 21055042,
  "unavailableRanges": []
}
```

## Status Values

| Field | Values |
| --- | --- |
| `witnessAvailability` | `available`, `partial`, `delayed`, `missing`, `unverified`, `pruned` |
| `pruning.state` | `not_pruned`, `near_pruning_boundary`, `pruned`, `unknown` |
| `pruningState` | `safe_for_current_witnesses`, `partial_retention`, `unsafe_pruned`, `unknown` |

## Indexer Invariants

- A lane root must name the exact accepted context that produced it.
- A witness must name the transaction, lane, and state objects it covers.
- A wallet must reject signing when witness availability is `missing`, `unverified`, or `pruned`.
- Reorg handling must invalidate affected lane roots and mark successor roots as stale until recomputed.
- A stale endpoint must not be allowed to serve witness state for a fresher wallet preview.
