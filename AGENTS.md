# Shared OOXML references

This repository owns shared facts, constants, provenance, fixtures, workflow
Gherkin and cross-language mapping ledgers for rcarmo OOXML implementations.
It does not implement document editing or confer parity on a consumer.

- Import committed source blobs only; retain their origin, revision, path,
  byte length and SHA-256. Never silently regenerate a fixture.
- Never change a published tag. Storage migrations receive a new distribution
  seal; preserve fixture hashes and scenario identities across the migration.
- Store fixtures once under fixtures/<format>/<scenario-group>/, regardless of
  origin. Reuse stable manifest IDs across scenarios, never copies or symlinks.
- Use descriptive lower-case kebab-case paths. Add a short hash only to distinguish
  colliding names; keep full hashes/provenance in metadata. Avoid redundant
  version/pack/export directory layers; releases are Git tags.
- Facts need evidence. Record disagreements; do not pick a value by source majority.
- Common workflow contracts have stable IDs and expected observable outcomes.
  Per-consumer implementation status and execution evidence are separate.
- Tags are immutable. Consumers pin the same tag's commit as a Git submodule;
  no runtime fetching, floating branches or copied fallback corpora.
- Validate hashes, registry references and workflow ledgers before tagging.
- Commit as Rui Carmo <rui.carmo@gmail.com>, local/global configured.
- Never rebase or rewrite a published tag. Coordinate migrations across consumers.

## Project-owned caches and temporary files

Resolve once before changing child `TMPDIR` with `scripts/project-paths.sh`.
`PROJECT_TMP_BASE` selects a validated absolute `<base>/fixtures-ooxml`;
`PROJECT_TMP_ROOT` is a compatible validated absolute override ending in
`fixtures-ooxml`. If both are set they must agree. Invalid, unusable or
conflicting overrides fail. CI uses writable `RUNNER_TEMP/fixtures-ooxml`,
then the original inherited `TMPDIR/fixtures-ooxml`, then platform
`/tmp/fixtures-ooxml`, even if `/workspace/tmp` exists. Local runs prefer
writable `/workspace/tmp/fixtures-ooxml`, then `/tmp/fixtures-ooxml`. The
same `cache/bun/install`, `cache/bun/transpiler`, `cache/xdg`, `cache/npm`,
`build/`, `tests/`, `logs/` and `runs/<purpose>/<run-id>/` hierarchy applies
on every host. Never use bare
`/tmp`, home caches or ad-hoc top-level temporary paths.

Run `make install`, `make check` and `make test`. Direct commands must use
`bash scripts/project-paths.sh exec <command>` or the same resolved variables.
`make test` sets `TMPDIR`, `TMP` and `TEMP` to an owned run directory;
specification tests check `OOXML_TEST_SCRATCH` and refuse unowned/symlinked
roots. `make clean` removes only this project's reproducible `cache/` and
`build/`, not active `runs/` or retained evidence. Test CPU/heap profiles,
logs and receipts live under repository `artifacts/test-profiles/` by default,
outside disposable scratch; CI uses its own project-named artifact root and
uploads it. Bun 1.4.2's `bun test` does not flush CLI profiling flags, so the
test preload captures a JSC CPU profile and live heap snapshot before exit.
Review `profile-analysis.txt` after each test run. Live heap snapshots do not
measure sampled `alloc_space`/`alloc_objects`, and subprocesses remain outside
this capture. Empty CPU samples or missing files fail the profiling gate.
Fixture bytes and sealed specs stay under source control.

## Unified behaviour catalogue

Organise `.feature` files by format, operation and observable behaviour, not by
runtime or source repository. This repository is the shared contract for Bun,
Go and Python even when each implementation derives and runs native tests.
Native test suites must not become separate, competing behaviour catalogues.

- Use `workflows/docx/`, `workflows/pptx/`, `workflows/xlsx/`,
  `workflows/package/`, `workflows/xml/` and `workflows/office/` for genuine
  cross-format obligations, with operation-named kebab-case files. No root-level
  workflows, `native/` catch-all or repeated format prefixes. Split mixed source
  API inventories by operation; source provenance belongs in ledgers.
  `staging/go/` and `staging/python/` hold non-executed source candidates
  pending functional reconciliation. Seal original source bytes and hashes in
  provenance before changing a staged copy. These candidates are not canonical
  workflows and grant no consumer execution credit. Registration and
  verification enforce workflow paths.
- Review existing features before adding scenarios. Consolidate equivalent
  preconditions, inputs, operations and outcomes under one canonical scenario ID.
  Several native declarations may map to that ID; do not create one scenario per
  source test or duplicate a feature for another runtime.
- Express common steps in runtime-neutral terms with concrete inputs and
  observable outcomes. Prefer shared fixture IDs, exact values, saved/reopened
  results, preservation limits and explicit refusal conditions where applicable.
  Merely renaming files or making step wording similar does not establish
  behavioural alignment.
- ECMA-376 and its normative references govern format requirements. Cite the
  relevant edition and clause; preserve imported specification bytes verbatim.
  Native tests and application output are observations, not specification goldens.
- Keep genuine API or editor-policy differences explicit within the relevant
  operation family, using scenario-level profile tags and documented
  preconditions. For example, resolving one existing comment differs from
  resolving a thread or creating missing extension metadata. Do not force these
  into one expected result, or label every implementation detail a new profile
  to avoid consolidation. Runtime-specific API checks belong to that profile;
  they must not redefine the common format contract.
- Derive runtime-native tests from the shared scenario's inputs and outcomes.
  Keep language bindings, helper code and implementation-specific assertions in
  the consumer repository. Map them back to canonical scenario IDs and, where
  relevant, exact example rows. Do not copy native implementation or test source
  into this repository. A runtime test change that reveals a missing shared
  behaviour must feed back into the central catalogue.
- Keep source revisions, file hashes, declaration inventories, parameter and
  helper gaps, implementation status and execution results in structured ledgers.
  Weak native assertions remain gaps: successful parsing, nonnull objects,
  permissive alternatives and predicates that pass on empty results must not
  weaken a shared expected outcome. A stronger planned contract earns no credit
  from a weaker native test.
- Track implementation and execution per scenario or case, not by activating an
  entire feature for a runtime. A unified feature may contain both supported and
  unsupported profiles. Consumers must select explicit implemented IDs and keep
  the remaining scenarios visible as planned gaps. Shared wording, inventory,
  parser success, source mappings and reference adoption confer no execution or
  cross-runtime conformance credit.
- Preserve published scenario IDs during consolidation. Retain distinct cases;
  use an explicit migration map when duplicate IDs must be retired. Review
  consumer path lookups, exact step bindings, lifecycle selection and expected
  case counts before moving files or changing steps. Coordinate any required
  consumer changes before releasing a merged feature.
- Commit feature consolidation, source mappings, workflow registry changes,
  manifest seals, contract links and regression tests together. Remove superseded
  feature copies; do not leave an unregistered parallel catalogue. Verify that
  every scenario is registered once, intended cases and profile distinctions
  survive, mappings still resolve, fixture bytes are unchanged, and affected
  consumers execute only their declared scenarios.

## Feature consolidation and cascading test strength

- Reconcile *observable behaviour*, not scenario names, matching step text or
  file location. Compare input bytes and parameters, preconditions, operation,
  output values, saved/reopened state, preservation and refusal policy. Merge
  equivalent cases into one operation-family scenario; several native tests may
  map to its ID. Combine disjoint example rows under one outline when the same
  contract covers every row. Keep incompatible inputs or outcomes as distinct
  cases or explicit profiles within that operation family.
- The merged contract retains the strongest applicable assertions from every
  source: exact values and error codes, output geometry, changed-part lists,
  unchanged bytes, rollback and readback where those outcomes apply. A weak
  `dict`, nonempty, success-only or permissive assertion cannot replace a
  stronger check. Do not add a strong claim without a fixture, independent
  expected value or other source evidence; mark it planned until verified.
- When one consumer tests only a weaker predicate, strengthen its native test
  and, where needed, its implementation to satisfy the merged outcome. Cascade
  changes through fixture creation, test data, bindings, mappings and per-case
  execution status. Keep that consumer planned until the stronger test runs;
  adopting a shared tag, passing an old weak test or rewording Gherkin grants
  no execution credit. Development in a consumer is preferable to retaining
  duplicate weak scenarios as permanent alternative contracts.
- Retire redundant scenario text after proving full equivalence. Map every
  retired ID and native declaration to the representative ID and exact example
  row, preserving original repository, revision, path, source hash, parameter
  scope and any stronger or non-equivalent predicates. Keep original bytes in
  immutable Git history or an explicit historical seal; record the transformed
  copy's new hash separately. Do not falsify old review counts or rewrite
  historical provenance to match the new copy. Partial overlap alone cannot
  retire a case or earn credit.
- Test the merge boundary: the representative has all applicable outcomes,
  aliases resolve to it once, disjoint rows and policy differences survive,
  retired IDs no longer compile as separate scenarios, and source fixtures
  retain their sealed bytes. Update manifests, reconciliation and consumer
  mappings together. Run the shared default and fresh-clone gates, then each
  affected consumer's default and fresh-clone tests and CI before publishing a
  new immutable tag and coordinated pins. Record unrun gates as unverified.

## Priority coordination

Use `chat` with `target_agent_name: "@alias"` and explicit `mode: "steer"` for
scope changes, stop/hold requests, release corrections, safety blockers and
unblocking decisions. Reserve `mode: "queue"` for routine progress. Name the
current revision, requested action, owner and superseded notice. Receivers verify
current state and acknowledge once; delayed messages must not restart obsolete
work. Use `session_control` only for runtime/session operations.
