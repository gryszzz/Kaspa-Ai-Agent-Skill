# Live Source Intelligence

Use this reference for current, latest, released, active, scheduled, or
network-state claims across the broader Kaspa ecosystem.

## Command

Run from the repository root or from an extracted release package:

```bash
node scripts/kaspa-source-intelligence.mjs --check
node scripts/kaspa-source-intelligence.mjs --markdown
node scripts/kaspa-source-intelligence.mjs --write-if-changed
```

Use `--check` for validation, `--markdown` for a reviewer report, and
`--write-if-changed` when refreshing `research-snapshots/source-intelligence/`.

## Evidence Lanes

The source-intelligence snapshot tracks:

- official and core GitHub repositories
- latest Rusty Kaspa release
- selected branch/tag refs
- official docs, build pages, and research pages by fingerprint
- KIP documents and statuses
- mainnet/TN endpoint network identity and DAA values

## Required Handling

- Treat `verdict.sourceHealth` as evidence quality, not protocol truth.
- Treat endpoint failures as unknowns, not feature absence.
- Reject wrong-network endpoint evidence.
- Record `checkedAt`, `factsHash`, release tag, commit hash, and network name
  for current claims.
- Use the snapshot as a dated baseline. Re-run the script for "latest" claims
  when network access is available.

## Claim Wording

Good:

- "As of the snapshot checked at `<checkedAt>`, source health is
  `<sourceHealth>` and latest Rusty Kaspa release is `<tag>`."
- "TN12 endpoint was unavailable in this snapshot, so TN12 state is unknown
  from this source."

Bad:

- "TN12 is inactive because the endpoint failed."
- "A KIP status proves node, wallet, and indexer readiness."
- "Latest release means every related feature is active on mainnet."
