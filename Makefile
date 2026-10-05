# PROJECT_TMP_BASE selects <base>/fixtures-ooxml; compatible PROJECT_TMP_ROOT
# must agree when both are provided. CI prefers RUNNER_TEMP, then the inherited
# TMPDIR, then platform temp; local runs prefer /workspace/tmp, then platform
# temp. The vendored resolver validates paths before child TMPDIR is redirected.
# Layout: cache/<tool>, build, tests, logs, runs/<purpose>/<run-id>. No host helper.
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
