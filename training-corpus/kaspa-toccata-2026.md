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
- Which KIP numbers are final for the Toccata bundle? Official Kaspa build references KIP-16, KIP-17, KIP-20, and KIP-21, while the public KIPs repository index currently shows up to KIP-15 on `master`.
- Which Toccata components are already merged in Rusty Kaspa master versus living in branches or pull requests?
- What verifier systems are included in the first activation, and what verification costs/mass rules apply?
- How will wallets expose covenant state and proof semantics safely to non-technical users?
- What explorer/indexer schema changes are needed for covenant IDs and sequencing commitment proofs?

## Source Inventory

- Rusty Kaspa releases: https://github.com/kaspanet/rusty-kaspa/releases
- Rusty Kaspa repository: https://github.com/kaspanet/rusty-kaspa
- Kaspa vision page: https://kaspa.org/vision/
- Kaspa build page: https://kaspa.org/build
- Kaspa docs programmability overview: https://docs.kaspa.org/programmability
- Kaspa docs covenants: https://docs.kaspa.org/programmability/covenants
- Kaspa docs based apps: https://docs.kaspa.org/programmability/based-apps
- Kaspa docs inline ZK: https://docs.kaspa.org/programmability/inline-zk
- Kaspa docs full vProgs: https://docs.kaspa.org/programmability/full-vprogs
- SilverScript: https://github.com/kaspanet/silverscript
- vProgs: https://github.com/kaspanet/vprogs
- KIPs repository: https://github.com/kaspanet/kips
