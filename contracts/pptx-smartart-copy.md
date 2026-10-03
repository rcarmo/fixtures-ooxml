# Bounded SmartArt graph copying

Copy a source slide's exact SmartArt frame into a destination slide through
`destination.copySmartArtFrom(sourceSlide, frameId)`. Shared
[recipes](../ledgers/pptx-smartart-copy.json) own two planned IDs and eight cases
in the [workflow](../workflows/pptx/smartart-copy.feature). As in inspection,
positive inputs are shared literal graph recipes; no Office-produced SmartArt
fixture or rendering certification is available.

## Admitted closure

Require an inspected direct source graphic frame under an identity slide root.
Refuse grouped source placement rather than inventing parent composition.
Copy the complete inspected internal dependency graph; do not reuse destination
or source assets, even for same-package copies. Admit diagramData/Layout/
QuickStyle/Colors, diagramDrawing and image relationships with matching diagram
or image content types. Internal cycles are supported. External edges must be
image or hyperlink relationships; preserve targets literally without fetching.
Unsupported dependency roles/types, fragments, ambiguous identities and dangling
identity references refuse with `PPTX_SMARTART_UNSUPPORTED`. Destination
protection/exhaustion retain `PPTX_PROTECTED` / `PPTX_ID_EXHAUSTED`.

## Identity and reference remapping

Allocate a fresh destination slide frame ID and collision-free copied part names.
Preserve frame geometry/name and all XML except its identity and four role
relationship values. Add four fresh role relationships on the destination.
Copied part-owned relationship IDs stay local and literal; retarget internal
paths to the corresponding copied part, preserving external paths.

For each data graph, collect definitions from diagram `pt` and `cxn` modelId
attributes. GUID model definitions must be unique. Assign fresh GUIDs with no
collision against source definitions or each other. Replace modelId and known
srcId/destId/parTransId/sibTransId/presId/presAssocID attributes across copied
data/drawing parts with the same map. Nonempty unknown/dangling GUID references
refuse; empty optional references stay empty. Preserve layout/style uniqueId
identifiers because they name semantic templates, not instance objects.
Copied drawing shape IDs are reassigned monotonically above that drawing's
original maximum; remap DrawingML stCxn/endCxn IDs consistently within the owner.
Opaque media payloads remain exact. Attribute splices preserve original quote
and prefix spelling; copied relationships change only internal Target values.

Return frame ID, target slide part, original-to-copy part map, original-to-new
model GUID map and owner-qualified drawing-ID map. Results are detached.
One transaction owns copied parts, relationship members, content types and frame
append; late failure rolls everything back without bumping versions. Success
bumps target version once. Never mutate a distinct source package. For same-slide
copy, existing source frame/parts stay literal while target metadata grows.
Save/reopen must retain dependency closure, exact external/media custody and
consistent remaps. No model editing, template synthesis or drawing regeneration
is performed; copy validity is bounded package/XML consistency only.
