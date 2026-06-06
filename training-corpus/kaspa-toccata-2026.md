# Kaspa Toccata Mastery Map

Generated: 2026-06-06

## Current Status

Treat Toccata as released and scheduled, but not yet active on mainnet until a verified mainnet endpoint reaches activation DAA `474,165,565`.

Confirmed evidence as of 2026-06-06:

- Rusty Kaspa `v2.0.0`, published 2026-06-05, is the final Toccata release. It schedules mainnet activation for DAA `474,165,565`, roughly 2026-06-30 16:15 UTC.
- Starting 24 hours before activation, updated nodes connect only to peers using P2P protocol version 10.
- The latest source snapshot observed mainnet below the activation threshold, so present-tense mainnet activation claims remain incorrect.
- Rusty Kaspa GitHub shows PR #1000, `Toccata`, closed and merged from `toccata` into `master` on 2026-06-02.
- Rusty Kaspa GitHub shows PR #1013, `ZK opcode updates`, closed and merged into `tn10` on 2026-05-27.
- Rusty Kaspa GitHub shows `tn10-toc3` as a pre-release published on 2026-05-27. It scheduled TN10 Toccata ZK hardening for 2026-05-28 around 16:00 UTC at DAA score 476,232,000.
- Rusty Kaspa GitHub shows `tn10-toc2` as a pre-release dated 2026-05-16. It scheduled the Toccata hard fork on testnet-10 for 2026-05-18 16:00 UTC at DAA score 467,579,632.
- The final release guide requires pools and miners to preserve `TransactionOutput.covenant` and `TransactionInput.compute_commit` from block templates through block submission.
- Rust/protobuf transaction APIs use `storage_mass`; JSON/JavaScript use `storageMass`. Legacy JSON `mass` remains a compatibility alias, and conflicting values are rejected.
- The higher minimum standard fee is `100 sompi * max(compute grams, 2 * transaction bytes)`. This is node relay/mempool policy, not consensus validity.
- The node database upgrade is one-way; rollback to older software requires a resync.
- KIP-16, KIP-17, KIP-20, and KIP-21 are closed and merged into `kaspanet/kips` `master`; their document statuses indicate implemented/activated on TN10.
- Kaspa.org describes Toccata as the next hard fork, focused on covenant-based base-layer programmability.
- Kaspa.org/build describes the Toccata bundle as extended script opcodes, covenant IDs, zk opcodes with a verifier precompile subsystem, and sequencing commitments. It says this is live on TN12 ahead of mainnet activation.
- SilverScript is a CashScript-inspired language/compiler targeting Kaspa Script. Its repository warns that it is experimental and that compiled scripts are valid only on Kaspa Testnet 12 at the time of review.
- Kaspa builder docs split programmability into Covenants, Based Apps, Inline ZK, and future Full vProgs.
- The vProgs repository is explicitly early/prototype-stage and models based computation through layered Rust crates for core types, storage, state, scheduling, transaction runtime, node integration, and zk.

## Second-Pass Source Audit

Audit time: 2026-06-06T01:39:16Z

### Rusty Kaspa Branch State

- `kaspanet/rusty-kaspa` `master`: `90dbf074275d60c1fe74a3491883196f110970c0`
- `kaspanet/rusty-kaspa` `toccata`: `0ae28f939e61994a11eb8eb6dd775255e2924afb`
- `kaspanet/rusty-kaspa` `tn10`: `e5f6d1f7c86f3a3afbe97dbb75e72a0a3ff66a57`
- `kaspanet/rusty-kaspa` `tn12`: `ab4c51afde90dc6e0bce3f782d0a18af5da29434`
- `kaspanet/rusty-kaspa` tag `v1.3.0-toc.5`: `04b0d135f8c8023676ea74dcf496c99d5d0bc2a5`
- `kaspanet/rusty-kaspa` tag `v2.0.0`: `90dbf074275d60c1fe74a3491883196f110970c0`
- `kaspanet/rusty-kaspa` tag `tn10-toc3`: `1015a62359e0d06e0b3b3b7f7d06bc1bd4bf0c1b`
- `kaspanet/rusty-kaspa` tag `tn10-toc2`: `97415b689462bec8a1a36f1665302529ea8a3108`

The implementation, final release, and activation schedule are now verified. Active mainnet behavior still requires live DAA threshold evidence.

Do not treat all GitHub PRs marked `MERGED` as merged into `master`. Several important Toccata PRs were merged into feature branches such as `covpp`, `covpp-reset1`, `covpp-reset2`, or `toccata`. Record `baseRefName` whenever using GitHub PR evidence.

### Activation Evidence

Release evidence:

- `v2.0.0` is final release and activation-schedule evidence.
- Mainnet activation DAA is `474,165,565`, roughly 2026-06-30 16:15 UTC.
- P2P protocol version 10 becomes mandatory for peer connectivity starting 24 hours before activation.
- `tn10-toc3` is TN10 hardening evidence. It schedules TN10 activation for May 28, 2026 around 16:00 UTC at DAA score 476,232,000.
- `tn10-toc2` is earlier TN10 rehearsal evidence. It scheduled the May 18, 2026 TN10 hard fork at DAA score 467,579,632.

Live REST check:

- `https://api.kaspa.org/info/blockdag` returned `networkName = kaspa-mainnet` and `virtualDaaScore = 452903728` at 2026-06-06T01:39:16Z, below activation.
- `https://api-tn10.kaspa.org/info/blockdag` returned `networkName = kaspa-testnet-10` and `virtualDaaScore = 483498498`, above the TN10 hardening activation DAA.
- The TN12 endpoint returned `HTTP 500` during this audit. Record the failure; do not silently present stale TN12 state as live.

Conclusion:

- Toccata should be described as active/past activation on TN10 only when the release schedule and live TN10 endpoint evidence are cited together.
- Toccata should be described as released and scheduled on mainnet, not active, until the live DAA reaches `474,165,565`.

### KIP Status Evidence

The public `kaspanet/kips` `master` branch is `1aba3b8321c1d27e00b7d87bd7c74ef879efabdc`.

The Toccata-related KIPs are now closed and merged into `master`:

- KIP-16: PR #31, file `kip-0016.md`, status in document: `Proposed, Implemented and activated in TN10`. Title: `New Transaction Opcodes for Verifiable Computation`. Introduces `OpZkPrecompile`.
- KIP-17: PR #32, file `kip-0017.md`, status in document: `Implemented and activated in TN10`. Title: `Covenants and Improved Scripting Capabilities`.
- KIP-20: PR #35, file `kip-0020.md`, status in document: `Proposed, Implemented and activated in TN10`. Title: `Covenant IDs (Consensus-Traced Covenant Lineage)`.
- KIP-21: PR #36, file `kip-0021.md`, status in document: `Implemented and activated in TN10`. Title: `Partitioned sequencing commitment with O(activity) proving`.

Treat these as merged spec sources, but still separate merged KIP status and TN10 status from final mainnet activation.

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
- PR #1013: `ZK opcode updates`, merged into base branch `tn10`.

Code in final `v2.0.0` includes:

- `TransactionInput.compute_commit`, with `ComputeBudget` for version >= 1 transactions.
- `TransactionOutput` carrying `Option<CovenantBinding>`.
- `UtxoEntry` carrying `Option<Hash>` covenant ID.
- `Transaction.storage_mass` in Rust/protobuf and `storageMass` in JSON/JavaScript, with legacy `mass` compatibility.
- WASM opcode exposure for `OpZkPrecompile`, `OpTxPayloadSubstr`, `OpTxPayloadLen`, `OpInputCovenantId`, `OpCovInputCount`, `OpCovInputIdx`, `OpCovOutputCount`, `OpCovOutputIdx`, `OpChainblockSeqCommit`, and `OpOutputCovenantId`.
- Post-Toccata transient mass and lane/gas limit parameters.

These are final-release contracts, but downstream compatibility and mainnet activation are separate questions.

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

- Track each feature against source status: released, scheduled, active-by-DAA, testnet active, wallet-ready, indexer-ready, or experimental.

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

- When will mainnet cross DAA `474,165,565`, and do endpoint observations agree at the threshold?
- What wallet, indexer, RPC, WASM, PSKT, and explorer support is verified against the final activation release?
- Which integrations still depend on deprecated `mass` names or omit `compute_commit`/covenant fields?
- What audited verification-cost, script-unit, and dependency assumptions should builders pin for the released Groth16 and RISC0/Succinct paths?
- How will wallets expose covenant state and proof semantics safely to non-technical users?
- What explorer/indexer schema changes are needed for covenant IDs and sequencing commitment proofs?

## Source Inventory

- Rusty Kaspa releases: https://github.com/kaspanet/rusty-kaspa/releases
- Rusty Kaspa final Toccata release: https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0
- Rusty Kaspa Toccata node guide: https://github.com/kaspanet/rusty-kaspa/blob/v2.0.0/docs/toccata-guide.md
- Rusty Kaspa Toccata mainnet pre-activation release: https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.3.0-toc.5
- Rusty Kaspa TN10 Toccata ZK hardening release: https://github.com/kaspanet/rusty-kaspa/releases/tag/tn10-toc3
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
- KIP-16 merged file: https://github.com/kaspanet/kips/blob/master/kip-0016.md
- KIP-17 PR: https://github.com/kaspanet/kips/pull/32
- KIP-17 merged file: https://github.com/kaspanet/kips/blob/master/kip-0017.md
- KIP-20 PR: https://github.com/kaspanet/kips/pull/35
- KIP-20 merged file: https://github.com/kaspanet/kips/blob/master/kip-0020.md
- KIP-21 PR: https://github.com/kaspanet/kips/pull/36
- KIP-21 merged file: https://github.com/kaspanet/kips/blob/master/kip-0021.md
- SilverScript: https://github.com/kaspanet/silverscript
- vProgs: https://github.com/kaspanet/vprogs
- KIPs repository: https://github.com/kaspanet/kips
- Mainnet REST blockDAG endpoint: https://api.kaspa.org/info/blockdag
- TN10 REST blockDAG endpoint: https://api-tn10.kaspa.org/info/blockdag
- TN12 REST blockDAG endpoint: https://api-tn12.kaspa.org/info/blockdag
