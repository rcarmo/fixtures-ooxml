# Concrete Word template inventory

The concrete-inventory rule in [template analysis](../workflows/docx/template-analysis.feature)
reports literal main-body/table content and direct outline metadata. It adds no staffing, guidance-colour, SOW, inherited-formatting or cache inference. Existing
response-shape/status/cache scenarios retain their separate predicates.

## Saved source and exact result

The generated source contains, in order, `Statement for <Customer>` with direct
outline 0; `Use <Project> and [TBD].`; a two-by-two table; `Delivery` with direct
outline 1; and `No placeholder`. Table rows are `Role` / `Hours` and `<Role>` /
`40`. Each table column and cell is 4,320 twips. An unrelated `customXml/opaque.bin` contains bytes `00 ff 2a`. Save and reopen the
source before inspection. The default source uses UTF-8.

Result scope is `main-body-and-tables`. Counts are eight paragraphs, two sections,
one table and three placeholders. Paragraph text order is exactly:
`Statement for <Customer>`, `Use <Project> and [TBD].`, `Role`, `Hours`, `<Role>`,
`40`, `Delivery`, `No placeholder`. Their body indexes are `0,1,2,2,2,2,3,4`.
All direct style IDs are absent; outline levels are `0,null,null,null,null,null,1,null`.
Cell paragraphs 2–5 have table index 0, row/column coordinates `(0,0),(0,1),(1,0),(1,1)`
and cell paragraph index 0. Other paragraphs have no table location.

Sections refer to paragraph indexes 0 and 6, body indexes 0 and 3, their exact
texts, and one-based levels 1 and 2. The table has index 0, body index 2, dimensions
2×2 and the literal rows above. Placeholder records have `(paragraphIndex,
bodyIndex,start,end,text,name)`:

- `(0,0,14,24,"<Customer>","Customer")`
- `(1,1,4,13,"<Project>","Project")`
- `(4,2,0,6,"<Role>","Role")`

Offsets count UTF-16 units in each decoded paragraph. No square-bracket or semantic
classification is inferred. Every invocation leaves source bytes unchanged.
Held first-paragraph and first-table handles remain readable.

## Other sources and refusals

An empty document reports zero counts and empty arrays. A plain document contains
only `Simple text`: one paragraph at body/paragraph index 0, absent style/outline,
and no sections, tables or placeholders.

The Unicode sample starts with run `😀 <Cus`, followed by run
`tomer> <Customer> <<nested>> <> < > [TBD]`. Further paragraphs contain
`<unfinished` and `ending>`. Only the two complete Customer tokens in paragraph 0
are returned at offsets 3–13 and 14–24; no token crosses a paragraph boundary.

Defects modify the concrete source: a field instruction in the final paragraph;
a direct body content control; a nested table or `vMerge` in cell (0,0); nonzero
`gridBefore` or `gridAfter` in the last row; cell (1,0) width changed to 100 or
removed; an XML comment inside `tblGrid`; or a stale wrapper after external main
XML change. Staleness preserves the externally changed in-memory bytes as well
as the unchanged disk source. All other refusals preserve the loaded bytes too.

Bounds are 10,000 paragraphs, 10,000 placeholder occurrences and 1,000 tables.
The three limit sources contain 10,001 empty direct paragraphs, one paragraph
with 10,001 `<A>` tokens, or 1,001 one-cell tables respectively. Each exceeds only
its named inventory bound and must throw `docx-template-limit`, returning no report.
No partial success or truncation is allowed.

## Snapshot, encodings and scope

Snapshots and all their nested arrays/records are immutable and detached. A later
in-memory edit of the final paragraph to `Changed <New>` leaves the old snapshot
unchanged; a new inspection sees the new paragraph and fourth placeholder. The
saved source is untouched.

Encoding cases use UTF-8 BOM or UTF-16BE BOM. UTF-16 binds prefix `q` to the Word
namespace and `w` to a foreign URI; namespace meaning, exact byte markers and
archive bytes are retained. Protected input adds `documentProtection` enforcement
1 through an internal settings relationship; reading remains permitted. Header
context adds a linked header containing `<Header>`; it is outside this named
scope and contributes neither paragraphs nor placeholders. These checks do not
establish general story traversal, rendered layout or tool-response compatibility.
