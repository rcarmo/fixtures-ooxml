# Paired plain-run move resolution

The [move-enabled profile](../workflows/docx/revisions.feature) extends the explicit
run-property profile. ECMA-376 Part 1 §§17.13.5.22–.24 and .27–.28 describe inline
move wrappers and range markers. Annex A.1 `CT_MoveBookmark` requires qualified
ID, name, author and date on each range start. Wrapper author and ID are required;
wrapper date is optional. Source/destination names pair sides; each side has its
own start/end ID pair. The two range IDs are distinct in these samples.

The older text-only and text-and-run-properties profiles still refuse moves.
Only same-story direct-paragraph start/wrapper/end triples containing identical
plain text runs and direct properties are supported here. Other move forms,
paragraph-mark moves and general document comparison are outside this profile.

## Source and exact expected output

Start with the seven-story synthetic source from
[run-property snapshots](run-property-revisions.md): parts in order are body,
header1, footer1, nested `word/footer2.xml`, footnotes, endnotes and comments.
Text wrapper IDs remain 1 through 14. In each first paragraph, replace the prior
Stable run with current bold properties and a single saved italic property:
`<w:r><w:rPr><w:b/><w:rPrChange w:id="80" w:author="Reviewer"><w:rPr><w:i/></w:rPr></w:rPrChange></w:rPr><w:t>Stable</w:t></w:r>`.

Append the source triple, a plain run saying Middle, then the destination triple
in that paragraph. Each wrapper contains exactly these runs:

```xml
<w:r><w:rPr><w:b/><w:color w:val="112233"/></w:rPr><w:t xml:space="preserve">Moved </w:t></w:r><w:r><w:t>text</w:t></w:r>
```

Source markers are `moveFromRangeStart/End` with ID100 and wrapper `moveFrom`
ID101. Destination markers are `moveToRangeStart/End` with ID102 and wrapper
`moveTo` ID103. Both starts have `w:name="move-one"`. Both starts and wrappers
have `w:author="Reviewer"` and `w:date="2026-09-27T00:00:00Z"`; ends have only
qualified ID. These deterministic mutations construct test input, not an authoring
API. Save every prepared variant to a source path and reopen it before testing.

Inspection exposes five records per story: deletion, insertion, run-properties,
move-from, move-to. Check exact wrapper IDs, author/date and text. Property ID80
has author Reviewer, absent date, and text Stable. Move text is `Moved text`.
There are 35 records across all stories. Markers do not inflate receipt counts.

Accept removes the source triple entirely and replaces the destination triple
with its runs. Reject keeps source runs and removes destination content. Both
remove all four markers. Resolve text and property revisions as specified in the
previous contract. Build full expected XML from source spans/known transformations
without invoking the resolver under test. Compare saved/reopened XML and encoded
bytes, including all text, properties, marker removal, namespace lifts and prior
unrelated content. Other members and the source archive are byte-identical.
Repetition returns `{resolved:0,changedParts:[]}` with exact current archive bytes.

## Scope, refusal and required dates

For scope cases, change only footer2's source range name to `unpaired` before
source save. Resolve header1 only: receipt count five, only its part changed,
body's exact five records intact, explicit footer2 move findings, all unselected
members unchanged. The default-profile cases attempt both actions and require
`docx-revisions-unsupported` without a receipt or archive changes.

Later-header defects respectively remove its source end; remove destination;
add another destination of the same name with IDs104/105; reuse range ID100 on
both sides; reuse wrapper ID101; put a moveTo wrapper in a source range; nest the
whole destination triple inside source wrapper; append an unowned source wrapper
ID190; change destination text; change destination bold to italic; split the pair
across body/header by removing body's destination and header's source; insert
unowned text between source start and wrapper; nest insertion ID150 inside a
source run; use unsupported glow instead of bold; place source triple in pPr;
remove qualified author from source start; add colFirst to source start; or use
header text-revision ID3 for the source wrapper. All actions must refuse typed,
without partial edits. Inspection must identify the defective selected story.
For cross-story input, both body and header are defective and must be reported.

The date rows remove or unqualify the selected range start's date, separately for
source/destination and accept/reject. Required qualified dates cannot be inferred
from the wrapper or opposite side. Both missing and unqualified dates refuse
`docx-revisions-unsupported` before edits. Other malformed/calendar/date spellings
are native policy tests, not additional cases here.

## Namespace, encoding and order

Encoding cases affect the body only. Rename run/property/text prefixes inside
both move wrappers to q and declare the WordprocessingML URI as `xmlns:q` on each
wrapper. Accept/reject lifts that declaration onto each surviving run. Preserve
UTF-8 BOM or UTF-16LE/BE BOM with the matching XML declaration and exact encoded
output. Other members and source archive remain unchanged.

The ordering case adds pair move-two in the body: destination IDs202/203 in a new
paragraph, then source IDs200/201 in another paragraph. All other metadata and
run content match the first pair. Inspection must show body move wrapper order
101,103,203,201. Rejecting body resolves seven records, removes both destinations
and restores both sources without changing other story bytes.

## Faults and no-op guards

After source save, append an unrelated body paragraph saying Prior and remember
the resulting package. Inject a synchronous exception after header write or
during serialization. For post-write validation, reinsert both original move
triples into the resolved header. The hook must be reached and the result must
be `docx-revisions-validation`, with no successful receipt. All package bytes,
including Prior, roll back; the source retains its separately saved original bytes.

Guard cases resolve all revisions before source save, then add linked enforced
protection, an external settings relationship, or a wrong-root settings part.
Each same-state rejection must return `docx-revisions-protected` with no receipt
and no byte changes. An empty selection is outside these cases.

Independent Word rendering/resolution and arbitrary move/edit composition are not
tested. Catalogue registration alone grants no consumer execution or parity credit.
