# Live Covenant Indexer Export

Captured: 2026-06-30T23:46:30.095Z

Network: `kaspa-mainnet`

Source: https://api.kaspa.org/transactions/6a76aae95f5732b8876c40308d58ff528f5d2142ee880a0436b20bd2b8a339be

OpenAPI: https://api.kaspa.org/openapi.json

Implementation: https://github.com/kaspa-ng/kaspa-rest-server

Activation evidence:

- required network: `kaspa-mainnet`
- activation DAA: `474165565`
- observed DAA: `474432424`
- observed blue score: `472544756`

Accepted transaction:

- transaction ID: `6a76aae95f5732b8876c40308d58ff528f5d2142ee880a0436b20bd2b8a339be`
- hash: `b22d18612061013834ed5b63db1fda248499c66d6d8916eaa99f04d657a2061c`
- version: `1`
- accepted: `true`
- accepting block: `c24ad03924d369b724ee79445b1814c24d926dde9ccec007413c43adc5d84d6f`
- accepting blue score: `472536522`
- covenant ID(s): `8a1584ce07859b4ed1870035eb36a6c4c061607d781c88ce0bb173e7fc92e617`
- compute budget(s): `10`
- covenant authorizing input(s): `0`
- normalized transaction facts hash: `5138947c7d54cdd5e67e82117f43c3cc36994d67cec00872cf0d379b0d1cfa70`
- raw transaction response hash: `88cf729cacfdf3f5d0f9c95aea3e2ee2bdd88eb789da399b7d091b6e19cf54f0`

Boundary:

This is a real public mainnet transaction/indexer export with Toccata covenant fields. It proves field visibility for this source and transaction only; it is not wallet, explorer, miner, or ecosystem-wide readiness approval.

Verify:

```bash
node scripts/toccata-live-covenant-export.mjs --check
node scripts/toccata-live-fixture-check.mjs --fixture fixtures/toccata/live-covenant-indexer-mainnet-latest.json
```
