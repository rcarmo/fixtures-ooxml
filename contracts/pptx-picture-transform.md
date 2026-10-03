# Direct picture rotation and flips

Patch only direct rotation and horizontal/vertical flip flags of one exact
picture ID through `Slide.patchPictureTransform(id, patch)`. Shared
[recipes](../ledgers/pptx-picture-transform.json) supply two planned IDs and
eighteen cases owned by the [workflow](../workflows/pptx/picture-transform.feature).

Accept plain optional `rotation`, `flipH` and `flipV` values. Rotation is an
integer DrawingML angle in [0, 21599999] (60000 units per degree); booleans are
required for flips. Null/undefined values, accessors, unknown fields and invalid
IDs refuse. Values outside one turn are refused instead of silently normalised.
An empty patch and equivalent decoded values are exact no-ops. No-op receipts
have `{changed:0}` and leave handle versions unchanged. Changed receipts have
`{changed:1}`. Existing equivalent boolean spellings remain literal on no-op.

Target an existing direct `a:xfrm` under the selected picture's `p:spPr`.
Missing direct placement refuses; never invent inherited placement. Support
root/grouped, embedded/linked and dual-asset picture metadata without fetching
external links. The bounded editable transform contains direct off/ext children
in order, ordinary coordinate attributes and only unqualified rot/flip flags.
Foreign lookalikes, unknown attributes/children, lexical barriers and duplicate
transforms refuse before mutation. Inspection ambiguity keeps
`PPTX_PICTURE_INVALID`; other bounded transform/request errors use
`PPTX_PICTURE_UNSUPPORTED`; missing/nonpicture IDs use `PPTX_PICTURE_NOT_FOUND`.
Presentation protection remains `PPTX_PROTECTED`.

Only the selected transform opening tag may change. Preserve its prefix,
whitespace and quote style for existing attribute values. Unpatched flags and
rotation stay literal. Off/ext children, picture position/size, crop, group
transforms, effects, descriptions, relationship parts and media payloads are
unchanged. Membership is exact and only the slide may change. Save/reopen keeps
exact orientation. A late serialization failure rolls back slide XML and leaves
versions and existing handles usable.

This profile performs no absolute group-coordinate mapping, rotation
composition, angle inference or rendering. Retained negative angles remain
inspectable but unsupported by this bounded authoring profile. DrawingML
transforms follow ECMA-376 Part 1, sections 20.1.9.
