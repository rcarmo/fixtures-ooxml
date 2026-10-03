# Deterministic editable diagrams

Author a bounded graph through `Slide.addDiagram(nodes, edges, options)`. Shared
[recipes](../ledgers/pptx-diagrams.json) own two planned IDs and fourteen cases
in the [workflow](../workflows/pptx/diagrams.feature).

Nodes are an ordered list of 1–32 unique keys and text labels. Keys are
nonempty strings up to 64 characters; labels are XML-valid strings up to 4096
characters. Edges are an ordered list of at most 64 `{from,to}` key pairs.
Endpoints must exist and differ. Duplicate directed pairs refuse; cycles and
reverse edges are allowed because layout follows input order without graph
ranking. All input records are plain data and accessors/unknown fields refuse.

Options require nonnegative bounded integer x/y, positive nodeWidth/nodeHeight,
nonnegative gap and direction `row` or `column`. Nodes are placed in input order
at `x+i*(nodeWidth+gap),y` for row, or `x,y+i*(nodeHeight+gap)` for column.
Every complete node rectangle must stay within [0,2147483647] EMUs.
Allocate nodes then connectors using max slide ID + 1. Node names are
`Diagram node <key>` and connectors are `Diagram edge <from> -> <to>`.
Return slide part, detached key/shape-ID/geometry node records and detached edge
records containing from/to, connector ID and exact start/end shape IDs/sites.

Each node is a direct editable rectangle with a native text body, no autofit,
fill `F2F2F2`, line `336699` of width 12700. Newline normalisation follows text-box
authoring. Each edge is a straight attached connector with the same line style,
row sites right=3 to left=1, column sites bottom=2 to top=0. Append nodes then
edges before any terminal extension list. Routing, edge labels, arrowheads,
overlap/crossing optimisation, grouping and SmartArt authoring are excluded.
Native text and style APIs must remain usable on the generated nodes.

Compute and validate the full result before one package transaction. Only slide
XML changes, membership is exact, and removing generated spans recovers complete
original XML. No assets/relationships are added. Save/reopen retains literal
placements, text, styles and attachment metadata. Invalid requests/graphs map
to `PPTX_DIAGRAM_UNSUPPORTED`; protection/exhaustion retain `PPTX_PROTECTED`
and `PPTX_ID_EXHAUSTED`. Serialization failure rolls back all generated nodes
and edges and leaves handle versions unchanged; success bumps the slide version
once, not once per graph element. Input planning/layout confers no rendering
or diagram-quality certification.
