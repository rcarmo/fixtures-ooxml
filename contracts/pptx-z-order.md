# Graphical sibling ordering

Read direct graphical IDs with `Slide.getShapeOrder(groupId?)` and reorder
selected sibling IDs with `Slide.reorderShapes(order, groupId?)`. Shared
[recipes](../ledgers/pptx-z-order.json) own two planned IDs and fifteen cases
in the [workflow](../workflows/pptx/z-order.feature).

Omitted parent means the root shape tree. An explicit exact group ID selects
that group's direct children. Admit sp, pic, grpSp, graphicFrame and cxnSp
sibling nodes, including opaque payloads kept as complete spans. Each node has
one expected nonvisual owner and unique positive slide ID. Parent must have
leading nvGrpSpPr/grpSpPr, supported graphical siblings and at most one terminal
extLst. Namespace/misordering ambiguity, invalid IDs and non-whitespace lexical
barriers between children refuse. Do not cross parents, create/remove shapes,
change grouping or rewrite child metadata. Root coordinate transforms are not
interpreted because sibling span reordering does not change coordinates.

Order is a plain array of 0–1000 unique existing direct IDs. It names a selected
subset, not necessarily every sibling. Sort that selection's occupied slots in
original parent order, then replace those complete spans with nodes in requested
order. Unselected nodes stay in the same slots; metadata/whitespace gaps and
terminal extensions stay literal. Empty, singleton and already-ordered selections
are exact no-ops returning `{changed:0}` with no version bump. Changed order
returns `{changed:1}`. This API does not implicitly move a subset to front/back;
callers include every crossed sibling ID when they want that operation.

Only complete original graphical XML spans are permuted. Membership is exact
and only slide XML changes; all other package payloads and relationships stay
literal. Save/reopen retains order and dependency identity. Accessor arrays,
unknown properties, duplicate/missing/cross-parent/metadata IDs refuse with
`PPTX_Z_ORDER_UNSUPPORTED`; protection remains `PPTX_PROTECTED`. Late failures
roll back XML and retain versions. No render/overlap judgement or dependency
rewriting is performed. PresentationML shape-tree child order supplies z-order
vocabulary (ECMA-376 Part 1, 19.3.1).
