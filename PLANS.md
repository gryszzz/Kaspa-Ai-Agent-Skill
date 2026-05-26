# ExecPlan: Publish Kaspa Skill Package v1.6.1

## Goal

Publish a small, reviewable `kaspa-sovereign-architect-engine` package release without changing runtime behavior or adapter contracts.

## Success Metrics

- Manifest version is bumped to `1.6.1`.
- README points to the current release notes.
- GitHub Release artifacts are produced by `.github/workflows/release-skill.yml`.
- Compatibility validation and Toccata readiness checks pass before tagging.
- Release assets include ZIP, tarball, latest aliases, and `SHA256SUMS.txt`.

## Constraints

- Preserve the existing package layout under `skills/public/kaspa-sovereign-architect-engine/`.
- Do not remove adapter compatibility or validator-required metadata.
- Do not present roadmap or research discussion as live protocol behavior.
- Do not reuse `v1.6.0`; it already exists as a published release.

## Milestones

1. Inspect release state.
- [x] Read `AGENTS.md` and `PLANS.md`.
- [x] Confirm `v1.6.0` already exists on GitHub.
- [x] Confirm current branch and remote.

2. Prepare release metadata.
- [x] Bump manifest to `1.6.1`.
- [x] Update README release pointer.
- [x] Add `release-notes/v1.6.1.md`.

3. Validate and publish.
- [x] Run compatibility validation before edits.
- [x] Run compatibility validation after edits.
- [x] Build local release artifacts with the package script.
- [x] Commit release metadata.
- [x] Tag `v1.6.1`.
- [x] Push commit and tag.
- [x] Verify GitHub Release assets and SHA256 digests.

## Commands to Verify

- `node scripts/covenant-lineage-prototype.mjs --check-all`
- `node scripts/vprog-scope-simulator.mjs --check`
- `node scripts/toccata-network-check.mjs --check`
- `node scripts/toccata-mainnet-readiness-gate.mjs --check`
- `node skills/public/kaspa-sovereign-architect-engine/scripts/validate-compatibility.mjs --all`
- `skills/public/kaspa-sovereign-architect-engine/scripts/package-release.sh /tmp/kaspa-skill-release-v1.6.1 v1.6.1`
- `git diff --check`

## Blockers / TODOs

- No root package manifest exists for a single repo-wide `npm test`; validation uses the release workflow's skill-specific checks.
