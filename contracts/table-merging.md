# Physical horizontal Word merges

ECMA-376 Part 1 §17.4.17 defines `gridSpan`; §17.4.71 defines `tcW`.
The [horizontal merge scenarios](../workflows/docx/table-merging.feature) check
physical cell removal with retained content. They do not replace the historical
span and vertical-merge setter/getter profile in `tables.feature`.

## Generated source

The source contains paragraph `Before`, a two-row/four-column table, paragraph
`After`, and `customXml/opaque.bin` with bytes `00 ff 2a`. Every grid column and
cell width is 2,160 twips. Cell (0,0) contains `Keep & <text>`; cell (1,3) contains
`Tail`; all other cells contain one structurally empty paragraph. The first cell
has direct clear shading `ABCDEF` and vertical alignment `center`. No other cell
has direct formatting except its width. Inputs are saved and reopened before
editing; output uses a different path.

Ranges are inclusive and zero-based. The writer keeps the first cell's text and
formatting, updates its width to the sum of selected grid columns, adds one
`gridSpan`, and removes the following selected cells. Exact retained paragraph
texts (including empty strings) must match source order minus only absorbed
paragraphs. Tests compare the grid, unselected cells, unselected rows and
non-document members byte-for-byte. Removing only the width/span properties
from the owner before and after must leave identical owner XML. The source
archive is never changed.

## Refusal inputs

Absorbed-content cases modify cell (0,1): text `Do not lose me`, one text space,
clear shading `ABCDEF`, paragraph `keepNext`, an empty run/text element, or an XML
comment before `tcPr`. Each request must refuse rather than discard that data.

Structural cases insert `vMerge` restart at cell (1,0), remove `tblGrid`, change
cell (1,0)'s width to 100 twips, insert a nested table at cell (1,3), add settings
with `documentProtection` enforcement 1, or add an external settings relationship.
These checks cover the entire table and the settings owner, not just selected
cells. The nested table may be empty; the plain document is not a rendering oracle.

Coordinate cases are `(0,0,0)`, `(0,2,1)`, `(0,0,4)` and `(0,0.5,2)`. They must
raise a range refusal. Fault cases throw synchronously immediately after writing
the modified main part or when serializing it. Faults must actually be reached.
All refusal cases retain exact archive bytes and readable held first-table,
first-cell and `Before` paragraph handles; the writer must not publish partial
state or stale those handles.

## Encodings and post-merge access

Encoding cases use a UTF-8 BOM, UTF-16LE BOM, or UTF-16BE BOM. Both UTF-16 cases
use a `q` prefix for WordprocessingML and bind `w` to a foreign URI at the root.
Readback must retain the original byte-order marker, decoded sibling XML and
WordprocessingML meaning of the inserted properties.

After success, old table, first-cell and `Before` paragraph handles must refuse.
The current table refuses cell access at all three merged coordinates, row
insertion and a second merge. The current unmerged (1,3) cell remains readable as
`Tail`; refusal attempts must retain the merged archive bytes. These are editing
session policies, not schema requirements.

Vertical merges, splitting, repeated merges, nonempty absorbed cells and rendered
layout are outside this contract. Catalogue presence and mapping associations
alone confer no consumer execution credit.
