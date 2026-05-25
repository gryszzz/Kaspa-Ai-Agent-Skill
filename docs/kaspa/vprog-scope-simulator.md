# vProg Scope Simulator

Status: small executable model for read sets, write sets, witness size, proof cadence, and scope explosion.

The simulator is intentionally simple. It helps builders catch designs that are trying to read too many apps, write too much state, carry oversized witnesses, or batch proofs so widely that the witness and rollback surface becomes hard to reason about.

Run:

```bash
node scripts/vprog-scope-simulator.mjs
node scripts/vprog-scope-simulator.mjs --check
```

Default fixture:

```text
fixtures/toccata/vprog-scope-basic.json
```

## Model

Each action declares:

- `app`: the app executing the action.
- `readSet`: state keys that must be read.
- `writeSet`: state keys that may change.
- `proofCadence.actionsPerProof`: how many actions one proof covers.
- `witnessBytes`: approximate witness payload size.

The simulator computes:

- Unique scope keys.
- Dependency apps inferred from key prefixes.
- Witness size.
- Proof cadence gap.
- Risk flags for scope explosion, dependency fanout, witness oversize, write amplification, and proof cadence gap.

## Example Interpretation

A small AMM swap that touches one DEX pool, one oracle price, and one account is low risk.

A composed liquidation that reads lending state, oracle state, DEX liquidity, risk parameters, sequencing state, identity state, governance parameters, bridge inventory, and settlement state is flagged because the action is no longer app-local. This does not mean the design is impossible. It means the builder must prove witness availability, pruning safety, and bounded verification cost before treating it as a practical vProg pattern.

## Builder Rule

If an app routinely crosses the simulator limits, do not force it into a covenant-only design. Reclassify it as Based App or future vProg territory and document the witness, pruning, and proof cadence assumptions before building wallet UX.
