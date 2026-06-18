# Kaspa Knowledge Map

Load only the references needed for the task. `SKILL.md` is the operating
kernel; these files hold detailed or changing knowledge.

| Task | Load | Purpose |
|---|---|---|
| Current, latest, released, active, or scheduled claim | `source-trust-policy.md`, `live-source-intelligence.md`, then the relevant section of `sources.md` | Establish evidence hierarchy, dated baseline, official URLs, network identity, source-health warnings, and claim status. |
| Toccata, covenants, ZK, sequencing, SilverScript, Based Apps, or vProgs | `toccata-rd-playbook.md`, plus `sources.md` | Load release/activation evidence, branch and KIP state, transaction compatibility, policy, migration, miner, wallet, indexer, and R&D detail. |
| KIP status or future-feature research | `kaspa-research-radar.md`, `source-trust-policy.md`, and `sources.md` | Separate proposal, merged document, implementation, release, activation, and ecosystem support. |
| Transaction plan, payment builder, fee/change review, signing preview, or broadcast safety | `transaction-plan-safety.md`, then `repo-audit-checklist.md` section 3 when code is involved | Enforce explicit inputs, outputs, fees, change, network prefixes, no secrets, no broadcast-by-default, and linter-backed review. |
| Wallet, signing, custody, identity, or payment architecture | `core-research-track.md` sections 6-7 and `repo-audit-checklist.md` sections 3-5 | Trace key boundaries, signing intent, provider trust, address/network validation, UTXO value flow, and UX risk. |
| DAG-aware indexer, RPC, balance, or query design | `core-research-track.md` sections 4-5 and `repo-audit-checklist.md` sections 2-5 | Design ingestion, reconciliation, checkpoints, replay, derived state, source identity, and authority labels. |
| Repository or code audit | `repo-audit-checklist.md`; add the domain reference above | Inspect concrete files, symbols, transaction paths, node interaction, security, and verification. |
| Protocol, mining, operations, or security deep dive | Relevant numbered sections of `core-research-track.md` | Load first-principles protocol, mining, live-network, DevOps, and incident-analysis questions. |
| New or changing ecosystem work | Relevant lane in `kaspa-research-radar.md`, then primary sources | Track economics, consensus, mining, papers, KIPs, programmability, and ecosystem engineering without promoting speculation. |
| Repository/local skill drift | `local-skill-sync.md` | Use deterministic two-way synchronization, conflict detection, backups, branch guards, and machine-readable reports. |

For packaged Toccata tasks, also load the corresponding files under
`references/repo-docs/` when present. For repository work, use the original
`docs/`, `research-snapshots/`, `fixtures/`, and `training-corpus/` paths.

Do not load every reference by default. Start with this map, choose the narrow
route, and expand only when evidence or implementation detail requires it.
