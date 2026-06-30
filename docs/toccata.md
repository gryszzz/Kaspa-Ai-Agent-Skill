# Toccata Builder Guide

Toccata changes the Kaspa engineering surface. Treat it as native L1 covenant
programming plus based-ZK and sequencing-commitment infrastructure, not as a
generic performance upgrade.

Source status: official/repo-backed only. Audit baseline: 2026-06-30. GitHub
reported `rusty-kaspa` latest release `v2.0.1`, published
2026-06-15T19:14:22Z, tag `cfafeb4c093fa37a303f1b9f19c58f986b870ce3`.
`v2.0.0` was published 2026-06-05T12:09:13Z, tag
`90dbf074275d60c1fe74a3491883196f110970c0`.

Post-activation audit: on 2026-06-30T22:39:08Z the live mainnet source monitor
returned `networkName=kaspa-mainnet` and `virtualDaaScore=474391519`, above the
activation DAA `474165565`. This proves Toccata protocol activation on
mainnet for this audit. It does not prove wallet, indexer, miner, explorer, or
application readiness.

## Source Pack

| Source | Use it for |
| --- | --- |
| Rusty Kaspa `v2.0.1` release: `https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.1` | Current implementation target for Toccata builders. |
| Rusty Kaspa `v2.0.0` release: `https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0` | Main Toccata hardfork release, KIP linkage, activation schedule, P2P protocol timing. |
| Toccata Guide: `https://github.com/kaspanet/rusty-kaspa/blob/master/docs/toccata-guide.md` | Operator and integrator checklist, fee policy, transaction/API fields, protobuf, pool, miner, exchange, wallet, and indexer requirements. |
| KIP-16: `https://github.com/kaspanet/kips/blob/master/kip-0016.md` | `OpZkPrecompile` and ZK proof verification model. |
| KIP-17: `https://github.com/kaspanet/kips/blob/master/kip-0017.md` | Covenant and transaction-introspection scripting surface. |
| KIP-20: `https://github.com/kaspanet/kips/blob/master/kip-0020.md` | `covenant_id`, covenant lineage, and UTXO data model. |
| KIP-21: `https://github.com/kaspanet/kips/blob/master/kip-0021.md` | Partitioned sequencing commitments, lanes, lane proofs, and O(activity) proving model. |
| Go Kaspad `v0.12.23`: `https://github.com/kaspanet/kaspad/releases/tag/v0.12.23` | Legacy Go wallet/tooling compatibility and fee-rate preparation. |
| Rusty Kaspa proto files: `https://github.com/kaspanet/rusty-kaspa/blob/master/rpc/grpc/core/proto/messages.proto` and `https://github.com/kaspanet/rusty-kaspa/blob/master/rpc/grpc/core/proto/rpc.proto` | gRPC/protobuf binding regeneration and field-level verification. |
| Rusty Kaspa repo: `https://github.com/kaspanet/rusty-kaspa` | Code-level grounding, stable branch, WASM/TypeScript SDK paths, and release-tag inspection. |

Do not use hype posts, market commentary, or community summaries as technical
truth for Toccata behavior.

## Builder Mental Model

- Toccata brings native L1 covenant programming and based-ZK infrastructure
  through KIP-16, KIP-17, KIP-20, and KIP-21.
- KIP-16 adds ZK proof verification through `OpZkPrecompile`.
- KIP-17 adds covenant and transaction-introspection opcodes. Do not invent
  opcodes that are not in the KIP.
- KIP-20 adds consensus-tracked `covenant_id` lineage carried by UTXOs.
- KIP-21 adds partitioned sequencing commitments and lane proofs so proving can
  be proportional to lane activity rather than global activity.
- Rusty Kaspa `v2.0.1` or newer is the current implementation target for new
  Toccata work. Use Go Kaspad `v0.12.23` only for legacy Go wallet/tooling
  compatibility and label it as legacy.
- Mainnet protocol activation is now verified by live DAA evidence, but
  downstream readiness remains a separate audit.

## Fee Model

The Toccata Guide defines the post-Toccata minimum standard fee policy as:

```text
100 sompi * max(compute grams, 2 * transaction bytes)
```

Rules for skill output:

- Call this node or mempool policy, not consensus.
- Tell builders to use fee-estimation RPC where possible.
- Fixed-fee software must update from old fixed assumptions.
- Do not claim zero-fee transactions are consensus-invalid solely because
  relay or direct RPC submission policy may reject them.

## Transaction And RPC Fields

Use the current names in new code and examples:

```text
RpcTransaction.storage_mass
JSON/WASM storageMass
RpcTransactionInput.computeBudget
RpcTransactionOutput.covenant
RpcUtxoEntry.covenant_id
transaction version 1
```

Compatibility rules:

- `mass` is deprecated for JSON/WASM-facing code; `storageMass` is the new
  field name.
- Rust/protobuf code should use `storage_mass`.
- If an integration accepts both `mass` and `storageMass`, conflicting values
  must be rejected rather than guessed.
- Regenerate protobuf bindings after reviewing `messages.proto` and
  `rpc.proto`; do not hand-patch generated structs.

Example field-shape checklist:

```text
transaction.version = 1
transaction.storageMass = <storage mass commitment>
input.computeBudget = <compute budget>
output.covenant = <covenant binding>
utxoEntry.covenant_id = <32-byte covenant lineage id>
```

## Role Prompts

Use these prompt modules when the skill is asked for Toccata guidance.

### Node Operators

- Upgrade to Rusty Kaspa `v2.0.1` or newer unless a cited source requires a
  different target.
- Treat database upgrade as one-way; rollback to pre-Toccata software requires
  resync planning.
- Use Testnet-10 for integration testing where relevant.
- Verify mainnet activation with live network name and DAA before claiming
  active behavior.

### Wallet Builders

- Prefer RPC fee estimation instead of fixed fees.
- Show `storageMass`, compute budget, covenant transitions, recipient, amount,
  change, fee, and network before signing.
- Preserve Kasware and Kaspium compatibility.
- Never expose seeds or private keys in prompts, logs, frontend state, or
  fixtures.

### Pool And Miner Integrators

- Preserve `RpcBlockHeader.version`, transaction version `1`,
  `RpcTransaction.storage_mass`, `RpcTransactionInput.computeBudget`, and
  `RpcTransactionOutput.covenant` from `GetBlockTemplate` through job
  distribution, solved block reconstruction, and `SubmitBlock`.
- Review `GetBlockRewardInfo` when reward accounting or miner reporting is in
  scope.
- Do not drop post-Toccata fields in custom stratum or template serializers.

### Indexers And Explorers

- Parse transaction version `1`, `computeBudget`, output `covenant`, UTXO
  `covenant_id`, and `storageMass`/`storage_mass`.
- Index covenant lineage by genesis outpoint, covenant ID, continuation edge,
  accepted transaction context, and reorg state.
- Review `GetSeqCommitLaneProof` for KIP-21 lane-proof data.
- Label derived or cached state explicitly.

### KaspaScript And Covenant Builders

- Start from KIP-17 and KIP-20.
- Model covenant genesis, continuation, and non-forgeability.
- Build invalid-transition tests before presenting a covenant pattern as
  usable.
- Do not describe Toccata as EVM-style smart contracts.

### ZK And Lane-Proof Researchers

- Start from KIP-16 and KIP-21.
- Explain proof binding in terms of program identity, image ID, journal or
  public inputs, and lane context when applicable.
- Use lane, `lane_id`, active-lanes root, sequencing commitment, and
  `merge_idx` terminology only when grounded in KIP-21 or Rusty Kaspa code.
- Do not invent future KIPs, proof systems, or roadmap status.

## Guardrails

- No fake Toccata claims.
- No made-up opcodes.
- No full EVM-style smart-contract claims.
- No fake fee rules.
- No fake activation, wallet-readiness, indexer-readiness, miner-readiness, or
  roadmap claims.
- No trading advice, price predictions, or urgency framing.
- Treat outdated pre-release notes as historical or testnet evidence unless a
  current official source says otherwise.
- Always cite the release, KIP, Toccata Guide, proto file, or local evidence
  note used.

## Required Local Cross-References

Before proposing code changes, load the narrow file that matches the task:

- `TRAINING_SOURCES.md`
- `docs/toccata-evidence-ladder.md`
- `docs/kaspa/toccata-upgrade-readiness.md`
- `docs/kaspa/covenant-lineage-indexer.md`
- `docs/kaspa/wallet-covenant-signing-preview.md`
- `docs/kaspa/sequencing-witness-api.md`
- `docs/kaspa/zk-proof-cost-matrix.md`
- `skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md`
