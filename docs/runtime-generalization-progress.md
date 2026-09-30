# Runtime generalization completed locally

All twelve formerly runtime-specific scenario IDs now have runtime-neutral
contracts and passing Bun, Go and Python candidate bindings: **32 cases and
195 compiled steps in each runtime**. No target ID remains runtime-specific in
the reuse review. Runtime-specific native safeguards remain as supplemental tests.

Verified shared candidate: `bb1ae7d8859963c1699fed45453f7d1ff2999222`.
Manifest seal: `9d3ebdcfa686e04dcacc13bc11b062126135beb8bbd5046e47edc2f898b8212e`.
The catalogue retains 304 IDs / 791 cases and unchanged fixture bytes.

## Exact shared results

| Scenario ID | Cases | Compiled steps | Bun | Go | Python |
|---|---:|---:|---|---|---|
| `@id-xml-prototype-safe-attributes` | 1 | 5 | passed | passed | passed |
| `@id-xml-immutable-namespace-metadata` | 1 | 6 | passed | passed | passed |
| `@id-xml-typed-parse-error` | 1 | 4 | passed | passed | passed |
| `@id-docx-go-table-cell-access` | 1 | 4 | passed | passed | passed |
| `@id-bun-opc-open-refusal` | 5 | 45 | passed | passed | passed |
| `@id-bun-opc-save-invalid-target-custody` | 1 | 11 | passed | passed | passed |
| `@id-bun-opc-symlink-destination-refusal` | 1 | 12 | passed | passed | passed |
| `@id-bun-zip32-reader-refusal` | 12 | 60 | passed | passed | passed |
| `@id-bun-zip32-writer-refusal` | 2 | 8 | passed | passed | passed |
| `@id-bun-zip32-configured-bounds` | 5 | 20 | passed | passed | passed |
| `@id-bun-opc-async-transaction-refusal` | 1 | 10 | passed | passed | passed |
| `@id-bun-opc-thenable-transaction-result` | 1 | 10 | passed | passed | passed |
| **Total** | **32** | **195** | **passed** | **passed** | **passed** |

Step totals include the five OPC-envelope Background steps in each relevant case.
Each scenario selects the actual production API. No acceptance-only model,
input-derived error classifier or weaker success/error predicate supplies credit.

## What changed

- XML special-looking keys are ordinary data with exact values and unchanged
  structure/source. Namespace metadata uses read-only or detached snapshots;
  mutating a returned map cannot affect fresh reads from the same parsed model.
  Malformed XML returns a documented machine-readable category, no partial
  document and unchanged source; exception class spelling is not prescribed.
- Cell lookup checks all nine distinct A1–C3 values and five explicit boundary
  absences without exceptions or negative-index aliasing. Grid, texts and
  document XML remain unchanged.
- ZIP32 and OPC refusal reasons retain all 26 concrete input variants and budget
  thresholds. Structured native reasons replace exception identity and diagnostic
  text. Reads/writes deliver no partial results; caller entries/bytes, existing
  destination and symlink target/link retain exact custody.
- Transactions use explicit immediate/deferred modes. Deferred callbacks are
  rejected before invocation. Immediate callbacks return their original opaque
  token without evaluating/awaiting it; saved readback contains Beta and retains
  every unrelated member. Callback/validation rollback and working-copy isolation
  are checked independently.

Historical IDs and input operands remain intact. The explicit
[XML](../ledgers/xml-runtime-generalization.json),
[cell](../ledgers/cell-runtime-generalization.json),
[package](../ledgers/package-runtime-generalization.json) and
[transaction](../ledgers/transaction-runtime-generalization.json) migrations retain
old predicates and execution evidence. Stronger cases require fresh results;
wording migration alone grants none.

## Native commits and full gates

| Consumer | Final local commit | Published/default gate | Latest candidate gate |
|---|---|---|---|
| Bun | `3e57ea3fb73cdc5f6b35664d4b746296d2fbd623` | `make check` passed; 732 implemented acceptance cases | `make check`: 1,120 tests, 732/732 implemented acceptance; exact target 32/195 passed |
| Go | `26b5d540f5e26151ebac049049086b1f9c5e3eee` | Uncached root + acceptance: 434 cases / 1,501 steps passed | Uncached root + acceptance: 465 cases / 1,692 steps passed; exact target 32/195 passed |
| Python | `5574a2e9433a9d3384138733325c0f8a0f3daee4` | Uncached 1,489 passed, 9 candidate tests skipped; 30 clean provenance reports | Uncached 1,526 passed; 34 clean provenance reports; exact target 32/195 passed |

Python retains four existing warnings in both full runs. Its preceding unpushed
text-filter commit `01133dc` remains in history. The owner independently ran the
four new Python lanes (37 tests passed) and inspected the exact Go report; Bun's
owner run executed all twelve IDs together. Shared validation and 238 tests passed.

Controls removed literal attributes, aliased namespace maps, suppressed failure
categories, selected wrong/out-of-range cells, corrupted current XML, changed
refusal reasons, bypassed source/destination validation, executed deferred
callbacks, replaced/evaluated opaque tokens and mutated deferred archive state.
Each selected fault failed; implementations were restored before final green
runs. Secure DTD handling, malformed directory names, finite ZIP defaults,
ASCII-only name folding and retained Go working-copy isolation were strengthened
following source review. Invalid candidate identities/seals still fail closed.

## Local evidence

These paths are review records in the workspace, not distributed contract assets:

- `/workspace/evidence/bun-all-runtime-generalized-bb1ae7d.json`
- `/workspace/analysis/go-ooxml-transactions/full-candidate-report/`
- `/workspace/analysis/go-ooxml-transactions/full-default-report/`
- `/workspace/analysis/go-ooxml-transactions/full-{candidate,default}-final.log`
- `/workspace/evidence/python-{xml-model-safety,docx-bounded-cell-lookup,package-value-reasons,opc-portable-transactions}-bb1ae7d.json`
- `/workspace/evidence/python-opc-transactions-{candidate,default}-20260930.log`
- Owner Python scoped receipt: `/workspace/evidence/python-transactions-owner-bb1ae7d.json`

## Release state

All four repositories retain this work in local commits. No push, tag or
consumer pin change occurred. Default consumer gitlinks still select published
v0.152.0 / `28e492f50979aaec6ab8d8d001cd9c37790e7fc6`. The shared execution ledger
keeps the twelve changed contracts planned pending release adoption and final
published receipts. The table above records local candidate success separately.
The generated reuse catalogue now has 118 generalized, 98 profile-specific and
88 incomplete IDs, with zero runtime-specific IDs among the canonical workflows.
Unreviewed staging and unrelated incomplete/profile-specific contracts are outside
this completed twelve-ID task.
