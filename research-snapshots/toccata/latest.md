# Toccata Source Snapshot

Generated: 2026-11-27T21:21:51.227Z

Facts hash: `11e32aadffa11149dedfb7dc954fc8bc70624336aaa309c0f676b4435942b0a0`

## Verdict

- Mainnet activation: verified active at mainnet DAA 603940167, activation threshold 474165565
- Mainnet DAA observed: 603940167
- Activation DAA: 474165565
- Implementation status: PR #1000 is closed and merged against master.
- Branch status: rusty-kaspa master 68bd2e91cddb, toccata 0ae28f939e61.
- Caution: Do not equate open PRs with merged production behavior. A final release and activation schedule do not mean the activation DAA has been reached. Separate protocol activation from wallet, pool, indexer, explorer, and application readiness.


## Changes Since Previous Snapshot

Previous snapshot: 2026-10-19T23:21:28.356Z

Current snapshot: 2026-11-27T21:21:51.227Z

### Stable Facts

- factsHash bb4eed3df96e3af84cfa254779474315eb5f0c4525f2eb0788a9729161df7433 -> 11e32aadffa11149dedfb7dc954fc8bc70624336aaa309c0f676b4435942b0a0

### GitHub Pull Requests and KIP PR States

- No changes detected.

### GitHub Releases

- No changes detected.

### GitHub References

- kaspanet/rusty-kaspa heads/master: sha 4edcbbccb449 -> 68bd2e91cddb.
- kaspanet/kips heads/master: sha e4ae2332117b -> d832dbd89347.
- kaspanet/docs heads/main: sha 0ac77d043a80 -> b20836bd1798.
- kaspanet/silverscript heads/master: sha a0dd7448ccc7 -> 7eb04634bfba.
- kaspanet/vprogs heads/master: sha f9b84a863a7c -> b8d6de02c754.

### Network Signals

- Mainnet blockdag: virtualDaaScore 570318708 -> 603940167; blockCount 1497831 -> 1350312; headerCount 1497831 -> 1350312.
- TN10 blockdag: virtualDaaScore 601168244 -> 634789562; blockCount 1203153 -> 1488200; headerCount 1204917 -> 1488200.

### Web Source Fingerprints

- Kaspa programmability overview: fingerprint 2d297e5e8700 -> e4019ea1da36; bytes 62234 -> 121429.
- Kaspa covenants docs: fingerprint 88da98e43f8e -> 70d2cdd8bedb; bytes 60844 -> 171051.
- Kaspa inline ZK docs: fingerprint 5f7613bba3a5 -> 1caae9eb031d; bytes 60046 -> 96469.
- Kaspa based apps docs: fingerprint c85ac243bbff -> 538312e1b347; bytes 58177 -> 128780.
- Kaspa full vProgs docs: fingerprint 7bb6b932a67d -> 04f7317df76b; bytes 51910 -> 82429.


## GitHub Pull Requests

| Signal | State | Base | Head SHA | Updated | Link |
| --- | --- | --- | --- | --- | --- |
| Toccata implementation | closed | master | 0ae28f939e61 | 2026-06-02T16:06:07Z | [source](https://github.com/kaspanet/rusty-kaspa/pull/1000) |
| ZK opcode updates | closed | tn10 | dd4c992dd6a7 | 2026-05-27T09:23:36Z | [source](https://github.com/kaspanet/rusty-kaspa/pull/1013) |
| KIP-16 | closed | master | 09d3615ef0c5 | 2026-05-28T18:51:50Z | [source](https://github.com/kaspanet/kips/pull/31) |
| KIP-17 | closed | master | b9b11429fdfc | 2026-06-02T16:59:02Z | [source](https://github.com/kaspanet/kips/pull/32) |
| KIP-20 | closed | master | e747e0286ada | 2026-05-28T19:01:14Z | [source](https://github.com/kaspanet/kips/pull/35) |
| KIP-21 | closed | master | 5214505744ed | 2026-05-28T20:25:33Z | [source](https://github.com/kaspanet/kips/pull/36) |
| KIP-22 | open | master | cdafc96705eb | 2026-07-13T14:58:49Z | [source](https://github.com/kaspanet/kips/pull/37) |
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
| Final Toccata mainnet release | v2.0.0 | no | 2026-06-05T12:09:13Z | master | This release introduces the **Toccata Hardfork**, marking a major milestone described in [KIP16](https://github.com/kaspanet/kips/blob/master/kip-0016.md), [KIP17](https://github.com/kaspanet/kips/blob/master/kip-0017.md), [KIP20](https://github.com/kaspanet/kips/blob/master/kip-0020.md), and [KIP21](https://github.com/kaspanet/kips/blob/master/kip-0021.md), bringing native L1 covenant programming and infrastructure for based ZK applications to Kaspa. The hard fork is scheduled to activate on mainnet at DAA score `474,165,565`, roughly on June 30, 2026, at 16:15 UTC.; Starting **24 hours before activation**, nodes will connect only to peers using the new **P2P protocol version 10**. Ensure your node is updated to maintain network connectivity.; ## Node upgrade guide; Ensure your node is updated to stay compatible with the Toccata Hardfork. For detailed instructions on upgrading and configuring your node, refer to the [Toccata Guide](https://github.com/kaspanet/rusty-kaspa/blob/master/docs/toccata-guide.md). | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0) |
| Toccata mainnet pre-activation pre-release | v1.3.0-toc.5 | yes | 2026-06-03T13:34:34Z | master | ## Toccata Mainnet pre-activation pre-release; This pre-release is intended for community-wide mainnet sanity testing before the final Toccata rollout.; The main goal is to verify that pre-activation mainnet behavior remains fully compatible with the current master release across a wider range of real-world node histories, upgrade paths, pruning states, and operator setups.; This pre-release does **not** activate Toccata on mainnet. Operators who test it should expect one more upgrade when the final Toccata release is published.; - Node operators are encouraged to test this pre-release on mainnet, especially on nodes with different upgrade histories and pruning states.; - Operators, pools, and miners are encouraged to test with a limited subset of infrastructure rather than fully migrating operations.; - Miners may use this pre-release to sanity-test mining flows, but this does not replace testing on an activated testnet. Before activation, mainnet block templates only contain current transaction versions, so some Toccata-specific paths are only meaningfully exercised after activation.; - RPC transaction submission now applies the upcoming higher minimum standard fee rule: `100 sompi * max(compute grams, 2 * transaction bytes)`. | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.3.0-toc.5) |
| TN10 Toccata ZK hardening | tn10-toc3 | yes | 2026-05-27T19:04:15Z | tn10 | This pre-release schedules the Toccata ZK hardening hard fork on testnet-10.; The release activates the final Toccata hardening layer on TN10, including Groth16 verifier hardening, updated ZK pricing behavior, and the SMT/seqcommit inactivity shortcut used by inactivity proofs. This activation is part of the final TN10 validation cycle before the accumulated Toccata logic is cleaned up and prepared for mainnet.; Activation is scheduled for:; DAA Score: 476,232,000; TN10 nodes should upgrade before the activation point. | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/tn10-toc3) |
| TN10 Toccata hardfork rehearsal | tn10-toc2 | yes | 2026-05-16T19:09:09Z | master | This release scheduled the Toccata hardofork in testnet-10 to:; DAA Score: 467,579,632 | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/tn10-toc2) |
| Pre-Toccata stable baseline | v1.1.0 | no | 2026-03-04T15:04:45Z | master | ## Highlights; - **VSPC API v2 (`GetVirtualChainFromBlockV2`) (major integrator improvement)**; - **IBD catchup improvements (faster, safer recovery and sync progression)**; - **Performance + storage optimizations (significant practical gains)**; - **Pruning proof algorithm refactor + stability upgrades**; ## VSPC API v2 Specification (`GetVirtualChainFromBlockV2`); - Non-breaking addition: existing `GetVirtualChainFromBlock` is unchanged.; - Verbosity is incremental (`Full` includes `High`, `Low`, and `None`). | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.1.0) |

## GitHub References

| Reference | SHA | Type |
| --- | --- | --- |
| kaspanet/rusty-kaspa heads/master | 68bd2e91cddb | commit |
| kaspanet/rusty-kaspa heads/toccata | 0ae28f939e61 | commit |
| kaspanet/rusty-kaspa heads/tn10 | e5f6d1f7c86f | commit |
| kaspanet/rusty-kaspa heads/tn12 | ab4c51afde90 | commit |
| kaspanet/rusty-kaspa tags/tn10-toc2 | 97415b689462 | commit |
| kaspanet/rusty-kaspa tags/tn10-toc3 | 1015a62359e0 | commit |
| kaspanet/rusty-kaspa tags/v1.3.0-toc.5 | 04b0d135f8c8 | commit |
| kaspanet/rusty-kaspa tags/v2.0.0 | 90dbf074275d | commit |
| kaspanet/rusty-kaspa tags/v1.1.0 | e97070faa382 | commit |
| kaspanet/kips heads/master | d832dbd89347 | commit |
| kaspanet/docs heads/main | b20836bd1798 | commit |
| kaspanet/silverscript heads/master | 7eb04634bfba | commit |
| kaspanet/vprogs heads/master | b8d6de02c754 | commit |

## Upstream Branch Deltas

| Source | Status | Range | Commits | Files | Engineering impact | Link |
| --- | --- | --- | --- | --- | --- | --- |
| kaspanet/rusty-kaspa master | ahead | 4edcbbccb449 -> 68bd2e91cddb | 8 | 110 | Activation and P2P compatibility, Transaction and wire-format contracts, Covenants and UTXO lineage, Fee, mass, and mempool policy, RPC, WASM, and SDK surface, Wallet and PSKT construction, ZK verification and pricing, Sequencing commitments and SMT state, Node storage, pruning, and IBD, Security hardening, Tests, benchmarks, and operator docs | [compare](https://github.com/kaspanet/rusty-kaspa/compare/4edcbbccb449f84832afb1ca157904b35f37d006...68bd2e91cddbdcdca5e59357344c7e26f2d6d97b) |
| kaspanet/rusty-kaspa toccata | unchanged | 0ae28f939e61 -> 0ae28f939e61 | 0 | 0 |  |  |
| kaspanet/rusty-kaspa tn10 | last_observed_change | 6899ea75384c -> e5f6d1f7c86f | 27 | 126 | Activation and P2P compatibility, Transaction and wire-format contracts, Covenants and UTXO lineage, Fee, mass, and mempool policy, RPC, WASM, and SDK surface, Wallet and PSKT construction, ZK verification and pricing, Node storage, pruning, and IBD, Security hardening, Tests, benchmarks, and operator docs | [compare](https://github.com/kaspanet/rusty-kaspa/compare/6899ea75384c1f422fe4ab0e47c439442da3f4fa...e5f6d1f7c86f3a3afbe97dbb75e72a0a3ff66a57) |
| kaspanet/rusty-kaspa tn12 | unchanged | ab4c51afde90 -> ab4c51afde90 | 0 | 0 |  |  |
| kaspanet/kips master | ahead | e4ae2332117b -> d832dbd89347 | 1 | 1 | Activation and P2P compatibility, Sequencing commitments and SMT state | [compare](https://github.com/kaspanet/kips/compare/e4ae2332117b5cb68bd6188e065ef885b6d17939...d832dbd89347dcb16d3d83bf6755b081714cbcb2) |
| kaspanet/docs main | ahead | 0ac77d043a80 -> b20836bd1798 | 16 | 41 | Activation and P2P compatibility, Transaction and wire-format contracts, Covenants and UTXO lineage, Fee, mass, and mempool policy, RPC, WASM, and SDK surface, Wallet and PSKT construction, ZK verification and pricing, Sequencing commitments and SMT state, Node storage, pruning, and IBD, Security hardening, Tests, benchmarks, and operator docs | [compare](https://github.com/kaspanet/docs/compare/0ac77d043a802fc8196abfd5812ac2afbd97a2b9...b20836bd179861ccb2b6c9337af6d72e33d145f4) |
| kaspanet/silverscript master | ahead | a0dd7448ccc7 -> 7eb04634bfba | 4 | 47 | Covenants and UTXO lineage, Fee, mass, and mempool policy, RPC, WASM, and SDK surface, ZK verification and pricing, Sequencing commitments and SMT state, Node storage, pruning, and IBD, Security hardening, Tests, benchmarks, and operator docs | [compare](https://github.com/kaspanet/silverscript/compare/a0dd7448ccc7bad5b99140f2c8edbbd0b2a874f1...7eb04634bfbae5350c1808efc7e34c4efa7f93af) |
| kaspanet/vprogs master | ahead | f9b84a863a7c -> b8d6de02c754 | 30 | 202 | Activation and P2P compatibility, Transaction and wire-format contracts, Covenants and UTXO lineage, Fee, mass, and mempool policy, RPC, WASM, and SDK surface, Wallet and PSKT construction, ZK verification and pricing, Sequencing commitments and SMT state, Node storage, pruning, and IBD, Tests, benchmarks, and operator docs | [compare](https://github.com/kaspanet/vprogs/compare/f9b84a863a7c7c20586a9cf947550475e894f72e...b8d6de02c754180a66c350e6d882acbfdf4279a3) |

### kaspanet/rusty-kaspa master

Commits:

- `b85380d16514` docs(rpc): get utxos by addresses v2 cursor comment reflects reality (#1159)
- `af6ff23a0b3e` UtxoIndex: covenant id index, adds paginated GetUtxosByCovenantIds RPC (#1152)
- `4863866fce84` rpc: add GetTransactionsByAcceptingBlock (#1164)
- `da2a3d137a37` test(math): exercise overflowing_shr instead of overflowing_shl twice (#1161)
- `bb738ee0d789` fix(mempool): remove the actually-spent outpoint in add_transaction (#1160)
- `5417ed03f473` Update locked chacha20 dependency to 0.10.2 (#1169)
- `338d13c13826` Add SECURITY.md (#1171)
- `68bd2e91cddb` Update the R0 G16 SDK while preserving native STARK consensus behavior (#1176)

Engineering impact:

- **Activation and P2P compatibility:** Node operators must track the activation DAA, release line, P2P version cutoff, and one-way upgrade constraints. Matched: `simpa/src/main.rs`.
- **Transaction and wire-format contracts:** RPC, protobuf, miner, pool, wallet, and indexer models must preserve v1 transaction fields without lossy renaming. Matched: `rpc/core/src/convert/tx.rs`, `rpc/core/src/model/accepting_block.rs`, `rpc/grpc/core/proto/messages.proto`, `rpc/grpc/core/proto/rpc.proto`, `rpc/grpc/core/src/convert/message.rs`, `rpc/grpc/core/src/convert/tx.rs`, `testing/integration/src/rpc_tests.rs`.
- **Covenants and UTXO lineage:** UTXO-first applications must preserve covenant bindings, authorizing inputs, covenant IDs, and successor lineage. Matched: `docs(rpc): get utxos by addresses v2 cursor comment reflects reality (#1159)`, `UtxoIndex: covenant id index, adds paginated GetUtxosByCovenantIds RPC (#1152)`, `cli/src/modules/rpc.rs`, `consensus/core/src/config/mod.rs`, `consensus/core/src/utxo/utxo_inquirer.rs`, `consensus/src/pipeline/virtual_processor/tests.rs`, `consensus/src/pipeline/virtual_processor/utxo_inquirer.rs`, `crypto/txscript/zk-sdk/src/zk_to_script/fragments/prepare/succinct.rs`.
- **Fee, mass, and mempool policy:** Fee estimation must distinguish consensus validity from node relay policy and use current mass dimensions. Matched: `fix(mempool): remove the actually-spent outpoint in add_transaction (#1160)`, `SECURITY.md`, `consensus/src/pipeline/virtual_processor/tests.rs`, `crypto/txscript/src/zk_precompiles/mod.rs`, `indexes/utxoindex/src/index.rs`, `mining/src/mempool/model/transactions_pool.rs`, `mining/src/mempool/model/utxo_set.rs`, `rpc/core/src/convert/tx.rs`.
- **RPC, WASM, and SDK surface:** Integrators must regenerate or update client bindings and test required arguments, aliases, and serialization behavior. Matched: `Cargo.lock`, `crypto/txscript/zk-sdk/src/lib.rs`, `crypto/txscript/zk-sdk/src/zk_to_script/mod.rs`, `crypto/txscript/zk-sdk/src/zk_to_script/wasm/commit/mod.rs`, `crypto/txscript/zk-sdk/src/zk_to_script/wasm/commit/succinct.rs`, `crypto/txscript/zk-sdk/src/zk_to_script/wasm/fragments.rs`, `crypto/txscript/zk-sdk/src/zk_to_script/wasm/mod.rs`, `crypto/txscript/zk-sdk/src/zk_to_script/wasm/proof/mod.rs`.
- **Wallet and PSKT construction:** Wallet construction and signing previews must preserve covenant fields, compute commitments, storage mass, and explicit fees. Matched: `wallet/core/src/tests/rpc_core_mock.rs`.
- **ZK verification and pricing:** Proof-system dependencies, verifier hardening, script-unit pricing, proof size, and failure behavior remain security-critical. Matched: `Cargo.lock`, `Cargo.toml`, `crypto/txscript/Cargo.toml`, `crypto/txscript/benches/pricing.rs`, `crypto/txscript/src/lib.rs`, `crypto/txscript/src/zk_precompiles/mod.rs`, `crypto/txscript/src/zk_precompiles/risc0/error.rs`, `crypto/txscript/src/zk_precompiles/risc0/mod.rs`.
- **Sequencing commitments and SMT state:** Lane-aware indexers and proof services must handle reorgs, pruning, inactivity shortcuts, and witness availability. Matched: `rpc/core/src/api/ops.rs`, `rpc/grpc/client/src/lib.rs`, `rpc/grpc/core/proto/messages.proto`, `rpc/grpc/core/src/convert/kaspad.rs`, `rpc/grpc/core/src/ops.rs`, `rpc/grpc/server/src/request_handler/factory.rs`, `rpc/wrpc/server/src/router.rs`, `testing/integration/src/rpc_tests.rs`.
- **Node storage, pruning, and IBD:** Operators must plan database migrations, resync cost, retention, pruning compatibility, and recovery procedures. Matched: `consensus/src/pipeline/virtual_processor/tests.rs`, `database/src/registry.rs`, `indexes/utxoindex/Cargo.toml`, `indexes/utxoindex/src/core/api.rs`, `indexes/utxoindex/src/index.rs`, `indexes/utxoindex/src/stores.rs`, `indexes/utxoindex/src/stores/covenant_ids.rs`, `indexes/utxoindex/src/stores/script_public_keys.rs`.
- **Security hardening:** Consensus and network-facing fixes require adversarial regression tests and careful version-boundary review. Matched: `Add SECURITY.md (#1171)`, `SECURITY.md`.
- **Tests, benchmarks, and operator docs:** Changed examples, tests, and guides should become reproducible compatibility checks in downstream projects. Matched: `crypto/txscript/benches/pricing.rs`, `crypto/txscript/src/zk_precompiles/tests/helpers.rs`, `crypto/txscript/src/zk_precompiles/tests/mod.rs`, `crypto/txscript/zk-sdk/tests/data/zk_builder_tests/groth.rcpt.hex`, `crypto/txscript/zk-sdk/tests/data/zk_builder_tests/succinct.image.hex`, `crypto/txscript/zk-sdk/tests/data/zk_builder_tests/succinct.journal.hex`, `crypto/txscript/zk-sdk/tests/data/zk_builder_tests/succinct.rcpt.hex`, `crypto/txscript/zk-sdk/tests/r0_script_builder.rs`.

### kaspanet/rusty-kaspa tn10

Commits:

- `d7f9b1590ca6` dashboard session (#1015)
- `a07d8b38d45f` fix  IPv4-looking worker labels display as unnamed-asic (#1014)
- `78fc1c16d9ae` fix/zero-share-worker-ui-retention (#1016)
- `3cef6adaf2c7` Fixes #1017 — unbounded Stratum input buffer allowing remote memory exhaustion (#1023)
- `34b6c3fe93ed` SPM calculation Fix (#1033)
- `72f814edb914` Integrate finalized ZK hardening and KIP-21 shortcut (#1027)
- `ee018ee6a04f` feat(mempool): allow p2p relayed tx with low fees before toccata activation (#1022)
- `bac62c25d2ad` Sig refactor (#1035)
- `6dea2bd7cc01` Finalize Toccata cleanup before master merge (#1036)
- `0ae28f939e61` Merge remote-tracking branch 'origin/master' into toccata
- `af1b97244a98` Toccata (#1000)
- `04b0d135f8c8` chore: 1.3.0 pre-release (#1037)

Engineering impact:

- **Activation and P2P compatibility:** Node operators must track the activation DAA, release line, P2P version cutoff, and one-way upgrade constraints. Matched: `feat(mempool): allow p2p relayed tx with low fees before toccata activation (#1022)`, `consensus/core/src/config/params.rs`, `docs/toccata-guide.md`, `mining/src/toccata_transient_mass_activation_tests.rs`.
- **Transaction and wire-format contracts:** RPC, protobuf, miner, pool, wallet, and indexer models must preserve v1 transaction fields without lossy renaming. Matched: `Rename tx.mass -> tx.storage_mass (#1039)`, `Rename input.mass -> input.compute_commit, TxInputMass -> ComputeCommit (#1040)`, `Make storage_mass a required field in RpcTransaction when decoding JSON (#1043)`, `consensus/core/src/tx.rs`, `consensus/core/src/tx/serde_impl.rs`, `protocol/p2p/proto/p2p.proto`, `rpc/grpc/core/proto/messages.proto`, `rpc/grpc/core/proto/rpc.proto`.
- **Covenants and UTXO lineage:** UTXO-first applications must preserve covenant bindings, authorizing inputs, covenant IDs, and successor lineage. Matched: `fix(wallet/generator): include covenant bindings (#896)`, `consensus/src/pipeline/virtual_processor/utxo_validation.rs`, `consensus/src/processes/transaction_validator/tx_validation_in_utxo_context.rs`, `crypto/txscript/test-data/script_tests_covenants.json`.
- **Fee, mass, and mempool policy:** Fee estimation must distinguish consensus validity from node relay policy and use current mass dimensions. Matched: `feat(mempool): allow p2p relayed tx with low fees before toccata activation (#1022)`, `Rename tx.mass -> tx.storage_mass (#1039)`, `Rename input.mass -> input.compute_commit, TxInputMass -> ComputeCommit (#1040)`, `Make storage_mass a required field in RpcTransaction when decoding JSON (#1043)`, `fix(wasm): mempool entries request args are required (#951)`, `consensus/core/src/mass/mod.rs`, `consensus/core/src/mass/units.rs`, `mining/errors/src/mempool.rs`.
- **RPC, WASM, and SDK surface:** Integrators must regenerate or update client bindings and test required arguments, aliases, and serialization behavior. Matched: `feat(wasm/txscript): allows passing script builder flags (#999)`, `fix(wasm): mempool entries request args are required (#951)`, `consensus/wasm/src/utils.rs`, `crypto/txscript/src/wasm/builder.rs`, `rpc/core/src/api/ops.rs`, `rpc/core/src/api/rpc.rs`, `rpc/core/src/convert/tx.rs`, `rpc/core/src/convert/verbosity.rs`.
- **Wallet and PSKT construction:** Wallet construction and signing previews must preserve covenant fields, compute commitments, storage mass, and explicit fees. Matched: `fix(wallet/generator): include covenant bindings (#896)`, `consensus/client/src/signing.rs`, `wallet/core/src/tests/rpc_core_mock.rs`, `wallet/core/src/tx/generator/generator.rs`, `wallet/core/src/tx/generator/test.rs`, `wallet/core/src/tx/mass.rs`, `wallet/core/src/wasm/tx/mass.rs`, `wallet/pskt/src/convert.rs`.
- **ZK verification and pricing:** Proof-system dependencies, verifier hardening, script-unit pricing, proof size, and failure behavior remain security-critical. Matched: `wasm/examples/nodejs/javascript/zkproof/groth16.js`, `wasm/examples/nodejs/javascript/zkproof/risc0-succinct.js`.
- **Node storage, pruning, and IBD:** Operators must plan database migrations, resync cost, retention, pruning compatibility, and recovery procedures. Matched: `Rename tx.mass -> tx.storage_mass (#1039)`, `Make storage_mass a required field in RpcTransaction when decoding JSON (#1043)`, `consensus/core/tests/db_compat.rs`, `consensus/src/processes/pruning_proof/mod.rs`, `protocol/flows/src/ibd/flow.rs`, `protocol/flows/src/v7/request_pruning_point_and_anticone.rs`.
- **Security hardening:** Consensus and network-facing fixes require adversarial regression tests and careful version-boundary review. Matched: `Fixes #1017 — unbounded Stratum input buffer allowing remote memory exhaustion (#1023)`, `Integrate finalized ZK hardening and KIP-21 shortcut (#1027)`, `Fix script engine handling of unknown script versions (#1046)`.
- **Tests, benchmarks, and operator docs:** Changed examples, tests, and guides should become reproducible compatibility checks in downstream projects. Matched: `consensus/benches/check_scripts.rs`, `consensus/core/benches/serde_benchmark.rs`, `consensus/core/tests/db_compat.rs`, `crypto/txscript/benches/pricing.rs`, `docs/toccata-guide.md`, `rothschild/benches/bench.rs`, `rpc/grpc/server/src/tests/rpc_core_mock.rs`, `wallet/core/src/tests/rpc_core_mock.rs`.

### kaspanet/kips master

Commits:

- `d832dbd89347` Fix KIP-21 lane inactivity boundary (#52)

Engineering impact:

- **Activation and P2P compatibility:** Node operators must track the activation DAA, release line, P2P version cutoff, and one-way upgrade constraints. Matched: `kip-0021.md`.
- **Sequencing commitments and SMT state:** Lane-aware indexers and proof services must handle reorgs, pruning, inactivity shortcuts, and witness availability. Matched: `Fix KIP-21 lane inactivity boundary (#52)`, `kip-0021.md`.

### kaspanet/docs main

Commits:

- `0bac01054dc7` docs: deprecate native RISC Zero STARK (0x21) and fix broken links and typos (#57)
- `06d113027e6a` docs: unify /toccata and /programmability under /programmability (#58)
- `a4ef00d5a357` docs: update Silverscript and rewrite Argent around actor model and ICC (#59)
- `ffbd282db74a` docs: add Conventions (KCCs) section and KCC-20 fungible token showcase
- `d684ab2372c1` Fix technical accuracy across integration, programmability, and KCC-20 docs
- `7bfad1750346` Address follow-up review notes on script pricing, KCC-20, and Java example
- `320408303d7f` Add Covenant Composability guide and PatternSnippet callout component
- `4ff6f125cd96` Rename to Inter-Covenant Communication (ICC) and add 3-tier payload/dynamic-dispatch snippets
- `97fa56fb162a` Polish ICC snippets, Diagram 2 layout, and PatternSnippet badge specificity
- `45fb1346559d` Clarify state_0 -> state_1 labels in ICC overview diagram
- `598fa5d5563b` Simplify ICC overview diagram labels and fix clipped inspection edge
- `9f352cd1cc4c` Consolidate ICC into four patterns: capsules for open observation vs payload dynamic dispatch

Engineering impact:

- **Activation and P2P compatibility:** Node operators must track the activation DAA, release line, P2P version cutoff, and one-way upgrade constraints. Matched: `content/docs/integrate/transaction-payload.mdx`, `content/docs/programmability/references.mdx`, `content/docs/toccata/references.mdx`.
- **Transaction and wire-format contracts:** RPC, protobuf, miner, pool, wallet, and indexer models must preserve v1 transaction fields without lossy renaming. Matched: `content/docs/integrate/transaction-payload.mdx`, `content/docs/programmability/references.mdx`, `content/docs/programmability/silverscript.mdx`, `content/docs/toccata/references.mdx`, `content/docs/toccata/silverscript.mdx`.
- **Covenants and UTXO lineage:** UTXO-first applications must preserve covenant bindings, authorizing inputs, covenant IDs, and successor lineage. Matched: `Add Covenant Composability guide and PatternSnippet callout component`, `Rename to Inter-Covenant Communication (ICC) and add 3-tier payload/dynamic-dispatch snippets`, `app/llms.txt/route.ts`, `content/docs/index.mdx`, `content/docs/integrate/kaspa-node.mdx`, `content/docs/programmability/agent-brief.mdx`, `content/docs/programmability/argent.mdx`, `content/docs/programmability/based-apps.mdx`.
- **Fee, mass, and mempool policy:** Fee estimation must distinguish consensus validity from node relay policy and use current mass dimensions. Matched: `content/docs/integrate/transaction-payload.mdx`, `content/docs/programmability/agent-brief.mdx`, `content/docs/programmability/based-apps.mdx`, `content/docs/programmability/composability.mdx`, `content/docs/programmability/index.mdx`, `content/docs/programmability/kccs/kcc20.mdx`, `content/docs/programmability/references.mdx`, `content/docs/programmability/script-pricing.mdx`.
- **RPC, WASM, and SDK surface:** Integrators must regenerate or update client bindings and test required arguments, aliases, and serialization behavior. Matched: `examples/java/README.md`.
- **Wallet and PSKT construction:** Wallet construction and signing previews must preserve covenant fields, compute commitments, storage mass, and explicit fees. Matched: `content/docs/programmability/inline-zk.mdx`.
- **ZK verification and pricing:** Proof-system dependencies, verifier hardening, script-unit pricing, proof size, and failure behavior remain security-critical. Matched: `content/docs/programmability/agent-brief.mdx`, `content/docs/programmability/based-apps.mdx`, `content/docs/programmability/composability.mdx`, `content/docs/programmability/index.mdx`, `content/docs/programmability/inline-zk.mdx`, `content/docs/programmability/references.mdx`, `content/docs/programmability/script-pricing.mdx`, `content/docs/programmability/silverscript.mdx`.
- **Sequencing commitments and SMT state:** Lane-aware indexers and proof services must handle reorgs, pruning, inactivity shortcuts, and witness availability. Matched: `app/llms.txt/route.ts`, `content/docs/programmability/agent-brief.mdx`, `content/docs/programmability/based-apps.mdx`, `content/docs/programmability/full-vprogs.mdx`, `content/docs/programmability/index.mdx`, `content/docs/programmability/inline-zk.mdx`, `content/docs/programmability/references.mdx`, `content/docs/toccata/based-apps.mdx`.
- **Node storage, pruning, and IBD:** Operators must plan database migrations, resync cost, retention, pruning compatibility, and recovery procedures. Matched: `content/docs/integrate/transaction-payload.mdx`, `content/docs/integrate/wallet.mdx`, `content/docs/programmability/argent.mdx`, `content/docs/programmability/composability.mdx`, `content/docs/programmability/silverscript.mdx`, `content/docs/toccata/silverscript.mdx`.
- **Security hardening:** Consensus and network-facing fixes require adversarial regression tests and careful version-boundary review. Matched: `content/docs/programmability/agent-brief.mdx`, `content/docs/programmability/argent.mdx`, `content/docs/programmability/based-apps.mdx`, `content/docs/programmability/index.mdx`, `content/docs/programmability/inline-zk.mdx`, `content/docs/programmability/kccs/kcc20.mdx`, `content/docs/programmability/references.mdx`, `content/docs/programmability/script-pricing.mdx`.
- **Tests, benchmarks, and operator docs:** Changed examples, tests, and guides should become reproducible compatibility checks in downstream projects. Matched: `content/docs/programmability/silverscript.mdx`, `content/docs/toccata/references.mdx`, `content/docs/toccata/silverscript.mdx`.

### kaspanet/silverscript master

Commits:

- `acae66a5a245` Add silverscript- prefix to crates (#261)
- `15b7bc27680b` Fix tree-sitter crate name (#262)
- `443d519e6688` Remove mentions of kcc20 (#263)
- `7eb04634bfba` Fix r0 groth16 verification key and temporarily disable RISC Zero Succinct verification with an advisory … (#265)

Engineering impact:

- **Covenants and UTXO lineage:** UTXO-first applications must preserve covenant bindings, authorizing inputs, covenant IDs, and successor lineage. Matched: `README.md`, `debugger/cli/src/main.rs`, `debugger/cli/tests/cli_tests.rs`, `debugger/session/tests/debug_session_tests.rs`, `docs/DECL.md`, `docs/fungible-token-book/src/fungible-token-contract.md`, `docs/fungible-token-book/src/fungible-token-minter-contract.md`, `docs/fungible-token-book/src/fungible-token-overview.md`.
- **Fee, mass, and mempool policy:** Fee estimation must distinguish consensus validity from node relay policy and use current mass dimensions. Matched: `debugger/cli/src/main.rs`, `docs/DECL.md`.
- **RPC, WASM, and SDK surface:** Integrators must regenerate or update client bindings and test required arguments, aliases, and serialization behavior. Matched: `Cargo.lock`.
- **ZK verification and pricing:** Proof-system dependencies, verifier hardening, script-unit pricing, proof size, and failure behavior remain security-critical. Matched: `Fix r0 groth16 verification key and temporarily disable RISC Zero Succinct verification with an advisory … (#265)`, `Cargo.lock`, `silverscript-lang/src/compiler/builtin_types.rs`, `silverscript-lang/src/compiler/compile/expression/builtin.rs`, `silverscript-lang/src/compiler/compile/stack_analysis.rs`, `silverscript-lang/src/compiler/type_check.rs`, `silverscript-lang/tests/common.rs`, `silverscript-lang/tests/compiler_tests.rs`.
- **Sequencing commitments and SMT state:** Lane-aware indexers and proof services must handle reorgs, pruning, inactivity shortcuts, and witness availability. Matched: `Cargo.lock`.
- **Node storage, pruning, and IBD:** Operators must plan database migrations, resync cost, retention, pruning compatibility, and recovery procedures. Matched: `debugger/cli/README.md`.
- **Security hardening:** Consensus and network-facing fixes require adversarial regression tests and careful version-boundary review. Matched: `silverscript-lang/tests/covenant_declaration_security_tests.rs`.
- **Tests, benchmarks, and operator docs:** Changed examples, tests, and guides should become reproducible compatibility checks in downstream projects. Matched: `README.md`, `debugger/cli/tests/cli_tests.rs`, `debugger/session/tests/debug_session_tests.rs`, `docs/DECL.md`, `docs/fungible-token-book/README.md`, `docs/fungible-token-book/book.toml`, `docs/fungible-token-book/mermaid-init.js`, `docs/fungible-token-book/mermaid.min.js`.

### kaspanet/vprogs master

Commits:

- `8c31f4655811` deps: pin kaspa to rusty-kaspa rev eb0a856d (#149)
- `958cc7065932` runtime-processor: reusable battery for guest apps (#131)
- `2ab6d73158cc` app-kit: host-only issuer crate for app drivers (#134)
- `64f062b97ac2` bridge/settler/aggregate-prover: reorg-flapped-fork survival + keyless observers (#136)
- `36947de205de` scheduler, storage: ResourceIndexer hooks for app secondary indexes (#140)
- `9a71a0ef707b` zk-abi, aggregate-prover, app-kit: permission claim builder and per-bundle exit feed (#139)
- `b20938486018` bridge-lane-anchor bridge: anchor first lane activation at the parent seq commit (#142)
- `9b5d01f493f4` runner, bridge: exit index with permission spend watcher and settlement pairing (#138)
- `3f9321db89e3` bridge, settler: join an already-live lane (authoritative tip seeding + pinned bootstrap deploy) (#144)
- `8672f3f6e7b9` bridge: busy-DAG mergeset lane-tip integration test (#145)
- `18f00b1c0841` runner, bridge, l1/types: reorg-safe claim exits (chain-idx journal revert) (#146)
- `334a85dfc388` storage: drain write worker on shutdown; bridge: adaptive-filter disable option (#147)

Engineering impact:

- **Activation and P2P compatibility:** Node operators must track the activation DAA, release line, P2P version cutoff, and one-way upgrade constraints. Matched: `bridge-lane-anchor bridge: anchor first lane activation at the parent seq commit (#142)`, `l1/bridge/src/worker.rs`, `l1/wallet/src/build/pricing.rs`, `node/cli/src/l1_bridge_params.rs`, `node/cli/src/params.rs`, `sim/src/config.rs`.
- **Transaction and wire-format contracts:** RPC, protobuf, miner, pool, wallet, and indexer models must preserve v1 transaction fields without lossy renaming. Matched: `l1/bridge/tests/malformed_response.rs`, `l1/wallet/src/build/carrier.rs`, `l1/wallet/src/build/funding.rs`, `l1/wallet/src/build/payout.rs`, `l1/wallet/src/build/pricing.rs`, `l1/wallet/src/build/settlement.rs`, `l1/wallet/src/build/testing.rs`, `zk/backend/risc0/app-kit/src/lane.rs`.
- **Covenants and UTXO lineage:** UTXO-first applications must preserve covenant bindings, authorizing inputs, covenant IDs, and successor lineage. Matched: `Cargo.lock`, `Cargo.toml`, `examples/tn10-flow/src/config.rs`, `examples/tn10-flow/src/main.rs`, `examples/tn10-runtime/src/config.rs`, `examples/tn10-runtime/src/main.rs`, `l1/bridge/src/config.rs`, `l1/bridge/src/permission_watch.rs`.
- **Fee, mass, and mempool policy:** Fee estimation must distinguish consensus validity from node relay policy and use current mass dimensions. Matched: `zk-abi, aggregate-prover, app-kit: permission claim builder and per-bundle exit feed (#139)`, `prover: survive receipt gaps and mass-capped settlement funding (#169)`, `Cargo.toml`, `examples/tn10-runtime/src/main.rs`, `l1/bridge/src/permission_watch.rs`, `l1/bridge/src/worker.rs`, `l1/bridge/tests/malformed_response.rs`, `l1/wallet/src/build/carrier.rs`.
- **RPC, WASM, and SDK surface:** Integrators must regenerate or update client bindings and test required arguments, aliases, and serialization behavior. Matched: `Cargo.lock`, `Cargo.toml`, `l1/bridge/tests/integration.rs`, `sim/src/lane_source.rs`.
- **Wallet and PSKT construction:** Wallet construction and signing previews must preserve covenant fields, compute commitments, storage mass, and explicit fees. Matched: `zk/backend/risc0/app-kit/src/lane.rs`.
- **ZK verification and pricing:** Proof-system dependencies, verifier hardening, script-unit pricing, proof size, and failure behavior remain security-critical. Matched: `.github/workflows/ci.yml`, `Cargo.lock`, `Cargo.toml`, `examples/tn10-runtime/src/actions.rs`, `examples/tn10-runtime/tests/runtime_actions.rs`, `l1/bridge/Cargo.toml`, `l1/bridge/src/permission_watch.rs`, `l1/bridge/src/worker.rs`.
- **Sequencing commitments and SMT state:** Lane-aware indexers and proof services must handle reorgs, pruning, inactivity shortcuts, and witness availability. Matched: `bridge-lane-anchor bridge: anchor first lane activation at the parent seq commit (#142)`, `bridge, settler: join an already-live lane (authoritative tip seeding + pinned bootstrap deploy) (#144)`, `bridge: busy-DAG mergeset lane-tip integration test (#145)`, `zk: cancel the aggregate prover's lane-proof fetch on shutdown (#153)`, `storage, zk: reorg-safe store restore + deferred dead lane proofs (#152)`, `aggregate-prover: drain an unmapped-boundary settlement's prefix by lane tip (#170)`, `Cargo.lock`, `Cargo.toml`.
- **Node storage, pruning, and IBD:** Operators must plan database migrations, resync cost, retention, pruning compatibility, and recovery procedures. Matched: `scheduler, storage: ResourceIndexer hooks for app secondary indexes (#140)`, `storage: drain write worker on shutdown; bridge: adaptive-filter disable option (#147)`, `storage, zk: reorg-safe store restore + deferred dead lane proofs (#152)`, `bridge: finalize below the header-cited pruning point after a confirmation window (#157)`, `storage: canonical reads below the restore base and after a rollback to genesis (#158)`, `Cargo.lock`, `Cargo.toml`, `core/smt/Cargo.toml`.
- **Tests, benchmarks, and operator docs:** Changed examples, tests, and guides should become reproducible compatibility checks in downstream projects. Matched: `core/smt/tests/e2e.rs`, `examples/tn10-runtime/tests/runtime_actions.rs`, `l1/bridge/tests/integration.rs`, `l1/bridge/tests/malformed_response.rs`, `runner/tests/two_provers_contend.rs`, `scheduling/scheduler/tests/e2e.rs`, `scheduling/scheduler/tests/indexer.rs`, `scheduling/scheduler/tests/reorg_id_gap.rs`.

## Network Signals

| Source | Status | Network | Virtual DAA | Block count |
| --- | --- | --- | --- | --- |
| Mainnet blockdag | ok | kaspa-mainnet | 603940167 | 1350312 |
| TN10 blockdag | ok | kaspa-testnet-10 | 634789562 | 1488200 |
| TN12 blockdag | error |  | Invalid JSON: Unexpected token '<', "<html><bod"... is not valid JSON |  |

## Web Source Fingerprints

| Source | HTTP | Bytes | Fingerprint | Link |
| --- | --- | --- | --- | --- |
| Rusty Kaspa Toccata node guide | 200 | 8267 | 3d09ed0027e1 | [source](https://raw.githubusercontent.com/kaspanet/rusty-kaspa/v2.0.0/docs/toccata-guide.md) |
| Kaspa programmability overview | 200 | 121429 | e4019ea1da36 | [source](https://docs.kaspa.org/programmability) |
| Kaspa covenants docs | 200 | 171051 | 70d2cdd8bedb | [source](https://docs.kaspa.org/programmability/covenants) |
| Kaspa inline ZK docs | 200 | 96469 | 1caae9eb031d | [source](https://docs.kaspa.org/programmability/inline-zk) |
| Kaspa based apps docs | 200 | 128780 | 538312e1b347 | [source](https://docs.kaspa.org/programmability/based-apps) |
| Kaspa full vProgs docs | 200 | 82429 | 04f7317df76b | [source](https://docs.kaspa.org/programmability/full-vprogs) |
| Formal vProg computation DAG model | 200 | 46722 | 0d01364b7b40 | [source](https://research.kas.pa/t/zoom-in-a-formal-backbone-model-for-the-vprog-computation-dag/407) |
| vProgs pruning safety | 200 | 24937 | 647b4d92432f | [source](https://research.kas.pa/t/pruning-safety-in-the-vprogs-architecture/411) |
| Proof stitching framework | 200 | 32618 | cc44adf3732d | [source](https://research.kas.pa/t/a-basic-framework-for-proofs-stitching/323) |
| Based ZK rollups over Kaspa | 200 | 56014 | 57a169246005 | [source](https://research.kas.pa/t/on-the-design-of-based-zk-rollups-over-kaspas-utxo-based-dag-consensus/208) |
