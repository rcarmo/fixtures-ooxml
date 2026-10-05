#!/usr/bin/env bash
set -euo pipefail
source scripts/project-paths.sh
root="$(resolve_root)"
for path in "$root/cache" "$root/build"; do
  valid_path "$path" || { echo "Unsafe cleanup path: $path" >&2; exit 1; }
  [[ -d "$path" && ! -L "$path" ]] || { echo "Missing/unowned cleanup path: $path" >&2; exit 1; }
done
rm -rf -- "$root/cache" "$root/build"
