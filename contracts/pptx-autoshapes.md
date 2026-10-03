# Bounded editable AutoShapes

Author one preset shape with `Slide.addAutoShape(preset, geometry, options)`.
The shared [recipe and preset policy](../ledgers/pptx-autoshapes.json) owns two
planned IDs and eighteen cases in the [workflow](../workflows/pptx/autoshapes.feature).

Presets are `rect`, `ellipse`, `triangle`, `diamond` and `roundRect`. The first
four accept no adjustments. Round rectangles accept integer `adj` in [0,50000],
with explicit default 16667. Author a DrawingML `gd name="adj" fmla="val N"`
under `avLst`; no arbitrary formula or guide name is accepted. Bounds are this
bounded authoring profile; the runtime does not evaluate every preset's guide
formula or certify its rendering. Preserve preset semantics as editable geometry.

Geometry uses explicit nonnegative integer x/y and positive width/height through
2147483647, matching native text-box authoring. Options are plain data with
optional name, text, adjustments, fill, lineColor and lineWidth. Unknown fields,
accessors, invalid XML strings or adjustment values refuse. Text is XML-valid
with at most 4096 source characters, normalising CR/CRLF to LF. Missing text
creates an empty editable paragraph. Default name is `AutoShape <allocatedId>`.
Defaults: fill `F2F2F2`, outline `336699`, width 12700. Colours are uppercase
six-digit RGB or `none`; width is an integer in [0,20116800].

Append one direct `p:sp` before terminal extensions, with unique max ID + 1,
explicit transform, requested preset/adjustments, native text body and direct
style. No assets or relationships are added. Removing the new shape must recover
complete original slide XML. Only slide XML can change, membership is exact,
and every other payload remains literal. Save/reopen retains exact adjustments,
text, placement and style; targeted native text/style APIs remain usable.
Return shape ID, owning slide part, preset, detached geometry and adjustments.

Invalid requests/topology map to `PPTX_AUTOSHAPE_UNSUPPORTED`; protection and
ID exhaustion retain `PPTX_PROTECTED` and `PPTX_ID_EXHAUSTED`. Late serialization
failures roll back shape XML and retain handle versions. No inherited geometry,
connector-site inference for new presets, rotations, groups or rendering is
included. Preset/guide vocabulary follows ECMA-376 Part 1 DrawingML preset
geometry (20.1.9).
