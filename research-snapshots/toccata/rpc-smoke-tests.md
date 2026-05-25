# TN10 and TN12 RPC Smoke Test Notes

These notes cover the testnet blockDAG endpoints used by the Toccata Source Monitor:

- TN10: `https://api-tn10.kaspa.org/info/blockdag`
- TN12: `https://api-tn12.kaspa.org/info/blockdag`

They are smoke checks for testnet endpoint health and response shape. They are not proof of mainnet activation, mainnet readiness, or production behavior.

## Quick Check

Run both endpoint checks before using TN10 or TN12 observations in Toccata research:

```bash
curl -fsS --max-time 20 https://api-tn10.kaspa.org/info/blockdag
curl -fsS --max-time 20 https://api-tn12.kaspa.org/info/blockdag
```

Expected baseline:

- HTTP response is `200`.
- Body is valid JSON.
- `networkName` matches the endpoint: `kaspa-testnet-10` for TN10 and `kaspa-testnet-12` for TN12.
- `virtualDaaScore`, `blockCount`, and `headerCount` are present and parseable as non-negative integer values. The public endpoint may return these as strings.
- `tipHashes` is present as an array. A non-empty array is the normal healthy shape.

The monitor records `virtualDaaScore`, `blockCount`, `headerCount`, and `tipHashes` in `latest.json`. Manual reviews should also check `networkName` to catch wrong endpoints, stale proxies, or copied output.

## Response Shape

A healthy response should look like this shape. Values are examples only and will drift as the testnets advance.

```json
{
  "networkName": "kaspa-testnet-10",
  "blockCount": "1506291",
  "headerCount": "1506292",
  "tipHashes": [
    "9780e40799792e1d4efbaf78b62ff2324a294dd2654c025ed7d925d222d96e6a"
  ],
  "difficulty": 1929827.7263482325,
  "pastMedianTime": "1779713002516",
  "virtualParentHashes": [
    "f428a9f6075c966c66ed00a8eccb3841f156f5fbf9b7c5cced9fe7bd432753c0"
  ],
  "pruningPointHash": "3451ecf3828465ac12a265333f7e229261bcc082f0101c0f30de756c79e5a92a",
  "virtualDaaScore": "473523535",
  "sink": "f428a9f6075c966c66ed00a8eccb3841f156f5fbf9b7c5cced9fe7bd432753c0"
}
```

For Toccata activation notes:

- TN10: compare `virtualDaaScore` against the `tn10-toc2` activation schedule only after confirming the response is from `kaspa-testnet-10`.
- TN12: treat the endpoint result as TN12 testnet evidence only, and pair it with branch or docs evidence before making broader Toccata claims.
- Mainnet: do not infer anything from TN10 or TN12. Mainnet claims require explicit mainnet release, activation, or merged production evidence.

## Failure Modes

Treat these as safe failures, not negative protocol conclusions:

- Timeout, DNS failure, TLS failure, connection reset, or HTTP `5xx`: endpoint unavailable or network path unhealthy. Retry later and keep the source snapshot marked as unavailable.
- HTTP `4xx`: endpoint path, host, routing, or access behavior may have changed. Confirm the URL before changing research claims.
- Invalid JSON: do not parse partial output by hand. Record the response as unusable for the smoke check.
- Missing `virtualDaaScore`, `blockCount`, `headerCount`, or `tipHashes`: endpoint shape changed or an intermediary returned the wrong body.
- `networkName` mismatch: wrong endpoint, stale cache, proxy mix-up, or copied response. Do not use the response.
- Stale or decreasing values across repeated checks: re-run from another network path before assuming testnet behavior changed.

## Troubleshooting

Use a verbose header check when a smoke test fails:

```bash
curl -v --max-time 20 https://api-tn10.kaspa.org/info/blockdag
curl -v --max-time 20 https://api-tn12.kaspa.org/info/blockdag
```

If the endpoint is reachable but the shape looks wrong, compare against the monitor output:

```bash
node scripts/toccata-source-monitor.mjs
```

Do not commit refreshed `latest.json` or `latest.md` only because live counters changed. The monitor's facts hash intentionally ignores the moving block counters and focuses on endpoint availability, source fingerprints, GitHub source state, and verdict rules.
