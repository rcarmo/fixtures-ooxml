# Bounded picture crop editing

Read and set one exact picture's direct source crop rectangle. Shared
[recipes](../ledgers/pptx-picture-crop.json) supply two planned IDs and seventeen
cases owned by the [workflow](../workflows/pptx/picture-crop.feature). Native
bindings use `getPictureCrop(id)` and `setPictureCrop(id, rectangle)`.

Crop is four explicit integer sides (`left`, `top`, `right`, `bottom`) in
DrawingML percentage units: 100000 is the full image. The bounded editing
profile accepts each side from 0 through 99999, with left+right and top+bottom
strictly below 100000. Missing source sides read as zero; a missing rectangle
reads as four zeros. Negative retained source crops remain inspectable under
item 1 but refuse bounded crop editing. Unknown fields, foreign-namespace
lookalike attributes, mixed-content crop nodes and duplicate/misordered source
rectangles refuse. A missing/nonpicture ID maps to `PPTX_PICTURE_NOT_FOUND`;
ambiguity retains `PPTX_PICTURE_INVALID`; bounded request/topology errors use
`PPTX_PICTURE_UNSUPPORTED`. Protection uses `PPTX_PROTECTED`.

A setter replaces all four sides, not a partial patch. Preserve attribute prefix,
quotes and lexical spacing for existing values; missing sides may be appended.
Create a absent nonzero `a:srcRect` between the blip and stretch/tile fill policy
with its own DrawingML namespace binding. Existing zero resets keep the node;
absent zero resets and equal-value requests are exact no-ops. Return `{changed}`
with 0 or 1. A no-op does not bump the slide handle version. Returned crop values
are detached. Root/grouped, embedded and linked pictures share this metadata
operation; linked targets are never fetched.

Only the selected source-rectangle span may change. Picture identity, description,
direct placement, group ancestry, effects, XML outside that span, every
relationship and all media payloads remain literal. Membership is exact and
only the slide can change. Save/reopen retains the exact values; late
serialization failures roll back XML and leave the handle version usable.
This profile includes no pixel decoding, rendering or inherited geometry.
ECMA-376 Part 1 DrawingML source rectangles (20.1.8) supply the vocabulary;
nonnegative bounded editing is the explicit authoring profile, not a claim
that negative source cropping is invalid OOXML.
