# Reference formats

## Specifications

ECMA-376 is the authority for OOXML requirements. Use the edition, part and clause
recorded with a requirement. The specification's normative references also apply;
Microsoft extensions need their own published references. A renderer difference
or an existing implementation's test result does not change a requirement.

The [specification index](specs/ecma-376/README.md) separates complete PDFs,
verbatim extracts and derived notes. Files imported as specifications or extracts
must retain their original bytes. Fix annotations in the index, not in the source
text. Keep different editions separate and preserve copyright notices.

## Assets

`manifest.json` uses schema 2 with repository-relative paths.

| Field | Meaning |
|---|---|
| `id` | `fixture-<sha256>` for fixtures; `asset-<sha256>` for other assets |
| `path` | File location relative to this repository |
| `sha256`, `bytes` | Exact file identity |
| `role` | Fixture, specification, extract, note, licence or workflow |
| `format`, `scenarioGroup` | Fixture format and primary storage group |
| `origins` | Source repository, revision, path and any qualifications |
| `aliases` | Previous names, retained for lookup and attribution |
| `scenarioIds` | Related Gherkin scenario IDs |

One unique byte hash has one physical file. Fixtures live under
`fixtures/<format>/<scenario-group>/`. Resolve an ID through the manifest rather
than relying on its original path. `ledgers/fixture-groups.json` indexes the groups.
Temporary edited documents belong in the application's test-output directory.

## Mutation contracts

`contracts/mutation-safety.json` schema 2 lists the format-local `features` and
selects eight `scenarioIds` (nineteen expanded cases). There is no singular
`feature` path. Verify each declared feature against the manifest, compile it,
select only those IDs and require exact aggregate membership without duplicates.
Additional scenarios in the same files are separate obligations.

The contract associates the selected scenarios with fixture IDs, expected
readback values, member hashes and the package members an operation may change.

Membership is exact. Members outside the permitted list must retain their hashes.
The Gherkin examples contain typed JSON values so null, numbers, strings and
Booleans are not conflated. The outcome interchange format is version 2.

## Facts and tests

Facts have a value, source references and one of three states: `specified`,
`observed` or `disputed`. A specification clause supports `specified`; observed
application behavior is recorded separately. Keep conflicting values explicit.

`ledgers/workflows.json` indexes Gherkin scenarios, examples and related facts.
Files under `ledgers/consumers/` connect implementation tests to those scenarios,
recording source revisions, hashes, assertions and gaps. Their `mapped`, `partial`
and `unmapped` fields describe those connections. Test execution is recorded in
the application's own results.

Use distinct scenarios when preconditions or expected outcomes differ. For
example, changing one comment's resolved flag differs from resolving its entire
thread, and a byte comparison differs from an XML-equivalence comparison.

## Reproducible inputs

Applications reference a tagged commit through `references/fixtures-ooxml` and
record the manifest's SHA-256. Validation checks the commit, tag, manifest, asset
hashes and reference-tree contents before running tests. Missing or modified
inputs fail; no replacement files are generated.

Published tags are immutable. Update the submodule commit and reference pin
together when taking a new release. See [licensing and attribution](NOTICES.md)
for imported material.
