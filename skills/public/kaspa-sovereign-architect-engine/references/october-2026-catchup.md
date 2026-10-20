# Post-Toccata Builder Baseline

Audit date: 2026-10-19. These are dated observations, not permanent versions.

## Released Foundations

- Rusty Kaspa `v2.1.0` includes protocol 11, chunked IBD, security hardening,
  post-Toccata cleanup, and `kaspa-txscript-zk-sdk` extraction.
- Silverscript `v1.0.0` is a released compiler for readable stateful Kaspa
  contracts. KaspaScript `.ks` and Silverscript `.sil` are different languages;
  neither artifact format nor bytecode compatibility may be assumed.
- Silverscript v1 pins Rusty Kaspa `a41a333b08848f41bf737b72592e463a6011b8ac`.
  A downstream project targeting node v2.1.0 must test their interoperability.
- Argent builds application and multi-contract abstractions above Silverscript.
  Its own README says it remains under active development and is not generally
  release-ready. Silverscript's stable release does not confer Argent readiness.
- KCCs are conventions. Record each document's status and validate wallet,
  indexer, artifact, and implementation support separately.

## Privacy Evidence

The Kaspa Privacy Initiative is independent community research. Its
`poc/tn10-live/README.md` reports a bounded October 19 private/native TN10 cycle:
four outer proofs, accepted settlements, four test-KAS principal paid to Bob,
and a separate 0.5 test-KAS permission-rent refund. Independent custody and the
full shutdown/recovery gate remain unproven. Independent verification of the
same receipts with shared verifier code is not an independent implementation or
security audit. Preserve these distinctions when discussing GPU results.

## Builder Verification

Follow `docs/kaspa/mainnet-readiness-gate.md`: protocol activation remains
separate from native transaction, wallet, indexer, miner, and app readiness.
Preserve v1 compute budgets, storage mass, covenant IDs, authorizing input,
explicit integer-sompi fees/change, and DAG reconciliation. A native engine test
is offline evidence; a fixture reducer is local model evidence. Neither is a
live accepted TN10 transaction.

Before calling a live covenant lifecycle verified, record the returned network
identity, pinned node/compiler versions, transaction IDs and acceptance,
genesis/continuation/exit outputs, fee/mass checks, rejection controls, and
indexer reconciliation. Never silently broadcast or use real funds to fill an
evidence gap.

## Keeping Knowledge Current

Run from the source repository or extracted release package:

```bash
node scripts/kaspa-source-intelligence.mjs --check
node scripts/toccata-source-monitor.mjs --check
```

In the repository, `--write-if-changed` refreshes dated snapshots. The daily
workflows publish updates through explicitly open PRs. A green run on an
automation branch does not mean main or the installed skill contains that
snapshot. Review, merge, and reconcile the installed skill with backup through
the documented sync command; do not overwrite unreviewed local edits.

Primary sources and exact pins are listed in `sources.md`.
