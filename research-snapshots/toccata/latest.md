# Toccata Source Snapshot

Generated: 2026-06-04T03:33:39.389Z

Facts hash: `1f3f260011d79cc6d36622835160dfdcf2080f2228304b4b496ffd468ed45fc0`

## Verdict

- Mainnet activation: not_verified_by_monitor; latest tracked Toccata mainnet release is pre-activation
- Implementation status: PR #1000 is closed and merged against master.
- Branch status: rusty-kaspa master d5205cc72ab7, toccata 0ae28f939e61.
- Caution: Do not equate open PRs with merged production behavior. Do not equate TN10/TN12 observations with mainnet activation. Use branch hashes, PR base refs, KIP merge state, and docs hashes together before making claims.


## Changes Since Previous Snapshot

Previous snapshot: 2026-06-04T03:31:13.507Z

Current snapshot: 2026-06-04T03:33:39.389Z

### Stable Facts

- factsHash 502d425b101943e3d47a4dab0564503989357cc14c8d003757dc2e2521d7f534 -> 1f3f260011d79cc6d36622835160dfdcf2080f2228304b4b496ffd468ed45fc0

### GitHub Pull Requests and KIP PR States

- No changes detected.

### GitHub Releases

- No changes detected.

### GitHub References

- No changes detected.

### Testnet Signals

- TN10 blockdag: virtualDaaScore 481839338 -> 481841011; blockCount 1108338 -> 1110011; headerCount 1108338 -> 1110011.
- TN12 blockdag: virtualDaaScore 29334710 -> 29336303; blockCount 1450682 -> 1452275; headerCount 1450682 -> 1452275.

### Web Source Fingerprints

- No changes detected.


## GitHub Pull Requests

| Signal | State | Base | Head SHA | Updated | Link |
| --- | --- | --- | --- | --- | --- |
| Toccata implementation | closed | master | 0ae28f939e61 | 2026-06-02T16:06:07Z | [source](https://github.com/kaspanet/rusty-kaspa/pull/1000) |
| ZK opcode updates | closed | tn10 | dd4c992dd6a7 | 2026-05-27T09:23:36Z | [source](https://github.com/kaspanet/rusty-kaspa/pull/1013) |
| KIP-16 | closed | master | 09d3615ef0c5 | 2026-05-28T18:51:50Z | [source](https://github.com/kaspanet/kips/pull/31) |
| KIP-17 | closed | master | b9b11429fdfc | 2026-06-02T16:59:02Z | [source](https://github.com/kaspanet/kips/pull/32) |
| KIP-20 | closed | master | e747e0286ada | 2026-05-28T19:01:14Z | [source](https://github.com/kaspanet/kips/pull/35) |
| KIP-21 | closed | master | 5214505744ed | 2026-05-28T20:25:33Z | [source](https://github.com/kaspanet/kips/pull/36) |
| KIP-22 | open | master | cdafc96705eb | 2026-03-10T16:31:00Z | [source](https://github.com/kaspanet/kips/pull/37) |
| KIP-23 | open | master | bdd3abd55ab8 | 2026-05-06T08:03:20Z | [source](https://github.com/kaspanet/kips/pull/40) |

## PR Diff Summaries

| Signal | Files | Content signals | Top changed files | KIP document status |
| --- | --- | --- | --- | --- |
| Toccata implementation | 357 files, +38666/-3734 | Groth16 verifier, RISC0/Succinct verifier, RPC/WASM bindings, ZK precompile, consensus activation/config, docs, pricing/resource meter, tests/benches, transaction validation, txscript opcode/runtime | crypto/smt/src/tree.rs (+2196/-0); crypto/txscript/benches/pricing.rs (+2091/-0); crypto/txscript/src/opcodes/mod.rs (+1755/-307); consensus/smt-store/tests/integration.rs (+1589/-0); crypto/txscript/src/lib.rs (+1293/-190); Cargo.lock (+1186/-286) |  |
| ZK opcode updates | 17 files, +1793/-179 | Groth16 verifier, RISC0/Succinct verifier, ZK precompile, consensus activation/config, pricing/resource meter, tests/benches, transaction validation, txscript opcode/runtime | crypto/txscript/benches/pricing.rs (+574/-69); crypto/txscript/src/zk_precompiles/tests/mod.rs (+545/-23); crypto/txscript/src/zk_precompiles/groth16/mod.rs (+312/-42); crypto/txscript/src/zk_precompiles/tests/helpers.rs (+167/-23); crypto/txscript/src/zk_precompiles/fields/mod.rs (+83/-2); crypto/txscript/src/zk_precompiles/risc0/mod.rs (+28/-3) |  |
| KIP-16 | 2 files, +221/-1 | Groth16 verifier, KIP document, RISC0/Succinct verifier, ZK precompile, consensus activation/config, docs, pricing/resource meter, txscript opcode/runtime | kip-0016.md (+219/-0); README.md (+2/-1) | kip-0016.md: Proposed, Implemented and activated in TN10 |
| KIP-17 | 2 files, +186/-0 | KIP document, ZK precompile, consensus activation/config, docs, txscript opcode/runtime | kip-0017.md (+185/-0); README.md (+1/-0) | kip-0017.md: Implemented and activated in TN10 |
| KIP-20 | 2 files, +363/-1 | KIP document, consensus activation/config, docs, txscript opcode/runtime | kip-0020.md (+361/-0); README.md (+2/-1) | kip-0020.md: Proposed, Implemented and activated in TN10 |
| KIP-21 | 5 files, +867/-1 | KIP document, consensus activation/config, docs, txscript opcode/runtime | kip-0021.md (+742/-0); kip-0021/seqcommit-accessor.md (+95/-0); kip-0021/proving-spec.md (+15/-0); kip-0021/impl-spec.md (+13/-0); README.md (+2/-1) | kip-0021.md: Implemented and activated in TN10 |
| KIP-22 | 1 file, +13/-0 |  | KIP22-P2MR-qr (+13/-0) |  |
| KIP-23 | 2 files, +294/-1 | KIP document, RPC/WASM bindings, docs, txscript opcode/runtime | kip-0023.md (+292/-0); README.md (+2/-1) | kip-0023.md: Proposed |

## GitHub Releases

| Signal | Tag | Pre-release | Published | Target | Highlights | Link |
| --- | --- | --- | --- | --- | --- | --- |
| Toccata mainnet pre-activation pre-release | v1.3.0-toc.5 | yes | 2026-06-03T13:34:34Z | master | ## Toccata Mainnet pre-activation pre-release; This pre-release is intended for community-wide mainnet sanity testing before the final Toccata rollout.; The main goal is to verify that pre-activation mainnet behavior remains fully compatible with the current master release across a wider range of real-world node histories, upgrade paths, pruning states, and operator setups.; This pre-release does **not** activate Toccata on mainnet. Operators who test it should expect one more upgrade when the final Toccata release is published.; - Node operators are encouraged to test this pre-release on mainnet, especially on nodes with different upgrade histories and pruning states.; - Operators, pools, and miners are encouraged to test with a limited subset of infrastructure rather than fully migrating operations.; - Miners may use this pre-release to sanity-test mining flows, but this does not replace testing on an activated testnet. Before activation, mainnet block templates only contain current transaction versions, so some Toccata-specific paths are only meaningfully exercised after activation.; - RPC transaction submission now applies the upcoming higher minimum standard fee rule: `100 sompi * max(compute grams, 2 * transaction bytes)`. | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.3.0-toc.5) |
| TN10 Toccata ZK hardening | tn10-toc3 | yes | 2026-05-27T19:04:15Z | tn10 | This pre-release schedules the Toccata ZK hardening hard fork on testnet-10.; The release activates the final Toccata hardening layer on TN10, including Groth16 verifier hardening, updated ZK pricing behavior, and the SMT/seqcommit inactivity shortcut used by inactivity proofs. This activation is part of the final TN10 validation cycle before the accumulated Toccata logic is cleaned up and prepared for mainnet.; Activation is scheduled for:; DAA Score: 476,232,000; TN10 nodes should upgrade before the activation point. | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/tn10-toc3) |
| TN10 Toccata hardfork rehearsal | tn10-toc2 | yes | 2026-05-16T19:09:09Z | master | This release scheduled the Toccata hardofork in testnet-10 to:; DAA Score: 467,579,632 | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/tn10-toc2) |
| Latest stable non-Toccata line tracked by monitor | v1.1.0 | no | 2026-03-04T15:04:45Z | master | ## Highlights; - **VSPC API v2 (`GetVirtualChainFromBlockV2`) (major integrator improvement)**; - **IBD catchup improvements (faster, safer recovery and sync progression)**; - **Performance + storage optimizations (significant practical gains)**; - **Pruning proof algorithm refactor + stability upgrades**; ## VSPC API v2 Specification (`GetVirtualChainFromBlockV2`); - Non-breaking addition: existing `GetVirtualChainFromBlock` is unchanged.; - Verbosity is incremental (`Full` includes `High`, `Low`, and `None`). | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.1.0) |

## GitHub References

| Reference | SHA | Type |
| --- | --- | --- |
| kaspanet/rusty-kaspa heads/master | d5205cc72ab7 | commit |
| kaspanet/rusty-kaspa heads/toccata | 0ae28f939e61 | commit |
| kaspanet/rusty-kaspa heads/tn10 | 6899ea75384c | commit |
| kaspanet/rusty-kaspa heads/tn12 | ab4c51afde90 | commit |
| kaspanet/rusty-kaspa tags/tn10-toc2 | 97415b689462 | commit |
| kaspanet/rusty-kaspa tags/tn10-toc3 | 1015a62359e0 | commit |
| kaspanet/rusty-kaspa tags/v1.3.0-toc.5 | 04b0d135f8c8 | commit |
| kaspanet/rusty-kaspa tags/v1.1.0 | e97070faa382 | commit |
| kaspanet/kips heads/master | 1aba3b8321c1 | commit |
| kaspanet/docs heads/main | 6aa5e9f52995 | commit |
| kaspanet/silverscript heads/master | 2c4623124d75 | commit |
| kaspanet/vprogs heads/master | 57039db09ea9 | commit |

## Testnet Signals

| Source | Status | Network | Virtual DAA | Block count |
| --- | --- | --- | --- | --- |
| TN10 blockdag | ok | kaspa-testnet-10 | 481841011 | 1110011 |
| TN12 blockdag | ok | kaspa-testnet-12 | 29336303 | 1452275 |

## Web Source Fingerprints

| Source | HTTP | Bytes | Fingerprint | Link |
| --- | --- | --- | --- | --- |
| Kaspa programmability overview | 200 | 55397 | 8a4394dc9266 | [source](https://docs.kaspa.org/programmability) |
| Kaspa covenants docs | 200 | 54726 | 73e4a4a4676b | [source](https://docs.kaspa.org/programmability/covenants) |
| Kaspa inline ZK docs | 200 | 53928 | f0935b1651d6 | [source](https://docs.kaspa.org/programmability/inline-zk) |
| Kaspa based apps docs | 200 | 52059 | 618bd928125d | [source](https://docs.kaspa.org/programmability/based-apps) |
| Kaspa full vProgs docs | 200 | 45792 | a33718dab852 | [source](https://docs.kaspa.org/programmability/full-vprogs) |
| Formal vProg computation DAG model | 200 | 46722 | 0d01364b7b40 | [source](https://research.kas.pa/t/zoom-in-a-formal-backbone-model-for-the-vprog-computation-dag/407) |
| vProgs pruning safety | 200 | 24937 | 647b4d92432f | [source](https://research.kas.pa/t/pruning-safety-in-the-vprogs-architecture/411) |
| Proof stitching framework | 200 | 32618 | cc44adf3732d | [source](https://research.kas.pa/t/a-basic-framework-for-proofs-stitching/323) |
| Based ZK rollups over Kaspa | 200 | 56014 | 57a169246005 | [source](https://research.kas.pa/t/on-the-design-of-based-zk-rollups-over-kaspas-utxo-based-dag-consensus/208) |
