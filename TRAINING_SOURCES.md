# Kaspa Architect Training Sources

Use this file before protocol, transaction, covenant, sequencing, wallet,
indexer, or architecture work. It is the source-grounding ladder for the
Kaspa Sovereign Architect agent. Cite the specific source used before proposing
code or architectural changes.

## Directive For The Kaspa Architect Agent

1. Protocol Truth: start with the Kaspa Developer Docs and Rusty Kaspa. If a
   prompt involves protocol changes, also verify active or draft KIPs.
2. Verification Loop: for transactions, covenants, or Toccata-related code,
   cross-reference the repository Toccata R&D intelligence in `docs/kaspa/`,
   `docs/toccata-evidence-ladder.md`, and
   `skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md`.
3. Constraint: never guess DAA, sequencing commitments, transaction fields,
   wallet readiness, or activation state. If the cited docs, code, snapshots,
   or live checks do not prove the claim, state that a research period is
   required and suggest checking official R&D channels.

## Evidence Ladder

### 1. Core Infrastructure Foundation

- Kaspa Developer Docs: `https://docs.kaspa.org/`
  - Mandatory starting point for Kaspa primitives, RPC, node infrastructure,
    WASM SDKs, integration patterns, and programmability documentation.
  - Rule: when in doubt about Kaspa primitives, consult the official docs
    first.
- Rusty Kaspa Repository: `https://github.com/kaspanet/rusty-kaspa`
  - Canonical Rust full-node implementation.
  - Use it as the final authority for transaction validation, DAG ordering,
    runtime APIs, consensus-adjacent behavior, and release-tag inspection.

### 2. Innovation Engine And Future Proofing

- Kaspa Improvement Proposals: `https://github.com/kaspanet/kips`
  - Protocol-upgrade source for KIP status, lifecycle, merged proposal text,
    and future-proof architecture constraints.
  - Verify whether a feature is draft, merged, implemented, released,
    scheduled, active, or ecosystem-ready before using present-tense wording.
- Kaspa Builder And R&D Portal: `https://kaspa.org/build`
  - Official entry point for builder resources and protocol discussion
    channels.
  - Use discussions as research leads, not production proof, unless they link
    back to official docs, KIPs, code, releases, or reproducible network
    evidence.
- Repository Toccata R&D Intelligence:
  - `docs/toccata.md`
  - `docs/kaspa/`
  - `docs/toccata-evidence-ladder.md`
  - `skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md`
  - Use these before covenant, ZK, sequencing, SilverScript, Based App,
    vProg, Toccata migration, transaction-structure, wallet, miner, or
    indexer changes.

### 3. Community And Tooling

- Kaspathon Developer Resources:
  `https://github.com/Kaspathon/KaspaDev-Resources`
  - Curated ecosystem tooling and "Awesome Kaspa" style references.
  - Useful for finding libraries before building from scratch.
  - Treat as community tooling unless ownership and maintenance are verified.
- Kaspa Wiki: `https://wiki.kaspa.org/`
  - Community-maintained how-to and operational knowledge.
  - Helpful for common development hurdles, but lower authority than docs,
    code, releases, KIPs, and reproducible live-network evidence.

## Toccata Official Source Pack

For Toccata engineering, use official/repo-backed sources only. Community
resources are navigation aids, not protocol truth.

- Rusty Kaspa `v2.0.1`: `https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.1`
- Rusty Kaspa `v2.0.0`: `https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0`
- Toccata Guide: `https://github.com/kaspanet/rusty-kaspa/blob/master/docs/toccata-guide.md`
- KIP-16: `https://github.com/kaspanet/kips/blob/master/kip-0016.md`
- KIP-17: `https://github.com/kaspanet/kips/blob/master/kip-0017.md`
- KIP-20: `https://github.com/kaspanet/kips/blob/master/kip-0020.md`
- KIP-21: `https://github.com/kaspanet/kips/blob/master/kip-0021.md`
- Go Kaspad `v0.12.23`: `https://github.com/kaspanet/kaspad/releases/tag/v0.12.23`
- Rusty Kaspa `messages.proto`: `https://github.com/kaspanet/rusty-kaspa/blob/master/rpc/grpc/core/proto/messages.proto`
- Rusty Kaspa `rpc.proto`: `https://github.com/kaspanet/rusty-kaspa/blob/master/rpc/grpc/core/proto/rpc.proto`

## Required Citation Behavior

- Before proposing code or architecture, name the source tier used and cite the
  exact URL or local path.
- For Toccata or covenant work, cite the specific requirement from
  `toccata-rd-playbook.md`, `docs/toccata-evidence-ladder.md`, or the relevant
  `docs/kaspa/` note before proposing the change.
- For current claims, record the absolute audit date, release or tag, commit
  hash when available, network name, and whether the claim is local-only,
  snapshot-backed, or live-verified.
- Never convert media, community discussion, roadmap language, or watchlist
  interest into verified protocol fact.

## Optional Local Knowledge Mirror

When the agent has filesystem and network access, it may mirror source
repositories into an uncommitted local `knowledge/` or `/knowledge/` directory
for faster search. Do not commit cloned source repositories or generated cache
data by default.
