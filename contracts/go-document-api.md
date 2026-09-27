# Go document API predicates

Go-origin predicates now belong to the corresponding Word operations:
[creation](../workflows/docx/creation.feature), [properties](../workflows/docx/properties.feature),
[paragraphs](../workflows/docx/paragraphs.feature), [paragraph styles](../workflows/docx/paragraph-style.feature),
[run formatting](../workflows/docx/run-formatting.feature), [tables](../workflows/docx/tables.feature),
[page layout](../workflows/docx/page-layout.feature) and [tracked editing](../workflows/docx/tracked-workflow.feature).
In-memory getters and saved/reopened results remain separate obligations.
The [consumer mapping](../ledgers/consumers/go-document-api.json) records source
assertions and gaps. API-specific return values and heading conventions still
need semantic review before they can be common format contracts.

## In-memory document and text

A new document exposes a nonnil body and empty paragraph/table collections. Setter/getter examples compare paragraph text, style classification, alignment, spacing, direct flags and multiple-run concatenation. Selected run examples compare direct colours, bold/italic/strike, effects, underline styles, font names, highlights and opposite superscript/subscript flags on two different runs. Neither a setter nor a getter proves disk persistence unless the feature explicitly saves and reopens.

The table examples compare dimensions, cell access bounds, four assigned cell texts, row counts, span/merge properties, direct style, header flag, shading and selected cell properties. A border-presence assertion checks only that a top border object exists; it does not check its style, size or colour. Row insert/delete examples check counts and an out-of-bounds error, not the identity or contents of shifted rows.

## Saved and reopened documents

The formatting round trip reads at least three runs and checks bold, italic, colour, font size and font name on the first three. It permits additional runs and does not compare their text. The table round trip requires one table with nine specific cell texts, without inspecting its grid, merges or style.

Opening a file without an error or obtaining a nonnil body does not check its content. Those fixture smoke tests have no shared scenarios. Their helper also ignores `Close` errors.

## Direct font size

The [existing direct font-size contract](../workflows/docx/font-size.feature) requires 10.5 points to serialize as `w:sz` value 21 and survive reopening. The Go unit test reads only the in-memory `FontSize()` getter. It never checks serialized `w:sz`, a reopened run or the helper's `HalfPts` field.

The source mapping records unselected parameter rows and the limits of each assertion, including a symbol/page-break check that only requires nonempty paragraph text. Complete package preservation and rendered appearance need separate checks.
