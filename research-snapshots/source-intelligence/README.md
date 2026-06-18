# Kaspa Source Intelligence Snapshots

This directory stores broad live-source intelligence snapshots generated from
official Kaspa repositories, release feeds, docs/research fingerprints, KIP
metadata, and network identity endpoints.

Refresh locally:

```bash
node scripts/kaspa-source-intelligence.mjs --write-if-changed
```

Use the snapshot as dated evidence, not permanent truth. Endpoint failures are
unknowns, not proof that a feature is absent.
