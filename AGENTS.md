# Agent Rules (Codex)

- Always read `PLANS.md` first. If missing or outdated, update it before coding.
- Read `SYSTEM_ARCHITECTURE.md` before non-trivial autonomous engineering
  work, and follow its Plan-Act-Verify loop.
- Never claim completion without running verification commands.
- Prefer minimal, shippable increments over idealized architecture.
- Every non-trivial change must include tests, docs updates, and reproducible steps.
- Keep Kaspa UTXO-first assumptions intact.
- Never implement hidden fees or hidden key handling; monetary flows must be explicit.
- Preserve both wallet compatibility paths:
  - Kasware
  - Kaspium
- Validate both Kaspa address prefixes:
  - `kaspa:`
  - `kaspatest:`

## Protocol Source Grounding

- Before protocol, transaction, covenant, sequencing, wallet, indexer, or
  architecture work, read `TRAINING_SOURCES.md`.
- Cite the specific source tier, URL, or local path used before proposing code
  or architecture changes.
- Start with Kaspa Developer Docs and Rusty Kaspa for protocol primitives.
  Verify protocol changes against active or draft KIPs.
- Never guess DAA, sequencing commitments, transaction fields, activation
  status, wallet readiness, or indexer readiness. If the cited sources do not
  prove the claim, state that a research period is required.

## Toccata R&D Intelligence

- For repository work, treat `docs/kaspa/` plus
  `docs/toccata-evidence-ladder.md` as the builder source of truth for
  Toccata requirements.
- Before proposing or implementing covenant-related changes, cite the specific
  requirement from `docs/kaspa/*`, `docs/toccata-evidence-ladder.md`, or
  `skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md`.
- Run `node scripts/toccata-network-check.mjs --check` before agent-facing
  Toccata changes unless the task is explicitly docs-only or network access is
  unavailable. If unavailable, say the result is local-only.
- Keep protocol activation, wallet readiness, indexer readiness, and tooling
  readiness as separate claims.

## Observability And Self-Correction

- Append to `AGENT_TRACE.md` for live API/network evidence, repeated command
  failures, package/release verification, transaction/broadcast results, or
  unresolved unknowns that must survive a context reset.
- Never log seeds, private keys, mnemonics, tokens, cookies, or hidden signing
  material.
- If the same failure repeats three times, stop guessing, record the blocker in
  `AGENT_TRACE.md`, update `PLANS.md`, and ask for a narrower next step.

## Pattern Of Success Memory

When a hard bug or protocol-integration failure is solved, append a concise
entry here. Use exactly this format:

```text
[Problem] | [Kaspa Protocol Constraint] | [Solution]
```

Do not add speculative lessons. Only record patterns backed by the solved
change, test, or reproduced failure.

### Entries

No entries yet.
