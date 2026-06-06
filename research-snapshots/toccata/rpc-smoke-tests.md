# Mainnet, TN10, and TN12 RPC Smoke Test Notes

These notes cover the blockDAG endpoints used by the Toccata Source Monitor:

- Mainnet: `https://api.kaspa.org/info/blockdag`
- TN10: `https://api-tn10.kaspa.org/info/blockdag`
- TN12: `https://api-tn12.kaspa.org/info/blockdag`

They are smoke checks for endpoint health and response shape. Mainnet activation additionally requires the final release activation DAA to be reached.

## Quick Check

Run all endpoint checks before using live observations in Toccata research:

```bash
curl -fsS --max-time 20 https://api.kaspa.org/info/blockdag
curl -fsS --max-time 20 https://api-tn10.kaspa.org/info/blockdag
curl -fsS --max-time 20 https://api-tn12.kaspa.org/info/blockdag
```

Expected baseline:

- HTTP response is `200`.
- Body is valid JSON.
- `networkName` matches the endpoint: `kaspa-mainnet`, `kaspa-testnet-10`, or `kaspa-testnet-12`.
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

- Mainnet: compare `virtualDaaScore` against final release activation DAA `474,165,565`. Below the threshold means scheduled; at or above means activation evidence.
- TN10: compare `virtualDaaScore` against the `tn10-toc2` activation schedule only after confirming the response is from `kaspa-testnet-10`.
- TN12: treat the endpoint result as TN12 testnet evidence only, and pair it with branch or docs evidence before making broader Toccata claims.
- Do not infer mainnet state from TN10 or TN12.

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
curl -v --max-time 20 https://api.kaspa.org/info/blockdag
curl -v --max-time 20 https://api-tn10.kaspa.org/info/blockdag
curl -v --max-time 20 https://api-tn12.kaspa.org/info/blockdag
```

If the endpoint is reachable but the shape looks wrong, compare against the monitor output:

```bash
node scripts/toccata-source-monitor.mjs
```

Do not commit refreshed `latest.json` or `latest.md` only because live counters changed. The monitor's facts hash intentionally ignores the moving block counters and focuses on endpoint availability, source fingerprints, GitHub source state, and verdict rules.

## Multi-Endpoint Check

Use the deterministic fixture check in CI and the live check when comparing additional source nodes:

```bash
node scripts/toccata-network-check.mjs --check
node scripts/toccata-network-check.mjs --live
```

By default, the live check uses:

- `https://api.kaspa.org/info/blockdag`
- `https://api-tn10.kaspa.org/info/blockdag`
- `https://api-tn12.kaspa.org/info/blockdag`

To compare more than one endpoint per network, pass comma-separated endpoint lists:

```bash
TOCCATA_MAINNET_ENDPOINTS="https://api.kaspa.org/info/blockdag,https://source-node.example/mainnet/info/blockdag" \
TOCCATA_TN10_ENDPOINTS="https://api-tn10.kaspa.org/info/blockdag,https://source-node.example/tn10/info/blockdag" \
TOCCATA_TN12_ENDPOINTS="https://api-tn12.kaspa.org/info/blockdag,https://source-node.example/tn12/info/blockdag" \
node scripts/toccata-network-check.mjs --live
```

The check flags:

- `network_name_mismatch`: the endpoint returned a different `networkName` than expected.
- `stale_endpoint`: the endpoint's `virtualDaaScore` lags the freshest healthy endpoint in its group beyond the configured threshold.
- `single_endpoint_group`: only one healthy endpoint is configured, so freshness cannot be cross-checked.
