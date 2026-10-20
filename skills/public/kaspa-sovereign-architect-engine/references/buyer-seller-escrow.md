# Buyer/Seller Escrow Without Agent Custody

Use when a user asks for a Kaspa script that controls escrow funds or asks who
can move them. Establish the desired spending agreement before adding an
arbiter, administrator, oracle, service fee, or recovery key.

## Concrete Experimental Agreement

KaspaScript's `contracts/buyer_seller_escrow.ks` has two participants:

- Cooperative release requires buyer AND seller signatures and pays the seller.
- A buyer-signed refund is available after an agreed absolute DAA-score deadline.
- Both paths are committed into the SAME P2SH redeem script before funding.
- Each spend has exactly one input and one output, with an explicit miner fee
  deducted from the locked principal and bounded by the agreed cap.
- Neither the agent nor a platform key is a signer. Keys stay in each user's
  wallet. There is no arbiter, service recipient, or automatic broadcast.

The buyer can withhold release and later take the refund, even if delivery
occurred. This economic limitation must be disclosed. The script cannot judge
delivery or resolve disputes. After the deadline, a release can conflict with
a refund; accepted DAG state decides which spend prevails. A fee cap can delay
recovery during high fees. Lost buyer keys can make funds unrecoverable.

## Evidence Boundary

Follow `docs/kaspa/mainnet-readiness-gate.md`: application readiness is separate
from protocol activation. The experimental implementation uses released Rusty
Kaspa v2.1.0 commit `01b532e8b553523216471682649693af92f0fd16`:

- [Native signatures, multisig, introspection and CLTV](https://github.com/kaspanet/rusty-kaspa/blob/01b532e8b553523216471682649693af92f0fd16/crypto/txscript/src/opcodes/mod.rs)
- [Node finalization](https://github.com/kaspanet/rusty-kaspa/blob/01b532e8b553523216471682649693af92f0fd16/consensus/src/processes/transaction_validator/tx_validation_in_header_context.rs)

Below the timestamp threshold, native lock time is a DAA score, not a wall-clock
deadline or linear block height. CLTV verifies the transaction lock time and
nonfinal sequence; local script success does not prove the node's current DAA
has passed that deadline. A read-only snapshot must check the exact TN10 network,
sync, UTXO index, unspent outpoint and fee estimate. Refresh before signing.

The KaspaScript native companion tests compile the `.ks` paths, combine them
into one script, and verify signed OFFLINE fixtures with the native engine.
Wrong signers, wrong recipient, extra inputs/outputs, excessive fees, invalid
refund lock time and modified signed transactions are negative controls.
These fixtures are not accepted transactions, a live indexer or an audit.

## Wallet And Agent Boundaries

Use public-key terms and unsigned plans. Show exact network, outpoint, payout,
fee, cap, deadline, signing keys and contract effects before wallet approval.
Never ask for private keys in chat or give the agent silent spending authority.
Kasware and Kaspium support for this exact transaction/script must each be
verified; do not claim either integration works from opcode tests alone.

Still required: wallet signing/rejection flows, an explicitly scoped funded
TN10 lifecycle with accepted transaction receipts, and DAG-aware restart,
conflict and recovery reconciliation. Mainnet use remains gated. Reference
response checks improve the skill's guardrails; they are not model training
or measurements of fresh agent responses.
