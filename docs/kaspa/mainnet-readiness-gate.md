# Mainnet Readiness Gate

Status: protocol-activation and ecosystem-readiness claim control.

Current snapshot note, 2026-06-06:

- Protocol decision: `do_not_claim_mainnet_protocol_active`.
- Rusty Kaspa `v2.0.0` is final release evidence.
- Activation is scheduled for DAA `474,165,565`, roughly 2026-06-30 16:15 UTC.
- The observed mainnet DAA is below the activation threshold.
- Ecosystem decision: `do_not_claim_wallet_indexer_ready`; local prototypes do not prove audited production support.

Run:

```bash
node scripts/toccata-mainnet-readiness-gate.mjs
node scripts/toccata-mainnet-readiness-gate.mjs --check
```

## Protocol Gates

| Gate | Required evidence |
| --- | --- |
| Final release | Stable Rusty Kaspa release explicitly naming Toccata |
| Activation schedule | Explicit mainnet DAA and UTC estimate |
| Merged code path | Production code merged into `master` |
| Mainnet endpoint | Healthy endpoint returning `kaspa-mainnet` |
| Activation reached | Live mainnet DAA at or above `474,165,565` |
| Docs alignment | Versioned official Toccata node guide |

## Ecosystem Gate

Wallet/indexer readiness is deliberately separate. It requires audited transaction parsing, `storageMass` and `compute_commit` compatibility, covenant-aware construction, reorg-safe indexing, fee estimation, and signing UX. Protocol activation alone does not complete this gate.

## Allowed Language

Before the DAA threshold:

```text
Toccata v2.0.0 is released and scheduled to activate at mainnet DAA 474,165,565.
```

After the threshold, if all protocol gates pass:

```text
Toccata protocol activation is verified on mainnet.
```

Still blocked without ecosystem evidence:

```text
All wallets and indexers are Toccata-ready.
```
