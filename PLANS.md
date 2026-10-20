# ExecPlan: Buyer/Seller Script Without Agent Custody

## Current Goal

Document and evaluate the spending agreement chosen by the user: buyer/seller
escrow with explicit shared rules. Keep keys with the participants. Explain
cooperative release, buyer timeout recovery, fee caps, and the inability of a
script to adjudicate delivery. Ground the reference in the executable
KaspaScript template and pinned Rusty Kaspa v2.1.0 engine tests.

## Milestones

- [x] Read the readiness/source rules and run the network fixture check.
- [x] Add a scoped escrow reference and route it from the knowledge map.
- [x] Add positive/adversarial behavioral evaluation coverage.
- [x] Run skill tests, compatibility, release validation and diff checks.
- [x] Package, test, back up and synchronize both installed skill locations.
- [x] Record native/offline evidence and remaining wallet/live boundaries.

No key reading, signing, funding, submission, paid proving, release publication,
or readiness promotion is authorized by this documentation work. Preserve
Kasware and Kaspium as wallet integration paths requiring separate verification.

## Checkpoint: 2026-10-20T01:19:14Z

KaspaScript has a readable two-party `.ks` template, single native P2SH
dispatcher, fee/payout constraints, unsigned previews and an optional read-only
wRPC inspector. Native tests exposed and now cover positive script-number sign
encoding. The legacy SDK refuses multi-path instantiation that would omit
recovery. Workspace tests: 85 passed, two live ignored; native tests: 19 passed.
Both Rust format/Clippy lanes passed.

Agent tests: 55 passed; behavioral reference cases: 19/19; extracted-package
tests: 43 passed. Release/compatibility/plan-lint/skill-validation gates passed.
Installed trees match tested package hash
`d43335867000205cfe7d4d5edef8049537ea1adad51bdea98d71afb9386a7262`;
backups end in `0293a578fc70` and `7e82b7888640`.

No real keys were read or funds moved. Wallet-provider signing, visual approval,
accepted funded TN10 receipts and DAG/indexer recovery remain unverified.
Behavioral references are guardrail tests, not fresh LLM evaluations. At this
checkpoint changes remained local and the remote draft PRs were unchanged.

## Integration Authorization: 2026-10-20T01:21:59Z

The user explicitly authorized commits, pushes and merges. Integrate the tested
working-tree changes into existing KaspaScript PR #2 and skill PR #23. Refresh
local gates, push the exact reviewed commits, wait for fresh CI, and merge only
when GitHub reports the PRs are mergeable with successful checks and no change
requests. Keep branch protection intact; do not use an administrative bypass.
The PR histories provide final commit/check/merge receipts. No release, wallet
signing, funding, key access or transaction broadcast is authorized by this step.

# Previous ExecPlan: October 2026 Catch-Up

## Current Goal

Restore the daily source-update loop, refresh dated protocol knowledge, reconcile
the installed skill with reviewed repository content, and validate KaspaScript
against released Rusty Kaspa and Silverscript tooling.

## Milestones

- [x] Fix snapshot PR selection and cover open, merged, closed, and API failures.
- [x] Track Silverscript releases, Argent, KCCs, and experimental privacy work.
- [x] Refresh source snapshots and packaged references with dated evidence.
- [x] Run skill tests, readiness checks, and extracted-package verification.
- [x] Back up and synchronize both installed skill locations without losing edits.
- [x] Add and run pinned KaspaScript compatibility and offline covenant lifecycle checks.
- [x] Record verified results, limitations, commits, and reviewable pull requests.

## Constraints And Verification

Follow `docs/kaspa/mainnet-readiness-gate.md`: protocol activation does not prove
transaction construction, wallet/indexer support, fee behavior, or app readiness.
Use Rusty Kaspa `v2.1.0` and Silverscript `v1.0.0` source pins; distinguish native
offline validation from live TN10 acceptance. No mainnet signing, paid proving,
release publication, or readiness promotion is part of this pass.

Run the snapshot PR regressions, source intelligence tests, all skill script
tests, release validation, network/readiness checks, package smoke, and
`git diff --check`. In KaspaScript, run workspace format/test/clippy plus the
isolated upstream compatibility probe and document any live-test prerequisites.

## Checkpoint: 2026-10-19

- Source snapshot: 10/10 repositories, 2/2 releases, 11/11 refs; mainnet and
  TN10 returned the correct network identities. TN12 returned unavailable.
- Agent repository tests: 54 passed; behavioral references: 18/18; extracted
  package tests: 42 passed; mainnet protocol gate: 6/6, ecosystem readiness held.
- Both installed skill locations match the reviewed full package with dated
  snapshots. Original copies were backed up before synchronization.
- KaspaScript: 83 workspace tests passed with testnet integration enabled;
  two live network tests remain ignored. Seven new native v2.1.0 tests passed,
  including both compilers and a signed offline genesis/continuation/exit flow.
- Live funded TN10 acceptance is not claimed. The funded wallet/node setup
  question remains open; no mainnet or live testnet funds were used.
- Agent changes: `bb88366` and snapshot refresh `62f4e0a`, draft review at
  https://github.com/gryszzz/Kaspa-Ai-Agent-Skill/pull/23.
- KaspaScript changes: `742e545`, draft review at
  https://github.com/gryszzz/Kaspa-Script/pull/2.
- Both branches are pushed. Main is unchanged; scheduled automation adopts the
  fix after review/merge. GitHub CI was started for both PRs.

# Previous ExecPlan: Post-Toccata Kaspa App Lab Hardening

## Current Goal

Start the post-Toccata Kaspa App Lab so the skill learns from executable
builder fixtures instead of general covenant descriptions:

- Fast-forward local `main` to `origin/main` before new work.
- Add three local covenant app-pattern fixtures: vault/escrow, stateful
  registry, and atomic-swap-style flow.
- Each fixture must include valid transition, invalid transition, replay
  attempt, reorg rollback, wrong-network rejection, and wallet preview data.
- Add a deterministic reducer/checker so these patterns become testable
  training and release-gate material.
- Add a maintainer readiness approval ledger that keeps wallet, indexer,
  miner, explorer, and app readiness unclaimed until a dated approval or
  reproducible integration test exists.
- Keep daily source-intelligence workflows intact and do not duplicate them.
- Keep Toccata mainnet protocol activation tied to the live `kaspa-mainnet`
  DAA evidence while keeping wallet/indexer/miner/application readiness
  explicitly separate.
- Treat `docs/toccata.md`, `docs/kaspa/`, and
  `docs/toccata-evidence-ladder.md` as the repository source of truth for
  Toccata builder requirements.
- Require Toccata R&D Intelligence mode to cite the relevant playbook,
  `docs/kaspa` note, or evidence-ladder requirement before proposing
  covenant-related changes.

## Current Constraints

- Keep Kaspa UTXO-first, DAG-aware, and network-explicit.
- Do not turn testnet, branch, KIP, docs, release schedule, or research
  evidence into mainnet activation claims without live `kaspa-mainnet`
  threshold evidence.
- Do not turn protocol activation into wallet, indexer, miner, explorer, or
  application readiness.
- Preserve existing release-gate behavior and package-release docs bundling.
- Do not let community resources override official docs, Rusty Kaspa code,
  releases, or KIPs.
- Do not add autonomous wallet spending, paid API behavior, or new agent
  orchestration dependencies without explicit approval.
- App Lab fixtures are local engineering fixtures only. They are not live
  mainnet evidence, wallet approval, miner approval, explorer approval, or
  production app readiness.
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
node scripts/toccata-protocol-drill.mjs --check
! node scripts/toccata-protocol-drill.mjs \
  --responses fixtures/toccata/protocol-drill-adversarial-responses.json
node scripts/toccata-captured-responses-check.mjs --check
node scripts/toccata-ecosystem-readiness-audit.mjs --check
node scripts/toccata-live-covenant-export.mjs --check
node scripts/toccata-live-fixture-check.mjs --check
node scripts/toccata-zk-benchmark-check.mjs --check
node scripts/toccata-app-lab.mjs --check-all
node scripts/toccata-readiness-approvals-check.mjs --check
node --test scripts/toccata-protocol-drill.test.mjs
node --test scripts/toccata-evidence-lanes.test.mjs
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
  warning while correctly enforcing the then-current pre-activation protocol
  gate and `do_not_claim_wallet_indexer_ready`.
