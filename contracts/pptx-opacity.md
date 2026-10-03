# Shape-fill opacity and picture transparency

Provide distinct get/set methods for shape-fill opacity and picture transparency.
Shared [recipes](../ledgers/pptx-opacity.json) own three planned IDs and twenty-four
cases in the [workflow](../workflows/pptx/opacity.feature).

`getShapeOpacity(id)` / `setShapeOpacity(id, value)` operate on one direct shape's
solid RGB or scheme colour. Opacity is integer 0–100000: zero transparent,
100000 opaque. The value is a direct colour `a:alpha val`, not whole-shape,
outline, text or inherited opacity. Absent alpha reads 100000; setting equivalent
opacity is an exact no-op. Preserve every other colour transform and their order,
colour reference, outline, theme/style/text/geometry XML. Update only alpha's
value with lexical spelling preserved, or append a locally bound alpha to its
colour. Non-solid fills, duplicate fills/alpha, competing alphaMod/alphaOff,
foreign attributes and unsupported colour classes refuse.

`getPictureTransparency(id)` / `setPictureTransparency(id, value)` use integer
0–100000 transparency: zero opaque, 100000 transparent. The corresponding direct
`a:alphaModFix amt` is exactly 100000 minus transparency. Missing modulation
reads zero transparency. Preserve original pixel bytes, relationship attributes,
crop, geometry, group ancestry, unrelated blip effects and extensions. Update
only amt or insert one effect in DrawingML order before extLst. Embedded/linked
pictures share the metadata policy; never fetch. Duplicate/competing alpha
effects or unknown effect grammar refuse rather than multiply guessed opacity.
This reports/modifies only the fixed alpha multiplier; source pixel alpha is
neither decoded nor combined into an effective opacity claim.

Getters validate the bounded grammar and return direct scalar values. Setters
return `{changed:0|1}`; no-op leaves XML/versions unchanged. All request values
are explicit integers. Only selected alpha/effect may change; membership is
exact, only slide XML changes, and every other member/relationship payload stays
literal. Save/reopen retains the exact scalar. Late serialization errors roll
back XML and preserve versions. Invalid ID/value/topology errors map to
`PPTX_OPACITY_UNSUPPORTED`; protection retains `PPTX_PROTECTED`. Existing picture
inspection ambiguities may keep their category. No gradient opacity, effective
inherited opacity, pixel processing or rendering certification is included.
DrawingML colour alpha and blip effects follow ECMA-376 Part 1, 20.1.2/20.1.8.
