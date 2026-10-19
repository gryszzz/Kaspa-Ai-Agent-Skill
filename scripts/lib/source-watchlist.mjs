export const githubRepos = [
  { repo: "kaspanet/rusty-kaspa", label: "Rusty Kaspa node and SDK", primary: true },
  { repo: "kaspanet/kips", label: "Kaspa Improvement Proposals", primary: true },
  { repo: "kaspanet/docs", label: "Official Kaspa docs source", primary: true },
  { repo: "kaspanet/kaspad", label: "Deprecated Go node", primary: false, deprecated: true },
  { repo: "michaelsutton/kdapp", label: "Kdapp reference work", primary: false },
  { repo: "kaspanet/silverscript", label: "Silverscript released compiler", primary: true },
  { repo: "kaspanet/vprogs", label: "vProgs experimental framework", primary: false, experimental: true },
  { repo: "argent-lang/argent", label: "Argent experimental application compiler", primary: false, experimental: true },
  { repo: "kaspanet/kccs", label: "KCC conventions; inspect each document status", primary: true, standards: true },
  { repo: "olafweller/kaspa-privacy-initiative", label: "Community privacy research; testnet evidence only", primary: false, experimental: true },
];

export const githubRefs = [
  ...["master", "toccata", "tn10", "tn12"].map((name) => ({ repo: "kaspanet/rusty-kaspa", kind: "heads", name })),
  { repo: "kaspanet/kips", kind: "heads", name: "master" },
  { repo: "kaspanet/docs", kind: "heads", name: "main" },
  { repo: "kaspanet/silverscript", kind: "heads", name: "master" },
  { repo: "kaspanet/vprogs", kind: "heads", name: "master" },
  { repo: "argent-lang/argent", kind: "heads", name: "master" },
  { repo: "kaspanet/kccs", kind: "heads", name: "main" },
  { repo: "olafweller/kaspa-privacy-initiative", kind: "heads", name: "main" },
];

export const githubReleases = [
  { repo: "kaspanet/rusty-kaspa", kind: "latest", label: "Latest Rusty Kaspa release" },
  { repo: "kaspanet/silverscript", kind: "latest", label: "Latest Silverscript release" },
];
