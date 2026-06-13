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
