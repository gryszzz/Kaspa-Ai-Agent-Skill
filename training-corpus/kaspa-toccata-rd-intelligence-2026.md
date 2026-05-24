# Kaspa Toccata R&D Intelligence Upgrade

Generated: 2026-05-24T22:45:31Z

## Executive Verdict

Toccata is not just "smart contracts on Kaspa." It is a bundle of UTXO-native programmability primitives that preserves Kaspa's proof-of-work BlockDAG identity while opening paths for covenants, proof-verified execution, and app-lane sequencing.

The strategic path is to master three layers at once:

- L1 covenant state machines for asset-native rules.
- ZK verification and sequencing commitments for proof-backed settlement.
- Based Apps and vProgs for shared-state concurrency and future synchronous composition.

Current high-confidence status:

- Toccata is active or treated as always active on TN12.
- Toccata has passed activation on TN10 according to the `tn10-toc2` release schedule and live TN10 DAA score.
- Mainnet activation is not verified. On the Rusty Kaspa `toccata` branch, mainnet remains `ForkActivation::never()`.
- The main Rusty implementation path is PR #1000, `Toccata`, from branch `toccata` into `master`.
- KIP-16, KIP-17, KIP-20, and KIP-21 are open KIP PRs, not merged KIPs on `kaspanet/kips` `master`.
- PR #1013, `ZK opcode updates`, is open against `tn10` and explicitly says it is for small ZK opcode consensus changes requiring a fast TN10 hard fork.

## Source Snapshot

Audit date: 2026-05-24T22:45:31Z

Rusty Kaspa:

- `master`: `a07d8b38d45f38a02a1f35f601e874358f6c7846`
- `toccata`: `f1d1a1ae6a4131a3d6124fef443192323c1c382f`
- `tn10`: `f1d1a1ae6a4131a3d6124fef443192323c1c382f`
- `tn12`: `7b1e18cc6e7098d83927049781c91740b90e7754`
- tag `tn10-toc2`: `97415b689462bec8a1a36f1665302529ea8a3108`
- latest stable release tag observed: `v1.1.0`, commit `e97070faa3826c590f477e327c82daaddd6178f4`

KIPs:

- `kaspanet/kips` `master`: `2a77c954b2241bce7954ba5fecad0ac7694ce195`
- KIP-16 PR #31: open, mergeable, head `c5ec7ff1060de4192b4092cdee3523088d76d8af`, document status `Proposed`
- KIP-17 PR #32: open, mergeable, head `6fc7a1b20bfe22a316dec76ebd20fe7d9e18722c`, document status `Draft`
- KIP-20 PR #35: open, mergeable, head `0581f55487ed7c471fbd3615684ebba7bae47e63`, document status `Proposed, Implemented, Activated in TN12`
- KIP-21 PR #36: open, mergeable, head `bd4cfe43a6035ef1c3335ff16ea1f0bd11f98cf7`, document status `Draft`

Docs and tooling:

- `kaspanet/docs` `main`: `6aa5e9f52995f53dc85ef3e8c7c71bab9a359b3e`
- `kaspanet/silverscript` `master`: `2c4623124d75bd8a9a7f87ded9413ef9f6b17acd`
- `kaspanet/vprogs` `master`: `57039db09ea958689aee2ae89f81ba40c8cc3e6d`

Live network checks:

- TN10 REST `info/blockdag`: `networkName = kaspa-testnet-10`, `virtualDaaScore = 473017445`
- TN12 REST `info/blockdag`: `networkName = kaspa-testnet-12`, `virtualDaaScore = 20528361`

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
- PR #1013 shows the ZK opcode surface is still changing.

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
git ls-remote --heads --tags https://github.com/kaspanet/rusty-kaspa.git master toccata tn10 tn12 refs/tags/tn10-toc2 refs/tags/v1.1.0
gh pr view -R kaspanet/rusty-kaspa 1000 --json state,baseRefName,headRefName,updatedAt,mergeable,commits
gh pr view -R kaspanet/rusty-kaspa 1013 --json state,baseRefName,headRefName,updatedAt,mergeable,commits
gh pr view -R kaspanet/kips 31 --json state,title,updatedAt,mergeable,commits
gh pr view -R kaspanet/kips 32 --json state,title,updatedAt,mergeable,commits
gh pr view -R kaspanet/kips 35 --json state,title,updatedAt,mergeable,commits
gh pr view -R kaspanet/kips 36 --json state,title,updatedAt,mergeable,commits
curl -fsSL https://api-tn10.kaspa.org/info/blockdag
curl -fsSL https://api-tn12.kaspa.org/info/blockdag
```

### Weekly Development Loop

1. Diff `toccata` against `master`.
2. Reclassify each capability as mainnet, testnet, branch-only, PR-only, docs-only, research-only, or experimental tooling.
3. Run SilverScript tests.
4. Compile one covenant example.
5. Update covenant indexer schema assumptions.
6. Update wallet signing UX assumptions.
7. Update ZK verifier and sequencing commitment assumptions.
8. Write one small app pattern that avoids hidden global-state bottlenecks.

### Build Targets

Target 1: Toccata source auditor

- Inputs: GitHub API, `git ls-remote`, TN10/TN12 REST endpoints.
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

