# Local Skill Synchronization

Use the repository directory
`skills/public/kaspa-sovereign-architect-engine/` as the canonical source.
Synchronize with the installed Codex copy through
`scripts/sync-local-skill.mjs`; do not copy either tree wholesale.

## Safe Workflow

Preview drift:

```bash
node skills/public/kaspa-sovereign-architect-engine/scripts/sync-local-skill.mjs \
  --check --report /tmp/kaspa-skill-drift.json
```

Install the repository skill locally:

```bash
node skills/public/kaspa-sovereign-architect-engine/scripts/sync-local-skill.mjs \
  --to-local --apply --backup
```

Inspect and import an intentional local edit:

```bash
node skills/public/kaspa-sovereign-architect-engine/scripts/sync-local-skill.mjs \
  --from-local --branch upgrade/local-skill-sync-v1.8
node skills/public/kaspa-sovereign-architect-engine/scripts/sync-local-skill.mjs \
  --from-local --branch upgrade/local-skill-sync-v1.8 --apply --backup
```

Dry-run is the default. `--apply` is required for writes. A destination changed
since the last successful synchronization is a conflict and blocks the write.
Use `--force` only after reviewing the JSON report and selecting the intended
direction. Pair forced resolution with `--backup`.

## State And Reports

For a complete installed bundle with repository docs, runtime scripts, and
current snapshots, first build and smoke-test `scripts/package-release.sh`,
extract the archive, and pass that verified skill directory as `--repo-dir`
with `--include-snapshots`. The latter is opt-in and is rejected for imports
from the installed copy; secrets and caches remain excluded.
It is generated from the canonical repository skill plus its declared context.
Use an explicit `--local-dir` and a separate persistent `--state` per installed
location. Review the dry-run, use `--backup`, and verify again against the same
extracted bundle after installation. A source-tree-only sync does not include
the repository context bundled by the release packager.

Example after extracting a locally built package:

```bash
node skills/public/kaspa-sovereign-architect-engine/scripts/sync-local-skill.mjs \
  --to-local --repo-dir /tmp/extracted/kaspa-sovereign-architect-engine \
  --include-snapshots \
  --local-dir "$HOME/.codex/skills/kaspa-sovereign-architect-engine" \
  --state "$HOME/.codex/state/kaspa-root-skill-sync.json" --backup
```

Add `--apply` after reviewing the report. `--force` remains reserved for
explicitly reviewed conflicts, always paired with backup.

The command stores the last successful tree hashes outside the skill at:

```text
$CODEX_HOME/state/kaspa-sovereign-architect-engine-sync-state.json
```

Reports contain sorted relative paths, SHA-256 file hashes, tree hashes,
classifications, proposed actions, and conflicts. They intentionally omit
timestamps so repeated comparisons of the same trees are deterministic.

## Exclusions

Synchronization excludes caches, logs, `.env` files, dependencies, coverage,
build output, generated snapshots, editor settings, package archives, checksum
files, and platform temporary files. These files are not canonical skill
content and must not resolve a source conflict.
