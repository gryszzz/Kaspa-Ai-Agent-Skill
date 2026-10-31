# Kaspa Live Source Intelligence

Checked: 2026-10-31T17:21:40.274Z
Facts hash: `dc68233ecfc4e1199d0fe272f503b6ad5e3cc669e474b0d6a26dfb4c224f30eb`
Source health: **healthy_with_warnings**

## Primary Evidence

| Lane | Healthy | Total |
| --- | ---: | ---: |
| GitHub repositories | 10 | 10 |
| GitHub releases | 2 | 2 |
| GitHub refs | 11 | 11 |
| Web/docs/research | 6 | 6 |
| Network endpoints | 2 | 3 |
| KIP documents | 15 | 15 |

## Latest Rusty Kaspa Release

- Tag: [v2.1.0](https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.1.0)
- Published: 2026-09-22T13:55:36Z
- Prerelease: no

## GitHub Refs

| Repository | Evidence scope |
| --- | --- |
| kaspanet/rusty-kaspa | Primary source |
| kaspanet/kips | Primary source |
| kaspanet/docs | Primary source |
| kaspanet/kaspad | Community or historical source |
| michaelsutton/kdapp | Community or historical source |
| kaspanet/silverscript | Primary source |
| kaspanet/vprogs | Experimental; no production readiness claim |
| argent-lang/argent | Experimental; no production readiness claim |
| kaspanet/kccs | Conventions; document status is separate from adoption |
| olafweller/kaspa-privacy-initiative | Experimental; no production readiness claim |

## Tracked Releases

- [kaspanet/rusty-kaspa v2.1.0](https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.1.0), published 2026-09-22T13:55:36Z; prerelease: no.
- [kaspanet/silverscript v1.0.0](https://github.com/kaspanet/silverscript/releases/tag/v1.0.0), published 2026-09-09T16:48:31Z; prerelease: no.

## Ref Pins

| Source | Ref | SHA | Status |
| --- | --- | --- | --- |
| kaspanet/rusty-kaspa | heads/master | `4edcbbccb449` | ok |
| kaspanet/rusty-kaspa | heads/toccata | `0ae28f939e61` | ok |
| kaspanet/rusty-kaspa | heads/tn10 | `e5f6d1f7c86f` | ok |
| kaspanet/rusty-kaspa | heads/tn12 | `ab4c51afde90` | ok |
| kaspanet/kips | heads/master | `e4ae2332117b` | ok |
| kaspanet/docs | heads/main | `0ac77d043a80` | ok |
| kaspanet/silverscript | heads/master | `15b7bc27680b` | ok |
| kaspanet/vprogs | heads/master | `f9b84a863a7c` | ok |
| argent-lang/argent | heads/master | `2796809f1671` | ok |
| kaspanet/kccs | heads/main | `1ed87aef59fa` | ok |
| olafweller/kaspa-privacy-initiative | heads/main | `7ffe83534376` | ok |

## Network Identity

| Endpoint | Expected | Observed | DAA | Status |
| --- | --- | --- | ---: | --- |
| [Mainnet blockDAG](https://api.kaspa.org/info/blockdag) | kaspa-mainnet | kaspa-mainnet | 580470767 | ok |
| [TN10 blockDAG](https://api-tn10.kaspa.org/info/blockdag) | kaspa-testnet-10 | kaspa-testnet-10 | 611324097 | ok |
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

