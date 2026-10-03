# Explicit picture fit policies

Insert one PNG/JPEG using `contain`, `cover` or `stretch`, a caller-provided
EMU box and positive integer intrinsic width/height. Shared
[recipes](../ledgers/pptx-picture-placement.json) provide three planned IDs and
sixteen cases owned by the [workflow](../workflows/pptx/picture-placement.feature).
Intrinsic dimensions describe the caller's aspect ratio; no pixel decode, DPI
inference or image-dimension certification occurs. Dimensions are bounded to
2147483647. Box/request/payload bounds follow [insertion](pptx-picture-insertion.md).

## Geometry and rounding

- `stretch`: use the exact box and zero crop. Aspect changes are intentional.
- `contain`: compare exact cross-products to choose the limiting axis. Keep that
  extent equal to the box; floor the other scaled extent using integer rational
  arithmetic. Centre using floor(remaining space / 2), giving an odd residual
  EMU to the right or bottom. Refuse if the derived extent is below one EMU or a
  derived coordinate exceeds signed 32-bit bounds. The floor has less than one
  EMU error from ideal scaling; centring is asymmetric by at most one EMU.
- `cover`: keep the exact box. Crop the overwide or overtall source symmetrically.
  Each side is half the discarded fraction in DrawingML percentage units
  (100000 = full source), rounded to nearest integer with ties upward using
  exact rational arithmetic. Refuse a rounded crop with no visible source region.
  Each side has at most 0.5 percentage-unit rounding error, so the visible
  fraction has at most one unit error. This bounds small aspect distortion from
  serialized crop; no raster-quality assertion is made.

Equal aspect ratios produce the exact box and zero crop for every policy.
Cross-products must not use floating-point arithmetic that loses integer
precision near bounds. The large-rational and fractional records independently
fix rounding behaviour; tolerance does not replace the exact integer contract.

## Persistence and custody

Expose a fitted-insertion method and a pure placement calculator in native API
bindings. The receipt includes normal insertion identity/assets and detached
calculated geometry/crop. Optional name/description behave as in insertion.
A single transaction authors picture placement, optional source crop, media,
relationship and content type. Save/reopen returns the exact calculated values.
All original shape XML, relationships and unrelated member payloads remain
unchanged. Invalid policies, dimensions, rounded extents and coordinates refuse
with `PPTX_PICTURE_UNSUPPORTED`; native accessors/unknown fields are refused.
Protection, stale-handle and graph/serialization errors retain insertion policy.

The PNG source is a manifest-addressed media member; no copied/generated
fixture or local expected-value catalogue is required. These placement tests
certify no rendering. Generic crop editing remains a separate operation.
DrawingML source rectangles and transforms follow ECMA-376 Part 1, sections
20.1.8 and 20.1.9.
