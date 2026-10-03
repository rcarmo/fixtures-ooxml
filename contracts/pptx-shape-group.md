# Editable shape grouping

Create an editable `p:grpSp` around a contiguous direct slide selection through
`Slide.groupShapes(shapeIds, geometry, options)`. Shared
[recipes](../ledgers/pptx-shape-group.json) define two planned IDs and sixteen
cases owned by the [workflow](../workflows/pptx/shape-group.feature).

Select 2–100 unique exact shape IDs. Accept direct `p:sp` and `p:pic` children
only; input ID order does not reorder children. Selection must occupy adjacent
shape-tree child positions, so replacing the range with one group preserves
relative graphical order with every unselected node. Missing IDs, duplicates,
noncontiguous selection, grouped descendants, graphic frames/connectors,
placeholders and picture/shape `noGrp` locks refuse. Other locks remain literal
because identity mapping preserves child geometry. Existing attached connector
endpoints refuse grouping rather than silently changing cross-group attachment
semantics. Unsupported lexical shape-tree barriers and nonidentity root
coordinate systems refuse under the existing append preflight policy.

Require explicit group geometry with signed 32-bit x/y and positive width/height
at most 2147483647. Set parent `off/ext` and child `chOff/chExt` to exactly the
same rectangle, with no rotation/flips. The group maps child coordinates through
identity: existing child XML can remain literal, without guessing bounds or
composing rotations. Geometry is the caller's group transform rectangle, not
an automatically inferred visual bounding box. Optional plain `name` is
XML-valid nonempty text; absent name is `Group <allocatedId>`.

Allocate max slide identity + 1; retain every existing ID. Return group ID,
slide part, child IDs in source order and detached geometry. The new group
occupies the selected range's original slot and contains the complete original
child slice, including inter-child whitespace. No copied asset or new member is
created. Preserve namespace bindings inherited by selected children: choose
wrapper prefixes not bound by the original root and do not shadow child prefixes.
Every unselected node, relationship and media payload remains unchanged. Only
slide XML may change and membership is exact. Save/reopen retains editable
children and picture ancestry with identity coordinates.

Invalid selection/request/topology errors map to `PPTX_GROUP_UNSUPPORTED`;
protection and identity exhaustion retain `PPTX_PROTECTED` and
`PPTX_ID_EXHAUSTED`. Accessors and unknown options refuse. Late serialization
errors roll back XML and retain handle versions. Existing runtime text/shape
APIs and their grouped-edit limitations remain unchanged. Scaling, coordinate
mapping, ungrouping and nested authoring are outside this slice. Group vocabulary
follows ECMA-376 Part 1 PresentationML grouping and DrawingML group transforms
(sections 19.3.1 and 20.1.9).
