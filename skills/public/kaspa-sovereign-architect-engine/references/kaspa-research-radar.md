# Kaspa Research Radar

## Economics

Track:
- monetary policy
- fee market discussions
- miner incentives
- MEV-like concerns if relevant
- network usage economics

## L1/L2

Track:
- L1/L2 bridge design
- settlement assumptions
- proof models
- liquidity movement
- security boundaries
- app developer implications

## Toccata Programmability

Track:
- activation status by network, release tag, DAA score, and UTC date
- mainnet DAA distance to activation and the 24-hour P2P protocol-version cutoff
- Rusty Kaspa branch status: `master`, `toccata`, `tn10`, `tn12`, release tags, and PR base branches
- branch-delta impact across transaction wire formats, RPC/WASM, wallet/PSKT, mempool policy, storage migrations, and security fixes
- open ZK SDK and ZK rollup example PRs
- vProg computation DAG, proof cadence, scope cost, and pruning safety research
- covenant script behavior
- extended script opcodes
- covenant IDs
- ZK opcodes and verifier precompile boundaries
- sequencing commitments
- SilverScript syntax, compiler status, and emitted Kaspa Script
- Based Apps and vProgs architecture
- wallet signing UX for covenant spends and proof-bearing transactions
- indexer schema impact for covenant lineage, app state, proof metadata, and sequencing commitments
- API migration from `mass` to `storageMass`/`storage_mass`, plus `TransactionInput.compute_commit`
- fee-policy separation: relay/RPC minimum fee policy is not consensus validity
- pool/miner preservation of covenant and compute-commit fields from template to submitted block
- one-way database upgrade and rollback/resync requirements
- production readiness labels: live, merged but unreleased, testnet-only, experimental, proposed, unknown

## Consensus

Track:
- GHOSTDAG
- DAGKNIGHT
- pruning
- finality
- block rate upgrades
- propagation constraints
- ordering assumptions

## Mining

Track:
- kHeavyHash
- mining templates
- propagation latency
- pool behavior
- hashrate centralization risk
- block production under higher BPS

## Paper Review

Track:
- PHANTOM
- GHOSTDAG
- DAGKNIGHT
- Prunality
- related cryptocurrency research

## KIPs

Track:
- KIP number
- title
- status
- implementation status
- activation status
- repo/code references
- wallet impact
- indexer impact
- dApp impact
- risk
- builder opportunity

## Ecosystem Engineering

Track:
- rusty-kaspa
- Kdapp
- KKluster JS utilities
- WASM SDK
- SQL indexer
- wallet tooling
- RPC/wRPC/gRPC
- explorer/indexer APIs
- TypeScript/React app paths
