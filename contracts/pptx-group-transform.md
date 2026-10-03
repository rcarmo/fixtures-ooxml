# Group coordinate frames and point mapping

Read and patch exact group transforms through `Slide.getGroupTransform(id)` and
`Slide.patchGroupTransform(id, patch)`. Pure native helpers map/unmap one group
or an outer-to-inner group chain. Shared
[recipes](../ledgers/pptx-group-transform.json) own three planned IDs and twenty-one
cases, including six literal independent mapping vectors, in the
[workflow](../workflows/pptx/group-transform.feature).

## Bounded direct transform

Require one `p:grpSp` beneath the slide shape tree or another group, with unique
slide identities and one direct `a:xfrm` in `p:grpSpPr`. Transform has ordered
`off`, `ext`, `chOff`, `chExt` children with ordinary unqualified attributes and
no unknown content or lexical barriers. Coordinates are signed 32-bit integers;
parent and child extents are positive integers through 2147483647. Rotation is
an integer angle in [0,21599999], 60000 units per degree; flips are booleans.
The partial patch permits x/y/width/height, childX/childY/childWidth/childHeight,
rotation/flipH/flipV. Accessors, unknown fields and null/undefined values refuse.
Validate the final frame, even for empty patches. Duplicate, malformed, missing
or unsupported groups refuse with `PPTX_GROUP_UNSUPPORTED`; protection remains
`PPTX_PROTECTED`. No missing frame is invented.

Only the selected transform span may change. Preserve existing lexical prefixes,
quotes and whitespace for scalar changes; do not rewrite children, crop, effects,
identity, group ancestry, relationship parts or media. Equal-value/empty patches
are exact no-ops with `{changed:0}` and no version bump. Changed patches return
`{changed:1}`. Readback returns detached frame values. Membership is exact and
only the slide may change. Save/reopen retains all direct values; late failure
rolls back XML and keeps versions usable.

## Forward and inverse mapping

Scale/translate a child point into the parent rectangle:
`qx = x + (px-childX)*width/childWidth`, with the analogous y expression.
Reflect q about the parent rectangle centre for flipH/flipV. Then rotate clockwise
in the slide's downward-y coordinate system about that centre:
`(dx,dy) -> (cos*dx-sin*dy, sin*dx+cos*dy)`. Quarter turns use exact constants.
The inverse undoes rotation, flips, then scale/translation. For an outer-to-inner
chain, forward mapping applies innermost first; inverse applies outermost first.
No child-level rotation is implicitly composed; callers supply the desired
point and explicit chain. Chain bounds are 1–16 frames. Input point coordinates
must be finite and within +/-2147483647, and intermediates/results must stay
within that finite bound; extreme/singular mappings refuse instead of emitting
infinite or unbounded points.

Numerical mapping results use absolute tolerance 0.00001 EMUs plus relative
1e-12 per coordinate. Direct serialized frame values remain exact integers.
These tolerances bound binary floating-point scale/trigonometric rounding far
below one serialized EMU; native tests must measure forward and inverse error
distributions against independent references before closure. No render, raster
or byte-hash equivalence gate applies to coordinate results. Affine scaling
and rotation may compose to non-orthogonal transforms; only points are mapped,
not inferred bounding rectangles. DrawingML group transforms follow ECMA-376
Part 1 (20.1.9).
