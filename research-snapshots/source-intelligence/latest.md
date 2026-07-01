# Kaspa Live Source Intelligence

Checked: 2026-07-01T15:29:30.815Z
Facts hash: `5087a6525acc46b49891e42e6075195f13e95e2e3796ad0878caa0fbbdc19547`
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

- Tag: [v2.0.1](https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.1)
- Published: 2026-06-15T19:14:22Z
- Prerelease: no

## GitHub Refs

| Source | Ref | SHA | Status |
| --- | --- | --- | --- |
| kaspanet/rusty-kaspa | heads/master | `98a4ccd8d200` | ok |
| kaspanet/rusty-kaspa | heads/toccata | `0ae28f939e61` | ok |
| kaspanet/rusty-kaspa | heads/tn10 | `e5f6d1f7c86f` | ok |
| kaspanet/rusty-kaspa | heads/tn12 | `ab4c51afde90` | ok |
| kaspanet/kips | heads/master | `1aba3b8321c1` | ok |
| kaspanet/docs | heads/main | `c3fb0fded5f1` | ok |
| kaspanet/silverscript | heads/master | `d25bd3427a09` | ok |
| kaspanet/vprogs | heads/master | `252ff51f5467` | ok |

## Network Identity

| Endpoint | Expected | Observed | DAA | Status |
| --- | --- | --- | ---: | --- |
| [Mainnet blockDAG](https://api.kaspa.org/info/blockdag) | kaspa-mainnet | kaspa-mainnet | 474999257 | ok |
| [TN10 blockDAG](https://api-tn10.kaspa.org/info/blockdag) | kaspa-testnet-10 | kaspa-testnet-10 | 505614276 | ok |
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
| 16 | Proposed, Implemented and activated in TN10 | New Transaction Opcodes for Verifiable Computation |
| 17 | Implemented and activated in TN10 | Covenants and Improved Scripting Capabilities |
| 20 | Proposed, Implemented and activated in TN10 | Covenant IDs |
| 21 | Implemented and activated in TN10 | Partitioned Sequencing Commitment with O(activity) Proving |

## Warnings

- Network endpoint unavailable: TN12 blockDAG

## Claim Rules

- Do not convert endpoint failure into feature absence.
- Do not convert testnet activation into mainnet activation.
- Do not convert a merged KIP into released or activated behavior.
- Do not convert a final release with a future DAA into active behavior.
- Always record source URL, checkedAt, release tag or commit, and network identity for current claims.

