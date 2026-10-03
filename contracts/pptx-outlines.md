# Direct outline decorations

Read direct line decorations with `Slide.getOutlineStyle(id)` and patch them
with `Slide.patchOutlineStyle(id, patch)`. Shared
[recipes](../ledgers/pptx-outlines.json) own two planned IDs and twenty-one cases
in the [workflow](../workflows/pptx/outlines.feature).

Accept an exact direct shape or connector with unique slide identity and one
existing direct `a:ln`. Do not invent inherited line styles. Cap enums are
`flat`, `rnd`, `sq`; compound enums are `sng`, `dbl`, `thickThin`, `thinThick`,
`tri`. Missing cap/compound read as flat/sng. Join is null (absent), round,
bevel or miter with explicit integer limit 0–1000000. Head/tail ends are null
(absent) or explicit type/width/length records. Types: none/triangle/stealth/
diamond/oval/arrow. Width and length: sm/med/lg. Existing absent end sizes read
med, and absent type reads none. Patches replace selected decoration records;
null removes a join/end, not unrelated line XML. Cap/compound require enums,
not null. Partial patch fields omitted retain original values.

Require bounded schema order: one fill choice, one dash choice, one join,
headEnd, tailEnd, terminal extLst. Refuse foreign lookalike decoration attributes,
unknown line grammar, duplicate joins/ends, invalid scalars and lexical barriers.
Unmodified fill/dash/extension subtrees are opaque and remain literal; this
operation does not resolve theme colours, change line width/alignment or
rewrite effects. Existing scalar quote/prefix/whitespace spellings survive when
updated. Empty/equivalent patches are exact no-ops with no version bump; return
`{changed:0|1}`. Getter objects are detached.

Only requested line attributes/decorations can change. Preserve all other line
attributes, colour transforms, dashes, shape fill/text/geometry, connector
attachment IDs/sites, style/theme references and every dependency payload.
Membership is exact and only slide XML changes. Save/reopen retains exact enum/
scalar records. Invalid request/topology errors map to `PPTX_OUTLINE_UNSUPPORTED`;
protection retains `PPTX_PROTECTED`. Accessors/unknown fields refuse and late
serialization errors roll back XML with versions intact. No routing, rendering,
inherited style resolution or cross-runtime execution credit is included.
DrawingML line joins/ends/caps/compound values follow ECMA-376 Part 1, 20.1.8.
