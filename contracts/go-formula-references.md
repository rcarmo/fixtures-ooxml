# Go static formula references

The [planned profile](../workflows/xlsx/formula-references.feature) analyses a conservative A1 expression subset, parses direct ranges and remaps static references after a named worksheet row or column insertion. It operates on formula strings. It does not calculate values, change a workbook package or certify Excel formula compatibility. The [Go consumer mapping](../ledgers/consumers/go-formula-references.json) pins the source declarations and their assertion limits.

## Analysis and direct ranges

`Analyze` returns a reference list with UTF-8 **byte** spans into the original expression. Literal strings such as `"A1"` are data rather than dependencies. A decoded quoted sheet name and `$` markers remain distinct properties of an accepted reference. Selected unsupported grammar and out-of-grid references refuse with an error and no partial reference list. The profile checks exact reference counts on named expressions; it does not infer a complete grammar or evaluate functions.

`ParseRange` handles selected direct cell, rectangular, whole-row and whole-column references. A whole-axis result leaves the absent coordinate at zero for the caller to interpret. This direct-range policy is separate from general expression analysis: accepting `$B:$B` in `ParseRange` does not establish that `Analyze` accepts a whole-column formula operand. Selected unions, external/three-dimensional references, mixed endpoints, spills and expressions refuse in this profile. Reversed endpoints in a source row are admitted by the parser; this does not mean they are valid for every worksheet operation.

## Insertion remaps

`InsertReferences` takes the expression, its context sheet and a row or column insertion. It changes supported coordinates on the named sheet and retains unrelated sheet references, string literals and source spelling that need not change. A changed reference's absolute marker does not prevent a structural shift. The planned examples specify exact complete output strings for five input rows. Invalid insertion arguments, overflowing grid coordinates and unsupported dynamic syntax return an error and empty replacement string in selected rows. That is a lexical result, not a saved-workbook rollback assertion.

A deterministic source test examines three sheet prefixes, four left cells, four right cells and six operators: **288 loop iterations** in one declaration. It checks two reparsable source slices per expression, an exact no-op for insertion at row 100, and matching references after wrapping in `SUM(...)` with span adjustment. This is one planned Gherkin case, not 288 executed canonical cases.

## Source and coverage boundary

The full target family has five tracked `internal/formula/*_test.go` files and **six declarations** at Go revision `e2c5891212beef16f7412c794d3bea6c01e9da35`. Five table/property test declarations have partial mappings in the ledger; `FuzzStaticReferenceAnalysis` is explicitly unmapped. Its six seed strings enter a conditional callback with early exits on input size, parser refusal and remap refusal. The source does not establish successful remapping of every seed or an exploratory fuzz campaign. Unrepresented invalid table rows and unasserted endpoints remain listed per declaration.

The existing XLSX cache-invalidation and shared/array-formula overwrite workflows use workbook-level operations. Their IDs are not reused for this string-level profile. No ECMA clause is assigned as authority for the supported parser grammar or rewrite policy; those are Go API boundaries. The complete ECMA PDFs in the [specification index](../specs/ecma-376/README.md) govern format requirements and require separate edition, part and clause review before conformance claims.
