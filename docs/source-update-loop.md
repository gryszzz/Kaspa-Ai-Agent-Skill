# Source Update Loop

The two scheduled monitors refresh source snapshots on automation branches and
open a PR for review. Main, release downloads, and an installed skill do not
change until those updates are reviewed and synchronized.

The October 2026 audit found that `gh pr view BRANCH` returned an old merged or
closed PR. Both workflows then edited it, reported success, and stopped opening
reviewable updates. The shared `scripts/update-snapshot-pr.mjs` now queries
`gh pr list --state open --base main --head BRANCH`. It edits the one open PR
by number or creates a fresh one. Failed, malformed, or ambiguous lookups fail
the job instead of masquerading as absence.

Regression checks:

```bash
node --test scripts/update-snapshot-pr.test.mjs scripts/kaspa-source-intelligence.test.mjs
```

The source watchlist includes released Silverscript tooling, experimental
Argent/vProgs, KCC conventions, and independent privacy research. Repository
activity is evidence of activity only. Release tags, convention adoption,
privacy claims, wallet support, and live network acceptance need their own
checks. Failed release and ref lookups are visible source-health warnings.

Refresh and review locally:

```bash
node scripts/kaspa-source-intelligence.mjs --write-if-changed
node scripts/toccata-source-monitor.mjs --write-if-changed
git diff -- research-snapshots
```

Synchronize the installed skill only after reviewing differences, using
`references/local-skill-sync.md`. Package smoke must also check the extracted
artifact, because repository-only scripts are not automatically installed by a
canonical-skill sync.
