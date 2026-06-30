# Toccata Ecosystem Readiness Audit

Checked: 2026-06-30T23:24:40.577Z

Verdict: `do_not_claim_wallet_indexer_ready`

This audit checks configured public repositories for source availability and
Toccata-related evidence terms. It does not prove wallet, indexer, miner,
explorer, or application readiness.

| Source | Role | Source | Readiness | Evidence terms | Evidence samples |
| --- | --- | --- | --- | --- | --- |
| KasWare browser extension | wallet | ok | source_available_no_toccata_readiness_proof | none | none |
| Kaspium mobile wallet | wallet | ok | repo_contains_toccata_evidence_review_required | toccata, covenant, storageMass | lib/kaspa/transaction/mass_calculator.dart (covenant,storageMass)<br>test/mass_calculator_test.dart (storageMass) |
| Kaspa NG | wallet_explorer_node | ok | repo_contains_toccata_evidence_review_required | toccata | core/CHANGELOG.md (toccata) |
| Simply Kaspa Indexer | indexer | ok | repo_contains_toccata_evidence_review_required | toccata, covenant, covenant_id | README.md (covenant,covenant_id) |
| Kaspa Explorer | explorer | ok | source_available_no_toccata_readiness_proof | none | none |
| Kaspa REST API server | explorer_api | ok | repo_contains_toccata_evidence_review_required | toccata, covenant, covenant_id, storage_mass | endpoints/get_transaction_mass.py (storage_mass)<br>helper/mass_calculation_storage.py (storage_mass)<br>helper/tests/test_storage_mass.py (storage_mass) |
| Kaspa CPU miner | miner | ok | source_available_no_toccata_readiness_proof | none | none |
| Rusty Kaspa reference node | node_mining_template_reference | ok | repo_contains_toccata_evidence_review_required | toccata, covenant, covenant_id, storage_mass, computeBudget, compute_commit, storageMass | consensus/client/src/covenant.rs (covenant,covenant_id)<br>consensus/core/src/hashing/covenant_id.rs (covenant,covenant_id)<br>consensus/core/src/mass/mod.rs (covenant,storage_mass,computeBudget,compute_commit,covenant_id) |
