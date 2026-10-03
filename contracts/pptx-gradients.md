# Exact linear gradient fills

Read/write one direct shape fill through `Slide.getLinearGradient(id)` and
`Slide.setLinearGradient(id, gradient)`. Shared
[recipes](../ledgers/pptx-gradients.json) own two planned IDs and eighteen cases
in the [workflow](../workflows/pptx/gradients.feature).

Gradient data has angle (DrawingML 60000 units per degree, integer 0–21599999),
explicit boolean scaled, and 2–16 strictly ascending stops. Stop positions are
integers 0–100000 with exact first/last positions 0/100000. Each colour contains
kind `srgb` or `scheme`, value, and an optional ordered transform list. RGB is
uppercase six-digit hex. Theme tokens are dk1/lt1/dk2/lt2/accent1–6/hlink/folHlink/
bg1/tx1/bg2/tx2/phClr. Keep theme tokens as references; never replace them with
guessed resolved RGB. Ordered transforms are unique tint/shade/lumMod/lumOff/
alpha elements with integer values 0–100000, at most five per colour. Unknown
fields, accessors, null scalars, duplicate stops/transforms and unsupported colour
classes refuse. Readback includes explicit empty transform lists.

Select an exact direct `p:sp` with unique slide identity and one `p:spPr`.
Support absent/noFill/solidFill and bounded existing linear gradients; reject
multiple fills, path gradients, pictures, inherited/group fills or lexical
barriers. Existing solid colour references/transforms can be explicitly replaced,
but no style/theme/outline/text XML is touched. Gradient replaces the complete
selected fill span, with own DrawingML binding, `rotWithShape=1`, ordered gsLst
and one lin ang/scaled. Existing same-value gradients are exact no-ops, preserving
prefixes, quote styles and boolean spellings. Absent/non-gradient readback is null;
unsupported existing gradient grammar refuses rather than silently returning null.
Readback objects are detached.

Only selected direct fill XML may change. Insert absent fill before outline/
effects/extensions using schema order. All geometry, style references, theme
parts, outline colour transforms, text, relationships and media remain literal.
Membership is exact and only slide XML changes. Save/reopen retains exact stop
and transform order, angle, references and numeric values. Invalid request/
topology errors use `PPTX_GRADIENT_UNSUPPORTED`; protection retains
`PPTX_PROTECTED`. No-op leaves versions unchanged; successful mutation bumps once.
Late serialization failures roll back XML and retain handles.

No gradient raster evaluation, theme colour resolution or rendering certification
is included. Direct values are exact integer/enum contracts, not generated-signal
hash comparisons. Linear gradients/colour transforms follow ECMA-376 Part 1
DrawingML (sections 20.1.8 and 20.1.2).
