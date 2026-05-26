# ExecPlan: Publish Kaspa Skill To GitHub Packages

## Goal

Publish `kaspa-sovereign-architect-engine` to GitHub Packages so the repository Packages tab shows a real package in addition to GitHub Release assets.

## Success Metrics

- Release workflow has `packages: write` permission.
- Release workflow pushes a GHCR OCI artifact containing ZIP, tarball, and `SHA256SUMS.txt`.
- README documents both GitHub Release downloads and GitHub Packages pulls.
- Manifest is bumped to the new release version.
- Tag push creates a GitHub Release and a GitHub Packages entry.

## Constraints

- Preserve the existing package layout under `skills/public/kaspa-sovereign-architect-engine/`.
- Do not remove adapter compatibility or validator-required metadata.
- Do not present roadmap or research discussion as live protocol behavior.
- Do not change skill behavior or adapters.
- Keep the release workflow interface unchanged.

## Milestones

1. Inspect package state.
- [x] Read `AGENTS.md` and `PLANS.md`.
- [x] Confirm current branch and remote.
- [x] Confirm GitHub Release assets exist but GitHub Packages is empty.

2. Add GitHub Packages publishing.
- [x] Add GHCR/ORAS publishing to `.github/workflows/release-skill.yml`.
- [x] Bump manifest and README release pointer.
- [x] Add release notes for the package-channel release.
- [x] Document `oras pull`.

3. Validate.
- [x] Run compatibility validation before release changes.
- [x] Run compatibility validation after release changes.
- [x] Build local release artifacts.
- [x] Run release-relevant Toccata checks.
- [x] Push commit and tag.
- [x] Verify GitHub Release assets.
- [x] Verify GitHub Packages entry/digest.

## Commands to Verify

- `node scripts/covenant-lineage-prototype.mjs --check-all`
- `node scripts/vprog-scope-simulator.mjs --check`
- `node scripts/toccata-network-check.mjs --check`
- `node scripts/toccata-mainnet-readiness-gate.mjs --check`
- `node skills/public/kaspa-sovereign-architect-engine/scripts/validate-compatibility.mjs --all`
- `skills/public/kaspa-sovereign-architect-engine/scripts/package-release.sh /tmp/kaspa-skill-release-v1.6.2 v1.6.2`
- `gh release view v1.6.2 --json assets,url`
- `oras manifest fetch ghcr.io/gryszzz/kaspa-sovereign-architect-engine:v1.6.2`
- `git diff --check`

## Blockers / TODOs

- No root package manifest exists for a single repo-wide `npm test`; validation uses the release workflow's skill-specific checks.
