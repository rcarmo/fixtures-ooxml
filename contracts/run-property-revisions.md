# Direct-run property revision snapshots

The [explicit profile](../workflows/docx/revisions.feature) resolves plain text
revisions and `w:r/w:rPr/w:rPrChange` together. ECMA-376 Part 1 §17.13.5.31 and
Annex A.1 define the complete previous property set in the child `w:rPr`. Accept
removes only the change node. Reject replaces the complete current `rPr` with
that saved set, including an empty saved set. Paragraph-mark changes (§17.13.5.30),
moves, section and table revisions are excluded. The older text-only cases retain
their refusal policy and exact predicates.

## Deterministic source

Extend the existing synthetic `all-stories` revision input in the same feature.
It has these seven reachable story parts in inspection and receipt order:

| Part | Original text | Current text | Deletion / insertion IDs |
|---|---|---|---|
| word/document.xml | Body historic. | Body modernized. | 1 / 2 |
| word/header1.xml | Header historic. | Header modernized. | 3 / 4 |
| word/footer1.xml | Footer historic. | Footer modernized. | 5 / 6 |
| word/footer2.xml | Nested footer historic. | Nested footer modernized. | 7 / 8 |
| word/footnotes.xml | Footnote historic. | Footnote modernized. | 9 / 10 |
| word/endnotes.xml | Endnote historic. | Endnote modernized. | 11 / 12 |
| word/comments.xml | Comment historic. | Comment modernized. | 13 / 14 |

The nested footer is linked from header1. Its text revision wrappers declare the
w14 namespace and their runs contain a `w14:glow` property; surviving runs retain
that declaration after unwrapping. Text revisions use author A and date
`2026-06-01T09:30:00Z`. In each first revision paragraph, append a plain run with
text `Stable`, current properties `<w:b/><w:color w:val="112233"/>`, and a final
`w:rPrChange` with ID80, author Editor, date `2026-09-27T00:00:00Z`, containing
`<w:rPr><w:i/><w:color w:val="445566"/></w:rPr>`.

This is test construction, not an authoring API. Save each prepared variant to a
source path and reopen before testing. Keep the source archive unchanged. The
result path must be different. Each story now has deletion, insertion and
run-properties records in that order, including exact metadata and text. There
are 21 records. Before resolution, inspection leaves the current archive intact.

Expected XML is the input text with precisely the chosen wrappers removed or
unwrapped and the chosen property snapshot removed or restored. Rejection turns
surviving `delText` names into `t`. Namespace declarations on removed wrappers
are transferred to surviving children. Compare the complete output XML and every
other member's bytes. Expected content must not be produced by invoking the
resolver under test. Inspect saved/reopened output for zero revisions/findings;
repeat resolution returns zero and retains exact current archive bytes.

## Selected scope and refusal

For selected-header cases, replace the body's *old* `w:i` with `w:unknown` before
saving the source. Resolve only header1. Its three revisions disappear; unchanged
unselected content exposes 17 supported records plus one unsupported body finding
(the 18 remaining revision records). Inspection must not silently omit that finding.
Every unselected member is byte-identical; the original source is unchanged.

Header refusal variants respectively remove the saved rPr, add a second saved
rPr, duplicate the change with ID81, nest a change inside the saved rPr, put the
change beside the run's rPr, replace Stable's text with a drawing, use an unknown
property, duplicate the old italic property, decorate it with an unqualified
attribute, set its Boolean to `maybe`, use ID3 already present in header1, put
colour before italic, add unowned text inside saved rPr, remove qualified author,
replace italic with a foreign-namespace property, or wrap the entire Stable run
in insertion ID90. Both actions must return `docx-revisions-unsupported` with no
receipt, identify the header during inspection, and preserve exact archive bytes.
All selected stories preflight before any mutation.

## Namespace, encoding and empty snapshots

Encoding variants replace the body's current rPr with a version declaring
`xmlns:z` for WordprocessingML. Its change declares `xmlns:q` for the same URI;
the saved element is `<q:rPr><q:i/><z:color z:val='445566'/></q:rPr>`. Rejection
must retain this spelling and add both inherited declarations to the saved root,
with no lost property or namespace meaning. Save/reopen must preserve UTF-8 BOM,
UTF-16LE BOM or UTF-16BE BOM as selected, with all other members unchanged.

The empty prior-set variant uses `<w:rPr/>`. The shadowed-alias variant puts
`xmlns:q="urn:outer"` on the change but `xmlns:q` for WordprocessingML on the
saved `<w:rPr>` containing `<q:i/>`. Rejection keeps only the old italic property
and the saved declaration. No bold/colour from the current set may survive.

## Transaction and guard checks

Fault cases first append a `Prior edit` paragraph to the body *after* source save,
then remember the resulting archive. Inject synchronous failure after writing
header1, during serialization, or by reinserting the property-change snapshot into
header1 immediately after its rejected write. The latter must trigger
`docx-revisions-validation`. Every hook must be reached; no successful receipt is
returned, and all current bytes including the prior edit are restored. The saved
source retains its earlier bytes.

Guard cases start with all revisions resolved. Add linked enforced protection,
an external settings relationship, a linked wrong-root settings XML, or request
an unknown profile. The first three return `docx-revisions-protected`; the last
returns `docx-revisions-invalid-profile`. No-op eligibility does not bypass these
checks. An explicitly empty selection and invalid XML syntax are outside these
cases. Independent Word UI/rendering and full multistory revision parity remain
untested by this profile; catalogue registration grants no execution credit.
