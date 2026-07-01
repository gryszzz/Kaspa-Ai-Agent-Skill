# Kaspa App Lab

Status: local post-Toccata covenant engineering fixtures.

The App Lab turns Toccata covenant reasoning into deterministic fixture checks.
It is not mainnet evidence, wallet readiness, miner readiness, explorer
readiness, or production application readiness.

## Source Gate

Before adding or changing App Lab fixtures, use these governing sources:

- `docs/toccata-evidence-ladder.md` for claim tiers and readiness boundaries.
- `skills/public/kaspa-sovereign-architect-engine/references/toccata-rd-playbook.md`
  for the repository source-of-truth rule.
- `docs/kaspa/covenant-lineage-indexer.md` for covenant-bound UTXO lineage,
  reorg, replay, accepted transaction context, and wrong-network handling.
- `docs/kaspa/wallet-covenant-signing-preview.md` for covenant spend preview
  requirements.

## Fixture Families

The current local app-pattern lab contains three covenant fixture families:

- `vault_escrow`: validates a guarded release transition, invalid claimant
  rejection, replay rejection, rollback, and wrong-network rejection.
- `stateful_registry`: validates a registry update transition, malformed name
  rejection, replay rejection, rollback, and wrong-network rejection.
- `atomic_swap`: validates a secret-claim transition, invalid secret rejection,
  replay rejection, rollback, and wrong-network rejection.

Every fixture must include:

- `valid`
- `invalid`
- `replay`
- `reorg_rollback`
- `wrong_network`
- wallet preview fields for consumed state, successor state, covenant ID,
  compute budget, fee, change, proof requirements, and a visible warning that
  the action is not a normal send.

## Verification

Run the App Lab reducer:

```bash
node scripts/toccata-app-lab.mjs --check-all
```

Run the approval ledger gate:

```bash
node scripts/toccata-readiness-approvals-check.mjs --check
```

## Promotion Boundary

A fixture can become a reusable builder pattern only after it has:

- a source citation from the evidence ladder or `docs/kaspa/`
- an explicit network and activation boundary
- an invalid transition case
- a replay case
- a reorg rollback case
- a wrong-network case
- wallet preview semantics
- a deterministic check command
- readiness status recorded in `READINESS_APPROVALS.md`

## Still Missing

- Invalid, malformed, max-size, boundary public-input, and early-rejection ZK
  proof-cost benchmark snapshots.
- Miner and pool block-template preservation tests for `computeBudget`,
  covenant output data, storage mass, and transaction v1.
- A working KIP-21 `GetSeqCommitLaneProof` witness drill.
- Manual readiness approvals from wallet, indexer, miner, and explorer
  maintainers, or reproducible integration tests accepted as equivalent
  evidence.

