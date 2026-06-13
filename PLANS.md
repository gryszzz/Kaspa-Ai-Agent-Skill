# ExecPlan: Local Skill Sync, Behavioral Evals, And Release Discipline

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
- [ ] Run existing compatibility, source, knowledge, lineage, vProg, network,
  and readiness checks.
- [ ] Run all new sync, evaluation, and consistency tests.
- [ ] Run skill quick validation and `git diff --check`.
- [ ] Package the skill, extract it into a clean temporary directory, and run
  the checks again from the artifact.
- [ ] Commit in focused increments and push only after all checks pass.

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
