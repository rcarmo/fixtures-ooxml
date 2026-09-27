# Python XLSX dependency observations

Five native tests in `python-office-mcp-server/tests/test_xlsx_dependency_preservation.py` exercise cell-edit dependency handling. The [source mapping](../ledgers/consumers/python-xlsx-dependencies.json) names their inputs, observed outcomes and missing assertions. It records the published consumer revision and source-file hash. These native tests are not five new shared cases.

The default-style edit partially overlaps [style dependency closure](../workflows/xlsx/cell-style.feature): it checks wrap text, valid style indices and bounded unchanged ZIP payloads, but not source-byte custody or relationship closure. The cross-sheet cache edit partially overlaps [formula cache invalidation](../workflows/xlsx/formula-cache.feature): it reopens the output in formula and data-only modes and checks a cleared cache, but does not assert every shared package outcome.

The generated workbook's custom-style preservation and direct `merge_styles` refusal have no matching registered scenario predicate. A unit helper's registry-rewrite refusal is a different operation from cell-style selection and cannot inherit that case's rollback claim.

The injected `xl/calcChain.xml` test checks removal of one standard-path chain part, its relationship token and content-type token. The [owned-chain case](../workflows/xlsx/calculation-chain-lifecycle.feature) instead requires a coherent nonstandard `xl/chains/order.xml` chain and saved readback of two dependent formula caches, an unaffected cache, source bytes and unrelated package members. The Python test is partial source evidence only; that case stays planned for Python. The Go case has its own independently run binding recorded in the shared workflow ledger.

An observed native pass or this source mapping does not grant execution credit. To bind a canonical case, run its exact inputs and independently check all applicable outcomes in the Python acceptance lane; record the selected case and its test result separately.
