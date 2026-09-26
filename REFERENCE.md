# Shared reference contract

This repository defines the shared OOXML facts, fixture identities and expected
workflow outcomes. Language repositories implement and test those outcomes. Their
ledgers record mappings and run results; they must not redefine common behaviour.

## Fixture manifest schema 2

`manifest.json` uses repository-relative paths and unique asset IDs. Fixture
entries include:

| Field | Meaning |
|---|---|
| `id` | `fixture-` followed by the full SHA-256 |
| `path` | Canonical file under `fixtures/<format>/<scenario-group>/` |
| `sha256`, `bytes` | Exact file identity |
| `format` | File format, such as `docx`, `pptx`, `xlsx` or `png` |
| `scenarioGroup` | Primary storage group, such as `comments`, `notes` or `formulas` |
| `origins` | All retained origins and their qualifications |
| `aliases` | Historical paths used only for provenance and migration |
| `scenarioIds` | Reviewed links to common scenarios; an empty list grants no coverage |

One unique byte hash has one physical file. The grouped baseline holds 115 fixture
files in 32 groups, totalling 6,451,099 bytes. It replaces 154 physical copies
without dropping a unique input. The complete manifest contains 122 assets;
notices and workflow metadata account for the other seven entries.

Resolve a fixture ID through the manifest. Do not infer its path from an origin,
copy it for another scenario, or create compatibility directories or symlinks.
`ledgers/fixture-groups.json` records primary membership. Reusable generated inputs
are also fixtures; ephemeral edited outputs belong in consumer temporary paths.

## Mutation workflow contract

`workflows/mutation-safety.feature` is the single definition of the eight mutation
scenarios and their 19 expanded cases. `contracts/mutation-safety.json` records
scenario IDs and the four logical fixture policies. Each policy references a
canonical `assetId`; file paths, sizes, hashes and provenance belong only to the
root manifest.

A policy contains readback facts, one `memberSha256` map and an allow-list of
members that successful edits may change. Membership is exact. Every member not
in the allow-list must retain its hash. Consumers derive that preserved set; no
second hash map or generated copy of the expanded Gherkin is stored.

The historical workflow revision `ooxml-shared-contracts-v2` and outcome
interchange version 2 remain unchanged. They do not imply a versioned directory.
Root-manifest entries seal the workflow and contract files; the Git commit seals
the complete reference tree.

## Facts and behaviour

Facts have stable IDs, values, evidence links and a status: `observed`, `specified`
or `disputed`. Implementation observations do not establish specification
correctness. Aliases name the same value; conflicting values remain explicit
until specification or producer/consumer checks resolve them.

`ledgers/workflows.json` links canonical Gherkin, expanded-case counts, facts and
consumer mapping states. Missing, unmapped and planned consumer states grant no
execution credit. Existing result descriptions are historical reports; verify a
consumer's current run separately. The full native-test catalogue is still being
reviewed and reconciled. Generated candidate text is not automatically canonical.

When several tests exercise the same behaviour, map them to one scenario with
explicit parameter variants. Distinct preconditions or conflicting outcomes need
separate scenarios or a recorded issue. A test title alone is not an outcome.

## Consumer pins and release checks

Consumers use `references/fixtures-ooxml` as a submodule and pin the same annotated
release tag's commit. Pin records include the root-manifest seal.
Before testing, verify HEAD, annotated-tag identity, the seal, all asset hashes
and clean reference contents, including facts and workflows. Missing or modified
inputs fail; no fallback corpus is generated.

Pre-release runs may use an explicit candidate root and candidate pin containing
an exact commit and manifest seal. They must not masquerade as a tagged-release check.
Publish only after the shared verifier and consumer candidate checks pass, then
repin consumers and repeat default recursive-clone checks. Never move a published
tag. Required licence notices and qualified provenance survive migrations.
