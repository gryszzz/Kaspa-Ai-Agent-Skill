# Repository Audit Checklist

Use this checklist per repository and quote concrete file paths and symbols.

## 1. Purpose and Scope

- Identify the project boundary, non-goals, and intended runtime environment.
- Identify whether the code is node-side, wallet-side, SDK-side, or language tooling.

## 2. Architecture Map

- List major layers and package boundaries.
- Identify entrypoints and lifecycle orchestration points.
- Identify RPC client/server surfaces and event streaming pathways.

## 3. Transaction and Signing Pipeline

- Locate transaction object model.
- Locate transaction builder and fee or mass calculation path.
- Locate `storageMass`/`storage_mass`, legacy `mass`, and
  `compute_commit` serialization paths when Toccata is in scope.
- Locate serialization and deserialization routines.
- Locate signing boundary and key usage boundary.
- Locate submission and confirmation tracking path.
- For concrete transaction-plan JSON, run
  `node scripts/lint-transaction-plan.mjs <plan.json>` before calling the plan
  reviewable.

## 4. Node Interaction

- Map JSON-RPC, gRPC, websocket, or custom protocol usage.
- Identify retry behavior, timeout policy, and reconnection behavior.
- Identify indexing assumptions and mempool consistency assumptions.
- Identify subscription semantics and replay or gap-handling behavior for stream consumers.

## 5. Security Review

- Identify secret material lifecycle: creation, storage, usage, zeroization.
- Identify trust boundary crossings: RPC payload parsing, script parsing, ABI decoding, plugin boundaries.
- Identify dependency and supply-chain risk points.
- Identify wallet phishing, malicious extension, and signing-prompt confusion risks.
- Identify race conditions around UTXO selection and double-spend handling.
- Identify extension or provider-injection risk when browser wallets are in scope.
- Verify Kasware and Kaspium flows when the product claims both paths.
- Verify explicit handling for `kaspa:` and `kaspatest:` prefixes.
- Verify `broadcast` remains false in reviewed plans unless the user has moved
  to explicit wallet-local signing outside the skill.

## 6. Improvement and Reuse

- Propose hardened production improvements with implementation steps.
- Extract reusable patterns for DeFi apps:
  - UTXO batching
  - Deterministic fee policy
  - Idempotent submission flow
  - Event-sourced balance tracking
  - Circuit-breaker rollback strategy
- Describe fork and extension path: where to add features safely.
- Include operational controls: rate limiting, circuit breakers, and abuse detection.

## 7. Output Requirements

- Include all mandatory sections from SKILL.md.
- Include a text architecture diagram showing:
  - User surface
  - Wallet or SDK layer
  - Node and indexing layer
  - Persistence and observability layer
  - Trust boundaries and signing boundaries

## Targeted Search Patterns

Use patterns like these to accelerate discovery:

```bash
rg -n "tx|transaction|sign|signature|wallet|Kasware|Kaspium|mnemonic|seed|utxo|rpc|grpc|websocket|fee|mass|storageMass|storage_mass|compute_commit|mempool|consensus|serialize|deserialize|kaspa:|kaspatest:" <repo-root>
```

Rust-heavy repos:

```bash
rg -n "struct .*Transaction|impl .*Sign|sighash|utxo|mempool|consensus|rpc|wasm_bindgen" <repo-root>
```

TypeScript-heavy repos:

```bash
rg -n "buildTransaction|sign|mnemonic|seed|rpc|ws|broadcast|serialize|utxo|fee" <repo-root>
```
