# Read-only SmartArt dependency inspection

Expose `Slide.inspectSmartArt()` as a detached inventory of SmartArt graphic
frames, four role roots, transitive package dependencies, drawing parts and
editing limits. Shared [recipes](../ledgers/pptx-smartart-inspection.json) own
two planned IDs and twelve cases in the
[workflow](../workflows/pptx/smartart-inspection.feature).

The 29 sealed PPTX fixtures currently contain no diagram parts. Positive inputs
are explicit shared literal member recipes layered in memory on a sealed
presentation. These verify package/XML dependency behaviour only. No Office
produced SmartArt, layout validity, rendering or interoperability certification
is available. Keep physical fixtures, seals and provenance unchanged.

## Roles and graph

Select direct graphic frames beneath shape trees or groups where `a:graphicData`
URI is `http://schemas.openxmlformats.org/drawingml/2006/diagram`. Require one
`dgm:relIds` with exact expanded-name relationship attributes dm, lo, qs and cs.
Resolve each internal relationship by ID, exact relationship type, content type
and XML root namespace/name. Roles in order: data/dataModel, layout/layoutDef,
style/styleDef, colors/colorsDef. Style uses relationship `diagramQuickStyle`
and MIME `diagramStyle+xml`; do not conflate those suffixes. Duplicate/invalid
slide identities, misplaced role leaves, foreign attribute lookalikes,
cardinality errors and mismatched roots/types refuse the entire report with
`PPTX_SMARTART_UNSUPPORTED`. Package/XML admission categories remain unchanged.

Traverse each internal target once, including optional diagramDrawing edges,
image dependencies and cycles. Return all target parts (lexically sorted),
content types, byte lengths and edges (owner then relationship-ID sorted).
An edge contains owner, ID, exact type/target, external flag and resolved part
or null for external targets. External URI/file targets remain data; never fetch
or open them. Required role roots must be internal. Validate diagramDrawing
MIME/root; report resolved drawing parts in lexical order. Bounded limits are
256 dependency parts, 1024 edges and depth-free iterative graph traversal.
If dataModelExt drawing metadata exists, require a unique exact diagramDrawing
relationship binding rather than silently accepting a stale relId.

## Output and custody

Records contain shape ID/name/slide part; ordered root asset records; dependency
parts and edges; drawingParts; limits with dataEditing, layoutEvaluation,
styleEvaluation and drawingRegeneration all false and a literal explanation.
No graph presence grants editor capability. Return no live XML/payload objects.
Mutating output cannot change later reads or package state.

Inspection does not set/delete parts or dirty slide versions. Save/reopen
retains exact records, membership and every member payload. Unknown dependency
parts are inventory entries, not interpreted or certified content. XML diagrams
use ECMA-376 Part 1 DrawingML diagram vocabulary; diagramDrawing/dataModelExt
are Microsoft extensions. Cross-runtime execution and SmartArt copy/editing
are separate work items.
