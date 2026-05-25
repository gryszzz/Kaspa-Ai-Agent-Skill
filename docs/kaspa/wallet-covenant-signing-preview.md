# Wallet Covenant-Signing Preview

Status: design mock for testnet-first Toccata preparation.

Purpose: make a covenant spend visibly different from a normal payment before a wallet signs it. A wallet should show which protected state is being consumed, which successor state will be created, what proof or script requirements are attached, and which assumptions are still testnet or prototype-only.

## Preview Rule

Do not render a covenant spend with the same confirmation language as a normal send.

Required top-level warning:

```text
This is not a normal send.
You are consuming protected covenant state and creating a successor state.
Only sign if the covenant ID, consumed state, successor state, network, and proof requirements match the app you intended to use.
```

## Preview Payload

```json
{
  "previewType": "covenant_state_transition",
  "network": "kaspa-testnet-12",
  "txDraftId": "draft-2026-05-25-001",
  "covenantId": "cov-demo-001",
  "appLabel": "Example vault covenant",
  "lineage": {
    "genesisOutpoint": "tx-genesis:0",
    "currentTip": "tx-step-1:0",
    "successorOutpoint": "draft-output:0",
    "indexerConfidence": "local_fixture_only"
  },
  "consumedState": {
    "outpoint": "tx-step-1:0",
    "valueSompi": 100000000,
    "scriptPublicKeyHash": "script-state-v1",
    "covenantBindingHash": "binding-step-1",
    "acceptedDaaScore": 120
  },
  "successorState": {
    "outputIndex": 0,
    "valueSompi": 100000000,
    "scriptPublicKeyHash": "script-state-v2",
    "covenantBindingHash": "binding-step-2",
    "stateDeltaSummary": "Advance vault state from v1 to v2"
  },
  "proofRequirements": {
    "scriptValidation": "required",
    "covenantIdContinuity": "required",
    "successorOutputValidation": "required",
    "inlineZkProof": "not_required_for_this_mock",
    "witnessAvailability": "indexer_must_have_consumed_outpoint"
  },
  "riskWarnings": [
    "The destination-like output is covenant state, not a normal recipient payment.",
    "If the successor state is wrong, the next owner or app may be locked into bad state.",
    "If the wallet or indexer is on the wrong network, this preview is invalid.",
    "If the consumed outpoint was reorged or already spent, this draft must be rejected."
  ],
  "signingDecision": {
    "primaryAction": "Sign covenant transition",
    "blockedIf": [
      "networkName mismatch",
      "covenantId mismatch",
      "currentTip mismatch",
      "missing successor covenant output",
      "unknown proof requirement",
      "indexer cannot prove consumed state"
    ]
  }
}
```

## Wallet UI Fields

| Field | Wallet copy | Source |
| --- | --- | --- |
| Network | `kaspa-testnet-12` | RPC endpoint plus wallet selected network |
| Action type | `Covenant state transition` | Transaction classifier |
| Covenant ID | `cov-demo-001` | Script/output parser |
| Consumed state | `tx-step-1:0` | UTXO/indexer |
| Successor state | `draft-output:0` | Transaction draft |
| Value retained | `1.00000000 KAS` | Draft outputs |
| Proof requirements | Script validation, ID continuity, successor validation | App policy plus protocol parser |
| Warning | `This is not a normal send.` | Always shown for covenant spends |

## Signing Blocks

Block signing when:

- The endpoint `networkName` does not match the wallet-selected network.
- The consumed outpoint is not the current tip for the covenant ID.
- The draft does not create exactly the expected successor covenant output.
- The app cannot explain the state delta in wallet-readable text.
- The wallet cannot identify whether inline ZK proof data is required.
- The indexer reports a reorg, duplicate continuation, stale endpoint, or missing consumed state.

## Test Cases

Use the covenant lineage fixtures as wallet-preview inputs:

```bash
node scripts/covenant-lineage-prototype.mjs --check-all
```

The wallet preview should accept the basic and missing-metadata fixtures only after rendering them as covenant transitions. It should reject wrong-network and duplicate-transition fixtures, and it should require a fresh preview after reorg rollback.
