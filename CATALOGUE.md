# Contributing catalogue entries

Add reviewed behaviour contracts under `workflows/` and their source-test mappings
under `ledgers/consumers/`. The catalogue is incomplete: source families, parameter
variants and specification requirements still need review. Working notes outside
these directories do not register a behaviour.

## Add an operation

Write the canonical `.feature` under `workflows/<format-or-layer>/`. Give each
scenario one unique `@id-` tag and concrete Given/When/Then steps. Keep distinct
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

## Completion

A complete catalogue accounts for every test declaration, parameter group,
integration workflow and required conformance rule in the consolidated estate.
An entry with unresolved assertions, missing variants or unverified clause
applicability remains a gap. Inventories and broad placeholder scenarios alone
do not close that gap.
