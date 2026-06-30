# Agent System Architecture

This repository turns the Kaspa Sovereign Architect from a single-turn code
helper into an auditable engineering loop. Keep the loop simple, local, and
source-grounded.

## Memory Layers

- `AGENTS.md`: durable agent rules, protocol constraints, and hard-won
  Patterns of Success.
- `PLANS.md`: current objective, constraints, verification plan, and execution
  checkpoint.
- `TRAINING_SOURCES.md`: protocol-source ladder for Kaspa and Toccata work.
- `AGENT_TRACE.md`: local trace log for meaningful autonomous-loop decisions,
  API results, command failures, and recovery notes. Never store secrets.
- `skills/public/kaspa-sovereign-architect-engine/references/`: packaged
  knowledge map and task-specific operating references.

## Plan-Act-Verify Loop

Use this loop for non-trivial work:

1. Plan: read `PLANS.md`, `AGENTS.md`, and the routed source files. State the
   smallest useful plan and the evidence required.
2. Act: make minimal changes that preserve Kaspa UTXO, DAG, wallet, fee,
   signing, and source-trust constraints.
3. Verify: run the planned checks. Do not claim completion without command
   output, tests, or an explicit local-only caveat.

When the user asks for direct implementation, the plan can be brief, but the
verify step still applies.

## Observability

Record a trace entry in `AGENT_TRACE.md` when work includes any of these:

- live network or GitHub API checks used to support a current claim
- repeated command failures or a changed recovery strategy
- transaction IDs, signatures, or broadcast results from user-approved tasks
- package/release verification results
- unresolved unknowns that should survive context reset

Trace entries must include UTC time, task, evidence, actions, verification,
and residual risk. Do not log seeds, private keys, tokens, cookies, mnemonics,
or user secrets.

## Self-Correction

- Prefer deterministic repo checks over ad hoc retries.
- Use `run-behavioral-evals.mjs`, focused tests, source monitors, network
  gates, and release validators before broad manual debugging.
- If the same failure repeats three times, stop the loop, record the failure in
  `AGENT_TRACE.md`, update `PLANS.md` with the blocker, and ask for a narrowed
  next step instead of guessing.

## Web4 Autonomy Boundaries

- Autonomous wallet identity is not enabled by default.
- Any on-chain identity, transaction signing, paid API use, budget spending, or
  x402-style economic action requires explicit user approval and a written
  spending/signing boundary.
- Prefer watch-only or provider-signed flows before custody.
- Never introduce hidden fees, hidden recipients, hidden key handling, or
  silent broadcasts.

## Rollback Discipline

- Do not run destructive git commands unless explicitly requested.
- If an agent loop drifts, preserve user changes, inspect `git status`, and
  reset the plan rather than stacking speculative patches.
- Use commits, tests, and trace entries as recovery points.
