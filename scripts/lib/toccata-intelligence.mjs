const IMPACT_RULES = [
  {
    id: "activation-p2p",
    label: "Activation and P2P compatibility",
    patterns: [/params\.rs/i, /forkactivation/i, /activation/i, /p2p.*version/i, /toccata-guide/i],
    builderImpact:
      "Node operators must track the activation DAA, release line, P2P version cutoff, and one-way upgrade constraints.",
  },
  {
    id: "transaction-wire-format",
    label: "Transaction and wire-format contracts",
    patterns: [
      /consensus\/core\/src\/tx/i,
      /protocol\/p2p\/proto/i,
      /rpc\/grpc\/core\/proto/i,
      /storage[_ ]?mass/i,
      /compute[_ ]?commit/i,
      /transaction.*mass/i,
    ],
    builderImpact:
      "RPC, protobuf, miner, pool, wallet, and indexer models must preserve v1 transaction fields without lossy renaming.",
  },
  {
    id: "covenant-lineage",
    label: "Covenants and UTXO lineage",
    patterns: [/covenant/i, /utxo/i, /genesis.*covenant/i],
    builderImpact:
      "UTXO-first applications must preserve covenant bindings, authorizing inputs, covenant IDs, and successor lineage.",
  },
  {
    id: "fees-mass-mempool",
    label: "Fee, mass, and mempool policy",
    patterns: [/mempool/i, /fee/i, /mass/i, /compute_budget/i, /script_units/i],
    builderImpact:
      "Fee estimation must distinguish consensus validity from node relay policy and use current mass dimensions.",
  },
  {
    id: "rpc-wasm-sdk",
    label: "RPC, WASM, and SDK surface",
    patterns: [/^rpc\//i, /^wasm\//i, /wasm/i, /js-bindings/i, /protobuf/i, /grpc/i],
    builderImpact:
      "Integrators must regenerate or update client bindings and test required arguments, aliases, and serialization behavior.",
  },
  {
    id: "wallet-pskt",
    label: "Wallet and PSKT construction",
    patterns: [/^wallet\//i, /pskt/i, /generator/i, /signing/i],
    builderImpact:
      "Wallet construction and signing previews must preserve covenant fields, compute commitments, storage mass, and explicit fees.",
  },
  {
    id: "zk-verification",
    label: "ZK verification and pricing",
    patterns: [/zk[_/-]?precompile/i, /groth16/i, /risc0/i, /succinct/i, /zkproof/i],
    builderImpact:
      "Proof-system dependencies, verifier hardening, script-unit pricing, proof size, and failure behavior remain security-critical.",
  },
  {
    id: "sequencing-smt",
    label: "Sequencing commitments and SMT state",
    patterns: [/seq[_-]?commit/i, /smt[_/-]?store/i, /lane/i, /accepted_id_merkle_root/i],
    builderImpact:
      "Lane-aware indexers and proof services must handle reorgs, pruning, inactivity shortcuts, and witness availability.",
  },
  {
    id: "node-storage-ibd",
    label: "Node storage, pruning, and IBD",
    patterns: [/database/i, /storage/i, /pruning/i, /ibd/i, /rocksdb/i, /db[_/-]/i],
    builderImpact:
      "Operators must plan database migrations, resync cost, retention, pruning compatibility, and recovery procedures.",
  },
  {
    id: "security-hardening",
    label: "Security hardening",
    patterns: [/security/i, /hardening/i, /unknown script version/i, /memory exhaustion/i, /audit/i, /cargo deny/i],
    builderImpact:
      "Consensus and network-facing fixes require adversarial regression tests and careful version-boundary review.",
  },
  {
    id: "tests-docs",
    label: "Tests, benchmarks, and operator docs",
    patterns: [/\/tests?\//i, /\/benches?\//i, /_test\.rs$/i, /^docs\//i, /\.md$/i],
    builderImpact:
      "Changed examples, tests, and guides should become reproducible compatibility checks in downstream projects.",
  },
];

function matchesRule(rule, value) {
  return rule.patterns.some((pattern) => pattern.test(value));
}

export function classifyUpstreamChanges(files = [], commits = []) {
  return IMPACT_RULES.filter(
    (rule) =>
      files.some((file) => matchesRule(rule, `${file.filename || ""}\n${file.patch || ""}`)) ||
      commits.some((commit) => matchesRule(rule, commit.message || "")),
  ).map((rule) => {
    const allMatchedFiles = files
      .filter((file) => matchesRule(rule, `${file.filename || ""}\n${file.patch || ""}`))
      .map((file) => file.filename);
    const allMatchedCommits = commits
      .filter((commit) => matchesRule(rule, commit.message || ""))
      .map((commit) => commit.message.split("\n")[0]);

    return {
      id: rule.id,
      label: rule.label,
      fileCount: allMatchedFiles.length,
      commitCount: allMatchedCommits.length,
      matchedFiles: allMatchedFiles.slice(0, 8),
      matchedCommits: allMatchedCommits.slice(0, 6),
      builderImpact: rule.builderImpact,
    };
  });
}

function releaseText(release) {
  return [
    release?.label || "",
    release?.name || "",
    release?.body || "",
    ...(release?.bodyHighlights || []),
  ].join("\n");
}

export function parseToccataActivation(release) {
  const text = releaseText(release);
  const daaMatch = text.match(/DAA\s*score\s*`?([\d,_]+)`?/i);
  const scheduleMatch = text.match(
    /(?:roughly|approximately|projected to occur)?\s*(?:on\s*)?([A-Z][a-z]+\s+\d{1,2},\s+\d{4}[^.\n]*?UTC)/i,
  );

  return {
    daaScore: daaMatch ? Number(daaMatch[1].replaceAll(/[,_]/g, "")) : null,
    scheduleText: scheduleMatch ? scheduleMatch[1].trim() : null,
  };
}

export function evaluateMainnetActivation(release, networkSource) {
  const activation = release?.activation || parseToccataActivation(release);
  const currentDaaScore = Number(networkSource?.virtualDaaScore ?? 0);
  const isFinalRelease = Boolean(release?.ok && !release.prerelease && !release.draft);
  const isMainnetEndpoint = Boolean(networkSource?.ok && networkSource.networkName === "kaspa-mainnet");

  let state = "not_verified";
  if (isFinalRelease && activation.daaScore && isMainnetEndpoint) {
    state = currentDaaScore >= activation.daaScore ? "active" : "scheduled";
  } else if (isFinalRelease && activation.daaScore) {
    state = "scheduled_endpoint_unverified";
  }

  return {
    state,
    releaseTag: release?.tagName || release?.tag || null,
    releasePublishedAt: release?.publishedAt || null,
    daaScore: activation.daaScore,
    scheduleText: activation.scheduleText,
    currentDaaScore: isMainnetEndpoint ? currentDaaScore : null,
    remainingDaaScore:
      isMainnetEndpoint && activation.daaScore ? Math.max(activation.daaScore - currentDaaScore, 0) : null,
    endpointVerified: isMainnetEndpoint,
  };
}

export function validateToccataSnapshot(snapshot) {
  const errors = [];
  const finalRelease = snapshot.github?.releases?.find(
    (release) => release.repo === "kaspanet/rusty-kaspa" && release.tag === "v2.0.0" && release.ok,
  );
  const mainnet = snapshot.kaspaNetwork?.find((source) => source.networkName === "kaspa-mainnet" && source.ok);

  if ((snapshot.schemaVersion || 0) < 2) {
    errors.push("schemaVersion must be at least 2");
  }
  if (!finalRelease) {
    errors.push("missing tracked Rusty Kaspa v2.0.0 release");
  }
  if (!snapshot.verdict?.activation?.daaScore) {
    errors.push("missing parsed mainnet Toccata activation DAA score");
  }
  if (!mainnet) {
    errors.push("missing healthy kaspa-mainnet endpoint evidence");
  }
  if (!Array.isArray(snapshot.github?.branchDeltas)) {
    errors.push("missing branchDeltas intelligence");
  }

  return errors;
}
