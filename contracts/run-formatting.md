# Direct paragraph run formatting

`workflows/docx/run-formatting.feature` specifies paragraph-wide bold/italic changes. The operation applies
only to supported direct text runs in one main-document paragraph, including a
paragraph inside a table cell.

The patch is tri-state: true writes direct on, false writes explicit direct off,
and null removes the direct property so inheritance can apply. An omitted key
leaves that property unchanged. This operation does not compute the effective
style, split runs, select a substring or edit the style graph.

The paragraph text, package membership, unrelated parts and unrelated run
properties retain their bytes. Changed bold/italic elements may be replaced;
missing elements are inserted in Word run-property order. A semantic no-op
preserves the original XML/archive and handle validity. A real change invalidates
paragraph/span/cell snapshots; callers reacquire handles.

Fields, revisions, mixed lexical content, duplicated/out-of-order or unknown
properties, malformed Boolean flags, misqualified attributes and protected or
external settings refuse before mutation. All runs preflight before publication;
serialization failure rolls the package back. Empty paragraphs have zero changed
runs; nonempty formatting on self-closing empty runs is unsupported.

Computed styles, general run-property validation and rendered appearance require
separate checks.
