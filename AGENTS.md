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
- Commit as Rui Carmo <rcarmo@users.noreply.github.com>, local/global configured.
- Never rebase or rewrite a published tag. Coordinate migrations across consumers.

## Unified behaviour catalogue

Organise `.feature` files by format, operation and observable behaviour, not by
runtime or source repository. This repository is the shared contract for Bun,
Go and Python even when each implementation derives and runs native tests.
Native test suites must not become separate, competing behaviour catalogues.

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
- Preserve published scenario IDs during consolidation. Retain equivalent cases;
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

## Priority coordination

Use `chat` with `target_agent_name: "@alias"` and explicit `mode: "steer"` for
scope changes, stop/hold requests, release corrections, safety blockers and
unblocking decisions. Reserve `mode: "queue"` for routine progress. Name the
current revision, requested action, owner and superseded notice. Receivers verify
current state and acknowledge once; delayed messages must not restart obsolete
work. Use `session_control` only for runtime/session operations.
