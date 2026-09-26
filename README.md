# OOXML specifications and test fixtures

Shared specifications, sample documents and Gherkin tests for DOCX, PPTX and XLSX.
The ECMA specification defines the expected behaviour. Implementation tests and
Office application output help find differences; they do not override the spec.

## Find a reference

| Directory | Contents |
|---|---|
| [`specs/ecma-376/`](specs/ecma-376/README.md) | Unmodified ECMA documents, extracts and separately identified notes |
| `facts/` | Content types, namespaces, relationship types and constants with source references |
| `fixtures/<format>/<scenario-group>/` | Reusable documents and images |
| `workflows/` | Gherkin scenarios for package, XML and document operations |
| `contracts/` | Operation semantics and limitations |
| `ledgers/` | Scenario indexes and test-to-requirement mappings |
| `notices/` | Original licence texts and asset attribution |

[`manifest.json`](manifest.json) records each asset's path, length, SHA-256 and
origin. Identical files are stored once. Resolve fixtures by their manifest ID;
do not construct paths from the project they came from.

## Use and validate

```sh
git submodule update --init --recursive
bun install --frozen-lockfile
bun run check
bun test
```

Projects use this repository as the `references/fixtures-ooxml` submodule. Keep
the submodule commit and reference pin together. Missing or modified files fail
validation; the tools do not generate replacements.

Validation checks file hashes, specification records, fixture groups, fact
references and Gherkin scenario identities. Applications run the scenarios against
their own implementation. Passing these repository checks alone does not establish
OOXML conformance.

Add new scenarios and source-test mappings directly here using the
[catalogue contribution guide](CATALOGUE.md). A feature, its mapping and registry
updates are committed together; validation rejects orphan feature files.

See [reference formats](REFERENCE.md), [XML operations](contracts/xml-profiles.md),
[package operations](contracts/package-profiles.md) and
[document operations](contracts/native-profiles.md).

## Licensing

The repository's original tools and contracts are MIT licensed. Imported
documents retain their original terms. ECMA material is kept verbatim and is not
relicensed as project code. See [notices](NOTICES.md).
