# Kaspa Toccata Mastery Map

Generated: 2026-05-24

## Current Status

Treat Toccata as a near-mainnet / testnet-active hard fork track until a final mainnet activation release and DAA score are verified from primary sources.

Confirmed evidence as of 2026-05-24:

- Rusty Kaspa GitHub shows `tn10-toc2` as a pre-release dated 2026-05-16. It scheduled the Toccata hard fork on testnet-10 for 2026-05-18 16:00 UTC at DAA score 467,579,632.
- The latest stable Rusty Kaspa release visible in GitHub releases is `v1.1.0`, dated 2026-03-04. That release focuses on VSPC API v2, sync/pruning improvements, storage/performance gains, pruning-proof refactors, RocksDB presets, and Stratum Bridge beta. It is not itself a final Toccata mainnet activation release.
- Kaspa.org describes Toccata as the next hard fork, focused on covenant-based base-layer programmability.
- Kaspa.org/build describes the Toccata bundle as extended script opcodes, covenant IDs, zk opcodes with a verifier precompile subsystem, and sequencing commitments. It says this is live on TN12 ahead of mainnet activation.
- SilverScript is a CashScript-inspired language/compiler targeting Kaspa Script. Its repository warns that it is experimental and that compiled scripts are valid only on Kaspa Testnet 12 at the time of review.
- Kaspa builder docs split programmability into Covenants, Based Apps, Inline ZK, and future Full vProgs.
- The vProgs repository is explicitly early/prototype-stage and models based computation through layered Rust crates for core types, storage, state, scheduling, transaction runtime, node integration, and zk.

## Second-Pass Source Audit

Audit time: 2026-05-24T22:36:54Z

### Rusty Kaspa Branch State

- `kaspanet/rusty-kaspa` `master`: `a07d8b38d45f38a02a1f35f601e874358f6c7846`
- `kaspanet/rusty-kaspa` `toccata`: `f1d1a1ae6a4131a3d6124fef443192323c1c382f`
- `kaspanet/rusty-kaspa` `tn12`: `7b1e18cc6e7098d83927049781c91740b90e7754`
- `kaspanet/rusty-kaspa` tag `tn10-toc2`: `97415b689462bec8a1a36f1665302529ea8a3108`

The decisive implementation signal is Rusty Kaspa PR #1000, `Toccata`, which is an open PR from branch `toccata` into `master`.

Do not treat all GitHub PRs marked `MERGED` as merged into `master`. Several important Toccata PRs were merged into feature branches such as `covpp`, `covpp-reset1`, `covpp-reset2`, or `toccata`. Record `baseRefName` whenever using GitHub PR evidence.

### Activation Evidence

Evidence from the `toccata` branch `consensus/core/src/config/params.rs`:

- Mainnet: `toccata_activation: ForkActivation::never()`
- Testnet-10: `toccata_activation: ForkActivation::new(467_579_632)`, with code comment `~16:00 UTC, May 18, 2026`
- Testnet-12: `toccata_activation: ForkActivation::always()`
- Simnet: `toccata_activation: ForkActivation::always()`
- Devnet: `toccata_activation: ForkActivation::never()`

Live REST check:

- `https://api-tn10.kaspa.org/info/blockdag` returned `networkName = kaspa-testnet-10` and `virtualDaaScore = 473012180` at 2026-05-24T22:36:54Z. This is above the `tn10-toc2` activation DAA score of 467,579,632.
- `https://api-tn12.kaspa.org/info/blockdag` returned `networkName = kaspa-testnet-12` and `virtualDaaScore = 20523315` at the same audit pass.

Conclusion:

- Toccata should be described as active on TN12 and activated/past activation on TN10.
- Toccata should not be described as active on mainnet until a mainnet activation release, DAA score, and code path are verified.

### KIP Status Evidence

The public `kaspanet/kips` `master` branch is still `2a77c954b2241bce7954ba5fecad0ac7694ce195`.

The Toccata-related KIPs are currently visible as open PRs, not merged files on `master`:

- KIP-16: PR #31, `Add kip16`, file `kip-0016.md`, status in document: `Proposed`. Title: `New Transaction Opcodes for Verifiable Computation`. Introduces `OpZkPrecompile`.
- KIP-17: PR #32, `KIP 17`, file `kip-0017.md`, status in document: `Draft`. Title: `Covenants and Improved Scripting Capabilities`.
- KIP-20: PR #35, `KIP-20: Covenant IDs (Consensus-Traced Covenant Lineage)`, file `kip-0020.md`, status in document: `Proposed, Implemented, Activated in TN12`.
- KIP-21: PR #36, `KIP-21: Partitioned sequencing commitment with O(activity) proving`, file `kip-0021.md`, status in document: `Draft`.

Treat these as high-signal proposal/spec sources, but not final merged KIPs until the PRs land in `kaspanet/kips` `master`.

### Implementation PR Map

Important Rusty Kaspa PRs:

- PR #797: `KIP 17 implementation`, merged into base branch `covpp`, not `master`.
- PR #813: `Covenant id scheme + Seq commit opcode`, merged into base branch `covpp-reset1`.
- PR #835: `Add Covenant Related fields in Transactions, UTXOs, PSKT, RPC, and JS Bindings; Resolve Related TODOs`, merged into base branch `covpp-reset1`.
- PR #884: `Add more granular script pricing and compute_budget field for v1 transactions`, merged into base branch `covpp-reset2`.
- PR #943: `Kip21 impl`, merged into base branch `covpp-reset2`.
- PR #963: `Add Toccata lane/gas limits to consensus and implement corresponding mempool policies`, merged into base branch `covpp-reset2`.
- PR #995: `Toccata transient mass activation and mempool policy refinement`, merged into base branch `toccata`.
- PR #997: `Bump P2P protocol version and guard Toccata IBD`, merged into base branch `toccata`.
- PR #998: `Bump the header version for Toccata`, merged into base branch `toccata`.
- PR #1005: `Toccata`, merged into base branch `toccata`.
- PR #1011: `Clarify seqcommit tx validation contexts`, merged into base branch `toccata`.
- PR #1013: `ZK opcode updates`, open PR. Its body says it is a pending PR for small zk opcode consensus changes that require a fast TN10 hard fork.

Code found on the `toccata` branch includes:

- `TransactionInput` carrying `TxInputMass`, with `ComputeBudget` for version >= 1 transactions.
- `TransactionOutput` carrying `Option<CovenantBinding>`.
- `UtxoEntry` carrying `Option<Hash>` covenant ID.
- WASM opcode exposure for `OpZkPrecompile`, `OpTxPayloadSubstr`, `OpTxPayloadLen`, `OpInputCovenantId`, `OpCovInputCount`, `OpCovInputIdx`, `OpCovOutputCount`, `OpCovOutputIdx`, `OpChainblockSeqCommit`, and `OpOutputCovenantId`.
- Post-Toccata transient mass and lane/gas limit parameters.

This branch-level evidence is stronger than roadmap copy, but still distinct from a final stable/mainnet release.

## Verification Ladder

Use these labels in all future Toccata research.

Confirmed:

- Directly present in official Kaspa pages, official GitHub repositories, official docs, or release notes.
- Must include fetch date and URL.

Likely:

- Repeated by high-signal ecosystem explainers and consistent with official evidence, but not yet final in release notes or merged specs.

Speculative:

- Narrative, roadmap extrapolation, price implication, adoption claim, or future architecture that has not been pinned by code, KIP, or activation evidence.

## What Toccata Changes Conceptually

Toccata moves Kaspa from fast proof-of-work payments toward programmable proof-of-work infrastructure without making the base layer an EVM-style global execution machine.

The core split:

- Covenants: L1 output-level rules and state transitions.
- SilverScript: higher-level authoring path for Kaspa covenants.
- ZK verification: proof-driven validation paths for specialized actions and future app architectures.
- Sequencing commitments: commitments that make ordered app activity provable or addressable in later verification flows.
- Based Apps / vProgs: longer-range architecture for shared-state and composable app execution that can settle against Kaspa.

## Covenants Mental Model

A covenant-protected output is not just a coin. It can encode rules about how it is allowed to be spent and what valid successor outputs must look like.

Useful framing:

- State is carried by protected outputs.
- Spending a protected output validates the transition from old state to new state.
- Successor outputs preserve lineage and enforce future rules.
- Independent covenant states can run in parallel, but one shared state advances sequentially.

Good early product fits:

- Vaults and treasury policies.
- Escrow and conditional release flows.
- Native asset issuance and transfer policy.
- Controlled distribution or claims.
- Wallet-level safety rails.

Bad fits:

- Many users mutating one global state at the same time.
- Large state.
- High-complexity state transitions that strain script size and developer tooling.
- Privacy-heavy systems where every action needs custom proof logic.

## SilverScript Track

SilverScript should be studied as the current builder-facing covenant authoring layer, not as a stable production language yet.

Known source facts:

- It is CashScript-inspired.
- It targets Kaspa Script.
- The main crate is `silverscript-lang`.
- The repo includes a source-level debugger.
- The repo warns that syntax, APIs, and output formats may change.
- The repo warns that compiled scripts are currently valid only on TN12.

Mastery tasks:

- Read the tutorial and declaration spec.
- Run example contracts on TN12 tooling.
- Trace compiler output into raw Kaspa Script.
- Build a vault, a constrained asset transfer, and a timed claim.
- Write adversarial tests for invalid successor outputs, replay-like attempts, oversized state, and malformed constructor arguments.

## ZK And Based App Track

Inline ZK is the specialized path where each action carries its own proof or validity check. It is powerful, but builder-heavy.

Based Apps are the shared-state concurrency path where one Rust app runs in a managed environment with accounts, balances, and app state.

Full vProgs are forward-looking: the endgame is cross-app synchronous composition, where independent apps can read or call each other in one flow instead of relying on delayed bridge-like settlement.

Mastery tasks:

- Separate L1 covenant use cases from Based App use cases.
- Identify what must be proven on-chain versus what can execute off-chain.
- Track how sequencing commitments reduce proof scope or bind app activity to L1 ordering.
- Study vProgs crate boundaries: `core`, `storage`, `state`, `scheduling`, `transaction-runtime`, `node`, and `zk`.
- Design a minimal app where Kaspa L1 orders activity, off-chain infrastructure executes, and proofs settle correctness.

## Architecture Map

```text
User / Wallet
  |
  | signs transactions, proofs, covenant spends
  v
Kaspa Transaction Layer
  |
  | payloads, scripts, covenant-protected outputs
  v
Kaspa L1 / BlockDAG
  |
  | ordering, acceptance, sequencing commitments
  v
Programmability Surface
  |
  +-- Covenants / SilverScript
  |     - output-level state machines
  |     - asset rules and custody flows
  |
  +-- Inline ZK
  |     - per-action proof verification
  |     - custom validity and privacy paths
  |
  +-- Based Apps / vProgs
        - shared app state
        - off-chain execution
        - proof-backed settlement
        - future app-to-app composition
```

## Mastery Curriculum

1. Protocol foundation

- Rebuild the mental model of BlockDAG ordering, GHOSTDAG, blue/red blocks, selected parent chain, UTXO acceptance, and how finality-like confidence is communicated.

2. Toccata feature matrix

- Track each feature against source status: script opcodes, covenant IDs, zk precompile/opcodes, sequencing commitments, TN12/TN10 activation, and final mainnet activation evidence.

3. SilverScript lab

- Clone and run SilverScript tests.
- Compile examples.
- Diff high-level code against emitted script.
- Write small covenant contracts and adversarial tests.

4. Transaction construction

- Build transaction lifecycle notes for covenant spends: UTXO selection, script construction, mass/fee handling, signing, broadcast, acceptance, and successor-state tracking.

5. Indexer and API implications

- Update indexer models to track covenant lineage, accepted transactions, script state, asset IDs, proof metadata, and sequencing commitments.

6. Wallet UX implications

- Add signing transparency for covenant spends: what state is being consumed, what successor state is created, and what constraints the user is accepting.

7. Security track

- Threat model malformed state transitions, wallet deception, malicious successor outputs, proof verification bugs, bridge-like assumptions, replay/conflict scenarios, and indexer trust errors.

8. Strategic builder map

- Classify every app idea as Covenant, Based App, Inline ZK, or future Full vProg. Keep the base layer lean and push heavy execution away from L1 unless proof verification is the product.

## Open Questions

- What exact Rusty Kaspa release will schedule mainnet Toccata?
- What final DAA score and UTC timestamp will define mainnet activation?
- When will KIP-16, KIP-17, KIP-20, and KIP-21 merge into `kaspanet/kips` `master`, and will their document statuses change before activation?
- When will Rusty Kaspa PR #1000 merge into `master`, and will PR #1013 or later ZK changes be part of the same activation bundle?
- What verifier systems are included in the first activation, and what verification costs/mass rules apply?
- How will wallets expose covenant state and proof semantics safely to non-technical users?
- What explorer/indexer schema changes are needed for covenant IDs and sequencing commitment proofs?

## Source Inventory

- Rusty Kaspa releases: https://github.com/kaspanet/rusty-kaspa/releases
- Rusty Kaspa repository: https://github.com/kaspanet/rusty-kaspa
- Rusty Kaspa Toccata PR: https://github.com/kaspanet/rusty-kaspa/pull/1000
- Rusty Kaspa ZK opcode updates PR: https://github.com/kaspanet/rusty-kaspa/pull/1013
- Kaspa vision page: https://kaspa.org/vision/
- Kaspa build page: https://kaspa.org/build
- Kaspa docs programmability overview: https://docs.kaspa.org/programmability
- Kaspa docs covenants: https://docs.kaspa.org/programmability/covenants
- Kaspa docs based apps: https://docs.kaspa.org/programmability/based-apps
- Kaspa docs inline ZK: https://docs.kaspa.org/programmability/inline-zk
- Kaspa docs full vProgs: https://docs.kaspa.org/programmability/full-vprogs
- Kaspa docs repository programmability sources: https://github.com/kaspanet/docs/tree/main/content/docs/programmability
- Kaspa Research vProgs architecture proposal: https://research.kas.pa/t/concrete-proposal-for-a-synchronously-composable-verifiable-programs-architecture/387
- KIP-16 PR: https://github.com/kaspanet/kips/pull/31
- KIP-17 PR: https://github.com/kaspanet/kips/pull/32
- KIP-20 PR: https://github.com/kaspanet/kips/pull/35
- KIP-21 PR: https://github.com/kaspanet/kips/pull/36
- SilverScript: https://github.com/kaspanet/silverscript
- vProgs: https://github.com/kaspanet/vprogs
- KIPs repository: https://github.com/kaspanet/kips
- TN10 REST blockDAG endpoint: https://api-tn10.kaspa.org/info/blockdag
- TN12 REST blockDAG endpoint: https://api-tn12.kaspa.org/info/blockdag
