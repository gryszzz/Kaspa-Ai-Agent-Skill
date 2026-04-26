# ExecPlan: Upgrade Kaspa Researcher + Engineer Skill v1.4.0

## Goal

Upgrade the existing `kaspa-sovereign-architect-engine` package into a sharper, current-aware, source-grounded Kaspa researcher and engineering skill without breaking its package-first structure or adapter compatibility.

## Success Metrics

- Skill supports efficient response modes and no longer forces deep audit output for tiny questions.
- Current/future Kaspa claims use freshness checks, source hierarchy, absolute dates, and commit hashes where applicable.
- KIPs, Kdapp, WASM/TypeScript, indexers, wallet safety, and future features have explicit handling rules.
- Adapters reference the same core policies and pass compatibility validation.
- README, manifest, release notes, and references describe the v1.4.0 behavior clearly.

## Constraints

- Preserve the existing package layout under `skills/public/kaspa-sovereign-architect-engine/`.
- Modify existing skill/docs instead of creating a new project.
- Do not remove adapter compatibility or validator-required metadata.
- Do not present roadmap or research discussion as live protocol behavior.

## Milestones

1. Inspect current repository structure and stale defaults.
- [x] Review README, README.dev, AGENTS, PLANS, CONTRIBUTING, manifest, skill, references, adapters, workflows, docs, release notes, and training corpus.

2. Refresh source baseline.
- [x] Check primary Kaspa source families and record repository snapshot hashes.

3. Upgrade the core skill.
- [x] Add Freshness & Verification Protocol.
- [x] Add Source Trust Policy pointer.
- [x] Add Research Radar pointer.
- [x] Add Efficient Response Modes.
- [x] Add KIP, Kdapp, WASM/TypeScript, indexer, wallet, and future-feature disciplines.
- [x] Scope deep audit skeleton to Deep Protocol Audit mode.

4. Update package assets.
- [x] Add `source-trust-policy.md`.
- [x] Add `kaspa-research-radar.md`.
- [x] Refresh source inventory.
- [x] Update adapters.
- [x] Update README examples and manifest metadata.
- [x] Add v1.4.0 release notes.

5. Validate and ship branch.
- [x] Run compatibility validation.
- [x] Run available markdown/link checks if present.
- [x] Confirm adapter references and required files.
- [ ] Commit changes.
- [ ] Push branch if remote is available.

## Commands to Verify

- `node skills/public/kaspa-sovereign-architect-engine/scripts/validate-compatibility.mjs --all`
- `rg -n "Freshness & Verification Protocol|Source Trust Policy|Research Radar|Efficient Response Modes|KIP Status Discipline|Wallet Safety Discipline" skills/public/kaspa-sovereign-architect-engine/agents`
- `rg -n "kaspa-sovereign-architect-engine" skills/public/kaspa-sovereign-architect-engine/agents`
- `test -f skills/public/kaspa-sovereign-architect-engine/references/source-trust-policy.md`
- `test -f skills/public/kaspa-sovereign-architect-engine/references/kaspa-research-radar.md`
- `test -f release-notes/v1.4.0.md`

## Blockers / TODOs

- No markdown lint or broken-link checker was present in repo metadata or workflows; compatibility, package, adapter export, and targeted search checks were run instead.
