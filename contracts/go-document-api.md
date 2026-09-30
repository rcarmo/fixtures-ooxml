# Word document value APIs

Shared value predicates belong to the corresponding Word operations:
[creation](../workflows/docx/creation.feature), [properties](../workflows/docx/properties.feature),
[paragraphs](../workflows/docx/paragraphs.feature), [paragraph styles](../workflows/docx/paragraph-style.feature),
[run formatting](../workflows/docx/run-formatting.feature), [tables](../workflows/docx/tables.feature),
[page layout](../workflows/docx/page-layout.feature) and [tracked editing](../workflows/docx/tracked-workflow.feature).
In-memory getters and saved/reopened results remain separate obligations.
The [Go source mapping](../ledgers/consumers/go-document-api.json) records source
assertions and gaps; historical IDs retain their origin names.

`@profile-document-value-api` retains getter names and return conventions.
The narrower profiles make compatibility limits explicit:

- `heading-classification-api`: style-ID-based `IsHeading` and `HeadingLevel`,
  without computed outline inheritance.
- `bounded-cell-lookup`: zero-based lookup returns presence/absence without
  throwing for the fourteen listed integer coordinates. Go `nil`, Bun `null`
  and Python `None` are native absence representations; no language spelling
  is required. The nine distinct labelled cells must return their exact text,
  rejecting row/column aliasing as well as out-of-range selection. Lookup leaves
  the 3×3 grid, all texts and document XML unchanged. This replaces the historical
  `nullable-cell-api` profile while retaining its ID and every original coordinate.
- `in-memory-effects-api`: all eight flags read true even though some pairs are
  mutually exclusive in saved WordprocessingML. This is not a valid-file recipe.
- `selected-formatting-readback` and `table-text-readback`: only the stated
  properties or text positions are required after saving and reopening.

Neutral actor wording does not promote these policies to OOXML requirements.
Weak presence/count predicates remain explicit gaps for stronger contracts.

## In-memory document and text

A new document exposes a nonnil body and empty paragraph/table collections. Setter/getter examples compare paragraph text, style classification, alignment, spacing, direct flags and multiple-run concatenation. Selected run examples compare direct colours, bold/italic/strike, effects, underline styles, font names, highlights and opposite superscript/subscript flags on two different runs. Neither a setter nor a getter proves disk persistence unless the feature explicitly saves and reopens.

The table examples compare dimensions, cell access bounds, four assigned cell texts, row counts, span/merge properties, direct style, header flag, shading and selected cell properties. The bounded lookup scenario strengthens the old nonnil-only check with A1/B1/C1, A2/B2/C2 and A3/B3/C3 texts, all nine present coordinates and five absent coordinates (-1,0), (0,-1), (3,0), (0,3), (3,3). Initialise those labels before recording input XML. Only the lookup operation must preserve that XML. A valid-format integer outside either independent axis bound returns absence without an exception; invalid non-integer arguments, merged grids, stale handles and saved readback require separate profiles. A production callable lookup must enforce the boundary; a test-side guard around an aliasing native call does not satisfy it. A border-presence assertion checks only that a top border object exists; it does not check its style, size or colour. Row insert/delete examples check counts and an out-of-bounds error, not the identity or contents of shifted rows.

## Saved and reopened documents

The formatting round trip reads at least three runs and checks bold, italic, colour, font size and font name on the first three. It permits additional runs and does not compare their text. The table round trip requires one table with nine specific cell texts, without inspecting its grid, merges or style.

Opening a file without an error or obtaining a nonnil body does not check its content. Those fixture smoke tests have no shared scenarios. Their helper also ignores `Close` errors.

## Direct font size

The [existing direct font-size contract](../workflows/docx/font-size.feature) requires 10.5 points to serialize as `w:sz` value 21 and survive reopening. The Go unit test reads only the in-memory `FontSize()` getter. It never checks serialized `w:sz`, a reopened run or the helper's `HalfPts` field.

The source mapping records unselected parameter rows and the limits of each assertion, including a symbol/page-break check that only requires nonempty paragraph text. Complete package preservation and rendered appearance need separate checks.
