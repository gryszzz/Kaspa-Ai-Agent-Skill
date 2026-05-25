# Kaspa Toccata Readiness Drills

Generated: 2026-05-25

This file is the repo-local training loop for preparing the `kaspa-sovereign-architect-engine` skill for Toccata-era work. It does not train the base model. It trains the local skill package, retrieval corpus, and operator habits by forcing repeated source verification, recall, and build-oriented synthesis.

## Operating Goal

Prepare for the Toccata upgrade by becoming excellent at three things:

- Source truth: separate mainnet, TN10, TN12, branch-only, PR-only, KIP PR, docs, research, and tooling evidence.
- Builder readiness: turn source changes into wallet, indexer, covenant, ZK, sequencing, and vProg tasks.
- Adversarial clarity: identify what can go wrong before users, wallets, indexers, or apps rely on it.

## Daily Loop

1. Refresh source state.

```bash
node scripts/toccata-source-monitor.mjs --write-if-changed
```

2. Run the local knowledge drill.

```bash
node scripts/kaspa-knowledge-drill.mjs
```

3. Answer the five-minute recall prompts without opening notes.
4. Pick one deep drill and produce a short artifact.
5. If an answer depends on current state, record the source URL, audit date, branch, PR base, and commit hash.
6. If a source changed, update the relevant corpus or playbook instead of relying on memory.
7. Check the endpoint `networkName` before trusting any TN10/TN12 result.

## Weekly Build Loop

Monday: source audit

- Re-check Rusty Kaspa PR #1000 and PR #1013.
- Re-check KIP-16, KIP-17, KIP-20, and KIP-21 PR status.
- Re-check TN10 and TN12 `/info/blockdag` shape.
- Confirm TN10/TN12 `networkName` values did not drift or get mixed by a proxy.
- Record what changed since the previous snapshot.

Tuesday: covenant lab

- Read or diff covenant-related code paths.
- Update a covenant lineage schema.
- Write invalid-successor and malformed-binding test ideas.
- Translate one covenant pattern into wallet UX language.

Wednesday: indexer lab

- Model accepted transaction ingestion.
- Add or refine `covenant_id`, genesis outpoint, authorizing input, continuation edge, and reorg state.
- Define cursor, retry, idempotency, and reconciliation behavior.

Thursday: wallet lab

- Design a signing preview for a covenant spend.
- Include consumed state, successor state, covenant ID, proof requirements, and replay or phishing risks.
- Separate watch-only, wallet-connected, local signer, extension signer, and hardware signer assumptions.

Friday: ZK and sequencing lab

- Track PR #1013 and KIP-16/KIP-21 changes.
- Compare proof-system tradeoffs.
- Sketch proof-bearing transaction payloads and witness APIs.
- Identify verification-cost and witness-availability risks.

Weekend: app strategy

- Classify candidate apps as covenant, inline ZK, Based App, or future vProg.
- Reject app shapes that require hidden shared global state or unbounded proof scope.
- Convert the best app idea into a small testnet-first build plan.

## Mastery Questions

Evidence:

- What would prove Toccata mainnet activation?
- What would prove only TN10 activation?
- What does a feature branch prove that an open PR does not?
- What does a KIP PR prove that a merged KIP does not?
- Which network name did each testnet endpoint return in the latest snapshot?

Covenants:

- What data must an indexer persist to prove covenant lineage?
- What does a covenant ID identify, and what does it not enforce by itself?
- How should a wallet render successor outputs?

ZK:

- Which verifier dependencies become consensus-sensitive or app-critical?
- What proof data belongs in transaction payloads versus off-chain witnesses?
- What cost or mass limits can turn a proof feature into a denial-of-service surface?

Sequencing:

- What does an app lane need from accepted transaction ordering?
- How does a lane-local witness differ from a global chain proof?
- What pruning assumptions can break a proof-serving API?

vProgs:

- What are the read set, write set, witness, proof cadence, and pruning risks for an app?
- When should an app avoid L1 covenants and use a Based App or future vProg model instead?
- What makes synchronous composition useful, and what makes it dangerous?

## Repo Improvement Backlog

High leverage:

- Extend PR diff summaries from changed-file signals into focused changed-behavior notes.
- Add adversarial covenant lineage fixtures for wrong network, duplicate continuation, missing metadata, and reorg rollback.
- Add wallet signing preview examples for covenant spends.
- Add a proof-cost matrix for ZK verifier options.
- Add a sequencing witness API sketch.
- Add a vProg scope simulator note or small prototype.

Guardrails:

- Never collapse testnet evidence into mainnet claims.
- Never treat KIP PRs as final merged KIPs.
- Never assume wallet/indexer support follows automatically from protocol code.
- Never treat a demo compiler or app as audited production readiness.
