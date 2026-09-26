# Specification-linked tests

The ECMA documents define format requirements. The scenarios below turn selected
requirements into concrete saved-file checks. An implementation must execute each
scenario before reporting that it supports the operation.

## Word font sizes

[`font-size.feature`](../workflows/docx/font-size.feature) sets a direct run size
to 10.5 points and requires exactly one `w:sz` with `w:val="21"` after saving and
reopening. ECMA-376 Part 1 (2016), §17.3.2.38, defines this value in half-points
for non-complex-script characters. It does not prescribe a font's rendered
metrics or require the complex-script `w:szCs` property to be present or absent.

The original Go tests include a 10.5-point input and an immediate getter check;
a separate ECMA test saves the file for optional schema validation. The new
scenario also requires inspecting the saved XML and reopening the getter. Those
additional assertions must be implemented in each test runner.

## Legacy comment drawings

Spreadsheet comments and their VML drawings have separate relationships. A
reader must resolve the drawing relationship referenced by `legacyDrawing`,
rather than treating a comments relationship as the drawing itself.

[`comment-vml-custody.feature`](../workflows/xlsx/comment-vml-custody.feature)
separates read-only inspection, preservation row editing and limited numeric
editing. A row insertion after an existing comment preserves its VML payloads;
the preservation profile rejects affected comments, control shapes and unknown
VML shapes. The limited numeric profile rejects the dependency before replacement.
These are distinct editor policies, not universal ECMA admission rules.

VML is deprecated in the informative guidance in Part 1 Annex L.5.1. Existing
VML content must still be handled deliberately. Operations that preserve it and
operations that reject it need distinct tests; deprecation alone does not permit
silently deleting an existing drawing.

[`deprecations.json`](../specs/ecma-376/deprecations.json) records the cited
changes, replacements and review limits. [The specification index](../specs/ecma-376/README.md)
identifies exact editions and distinguishes normative text from informative notes.
