# OOXML facts, fixtures and workflow contracts

Shared behaviour and integration references for the Bun, Go and Python OOXML
implementations. Consumers pin this repository as `references/fixtures-ooxml`
using the same immutable annotated tag and commit. Initialise recursive submodules
before testing; missing data is an error, never a reason to generate replacements.
[REFERENCE.md](REFERENCE.md) defines fixture IDs, schema versions, coverage states
and the consumer release checks.

## Contents

- `facts/`: typed MIME, namespace, relationship and other constant values with
  evidence IDs. `observed`, `specified` and `disputed` are distinct states.
- `fixtures/<format>/<scenario-group>/`: reusable fixture files, with exactly one
  physical copy per SHA-256. Groups include `docx/comments`, `pptx/notes`,
  `xlsx/formulas` and format-specific `mutation-safety` groups.
- `workflows/mutation-safety.feature`: the shared mutation scenarios.
- `contracts/mutation-safety.json`: four fixture-ID references, readback facts,
  exact member hashes and permitted changes. Expanded cases are compiled from
  Gherkin at verification time; there is no second generated scenario catalogue.
- `workflows/xml/`: lexical parsing, QName checks and conservative comparison
  profiles. Native operation differences are explicit in
  [contracts/xml-profiles.md](contracts/xml-profiles.md).
- `workflows/package/`: bounded ZIP/XML member admission and semantic package
  comparison. [contracts/package-profiles.md](contracts/package-profiles.md)
  separates these from graph edits and byte-based package differences.
- `workflows/native/`: additional format/package behaviour contracts. Their
  planned tag gives no consumer execution credit.
- `ledgers/workflows.json`: expected outcomes, related facts and per-consumer
  mapping state. Historical reported results are not fresh execution evidence.
- `ledgers/consumers/`: bounded native-test mappings, source hashes, verified
  assertions and gaps. Mapping is separate from execution.
- `manifest.json`: stable ID, path, format, scenario group, byte length, SHA-256
  and all origins for each unique asset. Historical path aliases are metadata only.
- `ledgers/fixture-groups.json`: primary group membership and reviewed links to
  scenarios. Multiple scenarios may reuse a fixture ID without copying its file.
- `notices/`: required original licence texts. Fixture provenance is retained.

## Validate

Run `bun install --frozen-lockfile`, `bun run check` and `bun test`.
The verifier checks hashes, unique IDs, compiled Gherkin case counts, fact evidence
links, format/scenario grouping and duplicate-hash rejection. Consumers run their own native operations and
save/reopen assertions. A shared contract or another language's result does not
establish implementation parity, rendered fidelity or calculation correctness.

The schema-2 manifest deduplicates the previous 154 fixture copies into 115 unique
files. Consumers look up `fixture-<full-SHA-256>`
IDs and use the manifest path; they must not construct paths from a producer name
or create compatibility folders. Shared fixture paths are repository-relative.
Feature text, scenario IDs and fixture bytes are unchanged. The root manifest
seals both the workflow and its contract; obsolete pack wrappers and duplicated
fixture metadata have been removed.

`ContentTypeCommentsExtendedSpecified` records vendor metadata matching the pinned
fixture. The old observed alias stays `disputed`. No independent Office reopening
or authoring certification has been performed.

## Agent coordination

Use `chat` with explicit `mode: "steer"` for release/pin corrections, scope
changes, stop/hold requests, safety blockers and decisions needed to unblock a
consumer. Routine progress uses `mode: "queue"`. Address local agents by `@alias`.
Include the current commit/tag, requested action, responsible agent and superseded
notice; recipients verify current state and acknowledge once. See the
[coordination example](REFERENCE.md#priority-agent-communications).

## Changes and releases

Do not modify data inside a consumer submodule. Propose a central change with
provenance and negative validation tests, then publish a new tag after all consumer
owners review it. Never move a published tag. Update consumer submodule commits
and pin records together; CI uses recursive checkout and fails on mismatches.
Runtime-generated test output belongs in each consumer's temporary/artifact paths.
Use owned real documents for integration tests and small native builders for edge
cases. The external reference corpus imported in v0.1.0 is removed in v0.1.1;
retaining those fixtures is not required to preserve regression assertions.

Shared facts and contracts are original project data; document assets retain their
origin licences. See `LICENSE` and `NOTICES.md`. No external implementation or test
source is redistributed here. Specification citations and required provenance are
retained so facts and assets remain auditable.
