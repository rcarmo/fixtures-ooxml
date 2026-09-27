# Contributing catalogue entries

Add reviewed behaviour contracts under `workflows/` and their source-test mappings
under `ledgers/consumers/`. The catalogue is incomplete: source families, parameter
variants and specification requirements still need review. Working notes outside
these directories do not register a behaviour.

## Add an operation

Extend an existing operation family before creating a file. Features are shared
across runtimes; native tests and bindings stay in their consumer repositories.
Use a `Rule` when a group needs its own background or policy description, and
put profile tags on scenarios so they cannot leak into another policy's cases.

Use `workflows/docx/`, `workflows/pptx/` or `workflows/xlsx/` for format
operations, and `workflows/package/` or `workflows/xml/` for common layers.
Files at the workflow root, runtime directories and a `native/` catch-all are
rejected. Name files after the operation without repeating the format name.
Split mixed operation inventories even if they came from one native test file.
See the [operation index](workflows/README.md).

Give each scenario one unique `@id-` tag and concrete Given/When/Then steps. Keep distinct
operations separate: preserving an existing part, rewriting it and refusing the
input have different contracts.

Map source declarations under `ledgers/consumers/`, recording repository revision,
file hash, assertions and unresolved gaps. Several source tests may map to one
scenario. Do not create duplicate scenarios for identical inputs and outcomes.
A weak source assertion stays a mapping limitation; it must not become an
ambiguous expected result in the shared contract.

State whether a rule comes from the specification, a documented API or an editor
policy. Cite the exact edition and clause for format requirements. Keep imported
ECMA material unchanged. Application output never overrides the specification.

## Register and check

```sh
bun scripts/register-workflow.ts workflows/<family>/<new-feature>.feature \
  contracts/<name>.md ledgers/consumers/<name>.json
bun run check
bun test
```

Registration adds byte lengths and SHA-256 hashes to `manifest.json`, then adds
the feature's scenario IDs and compiled outcomes to `ledgers/workflows.json`.
It accepts new files only and refuses scenarios without `@planned` or without
concrete outcomes. Omit an existing contract or mapping from the command; review
its changes separately and update its hash if it is already in the manifest.

Validation rejects an unregistered feature, a missing file, duplicate IDs or an
unsealed workflow. Each consumer's native test identity belongs to one mapping
ledger. Files at the same repository revision must have consistent source hashes
across ledgers. Add tests for exact example values and the source-family mapping.
Commit the feature, mapping, registry changes and checks together.

New scenarios are `@planned` until an implementation binds and runs them. Preserve
that distinction in results, but do not defer writing a valid format contract
because one implementation does not support it yet.

## Consolidating existing files

[`ledgers/feature-consolidation.json`](ledgers/feature-consolidation.json) records
old paths, source hashes and compiled-case fingerprints for the operation-family
migration. The later [format/operation migration](ledgers/workflow-layout-migration.json)
records all 229 scenario locations and 562 compiled-case fingerprints from
`d07ee96`, including scenarios whose paths did not change. Tests compare each
case and its policy tags, require removal of the old files, and reject missing or
duplicate identities. Existing scenario IDs, inputs and outcomes are preserved; the old
feature copies are removed. Reconcile equivalent cases before introducing new
IDs. Different inputs, save guarantees or refusal policies need separate cases.

Consumers select implemented scenario IDs explicitly. They must keep other
scenarios in a loaded feature visible as planned, never activate them because a
neighbouring case is bound. A full-coverage check must reject planned cases even
inside a partly implemented feature. Changed paths and source hashes require
fresh consumer results before reference adoption.

## Runtime-neutrality review

The catalogue is shared, but some contracts still encode one runtime's API.
The format/operation migration preserves exact steps so consumer bindings do
not silently acquire different semantics.

The first wording revision covers presentation notes, no-edit presentation saves,
relationship namespaces and ZIP64 reader actions (16 scenarios, 18 cases).
`ledgers/runtime-wording-migration.json` records exact step substitutions and
profile changes from `048dac5`; historical IDs, inputs and observable results are
retained. Notes and no-edit saves now use operation profiles. ZIP64 refusal codes
and the safe-integer bound remain explicit compatibility policies rather than
universal ZIP requirements. Regression tests compare current predicates with the
reviewed before/after fingerprints; the substitution helper is test-only and
never accepts legacy wording in an execution binding.

Package custody and ZIP32 actions are also runtime-neutral. Their separate
`ledgers/package-wording-migration.json` preserves 18 IDs / 38 cases from
`7b38bbb`, including all original error strings, typed inputs and callback
outcomes. The byte-custody profile is portable; JavaScript synchronous callback
and thenable behaviour is explicitly runtime-specific. `OoxmlError` and ZIP
option-key conventions remain named API compatibility profiles. Corpus names
identify fixture provenance, not the runtime executing the scenario.

Remaining work:

| Family | Remaining work |
|---|---|
| Word paragraphs, formatting and tables | Replace Go wording for shared value operations. Review API-specific nil, heading-classification and return-value conventions independently; do not turn them into format rules. |
| Word comments | Preserve the distinction between existing-extension edits, extension creation, root/reply resolution and filtered/threaded results. These are different operations and policies. |
| Word anchors and templates | Separate portable inspection from response envelopes, next-tool hints and cache APIs. Dictionary-only template responses remain weak contracts requiring stronger observable outcomes. |
| Spreadsheet creation | Remove incidental runtime names; retain exact fixture provenance in manifests and source mappings. |

Similar scenarios are not automatically equivalent. Native worksheet cache
invalidation and batch-workflow invalidation differ in their receipt, destination
and preservation requirements. Direct formatting getters and saved/reopened
formatting likewise retain different obligations. Deduplication must compare
preconditions, inputs, policies and every outcome before retiring an ID.

Keep historical IDs stable during wording changes. Coordinate exact step
bindings, scenario selection, source hashes and fresh execution in every affected
consumer. Source mapping and catalogue validation alone do not demonstrate that
all consumers execute the same tests.

## Completion

A complete catalogue accounts for every test declaration, parameter group,
integration workflow and required conformance rule in the consolidated estate.
An entry with unresolved assertions, missing variants or unverified clause
applicability remains a gap. Inventories and broad placeholder scenarios alone
do not close that gap.
