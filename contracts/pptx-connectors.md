# Straight attached rectangle connectors

Author one editable `p:cxnSp` through `Slide.addConnector(start, end, options)`.
Shared [recipes](../ledgers/pptx-connectors.json) own two planned IDs and fifteen
cases in the [workflow](../workflows/pptx/connectors.feature).
Each endpoint contains an exact `shapeId` and integer connection `site`.

## Endpoint profile

Accept distinct direct `p:sp` rectangle shapes with explicit unrotated/unflipped
DrawingML off/ext coordinates and `a:prstGeom prst="rect"` with empty adjustments.
Do not infer placeholders, inherited coordinates, custom paths, rotated/flipped
sites, pictures, groups or grouped children. Resolve IDs through unique slide
identities under an identity root group frame. Refuse missing, duplicate,
unsupported or same-ID endpoints. Positive extents and signed positions are
bounded to 32-bit integers; calculated sites and connector extents must also
stay bounded. Refuse noConnect shape locks and placeholders.

Rectangle sites follow DrawingML's ordered rect connection list:
0 top, 1 left, 2 bottom, 3 right. A centre coordinate uses floor(extent/2),
so odd dimensions leave at most half an EMU from the ideal centre. The literal
site records fix this bounded integer authoring rule. Zero width or height of
a straight connector is allowed, but coincident endpoints refuse.

## Authoring and custody

Append before any terminal shape-tree extension. Allocate max slide ID + 1.
Generate `p:nvCxnSpPr/p:cNvCxnSpPr` containing `a:stCxn` and `a:endCxn` with
exact endpoint IDs and site indices. Use `a:prstGeom prst="line"` and direct
transform offset=min endpoint coordinate, extents=absolute differences.
Use flipH/flipV when the endpoint direction decreases x/y, retaining endpoint
order. Optional name is XML-valid text; absent name is `Connector <id>`.
Optional line colour is uppercase six-digit RGB (default `000000`), and width
is 1–20116800 EMUs (default 12700). No arrows or automatic routing are included.
Return connector ID, slide part, detached endpoint coordinates/IDs/sites and
geometry including direction flips.

No asset or relationship is added. Exact membership and every existing member
payload except slide XML remain unchanged. Removing the new connector span
must recover complete original slide XML. Save/reopen retains exact style,
attachments and coordinates. Invalid request/topology errors map to
`PPTX_CONNECTOR_UNSUPPORTED`; protection and exhaustion remain
`PPTX_PROTECTED` and `PPTX_ID_EXHAUSTED`. Accessors/unknown fields refuse.
Late serialization failures roll back XML and preserve handle versions.
Grouping attached endpoints and deleting attached pictures continue to refuse
under earlier safety policies. Office rerouting behaviour and rendering remain
unverified. Connection-site, connector and preset vocabulary follows ECMA-376
Part 1 DrawingML presets and PresentationML connectors (sections 20.1.9, 19.3.1).
