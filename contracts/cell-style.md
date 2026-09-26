# Existing-cell style selection

The [shared feature](../workflows/xlsx/cell-style.feature) specifies selecting an
existing cellXf index on an existing worksheet cell. Explicit zero writes a direct
index; removal deletes only that attribute and can expose row/column defaults.
Neither operation creates cells or definitions or calculates effective formatting.

Save/reopen must preserve values, formulas, caches, other worksheet XML and unrelated
package parts. Numeric no-ops retain the exact archive. Selection validates the
styles relationship/MIME/root, relevant collection counts and selected font/base/
custom-number-format dependencies. Refusals preserve bytes and cached cell state.

The 9 selection and 18 refusal variants cover invalid inputs, protection, stale
cached sources and two worksheet names aliasing the same part. Native bindings
and per-consumer results are required for execution credit. Independent Excel
rendering and calculation are outside this contract.
