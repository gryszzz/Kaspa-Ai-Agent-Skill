# Kaspa Toccata R&D Intelligence Upgrade

Generated: 2026-06-06T01:39:16Z

## Executive Verdict

Toccata is not just "smart contracts on Kaspa." It is a bundle of UTXO-native programmability primitives that preserves Kaspa's proof-of-work BlockDAG identity while opening paths for covenants, proof-verified execution, and app-lane sequencing.

The strategic path is to master three layers at once:

- L1 covenant state machines for asset-native rules.
- ZK verification and sequencing commitments for proof-backed settlement.
- Based Apps and vProgs for shared-state concurrency and future synchronous composition.

Current high-confidence status:

- Rusty Kaspa `v2.0.0` is the final Toccata release. Activation is scheduled for mainnet DAA `474,165,565`, roughly 2026-06-30 16:15 UTC.
- The 2026-06-06 mainnet endpoint observation remained below the activation DAA, so the protocol is scheduled, not yet active.
- PR #1000, `Toccata`, is closed and merged from `toccata` into `master`.
- PR #1013, `ZK opcode updates`, is closed and merged into `tn10`.
- `tn10-toc3` is TN10 Toccata ZK hardening evidence. Its release notes schedule TN10 activation for May 28, 2026 around 16:00 UTC at DAA score 476,232,000.
- KIP-16, KIP-17, KIP-20, and KIP-21 are closed and merged to `kaspanet/kips` `master`; their document statuses indicate implemented/activated on TN10.
- The mainnet readiness gate separates protocol activation from wallet/indexer readiness. The release, schedule, merged code, mainnet endpoint, and official guide are present; the activation DAA has not yet been reached.

## Source Snapshot

Audit date: 2026-06-06T01:39:16Z

Rusty Kaspa:

- `master`: `90dbf074275d60c1fe74a3491883196f110970c0`
- `toccata`: `0ae28f939e61994a11eb8eb6dd775255e2924afb`
- `tn10`: `e5f6d1f7c86f3a3afbe97dbb75e72a0a3ff66a57`
- `tn12`: `ab4c51afde90dc6e0bce3f782d0a18af5da29434`
- tag `v1.3.0-toc.5`: `04b0d135f8c8023676ea74dcf496c99d5d0bc2a5`
- tag `v2.0.0`: `90dbf074275d60c1fe74a3491883196f110970c0`
- tag `tn10-toc3`: `1015a62359e0d06e0b3b3b7f7d06bc1bd4bf0c1b`
- tag `tn10-toc2`: `97415b689462bec8a1a36f1665302529ea8a3108`
- latest stable release tag observed: `v2.0.0`

KIPs:

- `kaspanet/kips` `master`: `1aba3b8321c1d27e00b7d87bd7c74ef879efabdc`
- KIP-16 PR #31: closed/merged, head `09d3615ef0c519b31f9eaf606f461267f1e98c75`, document status `Proposed, Implemented and activated in TN10`
- KIP-17 PR #32: closed/merged, head `b9b11429fdfccc0f6c1340a8184f13e71b3a1c75`, document status `Implemented and activated in TN10`
- KIP-20 PR #35: closed/merged, head `e747e0286adac97142467f300f62b3207e59468f`, document status `Proposed, Implemented and activated in TN10`
- KIP-21 PR #36: closed/merged, head `5214505744ed621bc4692ab426b41fa27406bcd0`, document status `Implemented and activated in TN10`

Docs and tooling:

- `kaspanet/docs` `main`: `6aa5e9f52995f53dc85ef3e8c7c71bab9a359b3e`
- `kaspanet/silverscript` `master`: `2c4623124d75bd8a9a7f87ded9413ef9f6b17acd`
- `kaspanet/vprogs` `master`: `57039db09ea958689aee2ae89f81ba40c8cc3e6d`

Live network checks:

- Mainnet REST `info/blockdag`: `networkName = kaspa-mainnet`, `virtualDaaScore = 452903728`
- TN10 REST `info/blockdag`: `networkName = kaspa-testnet-10`, `virtualDaaScore = 483498498`
- TN12 REST returned `HTTP 500` during the snapshot and is recorded as unavailable.

Final-release API changes:

- `Transaction.mass` became `storage_mass` in Rust/protobuf and `storageMass` in JSON/JavaScript.
- Legacy JSON `mass` remains an alias; when both names are supplied, conflicting values are rejected.
- `TransactionInput.mass`/`TxInputMass` became `compute_commit`/`ComputeCommit`.
- Wallet transaction generation now preserves covenant bindings.
- Pools and miners must preserve covenant and compute-commit fields from `GetBlockTemplate` through `SubmitBlock`.

## Feature Intelligence

### KIP-17: Covenants And Script Expansion

Primary capability:

- More transaction introspection.
- Byte-string manipulation.
- Additional arithmetic and bitwise operations.
- Covenant-style state transition validation.

Why it matters:

- A covenant can validate that a spend creates the next valid output state.
- State can be carried through protected UTXOs.
- Independent covenant states can execute in parallel because they are separate UTXOs.

What to build:

- Simple vault covenant.
- Stateful asset covenant.
- Timed claim covenant.
- Invalid successor-output tests.
- Indexer that tracks the previous covenant UTXO and next covenant UTXO.

Risk:

- Complex state machines can exceed script, transaction, or mental-model limits.
- Wallets must not display covenant spends as ordinary sends.

### KIP-20: Covenant IDs

Primary capability:

- A consensus-tracked `covenant_id` on UTXO entries and covenant-bound outputs.
- Non-forgeable covenant lineage for continuation and genesis outputs.

Why it matters:

- Indexers can track covenant membership without reconstructing full parent/grandparent witness chains.
- State identity becomes first-class enough for app tooling.
- Forged covenant UTXOs become uncreatable, not merely unspendable, when the rule is enforced correctly.

What to build:

- Covenant lineage table.
- Covenant genesis detector.
- Authorizing input verifier.
- Wallet display of `covenant_id` and successor set.

Risk:

- Incorrect indexers may mislabel lineage if they ignore authorizing input and genesis rules.
- App developers may assume covenant IDs enforce transition logic by themselves. They do not. Scripts must still enforce valid transition shape.

### KIP-16: ZK Precompile Opcode

Primary capability:

- `OpZkPrecompile` as a generic dispatch point for specific proof-system verifiers.
- Initial design paths include Groth16 and RISC0/Succinct style verification.

Why it matters:

- L1 can verify computation without re-running full computation.
- Bridges, rollups, privacy actions, and computational-integrity workflows become possible.

What to build:

- Proof-system choice matrix.
- Proof-bearing transaction schema.
- Verification-cost tracker.
- Testnet-only proof settlement examples.

Risk:

- ZK verifier libraries become security dependencies.
- Proof systems differ in proof size, verification cost, maturity, and quantum-safety properties.
- Final verifier behavior is released, but verifier dependencies and pricing remain security-sensitive and must be benchmarked against `v2.0.0`.

### KIP-21: Partitioned Sequencing Commitments

Primary capability:

- Lane-local sequencing commitments intended to make proofs scale with relevant activity rather than global chain activity.
- Header-level commitment remains compact while preserving lane-local witness paths.

Why it matters:

- Provers should be able to prove a target app lane without processing unrelated global activity.
- This is a bridge from BlockDAG sequencing to proof-backed app execution.

What to build:

- Lane-aware accepted-transaction index.
- `subnetwork_id` to lane mapping monitor.
- Sequencing witness API sketch.
- O(activity) proof-cost estimator.

Risk:

- Witness availability, pruning, and reorg handling become application-critical.
- Wallet and explorer UX needs to explain proof/commitment confidence without overwhelming users.

### Based Apps And vProgs

Primary capability:

- Based Apps provide the practical shared-state option.
- Full vProgs are future-direction work for synchronously composable independent apps.

Why it matters:

- Covenants are excellent for small, asset-native state machines.
- Many users mutating one shared state belongs closer to Based Apps or future vProg architecture.
- vProg research reframes rollups around sovereign programs, account scopes, proof cadence, and sync composition.

What to build:

- Computation DAG simulator.
- Read/write set visualizer.
- Scope-cost estimator.
- Proof cadence model.
- Pruning safety test harness.

Risk:

- Proof latency and witness size can silently dominate UX.
- Cross-vProg dependency graphs can grow into expensive scopes.
- App-to-app standards must prevent unsafe dependencies.

## R&D Operating System

### Daily Source Audit

Run a current-status audit before any serious claim:

```bash
git ls-remote --heads --tags https://github.com/kaspanet/rusty-kaspa.git master toccata tn10 tn12 refs/tags/v2.0.0 refs/tags/v1.3.0-toc.5 refs/tags/tn10-toc3
gh release view -R kaspanet/rusty-kaspa v2.0.0 --json tagName,isPrerelease,publishedAt,targetCommitish,body
gh release view -R kaspanet/rusty-kaspa tn10-toc3 --json tagName,isPrerelease,publishedAt,targetCommitish,body
gh pr view -R kaspanet/rusty-kaspa 1000 --json state,baseRefName,headRefName,updatedAt,mergeable,commits
gh pr view -R kaspanet/rusty-kaspa 1013 --json state,baseRefName,headRefName,updatedAt,mergeable,commits
gh pr view -R kaspanet/kips 31 --json state,title,updatedAt,mergeable,commits
gh pr view -R kaspanet/kips 32 --json state,title,updatedAt,mergeable,commits
gh pr view -R kaspanet/kips 35 --json state,title,updatedAt,mergeable,commits
gh pr view -R kaspanet/kips 36 --json state,title,updatedAt,mergeable,commits
curl -fsSL https://api.kaspa.org/info/blockdag
curl -fsSL https://api-tn10.kaspa.org/info/blockdag
curl -fsSL https://api-tn12.kaspa.org/info/blockdag
```

### Weekly Development Loop

1. Review the monitor's branch deltas against the previous snapshot.
2. Reclassify each capability as released, scheduled, active-by-DAA, testnet, branch-only, docs-only, research-only, or experimental tooling.
3. Run SilverScript tests.
4. Compile one covenant example.
5. Update covenant indexer schema assumptions.
6. Update wallet signing UX assumptions.
7. Update ZK verifier and sequencing commitment assumptions.
8. Write one small app pattern that avoids hidden global-state bottlenecks.

### Build Targets

Target 1: Toccata source auditor

- Inputs: GitHub API, branch compares, release notes, and mainnet/TN10/TN12 REST endpoints.
- Output: JSON snapshot and Markdown summary.
- Value: prevents stale claims and catches branch-state changes.

Target 2: Covenant lineage indexer

- Inputs: accepted transactions, outputs, UTXO entries, covenant bindings.
- Output: `covenant_id`, genesis outpoint, continuation edges, authorizing input.
- Value: makes covenant apps queryable.

Target 3: Wallet covenant preview

- Inputs: PSKT or transaction candidate.
- Output: consumed covenant state, successor state, proof requirements, risk warnings.
- Value: prevents users from signing opaque state transitions.

Target 4: ZK proof-cost notebook

- Inputs: proof system, proof size, verification path, script units, transient mass.
- Output: estimated fee/mass and risk labels.
- Value: turns ZK ideas into practical constraints.

Target 5: vProg scope simulator

- Inputs: accounts, read sets, write sets, witnesses, proof submissions.
- Output: scope size, proof-cadence pressure, pruning risk, dependency graph.
- Value: reveals whether an app design scales before implementation.

## Security Questions We Should Answer Before Building Production Apps

- Can a wallet clearly show what covenant state is being consumed and created?
- Can an indexer prove it has not confused covenant lineage after reorg or pruning events?
- Can a covenant app recover if a successor output is created but app metadata is unavailable?
- Can ZK verifier dependency updates be isolated without compromising unrelated app flows?
- Can proof-bearing transactions be priced so they cannot starve ordinary traffic?
- Can vProg proof cadence prevent scope explosion under adversarial read/write patterns?
- Can witnesses remain available long enough for all required proof paths?
- Can app developers avoid making "one global state UTXO" a bottleneck?

## What Would Put Us Ahead

The edge is operational, not rhetorical.

Build these before most builders need them:

- a branch-aware Toccata monitor
- a KIP status monitor
- a covenant ID explorer model
- a SilverScript example suite with adversarial tests
- a wallet covenant-signing preview
- a lane-aware indexer model
- a proof-cost and scope-cost simulator
- a testnet app catalog that classifies each idea as Covenant, Inline ZK, Based App, or future vProg

## Source Inventory

- Rusty Kaspa: https://github.com/kaspanet/rusty-kaspa
- Rusty Kaspa PR #1000: https://github.com/kaspanet/rusty-kaspa/pull/1000
- Rusty Kaspa PR #1013: https://github.com/kaspanet/rusty-kaspa/pull/1013
- Rusty Kaspa releases: https://github.com/kaspanet/rusty-kaspa/releases
- KIP-16 PR: https://github.com/kaspanet/kips/pull/31
- KIP-17 PR: https://github.com/kaspanet/kips/pull/32
- KIP-20 PR: https://github.com/kaspanet/kips/pull/35
- KIP-21 PR: https://github.com/kaspanet/kips/pull/36
- Kaspa build/developer page: https://kaspa.org/developments/
- Kaspa docs programmability: https://docs.kaspa.org/programmability
- Kaspa docs source files: https://github.com/kaspanet/docs/tree/main/content/docs/programmability
- SilverScript: https://github.com/kaspanet/silverscript
- vProgs: https://github.com/kaspanet/vprogs
- vProgs architecture proposal: https://research.kas.pa/t/concrete-proposal-for-a-synchronously-composable-verifiable-programs-architecture/387
- Formal vProg computation DAG model: https://research.kas.pa/t/zoom-in-a-formal-backbone-model-for-the-vprog-computation-dag/407
- Pruning safety in vProgs: https://research.kas.pa/t/pruning-safety-in-the-vprogs-architecture/411
- Proof stitching framework: https://research.kas.pa/t/a-basic-framework-for-proofs-stitching/323
- Based ZK rollups over Kaspa UTXO DAG consensus: https://research.kas.pa/t/on-the-design-of-based-zk-rollups-over-kaspas-utxo-based-dag-consensus/208
- Inclusion-time proving tension: https://research.kas.pa/t/on-the-inherent-tension-between-multileader-consensus-and-inclusion-time-proving/347
- TN10 REST blockDAG: https://api-tn10.kaspa.org/info/blockdag
- TN12 REST blockDAG: https://api-tn12.kaspa.org/info/blockdag
