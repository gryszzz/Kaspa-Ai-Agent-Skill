#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PUBLIC_DIR="$(cd "$SKILL_DIR/.." && pwd)"
REPO_ROOT="$(cd "$PUBLIC_DIR/../.." && pwd)"
OUT_DIR="${1:-$PWD/dist-artifacts}"
TAG_NAME="${2:-}"

SKILL_BASENAME="$(basename "$SKILL_DIR")"
BASE_NAME="kaspa-sovereign-architect-engine"
VERSION="$(node -e "const m=require(process.argv[1]); process.stdout.write(m.version);" "$SKILL_DIR/manifest.json")"
VERSION_TAG="v${VERSION}"

if [[ -n "$TAG_NAME" ]]; then
  NORMALIZED_TAG="${TAG_NAME#refs/tags/}"
  if [[ "$NORMALIZED_TAG" != "$VERSION_TAG" ]]; then
    echo "Tag/version mismatch: manifest=$VERSION_TAG tag=$NORMALIZED_TAG" >&2
    exit 1
  fi
fi

mkdir -p "$OUT_DIR"

STAGING_ROOT="$(mktemp -d "$OUT_DIR/stage.XXXXXX")"
trap 'rm -rf "$STAGING_ROOT"' EXIT
STAGED_SKILL_DIR="$STAGING_ROOT/$SKILL_BASENAME"

cp -R "$SKILL_DIR" "$STAGING_ROOT/"

mkdir -p \
  "$STAGED_SKILL_DIR/docs/kaspa" \
  "$STAGED_SKILL_DIR/references/repo-docs/kaspa" \
  "$STAGED_SKILL_DIR/research-snapshots/toccata" \
  "$STAGED_SKILL_DIR/references/repo-docs/research-snapshots/toccata" \
  "$STAGED_SKILL_DIR/training-corpus" \
  "$STAGED_SKILL_DIR/references/repo-docs/training-corpus" \
  "$STAGED_SKILL_DIR/fixtures/toccata"

copy_if_present() {
  local source_path="$1"
  local target_dir="$2"
  if [[ -e "$source_path" ]]; then
    cp -R "$source_path" "$target_dir/"
  fi
}

copy_if_present "$REPO_ROOT/docs/toccata-evidence-ladder.md" "$STAGED_SKILL_DIR/references/repo-docs"
copy_if_present "$REPO_ROOT/docs/toccata-evidence-ladder.md" "$STAGED_SKILL_DIR/docs"
copy_if_present "$REPO_ROOT/docs/kaspa/covenant-lineage-indexer.md" "$STAGED_SKILL_DIR/references/repo-docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/toccata-upgrade-readiness.md" "$STAGED_SKILL_DIR/references/repo-docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/wallet-covenant-signing-preview.md" "$STAGED_SKILL_DIR/references/repo-docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/zk-proof-cost-matrix.md" "$STAGED_SKILL_DIR/references/repo-docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/sequencing-witness-api.md" "$STAGED_SKILL_DIR/references/repo-docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/vprog-scope-simulator.md" "$STAGED_SKILL_DIR/references/repo-docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/mainnet-readiness-gate.md" "$STAGED_SKILL_DIR/references/repo-docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/covenant-lineage-indexer.md" "$STAGED_SKILL_DIR/docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/toccata-upgrade-readiness.md" "$STAGED_SKILL_DIR/docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/wallet-covenant-signing-preview.md" "$STAGED_SKILL_DIR/docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/zk-proof-cost-matrix.md" "$STAGED_SKILL_DIR/docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/sequencing-witness-api.md" "$STAGED_SKILL_DIR/docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/vprog-scope-simulator.md" "$STAGED_SKILL_DIR/docs/kaspa"
copy_if_present "$REPO_ROOT/docs/kaspa/mainnet-readiness-gate.md" "$STAGED_SKILL_DIR/docs/kaspa"
copy_if_present "$REPO_ROOT/research-snapshots/toccata/README.md" "$STAGED_SKILL_DIR/references/repo-docs/research-snapshots/toccata"
copy_if_present "$REPO_ROOT/research-snapshots/toccata/latest.json" "$STAGED_SKILL_DIR/references/repo-docs/research-snapshots/toccata"
copy_if_present "$REPO_ROOT/research-snapshots/toccata/latest.md" "$STAGED_SKILL_DIR/references/repo-docs/research-snapshots/toccata"
copy_if_present "$REPO_ROOT/research-snapshots/toccata/rpc-smoke-tests.md" "$STAGED_SKILL_DIR/references/repo-docs/research-snapshots/toccata"
copy_if_present "$REPO_ROOT/research-snapshots/toccata/README.md" "$STAGED_SKILL_DIR/research-snapshots/toccata"
copy_if_present "$REPO_ROOT/research-snapshots/toccata/latest.json" "$STAGED_SKILL_DIR/research-snapshots/toccata"
copy_if_present "$REPO_ROOT/research-snapshots/toccata/latest.md" "$STAGED_SKILL_DIR/research-snapshots/toccata"
copy_if_present "$REPO_ROOT/research-snapshots/toccata/rpc-smoke-tests.md" "$STAGED_SKILL_DIR/research-snapshots/toccata"
copy_if_present "$REPO_ROOT/training-corpus/kaspa-toccata-2026.md" "$STAGED_SKILL_DIR/references/repo-docs/training-corpus"
copy_if_present "$REPO_ROOT/training-corpus/kaspa-toccata-rd-intelligence-2026.md" "$STAGED_SKILL_DIR/references/repo-docs/training-corpus"
copy_if_present "$REPO_ROOT/training-corpus/kaspa-toccata-readiness-drills-2026.md" "$STAGED_SKILL_DIR/references/repo-docs/training-corpus"
copy_if_present "$REPO_ROOT/training-corpus/kaspa-toccata-2026.md" "$STAGED_SKILL_DIR/training-corpus"
copy_if_present "$REPO_ROOT/training-corpus/kaspa-toccata-rd-intelligence-2026.md" "$STAGED_SKILL_DIR/training-corpus"
copy_if_present "$REPO_ROOT/training-corpus/kaspa-toccata-readiness-drills-2026.md" "$STAGED_SKILL_DIR/training-corpus"
copy_if_present "$REPO_ROOT/fixtures/toccata/." "$STAGED_SKILL_DIR/fixtures/toccata"
copy_if_present "$REPO_ROOT/scripts/toccata-source-monitor.mjs" "$STAGED_SKILL_DIR/scripts"
copy_if_present "$REPO_ROOT/scripts/kaspa-knowledge-drill.mjs" "$STAGED_SKILL_DIR/scripts"
copy_if_present "$REPO_ROOT/scripts/covenant-lineage-prototype.mjs" "$STAGED_SKILL_DIR/scripts"
copy_if_present "$REPO_ROOT/scripts/vprog-scope-simulator.mjs" "$STAGED_SKILL_DIR/scripts"
copy_if_present "$REPO_ROOT/scripts/toccata-network-check.mjs" "$STAGED_SKILL_DIR/scripts"
copy_if_present "$REPO_ROOT/scripts/toccata-mainnet-readiness-gate.mjs" "$STAGED_SKILL_DIR/scripts"

VERSIONED_ZIP="$OUT_DIR/${BASE_NAME}-${VERSION_TAG}.zip"
VERSIONED_TAR="$OUT_DIR/${BASE_NAME}-${VERSION_TAG}.tar.gz"
LATEST_ZIP="$OUT_DIR/${BASE_NAME}.zip"
LATEST_TAR="$OUT_DIR/${BASE_NAME}.tar.gz"

(
  cd "$STAGING_ROOT"
  zip -rq "$VERSIONED_ZIP" "$SKILL_BASENAME"
  tar -czf "$VERSIONED_TAR" "$SKILL_BASENAME"
)

rm -rf "$STAGING_ROOT"
trap - EXIT

cp "$VERSIONED_ZIP" "$LATEST_ZIP"
cp "$VERSIONED_TAR" "$LATEST_TAR"

(
  cd "$OUT_DIR"
  shasum -a 256 \
    "$(basename "$VERSIONED_ZIP")" \
    "$(basename "$VERSIONED_TAR")" \
    "$(basename "$LATEST_ZIP")" \
    "$(basename "$LATEST_TAR")" \
    > SHA256SUMS.txt
)

echo "Packaged release artifacts in: $OUT_DIR"
ls -1 "$OUT_DIR"
