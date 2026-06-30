# ExecPlan: Toccata Builder Skill, Source Truth, And Agent Flywheel

## Current Goal

Make repository-local agent behavior match the Toccata builder workflow and
autonomous engineering flywheel:

- Treat `docs/kaspa/` and `docs/toccata-evidence-ladder.md` as the
  repository source of truth for Toccata builder requirements.
- Require Toccata R&D Intelligence mode to cite the relevant playbook,
  `docs/kaspa` note, or evidence-ladder requirement before proposing
  covenant-related changes.
- Formalize `AGENTS.md` as the persistent agent memory journal with a
  `[Problem] | [Kaspa Protocol Constraint] | [Solution]` Pattern of Success
  format.
- Add `TRAINING_SOURCES.md` as the immutable protocol-source ladder and make
  agent sessions cite it before protocol, transaction, covenant, sequencing,
  wallet, indexer, or architecture changes.
- Add `docs/toccata.md` as the official/repo-backed Toccata builder guide for
  node operators, wallet builders, pool/miner integrators, indexers/explorers,
  KaspaScript/covenant builders, and ZK/lane-proof researchers.
- Add `SYSTEM_ARCHITECTURE.md` and `AGENT_TRACE.md` so non-trivial autonomous
  work has memory, Plan-Act-Verify discipline, observability, and rollback
  boundaries.
- Add CI smoke coverage for agent-facing Toccata tasks, including the network
  endpoint check and mainnet readiness gate.

## Current Constraints

- Keep Kaspa UTXO-first, DAG-aware, and network-explicit.
- Do not turn testnet, branch, KIP, docs, or research evidence into mainnet
  activation claims.
- Preserve existing release-gate behavior and package-release docs bundling.
- Do not let community resources override official docs, Rusty Kaspa code,
  releases, or KIPs.
- Do not add autonomous wallet spending, paid API behavior, or new agent
  orchestration dependencies without explicit approval.
- Make changes minimal and verifiable.

## Current Verification Plan

```bash
node skills/public/kaspa-sovereign-architect-engine/scripts/validate-compatibility.mjs --all
node skills/public/kaspa-sovereign-architect-engine/scripts/run-behavioral-evals.mjs --check
node --test skills/public/kaspa-sovereign-architect-engine/scripts/*.test.mjs
node scripts/validate-skill-release.mjs --check
node --test scripts/validate-skill-release.test.mjs
node scripts/toccata-network-check.mjs --check
node scripts/toccata-mainnet-readiness-gate.mjs --check
skills/public/kaspa-sovereign-architect-engine/scripts/package-release.sh \
  /tmp/kaspa-skill-v1.8.0 v1.8.0
git diff --check
```

# Previous ExecPlan: Local Skill Sync, Behavioral Evals, And Release Discipline

## Goal

Make `skills/public/kaspa-sovereign-architect-engine/` the canonical
distributable skill, add conflict-safe synchronization with the installed
Codex copy, reduce duplicated prompt truth, add deterministic behavioral
evaluations, and prepare a coherent next release without publishing it.

## Audit Baseline

- Audit date: 2026-06-13.
- Repository: `gryszzz/Kaspa-Ai-Agent-Skill`.
- Starting commit: `a80a44d245d1f6d4d5cb233a429ca0481b6880bd`.
- Working branch: `upgrade/local-skill-sync-v1.8`.
- Repository manifest: `1.7.0`.
- Latest published GitHub release: `v1.6.2`, published 2026-05-26.
- Installed skill:
  `~/.codex/skills/public/kaspa-sovereign-architect-engine`.
- Installed skill is byte-for-byte identical to repository tag `v1.5.0`.
- All 17 observed differences are repository-only improvements. There are no
  authored local improvements, local-only files, conflicts, generated
  artifacts, volatile snapshots, machine-specific files, caches, or temporary
  files in the compared skill trees.

## Constraints

- Keep Kaspa UTXO-first and DAG-aware.
- Preserve Kasware and Kaspium compatibility.
- Validate `kaspa:` and `kaspatest:` addresses.
- Keep fees, recipients, change, signing intent, custody, and key handling
  explicit.
- Separate release, scheduled activation, verified network activation, and
  ecosystem readiness.
- Never overwrite synchronization conflicts silently.
- Dry-run is the synchronization default.
- Do not tag, publish, or release automatically.

## Milestones

1. Establish deterministic source-of-truth synchronization.
- [x] Add `--check`, `--from-local`, `--to-local`, `--dry-run`, `--backup`,
  and `--branch`.
- [x] Store deterministic hashes and a machine-readable drift report.
- [x] Exclude caches, logs, environment files, snapshots, dependencies,
  editor files, and platform temporary files.
- [x] Detect changed-on-both-sides conflicts using a shared sync-state file.
- [x] Test direction, deletion, ignores, conflicts, and missing local roots.

2. Reduce prompt duplication without reducing Kaspa specialization.
- [x] Keep safety, UTXO, DAG, signing, network, wallet, source-verification,
  and completion rules in `SKILL.md`.
- [x] Move dated Toccata facts and detailed compatibility material to
  references.
- [x] Add a knowledge map that routes task types to references.
- [x] Keep adapters semantically aligned with the operating kernel.

3. Add deterministic behavioral evaluations.
- [x] Cover network confusion, scheduled versus active behavior, KIP
  lifecycle, DAG indexers, UTXO conservation, signing/custody, Kasware and
  Kaspium, mass conflicts, policy versus consensus, covenant lineage/reorgs,
  endpoint failures, future-feature claims, and citation/date requirements.
- [x] Check both required content and prohibited claims.

4. Add release and metadata consistency gates.
- [x] Align manifest, README, adapters, release notes, examples, and package
  metadata on the next repository version.
- [x] Keep published release metadata separate from repository version.
- [x] Add CI checks for adapter and version drift.
- [x] Prepare release notes without creating a tag or release.

5. Verify repository and packaged artifact.
- [x] Run existing compatibility, source, knowledge, lineage, vProg, network,
  and readiness checks.
- [x] Run all new sync, evaluation, and consistency tests.
- [x] Run skill quick validation and `git diff --check`.
- [x] Package the skill, extract it into a clean temporary directory, and run
  the checks again from the artifact.
- [x] Commit in focused increments.
- [x] Push only after all checks pass.

## Verification Commands

```bash
python3 "$HOME/.codex/skills/.system/skill-creator/scripts/quick_validate.py" \
  skills/public/kaspa-sovereign-architect-engine
node skills/public/kaspa-sovereign-architect-engine/scripts/validate-compatibility.mjs --all
node --test skills/public/kaspa-sovereign-architect-engine/scripts/*.test.mjs
node --test scripts/toccata-source-monitor.test.mjs
node scripts/toccata-source-monitor.mjs --check
node scripts/kaspa-knowledge-drill.mjs --check
node scripts/covenant-lineage-prototype.mjs --check-all
node scripts/vprog-scope-simulator.mjs --check
node scripts/toccata-network-check.mjs --check
node scripts/toccata-mainnet-readiness-gate.mjs --check
git diff --check
```

## Release Posture

- Suggested next version: `1.8.0` because synchronization, evaluations, and CI
  contracts add new distributable capabilities.
- Published release remains `v1.6.2` until a release is explicitly created.
- Repository version will become `1.8.0` only with matching README and release
  metadata updates.

## Verification Record

- Repository and extracted-package checks passed on 2026-06-13.
- Packaged ZIP SHA-256:
  `99786b97a6b01a267d609b5ba596a5e77af616e4f3fbe0330ddec68a28d11182`.
- Packaged tarball SHA-256:
  `373107a34e06a48addddc7981b6c488f2f53d97f3448f78a52c59022dc318dff`.
- The deterministic network check retained one hard endpoint issue and one
  warning while correctly enforcing `do_not_claim_mainnet_protocol_active` and
  `do_not_claim_wallet_indexer_ready`.
