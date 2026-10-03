# Bounded editable freeform geometry

Author a direct custom-geometry shape through
`Slide.addFreeform(geometry, path, options)`. Shared
[recipes](../ledgers/pptx-freeform.json) own two planned IDs and fifteen cases
in the [workflow](../workflows/pptx/freeform.feature).

Path has explicit positive integer width/height through 2147483647 and an
ordered array of 2–256 commands. Commands are plain `{op:'move',x,y}`,
`{op:'line',x,y}` or `{op:'close'}` data. Points are integers inside inclusive
[0,width] / [0,height]. Every subpath starts with move and contains at least one
line; close requires at least two lines and at least three distinct vertices.
A line cannot follow close without a new move. Consecutive identical vertices
refuse. Filled paths require every subpath closed; open subpaths require
`fill:'none'`, including the default. Multiple subpaths are supported in one
DrawingML path. Self-intersection, winding and visual quality are not certified.
Unknown commands/fields, accessors, curves, formulas and out-of-bounds points
refuse with `PPTX_FREEFORM_UNSUPPORTED`.

Geometry follows native nonnegative slide-space integer position and positive
extent bounds. Options are optional plain name/fill/lineColor/lineWidth data.
Default name is `Freeform <allocatedId>`, fill `none`, outline `336699` and
width 12700. RGB/none and width bounds match AutoShape style. No text or preset
adjustments are accepted. Allocate max slide ID + 1 and append before terminal
extensions. Shape is a real `p:sp` with `a:custGeom`: empty avLst/gdLst/ahLst/
cxnLst, text rectangle l/t/r/b, and a single path with explicit local w/h,
fill mode and ordered moveTo/lnTo/close children. No raster asset is generated.

Only new shape XML is added; removing it recovers complete original slide XML.
Membership is exact and every other member payload/relationship remains literal.
Return ID, slide part, detached transform and command records. Save/reopen keeps
exact commands and style. Protection/exhaustion retain `PPTX_PROTECTED` /
`PPTX_ID_EXHAUSTED`. Late serialization failures roll back XML and preserve
versions. Curves, path evaluation, automatic bounds, inherited geometry and
rendering are outside this slice. DrawingML custom geometry/path vocabulary
follows ECMA-376 Part 1 (20.1.9).
