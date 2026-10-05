#!/usr/bin/env bash
# Keep CPU/heap profiles, logs and receipts separate from disposable scratch.
set -euo pipefail
source scripts/project-paths.sh
root="$(resolve_root)"
init_root "$root"
evidence=${OOXML_EVIDENCE_ROOT:-artifacts/test-profiles}
# Repo-owned artifacts or a named external retention root (CI) are independent
# from the disposable project scratch hierarchy.
if [[ "$evidence" == artifacts/test-profiles ]]; then evidence="$(pwd -P)/$evidence";
elif [[ "$evidence" != /*/fixtures-ooxml ]]; then echo 'Unsafe project evidence root' >&2; exit 1; fi
run=$(date -u +%Y%m%dT%H%M%SZ)-$$
run_parent="$root/runs/test"
scratch="$run_parent/$run"
record="$evidence/$run"
for path in "$run_parent" "$scratch" "$evidence" "$record"; do
  if [[ -L "$path" ]]; then echo "Refusing symlinked test path: $path" >&2; exit 1; fi
  if [[ ! -e "$path" ]]; then mkdir -p -- "$path"; fi
  if [[ ! -d "$path" || ! -O "$path" ]]; then echo "Refusing unowned test path: $path" >&2; exit 1; fi
done
export PROJECT_TMP_ROOT="$root" TMPDIR="$scratch" TMP="$scratch" TEMP="$scratch"
export BUN_INSTALL_CACHE_DIR="$root/cache/bun/install"
export BUN_RUNTIME_TRANSPILER_CACHE_PATH="$root/cache/bun/transpiler"
export XDG_CACHE_HOME="$root/cache/xdg" npm_config_cache="$root/cache/npm"
export OOXML_TEST_SCRATCH="$scratch"
{
  printf 'revision=%s\n' "$(git rev-parse HEAD)"
  printf 'worktree=%s\n' "$(pwd -P)"
  printf 'command=bun test --preload=./scripts/test-profile.ts tests\n'
  printf 'profile_method=bun:jsc.profile (1000 us) + Bun.generateHeapSnapshot(v8) in bun:test afterAll\n'
  printf 'toolchain=%s\n' "$(bun --version)"
  printf 'executable=%s\n' "$(command -v bun)"
  printf 'sampling_cpu_us=1000\nheap_capture=live snapshot (not alloc_space/alloc_objects samples)\nworkload=all tests in tests/; no subprocess instrumentation\n'
} > "$record/receipt.txt"
status=0
OOXML_PROFILE_DIR="$record" bun test --preload=./scripts/test-profile.ts tests > "$record/test.log" 2>&1 || status=$?
printf 'exit_status=%s\n' "$status" >> "$record/receipt.txt"
analysis=0
bun scripts/analyse-test-profiles.ts "$record" > "$record/profile-analysis.txt" 2>&1 || analysis=$?
printf 'analysis_status=%s\n' "$analysis" >> "$record/receipt.txt"
tail -n 12 "$record/test.log"
cat "$record/profile-analysis.txt"
printf 'retained_evidence=%s\n' "$record"
if [[ "$status" -ne 0 ]]; then exit "$status"; fi
if [[ "$analysis" -ne 0 ]]; then exit "$analysis"; fi
