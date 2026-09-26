# Bounded effective bold/italic inspection

The [shared feature](../workflows/docx/effective-formatting.feature) resolves flags
for plain direct body-paragraph runs with bounded Latin text. Results contain run
text, effective bold/italic values, paragraph-style ancestry and ordered source
contributions. Inspection preserves exact package bytes and existing handles.

Start with false, apply document-default values, traverse the selected paragraph
style's `basedOn` chain from root to leaf, then apply absolute direct run values.
Without a selected style, use the paragraph default. Style true toggles the
inherited flag; style false retains it. An explicit paragraph style does not also
inherit the default style unless the ancestry names it.

Missing/cyclic/wrong-type ancestry, duplicate IDs or defaults, malformed or
repeated flags, character styles, numbering, tables, revisions, complex-script
properties, external/wrong-MIME styles, Office stylesWithEffects and stale
paragraph handles refuse. This is not a complete style, theme, font or script
cascade. Unused style ancestry is outside the traversal.

LibreOffice 24.2.7 retains bold across two paragraph-style true toggles; the OOXML
toggle rule returns false. This known difference prevents a claim of renderer
equivalence.
