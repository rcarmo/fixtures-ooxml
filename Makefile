# Scratch resolves once per command to PROJECT_TMP_ROOT, a validated absolute
# project-named directory. Local default: /workspace/tmp/fixtures-ooxml.
# CI passes RUNNER_TEMP through the same resolver; no host helper is required.
.PHONY: init-temp install check test clean
init-temp:
	@bash scripts/project-paths.sh paths

install:
	@bash scripts/project-paths.sh exec bun install --frozen-lockfile

check:
	@bash scripts/project-paths.sh exec bun run check

test:
	@bash scripts/project-paths.sh exec bash scripts/profile-tests.sh

# Only this project's reproducible cache and build directories are disposable.
# Active runs and retained evidence are never removed here.
clean:
	@bash scripts/project-paths.sh exec bash scripts/clean-project.sh
