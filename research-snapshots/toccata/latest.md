# Toccata Source Snapshot

Generated: 2026-05-25T13:25:09.843Z

Facts hash: `ec8440c8f32601e8b6b3a64114d0f447c81a0c5ec9f07e45330b909da44473f3`

## Verdict

- Mainnet activation: not_verified_by_monitor
- Implementation status: PR #1000 is open against master.
- Branch status: rusty-kaspa master a07d8b38d45f, toccata f1d1a1ae6a41.
- Caution: Do not equate open PRs with merged production behavior. Do not equate TN10/TN12 observations with mainnet activation. Use branch hashes, PR base refs, KIP merge state, and docs hashes together before making claims.


## Changes Since Previous Snapshot

Previous snapshot: 2026-05-25T13:23:53.253Z

Current snapshot: 2026-05-25T13:25:09.843Z

### Stable Facts

- No stable monitored fact changes detected.

### GitHub Pull Requests and KIP PR States

- No changes detected.

### GitHub References

- No changes detected.

### Testnet Signals

- TN10 blockdag: virtualDaaScore 473546380 -> 473547254; blockCount 1529136 -> 1530010; headerCount 1529136 -> 1530010.
- TN12 blockdag: virtualDaaScore 21054275 -> 21055042; blockCount 1414266 -> 1415033; headerCount 1414266 -> 1415033.

### Web Source Fingerprints

- No changes detected.


## GitHub Pull Requests

| Signal | State | Base | Head SHA | Updated | Link |
| --- | --- | --- | --- | --- | --- |
| Toccata implementation | open | master | f1d1a1ae6a41 | 2026-05-21T08:45:01Z | [source](https://github.com/kaspanet/rusty-kaspa/pull/1000) |
| ZK opcode updates | open | tn10 | 3201436e8e13 | 2026-05-25T13:20:24Z | [source](https://github.com/kaspanet/rusty-kaspa/pull/1013) |
| KIP-16 | open | master | c5ec7ff1060d | 2026-05-17T17:16:38Z | [source](https://github.com/kaspanet/kips/pull/31) |
| KIP-17 | open | master | 6fc7a1b20bfe | 2026-05-13T16:00:54Z | [source](https://github.com/kaspanet/kips/pull/32) |
| KIP-20 | open | master | 0581f55487ed | 2026-02-11T13:56:06Z | [source](https://github.com/kaspanet/kips/pull/35) |
| KIP-21 | open | master | bd4cfe43a603 | 2026-03-12T20:56:21Z | [source](https://github.com/kaspanet/kips/pull/36) |
| KIP-22 | open | master | cdafc96705eb | 2026-03-10T16:31:00Z | [source](https://github.com/kaspanet/kips/pull/37) |
| KIP-23 | open | master | bdd3abd55ab8 | 2026-05-06T08:03:20Z | [source](https://github.com/kaspanet/kips/pull/40) |

## PR Diff Summaries

| Signal | Files | Content signals | Top changed files | KIP document status |
| --- | --- | --- | --- | --- |
| Toccata implementation | 357 files, +43272/-3729 | Groth16 verifier, RISC0/Succinct verifier, RPC/WASM bindings, ZK precompile, consensus activation/config, docs, pricing/resource meter, tests/benches, transaction validation, txscript opcode/runtime | crypto/txscript/test-data/script_tests_covenants.json (+6026/-0); crypto/smt/src/tree.rs (+2196/-0); crypto/txscript/src/opcodes/mod.rs (+1757/-309); consensus/smt-store/tests/integration.rs (+1589/-0); crypto/txscript/benches/pricing.rs (+1586/-0); Cargo.lock (+1186/-286) |  |
| ZK opcode updates | 17 files, +1283/-138 | Groth16 verifier, RISC0/Succinct verifier, ZK precompile, consensus activation/config, pricing/resource meter, tests/benches, transaction validation, txscript opcode/runtime | crypto/txscript/src/zk_precompiles/tests/mod.rs (+362/-22); crypto/txscript/src/zk_precompiles/groth16/mod.rs (+312/-42); crypto/txscript/benches/pricing.rs (+312/-29); crypto/txscript/src/zk_precompiles/tests/helpers.rs (+122/-23); crypto/txscript/src/zk_precompiles/fields/mod.rs (+83/-2); crypto/txscript/src/runtime_resource_meter.rs (+26/-3) |  |
| KIP-16 | 2 files, +221/-1 | Groth16 verifier, KIP document, RISC0/Succinct verifier, ZK precompile, consensus activation/config, docs, pricing/resource meter, txscript opcode/runtime | kip-0016.md (+219/-0); README.md (+2/-1) | kip-0016.md: Proposed |
| KIP-17 | 1 file, +142/-0 | KIP document, consensus activation/config, docs, txscript opcode/runtime | kip-0017.md (+142/-0) | kip-0017.md: Draft |
| KIP-20 | 1 file, +343/-0 | KIP document, consensus activation/config, docs, txscript opcode/runtime | kip-0020.md (+343/-0) | kip-0020.md: Proposed, Implemented, Activated in TN12 |
| KIP-21 | 1 file, +699/-0 | KIP document, consensus activation/config, docs, txscript opcode/runtime | kip-0021.md (+699/-0) | kip-0021.md: Draft |
| KIP-22 | 1 file, +13/-0 |  | KIP22-P2MR-qr (+13/-0) |  |
| KIP-23 | 2 files, +294/-1 | KIP document, RPC/WASM bindings, docs, txscript opcode/runtime | kip-0023.md (+292/-0); README.md (+2/-1) | kip-0023.md: Proposed |

## GitHub References

| Reference | SHA | Type |
| --- | --- | --- |
| kaspanet/rusty-kaspa heads/master | a07d8b38d45f | commit |
| kaspanet/rusty-kaspa heads/toccata | f1d1a1ae6a41 | commit |
| kaspanet/rusty-kaspa heads/tn10 | f1d1a1ae6a41 | commit |
| kaspanet/rusty-kaspa heads/tn12 | 7b1e18cc6e70 | commit |
| kaspanet/rusty-kaspa tags/tn10-toc2 | 97415b689462 | commit |
| kaspanet/rusty-kaspa tags/v1.1.0 | e97070faa382 | commit |
| kaspanet/kips heads/master | 2a77c954b224 | commit |
| kaspanet/docs heads/main | 6aa5e9f52995 | commit |
| kaspanet/silverscript heads/master | 2c4623124d75 | commit |
| kaspanet/vprogs heads/master | 57039db09ea9 | commit |

## Testnet Signals

| Source | Status | Network | Virtual DAA | Block count |
| --- | --- | --- | --- | --- |
| TN10 blockdag | ok | kaspa-testnet-10 | 473547254 | 1530010 |
| TN12 blockdag | ok | kaspa-testnet-12 | 21055042 | 1415033 |

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
