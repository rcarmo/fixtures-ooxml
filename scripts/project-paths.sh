#!/usr/bin/env bash
# Portable fixtures-ooxml scratch resolver. Source for one resolved root per run.
set -euo pipefail
project=fixtures-ooxml
# Save the incoming TMPDIR before exec changes it for a child process.
if [[ -z "${PROJECT_ORIGINAL_TMPDIR+x}" ]]; then
  export PROJECT_ORIGINAL_TMPDIR="${TMPDIR:-}"
fi
is_ci() {
  case "${CI:-}" in ''|0|false|FALSE) ;; *) return 0;; esac
  case "${GITHUB_ACTIONS:-}:${GITLAB_CI:-}:${TF_BUILD:-}:${CIRCLECI:-}" in
    *true*|*True*|*TRUE*) return 0;;
  esac
  return 1
}
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
  local candidate base explicit_base_root='' bases=()
  if [[ -n "${PROJECT_TMP_BASE+x}" ]]; then
    [[ -n "$PROJECT_TMP_BASE" ]] || { echo 'PROJECT_TMP_BASE must not be empty' >&2; return 1; }
    explicit_base_root="${PROJECT_TMP_BASE%/}/$project"
    valid_path "$explicit_base_root" || { echo 'PROJECT_TMP_BASE must be a usable absolute base' >&2; return 1; }
  fi
  if [[ -n "${PROJECT_TMP_ROOT+x}" ]]; then
    candidate="${PROJECT_TMP_ROOT%/}"
    [[ "${candidate##*/}" == "$project" ]] && valid_path "$candidate" || {
      echo 'PROJECT_TMP_ROOT must be a usable absolute project-named directory, not a symlink' >&2; return 1;
    }
    [[ -z "$explicit_base_root" || "$candidate" == "$explicit_base_root" ]] || {
      echo 'Conflicting PROJECT_TMP_BASE and PROJECT_TMP_ROOT' >&2; return 1;
    }
    printf '%s\n' "$candidate"; return
  fi
  if [[ -n "$explicit_base_root" ]]; then printf '%s\n' "$explicit_base_root"; return; fi
  if is_ci; then
    # CI must not select the host workspace even when that mount exists.
    bases=("${RUNNER_TEMP:-}" "$PROJECT_ORIGINAL_TMPDIR" /tmp)
  else
    bases=(/workspace/tmp /tmp)
  fi
  for base in "${bases[@]}"; do
    [[ -n "$base" ]] || continue
    candidate="${base%/}/$project"
    if valid_path "$candidate"; then printf '%s\n' "$candidate"; return; fi
  done
  echo 'No writable project-owned scratch root' >&2; return 1
}
init_root() {
  local root="$1" path
  for path in "$root" "$root/cache" "$root/build" "$root/tests" "$root/logs" "$root/runs" "$root/cache/bun" "$root/cache/bun/install" "$root/cache/bun/transpiler" "$root/cache/xdg" "$root/cache/npm"; do
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
