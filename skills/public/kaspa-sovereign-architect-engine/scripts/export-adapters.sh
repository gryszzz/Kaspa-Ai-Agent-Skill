#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${1:-$PWD/kaspa-sovereign-adapters}"

mkdir -p "$OUT_DIR/agents" "$OUT_DIR/assets" "$OUT_DIR/references"
cp -R "$ROOT_DIR/agents/." "$OUT_DIR/agents/"
cp -R "$ROOT_DIR/assets/." "$OUT_DIR/assets/"
cp -R "$ROOT_DIR/references/." "$OUT_DIR/references/"
cp "$ROOT_DIR/SKILL.md" "$OUT_DIR/SKILL.md"
cp "$ROOT_DIR/manifest.json" "$OUT_DIR/manifest.json"

echo "Exported self-contained adapter pack to: $OUT_DIR"
echo "Files:"
echo "- $OUT_DIR/SKILL.md"
echo "- $OUT_DIR/references/"
echo "- $OUT_DIR/assets/"
echo "- $OUT_DIR/agents/openai.yaml"
echo "- $OUT_DIR/agents/anthropic.md"
echo "- $OUT_DIR/agents/cursor.mdc"
echo "- $OUT_DIR/agents/openclaw.md"
echo "- $OUT_DIR/agents/gemini.md"
echo "- $OUT_DIR/agents/generic-system-prompt.md"
