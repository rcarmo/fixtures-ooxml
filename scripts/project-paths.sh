#!/usr/bin/env bash
# Portable fixtures-ooxml scratch resolver. Source for one resolved root per run.
set -euo pipefail
project=fixtures-ooxml
valid_path() {
  local path="$1" parent ancestor
  [[ "$path" = /* && "$path" != */../* && "$path" != */./* && "$path" != */.. && "$path" != */. ]] || return 1
  [[ ! -L "$path" ]] || return 1
  ancestor="${path%/*}"
  while [[ -n "$ancestor" && "$ancestor" != / ]]; do
    [[ ! -L "$ancestor" || "$ancestor" == /workspace ]] || return 1
    ancestor="${ancestor%/*}"
  done
  if [[ -e "$path" ]]; then [[ -d "$path" && -O "$path" && -w "$path" && -x "$path" ]] || return 1; fi
  parent="$path"
  while [[ ! -e "$parent" && ! -L "$parent" ]]; do parent="${parent%/*}"; [[ -n "$parent" ]] || parent=/; done
  [[ -d "$parent" && -w "$parent" && -x "$parent" ]] || return 1
}
resolve_root() {
  local candidate base
  if [[ -n "${PROJECT_TMP_ROOT+x}" ]]; then
    candidate="${PROJECT_TMP_ROOT%/}"
    [[ "${candidate##*/}" == "$project" ]] && valid_path "$candidate" || {
      echo 'PROJECT_TMP_ROOT must be a usable absolute project-named directory, not a symlink' >&2; return 1;
    }
    printf '%s\n' "$candidate"; return
  fi
  for base in /workspace/tmp "${RUNNER_TEMP:-}" "${TMPDIR:-}" /tmp; do
    [[ -n "$base" ]] || continue
    candidate="${base%/}/$project"
    if valid_path "$candidate"; then printf '%s\n' "$candidate"; return; fi
  done
  echo 'No writable project-owned scratch root' >&2; return 1
}
init_root() {
  local root="$1" path
  for path in "$root" "$root/cache" "$root/build" "$root/runs" "$root/cache/bun" "$root/cache/bun/install" "$root/cache/bun/transpiler" "$root/cache/xdg" "$root/cache/npm"; do
    valid_path "$path" || { echo "Unsafe project path: $path" >&2; return 1; }
    mkdir -p -- "$path"
  done
}
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  root="$(resolve_root)";init_root "$root"
  if [[ "${1:-}" == exec ]]; then
    shift
    [[ $# -gt 0 ]] || { echo 'Expected command after exec' >&2; exit 1; }
    export PROJECT_TMP_ROOT="$root" BUN_INSTALL_CACHE_DIR="$root/cache/bun/install"
    export BUN_RUNTIME_TRANSPILER_CACHE_PATH="$root/cache/bun/transpiler"
    export XDG_CACHE_HOME="$root/cache/xdg" npm_config_cache="$root/cache/npm"
    export TMPDIR="$root/runs" TMP="$root/runs" TEMP="$root/runs"
    exec "$@"
  elif [[ "${1:-}" == paths || $# -eq 0 ]]; then
    printf 'PROJECT_TMP_ROOT=%s\n' "$root"
  else
    echo 'Usage: project-paths.sh paths|exec <command...>' >&2; exit 1
  fi
fi
