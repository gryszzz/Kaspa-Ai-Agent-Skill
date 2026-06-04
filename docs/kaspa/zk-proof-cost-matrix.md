# ZK Proof-Cost Matrix

Status: planning matrix for Toccata-era inline ZK and verifier readiness.

This matrix is intentionally conservative. It records what the builder must compare before treating a proof path as wallet-ready, indexer-ready, or denial-of-service resistant. Current source-monitor evidence tracks ZK opcode changes, Groth16 verifier signals, RISC0/Succinct signals, pricing/resource-meter changes, and tests/benches in Rusty Kaspa PR #1013, which is closed and merged into `tn10`. Release `tn10-toc3` is TN10 hardening evidence; it is not mainnet evidence.

## Matrix

| Verifier path | Proof size shape | Dependency maturity | Verification cost signal | Payload shape | DoS risk | Builder stance |
| --- | --- | --- | --- | --- | --- | --- |
| Groth16 verifier | Usually compact proof, circuit-specific verifying key | Mature cryptographic pattern, but implementation details must be source-verified | Watch `zk_precompiles`, pricing benches, resource meter, and activation config | Proof bytes plus public inputs and verifying key reference or embedded material | High if malformed payloads or expensive pairings can bypass pricing limits | Good candidate for compact action proofs after pricing and malformed-input tests are proven |
| RISC0-style verifier | Larger receipt-oriented payloads are possible | Strong ecosystem, but chain integration and verifier constraints are still source-specific | Watch verifier module, payload limits, memory cost, and test vectors | Receipt, journal/public output, image ID, optional assumptions | High if payload size or guest-program assumptions are not bounded | Use for general computation only with strict payload and witness limits |
| Succinct/SP1-style verifier | Receipt/proof payload, VM-oriented | Active ecosystem, but exact verifier path must be confirmed from source | Watch verifier module, gas/script-unit analog, and dependency version drift | Proof, verification key/program ID, public values | High if dependency or proof format changes faster than wallet/indexer validation | Treat as advanced path until dependency lock and test vectors are stable |
| Custom app proof outside L1 | Off-chain proof object, on-chain commitment only | App-defined | L1 cost may be low, but app verification and availability move off-chain | Commitment, witness locator, external proof URL/hash | Medium to high if witness availability is weak | Only acceptable when the app can prove availability and replay boundaries |
| No ZK, covenant-only transition | No proof payload beyond script/witness data | Closest to covenant tooling path | Cost comes from script size, state size, and validation path | Consumed state, successor state, covenant ID, script witness | Medium if state grows beyond script budget or wallet hides state transition | Prefer this when asset-native state is small and sequential |

## Required Measurements

Before a proof path graduates from research to builder default, capture:

- Maximum accepted proof payload bytes.
- Maximum public input bytes.
- Verification cost under valid, invalid, malformed, and boundary-sized proofs.
- Dependency versions and reproducible verifier build inputs.
- Pricing/resource-meter behavior for the verifier path.
- Wallet preview requirements for proof type, public inputs, and app label.
- Indexer fields needed to store proof commitment, witness locator, and verification result.

## DoS Review Questions

- Can an attacker submit many invalid proofs that are cheap to create but expensive to reject?
- Does pricing scale with proof size, public input size, and verifier-specific work?
- Are malformed payloads rejected before expensive verifier work begins?
- Are proof dependencies pinned tightly enough for reproducible validation?
- Can wallets display proof type and proof requirements without pretending the action is a normal send?

## Current Gate

Do not call any proof path mainnet-ready until all of these are true:

- The verifier code path is merged into the production branch.
- Activation schedule and pricing rules are explicit for the target network.
- Test vectors cover valid, invalid, malformed, and maximum-size payloads.
- Wallet preview copy identifies proof requirements.
- Indexer storage can distinguish proof type, payload hash, public inputs, and verification status.
