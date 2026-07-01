# ZK Proof-Cost Baseline

Checked: 2026-06-30T23:55:00Z

Status: `measured_partial`

Local Criterion measurements were captured from upstream Rusty Kaspa's official
`kaspa-txscript` `zk_precompiles` benchmark. These are machine/profile timing
measurements, not consensus rules, relay policy, or complete DoS proof.

Source:

- Repository: `https://github.com/kaspanet/rusty-kaspa`
- Commit: `98a4ccd8d200853787f227bd4536ac540cf34957`
- Benchmark: `crypto/txscript/benches/zk_precompiles.rs`
- Fixtures: `crypto/txscript/src/zk_precompiles/tests/helpers.rs`
- Command: `cargo bench -p kaspa-txscript --bench zk_precompiles -- --warm-up-time 1 --measurement-time 3 --sample-size 10`
- Machine: Apple M1, 8 logical CPUs, 8 GB RAM, macOS 26.5 build 25F71
- Toolchain: rustc 1.95.0, cargo 1.95.0

Measured valid verifier paths:

| Path | Payload/public input | Mean | 95% interval |
| --- | --- | --- | --- |
| R0/Succinct | 222,668 byte seal, 32 byte journal | 13.924 ms | 13.892-13.962 ms |
| Groth16 | 128 byte proof, 160 byte public inputs, 424 byte verifying key | 2.626 ms | 2.621-2.632 ms |
| ECDSA baseline | signature verification reference | 24.768 us | 24.745-24.792 us |

Supporting measurements:

- R0 batch, 50 proofs: 693.431 ms at 1 thread, 370.476 ms at 2 threads,
  199.841 ms at 4 threads, 151.409 ms at 8 threads, 150.211 ms at 16 threads.
- Groth16 input preparation: 42.039 ms for 10,000 inputs, 90.636 ms for
  20,000, 195.452 ms for 40,000, 436.293 ms for 80,000, and 885.648 ms for
  160,000.

Remaining gaps:

- Invalid proof rejection cost was not measured in this run.
- Malformed proof rejection cost was not measured in this run.
- Boundary-sized payload acceptance and rejection costs need dedicated fixtures.
- These local wall-clock timings do not define on-chain pricing, relay policy,
  or consensus validity.

Verify:

```bash
node scripts/toccata-zk-benchmark-check.mjs --check
```
