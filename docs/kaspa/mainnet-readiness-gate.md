# Mainnet Readiness Gate

Status: claim-control checklist and executable gate.

Current snapshot note, 2026-06-04:

- Decision: `do_not_claim_mainnet`.
- Complete gates: 1 of 6.
- PR #1000 is merged into `master`, so the merged-code-path gate is complete.
- Release `v1.3.0-toc.5` is tracked, but it is a pre-activation pre-release and does not complete the final mainnet-release or activation-schedule gates.
- TN10/TN12 evidence remains testnet-only.

Run:

```bash
node scripts/toccata-mainnet-readiness-gate.mjs
node scripts/toccata-mainnet-readiness-gate.mjs --check
```

The gate reads `research-snapshots/toccata/latest.json` and returns `do_not_claim_mainnet` unless all required evidence categories are complete.

## Required Gates

| Gate | Required evidence | Current rule |
| --- | --- | --- |
| Mainnet release tag | Rusty Kaspa release tag or signed release explicitly naming mainnet Toccata behavior | Testnet tags do not count |
| Activation schedule | Explicit mainnet height, DAA score, timestamp, or release note | Open PRs do not count |
| Merged production code path | Merged production branch or equivalent primary-source code evidence | PR #1000 is merged, but code merge alone is not activation |
| Mainnet endpoint evidence | Healthy endpoint checks returning expected mainnet network name and current state | TN10/TN12 are testnet-only |
| Wallet and indexer support | Wallet preview, signing support, indexer schema, reorg handling, and support matrix | Protocol code alone is not UX readiness |
| Docs alignment | Official docs or release notes aligned with tag, schedule, code, endpoints, and wallet/indexer support | General programmability docs do not imply activation |

## Decision Language

Allowed:

```text
Toccata evidence is present on testnet and in open source work, but this repo does not verify mainnet activation yet.
```

Blocked:

```text
Toccata is live on mainnet.
```

Blocked unless every gate is complete:

```text
Mainnet wallets and indexers can rely on Toccata behavior.
```

## Why This Exists

This repo tracks fast-moving source, KIPs, docs, testnet endpoints, and builder prototypes. That is powerful, but it creates a temptation to turn evidence into claims too early. The gate keeps the skill precise: testnet signals are useful, open PRs are useful, docs are useful, but mainnet claims require all evidence lines to converge.
