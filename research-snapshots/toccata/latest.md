# Toccata Source Snapshot

Generated: 2026-06-06T01:39:16.315Z

Facts hash: `09fb9264350e6cf7c7e8882ebc1bf704383afea8878a8bb70a3ccab70e58bf4f`

## Verdict

- Mainnet activation: scheduled for mainnet DAA 474165565 (June 30, 2026, at 16:15 UTC); current mainnet is below threshold
- Mainnet DAA observed: 452903728
- Activation DAA: 474165565
- Implementation status: PR #1000 is closed and merged against master.
- Branch status: rusty-kaspa master 90dbf074275d, toccata 0ae28f939e61.
- Caution: Do not equate open PRs with merged production behavior. A final release and activation schedule do not mean the activation DAA has been reached. Separate protocol activation from wallet, pool, indexer, explorer, and application readiness.


## Changes Since Previous Snapshot

Previous snapshot: 2026-06-06T01:38:20.406Z

Current snapshot: 2026-06-06T01:39:16.315Z

### Stable Facts

- No stable monitored fact changes detected.

### GitHub Pull Requests and KIP PR States

- No changes detected.

### GitHub Releases

- No changes detected.

### GitHub References

- No changes detected.

### Network Signals

- Mainnet blockdag: virtualDaaScore 452903094 -> 452903728; blockCount 26370527 -> 26371161; headerCount 26370527 -> 26371161.
- TN10 blockdag: virtualDaaScore 483497959 -> 483498498; blockCount 1468740 -> 1469279; headerCount 1468740 -> 1469279.

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
| Final Toccata mainnet release | v2.0.0 | no | 2026-06-05T12:09:13Z | master | This release introduces the **Toccata Hardfork**, marking a major milestone described in [KIP16](https://github.com/kaspanet/kips/blob/master/kip-0016.md), [KIP17](https://github.com/kaspanet/kips/blob/master/kip-0017.md), [KIP20](https://github.com/kaspanet/kips/blob/master/kip-0020.md), and [KIP21](https://github.com/kaspanet/kips/blob/master/kip-0021.md), bringing native L1 covenant programming and infrastructure for based ZK applications to Kaspa. The hard fork is scheduled to activate on mainnet at DAA score `474,165,565`, roughly on June 30, 2026, at 16:15 UTC.; Starting **24 hours before activation**, nodes will connect only to peers using the new **P2P protocol version 10**. Ensure your node is updated to maintain network connectivity.; ## Node upgrade guide; Ensure your node is updated to stay compatible with the Toccata Hardfork. For detailed instructions on upgrading and configuring your node, refer to the [Toccata Guide](https://github.com/kaspanet/rusty-kaspa/blob/master/docs/toccata-guide.md). | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0) |
| Toccata mainnet pre-activation pre-release | v1.3.0-toc.5 | yes | 2026-06-03T13:34:34Z | master | ## Toccata Mainnet pre-activation pre-release; This pre-release is intended for community-wide mainnet sanity testing before the final Toccata rollout.; The main goal is to verify that pre-activation mainnet behavior remains fully compatible with the current master release across a wider range of real-world node histories, upgrade paths, pruning states, and operator setups.; This pre-release does **not** activate Toccata on mainnet. Operators who test it should expect one more upgrade when the final Toccata release is published.; - Node operators are encouraged to test this pre-release on mainnet, especially on nodes with different upgrade histories and pruning states.; - Operators, pools, and miners are encouraged to test with a limited subset of infrastructure rather than fully migrating operations.; - Miners may use this pre-release to sanity-test mining flows, but this does not replace testing on an activated testnet. Before activation, mainnet block templates only contain current transaction versions, so some Toccata-specific paths are only meaningfully exercised after activation.; - RPC transaction submission now applies the upcoming higher minimum standard fee rule: `100 sompi * max(compute grams, 2 * transaction bytes)`. | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.3.0-toc.5) |
| TN10 Toccata ZK hardening | tn10-toc3 | yes | 2026-05-27T19:04:15Z | tn10 | This pre-release schedules the Toccata ZK hardening hard fork on testnet-10.; The release activates the final Toccata hardening layer on TN10, including Groth16 verifier hardening, updated ZK pricing behavior, and the SMT/seqcommit inactivity shortcut used by inactivity proofs. This activation is part of the final TN10 validation cycle before the accumulated Toccata logic is cleaned up and prepared for mainnet.; Activation is scheduled for:; DAA Score: 476,232,000; TN10 nodes should upgrade before the activation point. | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/tn10-toc3) |
| TN10 Toccata hardfork rehearsal | tn10-toc2 | yes | 2026-05-16T19:09:09Z | master | This release scheduled the Toccata hardofork in testnet-10 to:; DAA Score: 467,579,632 | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/tn10-toc2) |
| Pre-Toccata stable baseline | v1.1.0 | no | 2026-03-04T15:04:45Z | master | ## Highlights; - **VSPC API v2 (`GetVirtualChainFromBlockV2`) (major integrator improvement)**; - **IBD catchup improvements (faster, safer recovery and sync progression)**; - **Performance + storage optimizations (significant practical gains)**; - **Pruning proof algorithm refactor + stability upgrades**; ## VSPC API v2 Specification (`GetVirtualChainFromBlockV2`); - Non-breaking addition: existing `GetVirtualChainFromBlock` is unchanged.; - Verbosity is incremental (`Full` includes `High`, `Low`, and `None`). | [source](https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.1.0) |

## GitHub References

| Reference | SHA | Type |
| --- | --- | --- |
| kaspanet/rusty-kaspa heads/master | 90dbf074275d | commit |
| kaspanet/rusty-kaspa heads/toccata | 0ae28f939e61 | commit |
| kaspanet/rusty-kaspa heads/tn10 | e5f6d1f7c86f | commit |
| kaspanet/rusty-kaspa heads/tn12 | ab4c51afde90 | commit |
| kaspanet/rusty-kaspa tags/tn10-toc2 | 97415b689462 | commit |
| kaspanet/rusty-kaspa tags/tn10-toc3 | 1015a62359e0 | commit |
| kaspanet/rusty-kaspa tags/v1.3.0-toc.5 | 04b0d135f8c8 | commit |
| kaspanet/rusty-kaspa tags/v2.0.0 | 90dbf074275d | commit |
| kaspanet/rusty-kaspa tags/v1.1.0 | e97070faa382 | commit |
| kaspanet/kips heads/master | 1aba3b8321c1 | commit |
| kaspanet/docs heads/main | 6aa5e9f52995 | commit |
| kaspanet/silverscript heads/master | 2c4623124d75 | commit |
| kaspanet/vprogs heads/master | 57039db09ea9 | commit |

## Upstream Branch Deltas

| Source | Status | Range | Commits | Files | Engineering impact | Link |
| --- | --- | --- | --- | --- | --- | --- |
| kaspanet/rusty-kaspa master | last_observed_change | d5205cc72ab7 -> 90dbf074275d | 12 | 98 | Activation and P2P compatibility, Transaction and wire-format contracts, Covenants and UTXO lineage, Fee, mass, and mempool policy, RPC, WASM, and SDK surface, Wallet and PSKT construction, ZK verification and pricing, Node storage, pruning, and IBD, Security hardening, Tests, benchmarks, and operator docs | [compare](https://github.com/kaspanet/rusty-kaspa/compare/d5205cc72ab7b811e88a23595dfac5b9facdeece...90dbf074275d60c1fe74a3491883196f110970c0) |
| kaspanet/rusty-kaspa toccata | unchanged | 0ae28f939e61 -> 0ae28f939e61 | 0 | 0 |  |  |
| kaspanet/rusty-kaspa tn10 | last_observed_change | 6899ea75384c -> e5f6d1f7c86f | 27 | 126 | Activation and P2P compatibility, Transaction and wire-format contracts, Covenants and UTXO lineage, Fee, mass, and mempool policy, RPC, WASM, and SDK surface, Wallet and PSKT construction, ZK verification and pricing, Node storage, pruning, and IBD, Security hardening, Tests, benchmarks, and operator docs | [compare](https://github.com/kaspanet/rusty-kaspa/compare/6899ea75384c1f422fe4ab0e47c439442da3f4fa...e5f6d1f7c86f3a3afbe97dbb75e72a0a3ff66a57) |
| kaspanet/rusty-kaspa tn12 | unchanged | ab4c51afde90 -> ab4c51afde90 | 0 | 0 |  |  |
| kaspanet/kips master | unchanged | 1aba3b8321c1 -> 1aba3b8321c1 | 0 | 0 |  |  |
| kaspanet/docs main | unchanged | 6aa5e9f52995 -> 6aa5e9f52995 | 0 | 0 |  |  |
| kaspanet/silverscript master | unchanged | 2c4623124d75 -> 2c4623124d75 | 0 | 0 |  |  |
| kaspanet/vprogs master | unchanged | 57039db09ea9 -> 57039db09ea9 | 0 | 0 |  |  |

### kaspanet/rusty-kaspa master

Commits:

- `ae51b8a5072e` Reenable TN10 (#1038)
- `770e3e9d4fd2` feat(rpc): get block reward by hash (#927)
- `a9451167d721` Rename tx.mass -> tx.storage_mass (#1039)
- `c26d517a80aa` Rename input.mass -> input.compute_commit, TxInputMass -> ComputeCommit (#1040)
- `9bd6581b9c25` Make storage_mass a required field in RpcTransaction when decoding JSON (#1043)
- `36126503b812` clean: remove consensus get current block color (#1042)
- `c1d8189303cd` feat(wasm/txscript): allows passing script builder flags (#999)
- `bbadf5e57170` fix(wallet/generator): include covenant bindings (#896)
- `580fa8b5d5a6` fix(wasm): mempool entries request args are required (#951)
- `b8deb638dab0` Set Toccata to activate on mainnet (#1044)
- `4e8f3135828d` Fix script engine handling of unknown script versions (#1046)
- `90dbf074275d` Add Toccata upgrade guide (#1045)

Engineering impact:

- **Activation and P2P compatibility:** Node operators must track the activation DAA, release line, P2P version cutoff, and one-way upgrade constraints. Matched: `consensus/core/src/config/params.rs`, `docs/toccata-guide.md`, `mining/src/toccata_transient_mass_activation_tests.rs`.
- **Transaction and wire-format contracts:** RPC, protobuf, miner, pool, wallet, and indexer models must preserve v1 transaction fields without lossy renaming. Matched: `Rename tx.mass -> tx.storage_mass (#1039)`, `Rename input.mass -> input.compute_commit, TxInputMass -> ComputeCommit (#1040)`, `Make storage_mass a required field in RpcTransaction when decoding JSON (#1043)`, `consensus/core/src/tx.rs`, `consensus/core/src/tx/serde_impl.rs`, `protocol/p2p/proto/p2p.proto`, `rpc/grpc/core/proto/messages.proto`, `rpc/grpc/core/proto/rpc.proto`.
- **Covenants and UTXO lineage:** UTXO-first applications must preserve covenant bindings, authorizing inputs, covenant IDs, and successor lineage. Matched: `fix(wallet/generator): include covenant bindings (#896)`, `consensus/src/pipeline/virtual_processor/utxo_validation.rs`, `consensus/src/processes/transaction_validator/tx_validation_in_utxo_context.rs`.
- **Fee, mass, and mempool policy:** Fee estimation must distinguish consensus validity from node relay policy and use current mass dimensions. Matched: `Rename tx.mass -> tx.storage_mass (#1039)`, `Rename input.mass -> input.compute_commit, TxInputMass -> ComputeCommit (#1040)`, `Make storage_mass a required field in RpcTransaction when decoding JSON (#1043)`, `fix(wasm): mempool entries request args are required (#951)`, `consensus/core/src/mass/mod.rs`, `consensus/core/src/mass/units.rs`, `mining/src/mempool/check_transaction_limits.rs`, `mining/src/mempool/check_transaction_standard.rs`.
- **RPC, WASM, and SDK surface:** Integrators must regenerate or update client bindings and test required arguments, aliases, and serialization behavior. Matched: `feat(wasm/txscript): allows passing script builder flags (#999)`, `fix(wasm): mempool entries request args are required (#951)`, `consensus/wasm/src/utils.rs`, `crypto/txscript/src/wasm/builder.rs`, `rpc/core/src/api/ops.rs`, `rpc/core/src/api/rpc.rs`, `rpc/core/src/convert/tx.rs`, `rpc/core/src/convert/verbosity.rs`.
- **Wallet and PSKT construction:** Wallet construction and signing previews must preserve covenant fields, compute commitments, storage mass, and explicit fees. Matched: `fix(wallet/generator): include covenant bindings (#896)`, `consensus/client/src/signing.rs`, `wallet/core/src/tests/rpc_core_mock.rs`, `wallet/core/src/tx/generator/generator.rs`, `wallet/core/src/tx/generator/test.rs`, `wallet/core/src/tx/mass.rs`, `wallet/core/src/wasm/tx/mass.rs`, `wallet/pskt/src/convert.rs`.
- **ZK verification and pricing:** Proof-system dependencies, verifier hardening, script-unit pricing, proof size, and failure behavior remain security-critical. Matched: `wasm/examples/nodejs/javascript/zkproof/groth16.js`, `wasm/examples/nodejs/javascript/zkproof/risc0-succinct.js`.
- **Node storage, pruning, and IBD:** Operators must plan database migrations, resync cost, retention, pruning compatibility, and recovery procedures. Matched: `Rename tx.mass -> tx.storage_mass (#1039)`, `Make storage_mass a required field in RpcTransaction when decoding JSON (#1043)`, `consensus/core/tests/db_compat.rs`.
- **Security hardening:** Consensus and network-facing fixes require adversarial regression tests and careful version-boundary review. Matched: `Fix script engine handling of unknown script versions (#1046)`.
- **Tests, benchmarks, and operator docs:** Changed examples, tests, and guides should become reproducible compatibility checks in downstream projects. Matched: `consensus/benches/check_scripts.rs`, `consensus/core/benches/serde_benchmark.rs`, `consensus/core/tests/db_compat.rs`, `crypto/txscript/benches/pricing.rs`, `docs/toccata-guide.md`, `rothschild/benches/bench.rs`, `rpc/grpc/server/src/tests/rpc_core_mock.rs`, `wallet/core/src/tests/rpc_core_mock.rs`.

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

## Network Signals

| Source | Status | Network | Virtual DAA | Block count |
| --- | --- | --- | --- | --- |
| Mainnet blockdag | ok | kaspa-mainnet | 452903728 | 26371161 |
| TN10 blockdag | ok | kaspa-testnet-10 | 483498498 | 1469279 |
| TN12 blockdag | error |  | Internal server error |  |

## Web Source Fingerprints

| Source | HTTP | Bytes | Fingerprint | Link |
| --- | --- | --- | --- | --- |
| Rusty Kaspa Toccata node guide | 200 | 8267 | 3d09ed0027e1 | [source](https://raw.githubusercontent.com/kaspanet/rusty-kaspa/v2.0.0/docs/toccata-guide.md) |
| Kaspa programmability overview | 200 | 55397 | 8a4394dc9266 | [source](https://docs.kaspa.org/programmability) |
| Kaspa covenants docs | 200 | 54726 | 73e4a4a4676b | [source](https://docs.kaspa.org/programmability/covenants) |
| Kaspa inline ZK docs | 200 | 53928 | f0935b1651d6 | [source](https://docs.kaspa.org/programmability/inline-zk) |
| Kaspa based apps docs | 200 | 52059 | 618bd928125d | [source](https://docs.kaspa.org/programmability/based-apps) |
| Kaspa full vProgs docs | 200 | 45792 | a33718dab852 | [source](https://docs.kaspa.org/programmability/full-vprogs) |
| Formal vProg computation DAG model | 200 | 46722 | 0d01364b7b40 | [source](https://research.kas.pa/t/zoom-in-a-formal-backbone-model-for-the-vprog-computation-dag/407) |
| vProgs pruning safety | 200 | 24937 | 647b4d92432f | [source](https://research.kas.pa/t/pruning-safety-in-the-vprogs-architecture/411) |
| Proof stitching framework | 200 | 32618 | cc44adf3732d | [source](https://research.kas.pa/t/a-basic-framework-for-proofs-stitching/323) |
| Based ZK rollups over Kaspa | 200 | 56014 | 57a169246005 | [source](https://research.kas.pa/t/on-the-design-of-based-zk-rollups-over-kaspas-utxo-based-dag-consensus/208) |
