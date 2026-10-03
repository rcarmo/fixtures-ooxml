# Safe embedded picture replacement

Replace the payload dependency of one exact picture ID. The shared
[recipes](../ledgers/pptx-picture-replacement.json) define five planned IDs and
fourteen cases owned by the [workflow](../workflows/pptx/picture-replacement.feature).
No scenario registration grants execution credit.

Use the PNG/JPEG byte-input bounds and signature/envelope policy from
[picture insertion](pptx-picture-insertion.md). The only option is explicit
`contentType`; no name, description, crop, transform or fit changes are accepted.
The target is one unambiguous embedded-only `p:pic` in the enrolled slide's shape
tree or group. A missing/nonpicture ID refuses with `PPTX_PICTURE_NOT_FOUND`;
linked, dual-asset and paired image-extension pictures refuse with
`PPTX_PICTURE_UNSUPPORTED`.
Inspection ambiguities retain `PPTX_PICTURE_INVALID`; protection retains
`PPTX_PROTECTED`. Invalid ID/request values refuse before package mutation.

Always allocate a fresh case-insensitively unused media part and new image
relationship. Reuse the insertion name and relationship allocation policy.
Retain every prior media member and relationship, even if it becomes unreferenced.
This isolates all shared references without attempting an incomplete dependency
scan. Garbage collection is a separate operation. Change only the selected
DrawingML blip's expanded-name embedded relationship attribute value. Preserve
its lexical prefix, quote style, whitespace, effects and extension payloads.
All other slide XML is literal, including nonvisual identity, accessibility
text, group ancestry, local coordinates, crop, rotation, flips and ordering.

Return the ordinary picture receipt plus `previousRelationshipId` and
`previousMediaPart`. Copy caller bytes before storing. Save and reopen must
retain the exact new media payload and metadata. Only the slide, its relationship
member and content-type registry may change; membership adds exactly the one
new media part. Existing relationship element bytes remain unchanged. An
injected serialization failure rolls back media, relationships, content types
and selected XML together; handle versions change only after success.

Recipe PNG media and JPEG thumbnail are source members of the manifest-addressed
sealed image presentation. Resolve and verify the fixture and member provenance;
apply literal operations only in memory. No fixture copies, rendering, decoding,
links, SVG fallback edits or shared-media mutation are included. XML vocabulary
follows ECMA-376 Part 1, PresentationML pictures (19.3.1.37) and DrawingML blips
(20.1.8). The presence of retained opaque effects certifies no rendering quality.
