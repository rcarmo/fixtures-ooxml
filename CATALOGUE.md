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

Word value actions and anchor profiles now identify operations rather than
source runtimes. `ledgers/word-wording-migration.json` records 34 changed IDs /
75 cases across nine files from `d373421`. Exact getter names, nil results,
style-ID heading classification, in-memory-only simultaneous effects, selected
readback and tool hints remain explicit API policies. Existing neighbouring
scenarios, values and assertions are unchanged. Wording cleanup does not fill
missing custody, rendering or semantic assertions.

XML snapshot editing and static formula references now use operation actors and
API profiles for 19 IDs / 60 cases. The exact substitutions from `3901018` are in
`ledgers/xml-formula-wording-migration.json`. Lexical bytes, ownership, offset
units, grammar restrictions, absent-axis zeros and no-partial-result refusals
are unchanged. The namespace and formula matrices remain single Gherkin cases
with bounded internal combinations. No workbook mutation, calculation, XML
canonicalisation or schema validation follows from these profiles.

Comment authoring, template analysis/cache and XML escaping/error profiles now
use operation/API names. `ledgers/comment-template-wording-migration.json`
records 24 IDs / 25 cases from `4095fc3`; the XLSX creation change affects only
its description. The existing commentsExtended-only policy remains separate
from extension creation, reply-to-root resolution and filtered/threaded response
APIs. Template response-shape, response-status and cache policies are labelled
explicitly. JavaScript prototype/thenable policies and exact error types remain
runtime-specific compatibility contracts.

A catalogue-wide regression rejects Go/Bun/Python actor names in compiled steps
and origin-named profile prefixes. Historical IDs, source ledgers and corpus
provenance retain their names. This lexical guard establishes wording hygiene,
not semantic equivalence or portable support for every API profile.

## Saved tracking preferences

The [tracking preference contracts](contracts/tracking-settings.md) add seven
scenarios / 24 cases for saved preferences, exact sibling and encoding custody,
no-ops, atomic refusals and rollback. The earlier getter-only case is unchanged.
These additions bring the catalogue to 47 features, 236 scenarios and 586 cases.
All consumer statuses for the new contracts start planned.

## Physical horizontal merges

The [physical merge contract](contracts/table-merging.md) adds seven scenarios /
26 cases: saved geometry and exact retained content, content-loss and structural
refusals, coordinate errors, rollback, three encodings and post-merge handles.
The catalogue now has 48 features, 243 scenarios and 612 cases. Existing individual
span/vertical-setter predicates and their source mappings are unchanged. New
consumer entries start planned; physical authoring requires its own native proof.

## Physical vertical merges

The table-merging family also specifies seven vertical scenarios / 26 cases.
All physical cells, widths and paragraph order remain intact; only explicit
restart/continue flags are inserted. Refusals, reached fault rollback, encodings
and stale handles have separate cases. The preceding 26 horizontal case
fingerprints are unchanged. Totals are 48 features, 250 scenarios and 638 cases;
new consumer entries start planned, with no property-setter compatibility credit.

## Concrete template inventory

Eight [concrete inventory scenarios](contracts/template-inventory.md) add 22
cases to template analysis: exact body/table values and locations, literal
placeholder offsets, whole-operation refusals and bounds, encoding, detached
snapshots and named scope. The six earlier response/status/cache cases retain
their predicates and historical fingerprints. Totals are 48 features, 258
scenarios, 660 cases and 212 assets; all new consumer entries start planned.
No semantic SOW/guidance/table-purpose or cache behaviour follows from this rule.

## Weak-outcome review

| Contract | Current assertion boundary | Requirement still missing |
|---|---|---|
| Plain, placeholder and blue-guidance template analysis | Any dictionary, including an error dictionary | Correct sections/placeholders/guidance/table values, no error and source-byte custody |
| SOW and unified analysis status | No `error` member; SOW also requires a dictionary | Specific nonempty useful analysis fields; native SOW assertion is weaker than the shared success condition |
| Comment filters | Shared case requires nonempty results with predicates | Source native `all()` checks can pass on empty lists; no execution credit until non-vacuity is asserted |
| Comment extension authoring | Saved `commentEx` and returned paragraph ID | Relationship/content-type closure and unrelated-member preservation |
| Cache invalidation | Exact reason and missing value; selected stored/hit results | Full hit-state semantics, cache-file/source custody and cross-process persistence |
| Word getters and selected readback | Named in-memory values or selected reopened attributes | Complete text, property, package and rendering preservation where required |

No equivalent scenario pair was retired by the wording work. Similar operations
with different inputs, API returns, save guarantees or thread policies remain
distinct. Stronger behavioural contracts must add failing predicates and native
evidence; renaming an actor cannot close these gaps.

[Existing complete threads](contracts/comment-threads.md) add eight scenarios /
23 cases for immutable inspection, all-member resolution, exact byte preservation,
refusal, rollback and encoding. The 23 earlier comment cases are unchanged.
Single-comment and authored root-only resolution keep their separate policies.
These cases do not exercise authoring, filtered responses or Word rendering.

[Direct-run property snapshots](contracts/run-property-revisions.md) add eight
scenarios / 33 cases for the opt-in text-and-run-properties profile. Both actions
check complete saved/current properties, selected stories, exact member bytes,
namespace and encoding preservation, refusal and rollback. The ten earlier
revision cases and default text-only policy are unchanged. Moves and other
property revisions remain outside this profile.

Remaining work:

| Family | Remaining work |
|---|---|
| Word value APIs | Decide which API observations need stronger common format contracts. Retain explicit nil/heading/effects compatibility policies and their missing saved-output checks. |
| Word comments | Validate authoring graph/custody and non-vacuous filters; reconcile native assertions against the separate extension/thread policies. |
| Word templates | Separate useful document analysis from response-shape and metadata-cache APIs. Dictionary-only responses remain weak contracts requiring stronger observable outcomes. |
| Cross-consumer execution | Bind the shared contracts in each consumer and retain explicit unsupported profiles; a common catalogue alone does not establish parity. |

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
