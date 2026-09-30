# Runtime generalization progress

Three of the twelve runtime-specific scenario IDs have neutral contracts and
verified Bun, Go and Python candidate bindings. Nine IDs still need work.

## XML batch — locally verified

Shared candidate `ee47f750184bf3dc0bc396632a5373f3d673b563` retains all three IDs
and exact XML inputs. It changes the observable outcomes from JavaScript
prototype/freeze semantics and exception identity to literal attribute safety,
same-model namespace snapshot isolation and documented malformed-XML failures.
See [the contract](../contracts/xml-values.md) and
[the migration](../ledgers/xml-runtime-generalization.json).

| Scenario ID | Cases / steps | Bun | Go | Python |
|---|---:|---|---|---|
| `@id-xml-prototype-safe-attributes` | 1 / 5 | passed | passed | passed |
| `@id-xml-immutable-namespace-metadata` | 1 / 6 | passed | passed | passed |
| `@id-xml-typed-parse-error` | 1 / 4 | passed | passed | passed |

Native local commits:

- Bun `f380fa44ed5933479c20847cc467de4f87e76a4a`.
- Go `58f54e67cfc05a6634690b3aee0edf64fcdabf13`.
- Python `3e949ad37d8f653efd525456a39ce81535215dee`, preserving its preceding
  unpushed text-filter commit `01133dc`.

The shared candidate is clean and sealed. All consumer gitlinks/default pins
still select published v0.152.0 / `28e492f`. The shared execution ledger marks
these three changed contracts planned until release adoption and fresh final
receipts; historical execution is recorded separately. No push or tag occurred.

## Verification

- Shared candidate: reference validation and 235 tests passed; 304 IDs / 791
  cases and original fixture bytes retained.
- Bun: default and explicit clean candidate `make check` passed; candidate
  1,115 unit tests and 732 implemented acceptance cases. Scoped three-ID run
  independently passed 3 cases / 15 steps.
- Go: uncached root plus separate acceptance module passed for default
  434 cases / 1,501 steps and candidate 437 / 1,516. Candidate's three selected
  cases / 15 steps all passed.
- Python: uncached default 1,489 passed / three candidate skips; explicit
  candidate 1,494 passed. Four existing warnings in each full suite. Independent
  scoped candidate review passed five tests, including 3 cases / 15 steps.
- Native and binding fault controls rejected dropped literal attributes,
  mutable namespace metadata and missing/wrong failure classification; code
  was restored before green runs. Wrong candidate seals/identities fail closed.

Workspace evidence (local review records, outside distributed contracts):

- `/workspace/evidence/bun-xml-model-safety-ee47f75.json`
- `/workspace/analysis/go-ooxml-batch1/full-candidate-report/`
- `/workspace/analysis/go-ooxml-batch1/full-default-report/`
- `/workspace/analysis/go-ooxml-batch1/acceptance-{classifier,namespace,literal-loss}-red.log`
- `/workspace/evidence/python-xml-model-safety-ee47f75.json`
- `/workspace/evidence/python-xml-model-{default,candidate}-20260930.log`

## Remaining IDs

| Family | IDs | Work required |
|---|---|---|
| Nullable table cells | `@id-docx-go-table-cell-access` | Exact bounded cell presence/absence, native absence mapping and source custody |
| OPC validation/save errors | `@id-bun-opc-open-refusal`, `@id-bun-opc-save-invalid-target-custody`, `@id-bun-opc-symlink-destination-refusal` | Runtime-neutral structured reasons, graph validation and safe destination handling |
| ZIP32 reader/writer/budgets | `@id-bun-zip32-reader-refusal`, `@id-bun-zip32-writer-refusal`, `@id-bun-zip32-configured-bounds` | Distinct native failure reasons for all 19 example cases; strict ZIP geometry and writer/admission APIs |
| Transactions | `@id-bun-opc-async-transaction-refusal`, `@id-bun-opc-thenable-transaction-result` | Deferred-operation pre-body refusal and opaque-result non-evaluation/identity with equivalent native APIs |

Neutral wording alone does not close these gaps. Python's initial read-only
survey found missing OPC graph-validation, symlink refusal and strict ZIP writer
interfaces. It also found conflated ZIP refusal reasons. Those require production
changes and exact controls before passing shared cases. Go's corresponding survey
is pending. No unsupported operation receives migration credit.
