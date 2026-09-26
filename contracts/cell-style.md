# Existing-cell style selection

The [feature](../workflows/xlsx/cell-style.feature) selects an existing cellXf
index on an existing worksheet cell. Explicit zero writes `s="0"`; removal deletes
that attribute and can expose row or column defaults. Neither operation creates
cells or style definitions.

Numeric selection validates the styles relationship, content type and selected
font, fill, border, base-style and custom-number-format references. Protected or
stale inputs, missing cells, ambiguous worksheet targets and invalid definitions
are rejected before any change.

Values, formulas, cached values and unrelated content stay unchanged. Numeric
no-ops retain the original attribute spelling and archive bytes. The selected
index or its absence must survive save/reopen. Style creation, effective-format
calculation and spreadsheet rendering are separate operations.
