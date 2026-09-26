# OOXML facts, fixtures and workflow contracts

Shared behaviour and integration references for the Bun, Go and Python OOXML
implementations. Consumers pin this repository as `references/fixtures-ooxml`
using the same immutable annotated tag and commit. Initialise recursive submodules
before testing; missing data is an error, never a reason to generate replacements.

## Contents

- `facts/`: typed MIME, namespace, relationship and other constant values with
  evidence IDs. `observed`, `specified` and `disputed` are distinct states.
- `fixtures/`: origin-qualified document packages and generated corpus snapshots.
- `reference-assets/`: document/XML/media test inputs, without implementation or
  test source code. Original fixture paths appear only in provenance records.
- `shared/v2/pack/`: shared mutation Gherkin, four fixtures, per-member custody
  hashes and expanded stable case identities.
- `workflows/native/`: additional format/package behaviour contracts. Their
  planned tag gives no consumer execution credit.
- `ledgers/workflows.json`: expected outcomes, related facts and per-consumer
  mapping state. Historical reported results are not fresh execution evidence.
- `manifest.json`: path, byte length, SHA-256 and origin for every imported asset.
- `notices/`: required original licence texts. Fixture provenance is retained.

## Validate

Run `bun install --frozen-lockfile`, `bun run check` and `bun test`.
The verifier checks hashes, unique IDs, compiled Gherkin case counts, fact evidence
links and reference-only contents. Consumers run their own native operations and
save/reopen assertions. A shared contract or another language's result does not
establish implementation parity, rendered fidelity or calculation correctness.

The code-free distribution `fixtures-ooxml-v0.1.0` retains the prior mutation
pack's fixture bytes, feature text and stable case identities. Its new seal omits
external generator/compiler sources and diagnostic code references. The historical
whole-pack seal is provenance only; consumers must verify this distribution's seal.

`ContentTypeCommentsExtendedSpecified` records vendor metadata matching the pinned
fixture. The old observed alias stays `disputed`. No independent Office reopening
or authoring certification has been performed.

## Changes and releases

Do not modify data inside a consumer submodule. Propose a central change with
provenance and negative validation tests, then publish a new tag after all consumer
owners review it. Never move a published tag. Update consumer submodule commits
and pin records together; CI uses recursive checkout and fails on mismatches.
Runtime-generated test output belongs in each consumer's temporary/artifact paths.

Shared facts and contracts are original project data; document assets retain their
origin licences. See `LICENSE` and `NOTICES.md`. No external implementation or test
source is redistributed here. Specification citations and required provenance are
retained so facts and assets remain auditable.
