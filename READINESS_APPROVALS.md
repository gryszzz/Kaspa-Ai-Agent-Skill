# Toccata Readiness Approvals

This ledger separates local engineering checks from ecosystem readiness.

Do not claim wallet, indexer, miner, explorer, or application readiness unless
a dated maintainer approval or a reproducible integration test is recorded
here with the exact claim and evidence link.

## Ledger

| Component | Status | Evidence Type | Source/Maintainer | Date | Exact Claim | Evidence Link | Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- |
| wallet | not_approved | pending | N/A | N/A | No Kasware/Kaspium covenant signing approval captured yet. | N/A | Wallet preview fixtures are local only and do not prove wallet support. |
| indexer | integration_evidence_only | reproducible_integration_test | Public Kaspa REST/indexer export | 2026-06-30 | One public mainnet covenant/indexer export was captured and locally normalized. | fixtures/toccata/live-covenant-indexer-mainnet-latest.json; `node scripts/toccata-live-covenant-export.mjs --check` | One live export is useful evidence, not ecosystem-wide indexer readiness. |
| miner | not_approved | pending | N/A | N/A | No miner or pool preservation approval captured yet. | N/A | Block-template preservation for compute budget, covenant data, storage mass, and transaction v1 remains unproven. |
| explorer | not_approved | pending | N/A | N/A | No explorer maintainer approval captured yet. | N/A | Explorer display and API parity must be proven independently from REST/indexer capture. |
| app | local_fixture_only | deterministic_local_fixture | Kaspa App Lab | 2026-07-01 | Local covenant app fixtures validate reducer behavior for vault/escrow, registry, and atomic-swap-style flows. | fixtures/toccata/app-lab/; `node scripts/toccata-app-lab.mjs --check-all` | Local fixtures are not mainnet evidence, wallet readiness, or production app readiness. |

## Required Approval Shape

When a real approval arrives, add a new row instead of overwriting the boundary
history:

| Component | Status | Evidence Type | Source/Maintainer | Date | Exact Claim | Evidence Link | Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- |
| wallet | approved | maintainer_approval | Maintainer name or signed source | YYYY-MM-DD | Exact approval claim in one sentence. | URL, issue, PR, signed note, or reproducible test command | What this does not prove. |

Acceptable evidence types:

- `maintainer_approval`
- `reproducible_integration_test`
- `public_api_capture`
- `deterministic_local_fixture`
- `pending`

Status vocabulary:

- `approved`
- `integration_evidence_only`
- `local_fixture_only`
- `not_approved`

