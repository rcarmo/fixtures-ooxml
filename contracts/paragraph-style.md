# Existing paragraph style selection

`workflows/docx/paragraph-style.feature` specifies direct style assignment and
removal for one supported main-document paragraph.

The input is an existing paragraph style ID or null. A non-null ID requires one
internal styles relationship, the Word styles content type, a valid styles root
and exactly one matching direct paragraph-style definition. Missing, character,
duplicated, external or ambiguous definitions refuse. The style definition bytes
and other package parts are retained; no style is created or edited.

Null removes only the direct `pStyle` override and does not require a styles
registry. It does not select a named default or evaluate inherited formatting.
The direct style getter reads the stored override, including unknown IDs, and
returns no value when absent. Malformed direct metadata refuses.

Paragraph text and unrelated paragraph/run properties are preserved. New style
elements are inserted first in `pPr`. Changed selections invalidate paragraph,
span and cell snapshots; table handles remain valid. Exact no-ops retain archive
bytes and valid handles. Save/serialization validation occurs within rollback;
no partial model update is committed on failure.

Protected settings, unsupported text/field/revision topology, mixed lexical
content, duplicate/misplaced paragraph properties, wrong namespaces and stale
handles refuse. Style creation, effective-style calculation and page layout are
separate operations.
