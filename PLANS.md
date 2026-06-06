# ExecPlan: Ship The Complete Toccata-Aware Skill Update

## Goal

Update the entire `kaspa-sovereign-architect-engine` package so its core
instructions, platform adapters, references, bundled scripts, release metadata,
and validation all express the same current Kaspa Toccata engineering contract.

## Success Metrics

- `SKILL.md` remains concise enough for progressive disclosure and routes
  detailed protocol knowledge to references.
- Every adapter carries the same activation, UTXO, wallet, fee, network, and
  verification rules.
- The package includes every helper module and deterministic test required by
  its bundled scripts.
- Manifest, repository documentation, and release notes describe a coherent
  `v1.7.0` package without falsely claiming it has already been published.
- Automated validation detects adapter drift and missing Toccata safety rules.
- Packaged artifacts run their own monitor, readiness, lineage, and knowledge
  checks after extraction.

## Constraints

- Preserve Kaspa's UTXO-first and DAG-aware architecture.
- Preserve both Kasware and Kaspium compatibility paths.
- Validate both `kaspa:` and `kaspatest:` address prefixes.
- Keep fees, signing intent, custody, and key handling explicit.
- Treat Rusty Kaspa `v2.0.0` as final release evidence and mainnet DAA
  `474,165,565` as the activation threshold; do not claim active behavior before
  live mainnet reaches it.
- Do not claim a new GitHub release or package publication without actually
  publishing it.

## Milestones

1. Audit the complete skill surface.
- [x] Read the prior plan, working tree, skill creator guidance, core skill,
  manifest, adapters, references, scripts, and release workflow.
- [x] Identify stale adapter wording, package omissions, and version drift.

2. Update the complete skill.
- [x] Refine `SKILL.md` trigger metadata, engineering workflow, and progressive
  disclosure.
- [x] Align OpenAI, Anthropic, Cursor, Gemini, OpenClaw, and generic adapters.
- [x] Refresh references and source metadata from the latest checked-in
  snapshot.
- [x] Bundle source-intelligence tests and all runtime dependencies.
- [x] Bump the package to `1.7.0` and add accurate release notes.

3. Strengthen validation.
- [x] Validate required Toccata, network, wallet, fee, and UTXO rules across
  every adapter.
- [x] Validate package contents and extracted helper execution.

4. Verify.
- [x] Run skill-creator and repository compatibility validators.
- [x] Run Toccata source, knowledge, network, readiness, lineage, and vProg
  checks.
- [x] Run Kasware/Kaspium and address-prefix compatibility tests.
- [x] Build and smoke-test the `v1.7.0` package.
- [x] Run `git diff --check` and review the final diff.

## Commands To Verify

- `python3 /Users/anthonygryszkin/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/public/kaspa-sovereign-architect-engine`
- `node skills/public/kaspa-sovereign-architect-engine/scripts/validate-compatibility.mjs --all`
- `node --test skills/public/kaspa-sovereign-architect-engine/scripts/validate-compatibility.test.mjs`
- `node --test scripts/toccata-source-monitor.test.mjs`
- `node scripts/toccata-source-monitor.mjs --check`
- `node scripts/kaspa-knowledge-drill.mjs --check`
- `node scripts/toccata-network-check.mjs --check`
- `node scripts/toccata-mainnet-readiness-gate.mjs --check`
- `node scripts/covenant-lineage-prototype.mjs --check-all`
- `node scripts/vprog-scope-simulator.mjs --check`
- `npm run build --prefix kaspa-wallet-fullstack/backend && npm test --prefix kaspa-wallet-fullstack/backend`
- `npm test --prefix kaspa-wallet-fullstack/frontend`
- `npm run lint --prefix kaspa-wallet-fullstack/frontend && npm run build --prefix kaspa-wallet-fullstack/frontend`
- `skills/public/kaspa-sovereign-architect-engine/scripts/package-release.sh /tmp/kaspa-skill-v1.7.0 v1.7.0`
- `git diff --check`

## Verification Notes

- Live source checks are network-dependent; deterministic checks must remain
  runnable from the checked-in snapshot.
- The latest checked-in live sample recorded TN12 `HTTP 500`; this is evidence
  of endpoint state, not proof that TN12 protocol behavior is unavailable.
- Wallet dependency advisories remain separate maintenance work unless package
  changes in this plan require dependency updates.
- Packaged ZIP SHA-256:
  `1cbca071335b56db0f61eb9efd14b9b8f7e3bf93fc2ad27c915df14e572dba47`.
