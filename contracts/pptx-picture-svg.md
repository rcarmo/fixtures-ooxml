# Passive SVG pictures with raster fallback

Insert an SVG byte payload and a caller-supplied PNG/JPEG fallback through
`Slide.addSvgPicture(svgBytes, fallbackBytes, geometry, options)`. Shared
[recipes](../ledgers/pptx-picture-svg.json) define two planned IDs and eleven
cases owned by the [workflow](../workflows/pptx/picture-svg.feature). SVG literals
are shared recipe inputs, not regenerated fixture archives. Raster members
come from the sealed manifest-addressed image presentation.

## Bounded SVG input

Accept nonempty UTF-8 SVG bytes up to 1 MiB. Parse with existing bounded XML
admission; root must be SVG in `http://www.w3.org/2000/svg`. Allow only passive
`svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `path`,
`title` and `desc` elements in that namespace. Attributes are limited to plain
geometry/presentation fields: width, height, viewBox, preserveAspectRatio,
x/y/x1/y1/x2/y2/cx/cy/r/rx/ry, points, d, fill, stroke, stroke-width, opacity,
fill-opacity, stroke-opacity, fill-rule, stroke-linecap, stroke-linejoin and
transform. Fill/stroke values accept plain alphabetic colour names, hexadecimal
colours or `none`; CSS functions and escaped paint syntax refuse.
Namespace declarations and xml:space are permitted. Do not interpret
or certify path data or rasterise the vector. Unknown/foreign attributes,
scripts, events, styles, hrefs, paint URLs, processing instructions, DOCTYPE
and external references refuse with `PPTX_PICTURE_UNSUPPORTED`. This allowlist
is an authoring profile; it does not accept every valid SVG.

Validate/copy fallback using ordinary insertion bounds and explicit PNG/JPEG
MIME/signature policy. Geometry, name and description follow insertion. No
fetching, pixel decoding, image conversion, fallback generation or inferred
DPI/aspect ratio is included. No rendering-equivalence or fallback similarity
claim is made.

## Pair and custody

Allocate fresh SVG and raster media parts and two ordinary internal image
relationships. The picture's `a:blip r:embed` references raster fallback. Within
that blip, create one `a:extLst/a:ext` with URI
`{96DAC541-7B7A-43D3-8B79-37D633B846F1}` and a namespaced SVG `svgBlip` element
in `http://schemas.microsoft.com/office/drawing/2016/SVG/main`, embedding the
vector relationship. Set `image/svg+xml` and the explicit fallback MIME.
Return ordinary fallback receipt fields plus `svgMediaPart` and
`svgRelationshipId`. Shape identity and geometry apply to the complete pair.

Store both source payloads without rewriting. Copy caller arrays before storing.
One transaction owns both media members, relationships, content types and slide
XML; a late failure rolls back the entire pair and leaves versions unchanged.
Membership adds exactly two media parts. Only slide XML, its relationships and
content types may change; all previous media, shapes and relationship elements
remain literal. Save/reopen retains exact payloads and both relationship edges.
Existing ordinary picture inspection reports raster metadata; the paired edge
is independently verified by native bindings. Pair-aware inspection is outside
item 1's closed bounded record shape. Ordinary replacement refuses paired
assets, as established in item 3.

SVG extension vocabulary follows Microsoft's DrawingML SVG extension schema;
ordinary picture/blip vocabulary follows ECMA-376 Part 1 (19.3.1.37, 20.1.8).
Application rendering compatibility remains unverified.
