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
without dropping a unique input. The manifest also pins notices and workflow metadata; its total asset count grows
as behaviour contracts are added. Fixture counts and bytes are unchanged by those
catalogue additions.

Resolve a fixture ID through the manifest. Do not infer its path from an origin,
copy it for another scenario, or create compatibility directories or symlinks.
`ledgers/fixture-groups.json` records primary membership. Reusable generated inputs
are also fixtures; ephemeral edited outputs belong in consumer temporary paths.

## Path names

Name files for their contents and keep directory depth useful. Use lower-case
kebab-case and the format/scenario group, for example
`fixtures/xlsx/mutation-safety/cross-sheet-cache.xlsx`. Add a short hash suffix
only when distinct fixtures otherwise share the same descriptive name. Full
hashes and all origins remain in the manifest.

Use direct paths such as `workflows/mutation-safety.feature`,
`contracts/mutation-safety.json` and `notices/go-fixture-provenance.md`. Do not add
version/pack/export layers or reproduce producer checkout paths. Version the
repository with tags; resolve reusable files by stable IDs so a rename does not
change which bytes a consumer uses.

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

Native test snapshots under `ledgers/consumers/` use `mapped`, `partial` or
`unmapped` coverage, pinned repository revisions and test-file hashes. They
require explicit gaps for partial/unmapped rows and always set
`executionCredit: false`. A complete declaration mapping does not cover a module
or imply that central bindings ran. See [XML profiles](contracts/xml-profiles.md).

When several tests exercise the same behaviour, map them to one scenario with
explicit parameter variants. Distinct preconditions or conflicting outcomes need
separate scenarios or a recorded issue. A test title alone is not an outcome.

## Priority agent communications

Priority coordination must steer the recipient's active work. Use an explicit
mode rather than relying on a default:

```js
chat({
  action: "send",
  target_agent_name: "@ooxml-go",
  mode: "steer",
  content: "PRIORITY: current release <tag>/<commit>. Go owner: verify the new pin before further edits. Supersedes the earlier candidate-pin notice."
});
```

Use steering for user scope changes, stop/hold instructions, release or pin
corrections, safety blockers and decisions that unblock another agent. Use
`mode: "queue"` only for routine updates that can wait. A queued progress report
must not be relied on to halt unsafe work or correct a stale release pin.

The receiver checks the current tag/ref or source of record, acknowledges that
state once, and acts on the requested change. Delayed progress messages do not
supersede newer instructions. Do not replay old blockers or repeatedly announce a
resolved decision. Use `session_control` for session runtime operations; it does
not replace the coordination message.

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
