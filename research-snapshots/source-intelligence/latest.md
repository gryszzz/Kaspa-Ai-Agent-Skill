# Kaspa Live Source Intelligence

Checked: 2026-10-10T17:28:25.005Z
Facts hash: `2fa4fbc67be70ca6f075d8d71e12f43bb5669d1fa1747268ab05d97c2dff2101`
Source health: **healthy_with_warnings**

## Primary Evidence

| Lane | Healthy | Total |
| --- | ---: | ---: |
| GitHub repositories | 7 | 7 |
| GitHub releases | 1 | 1 |
| GitHub refs | 8 | 8 |
| Web/docs/research | 6 | 6 |
| Network endpoints | 2 | 3 |
| KIP documents | 15 | 15 |

## Latest Rusty Kaspa Release

- Tag: [v2.1.0](https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.1.0)
- Published: 2026-09-22T13:55:36Z
- Prerelease: no

## GitHub Refs

| Source | Ref | SHA | Status |
| --- | --- | --- | --- |
| kaspanet/rusty-kaspa | heads/master | `01b532e8b553` | ok |
| kaspanet/rusty-kaspa | heads/toccata | `0ae28f939e61` | ok |
| kaspanet/rusty-kaspa | heads/tn10 | `e5f6d1f7c86f` | ok |
| kaspanet/rusty-kaspa | heads/tn12 | `ab4c51afde90` | ok |
| kaspanet/kips | heads/master | `e4ae2332117b` | ok |
| kaspanet/docs | heads/main | `0ac77d043a80` | ok |
| kaspanet/silverscript | heads/master | `a0dd7448ccc7` | ok |
| kaspanet/vprogs | heads/master | `f9b84a863a7c` | ok |

## Network Identity

| Endpoint | Expected | Observed | DAA | Status |
| --- | --- | --- | ---: | --- |
| [Mainnet blockDAG](https://api.kaspa.org/info/blockdag) | kaspa-mainnet | kaspa-mainnet | 562330222 | ok |
| [TN10 blockDAG](https://api-tn10.kaspa.org/info/blockdag) | kaspa-testnet-10 | kaspa-testnet-10 | 593189840 | ok |
| [TN12 blockDAG](https://api-tn12.kaspa.org/info/blockdag) | kaspa-testnet-12 |  |  | failed 503 |

## KIP Index

| KIP | Status | Title |
| --- | --- | --- |
| 1 | Implemented | Rewriting the Kaspa Full-Node in the Rust Programming Language |
| 2 | Proposed | Upgrade consensus to follow the DAGKNIGHT protocol |
| 3 | Rejected (see below) | Block sampling for efficient DAA with high BPS |
| 4 | Active | Sparse Difficulty Windows |
| 5 | Active | Message Signing |
| 6 | Draft | Proof of Chain Membership (PoChM) |
| 9 | Active | Extended mass formula for mitigating state bloat |
| 10 | Active | New Transaction Opcodes for Enhanced Script Functionality |
| 13 | Active | Transient Storage Handling |
| 14 | Active | The Crescendo Hardfork |
| 15 | Active | Canonical Transaction Ordering and SelectedParent Accepted Transactions Commitment |
| 16 | Active | New Transaction Opcodes for Verifiable Computation |
| 17 | Active | Covenants and Improved Scripting Capabilities |
| 20 | Active | Covenant IDs |
| 21 | Active | Partitioned Sequencing Commitment with O(activity) Proving |

## Warnings

- Network endpoint unavailable: TN12 blockDAG

## Claim Rules

- Do not convert endpoint failure into feature absence.
- Do not convert testnet activation into mainnet activation.
- Do not convert a merged KIP into released or activated behavior.
- Do not convert a final release with a future DAA into active behavior.
- Always record source URL, checkedAt, release tag or commit, and network identity for current claims.

