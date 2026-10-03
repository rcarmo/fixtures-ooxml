# Embedded picture insertion

Append one PNG or JPEG picture at an explicit slide-space rectangle. Shared
[recipes](../ledgers/pptx-picture-insertion.json) own the inputs and literal
expected records; [the workflow](../workflows/pptx/picture-insertion.feature)
owns six planned IDs and eighteen cases. Native bindings confer no shared
execution credit.

## Request and output

Supply raw payload bytes, geometry (`x`, `y`, `width`, `height`) in EMUs and
options containing explicit `contentType`, optional `name` and optional
`description`. Positions are signed 32-bit integers; extents are positive
integers up to 2147483647. Unknown fields, accessor properties, invalid XML
strings, non-byte payloads, empty payloads and payloads above 64 MiB refuse.
Only `image/png` and `image/jpeg` are accepted. Check the eight-byte PNG signature
or JPEG SOI/EOI envelope. These checks certify neither pixel decoding nor
renderability. MIME mismatch refuses.

Allocate the next maximum slide shape ID, the first unused relationship ID and
the first case-insensitively unused `ppt/media/imageN.png` or `.jpeg` name.
Existing orphan members count as occupied names. Append before any terminal
shape-tree extension list, without rewriting existing shapes. No deduplication
or pixel/aspect inference is performed. The authored picture has a rectangle
preset, exact offset/extents, zero rotation, no flips, zero crop and one embedded
image relationship. The receipt contains shape ID, owning slide part, media
part and relationship ID. Missing name defaults to `Picture <shapeId>`;
missing description is omitted.

## Shared sources and custody

Resolve every payload's fixture ID through the manifest. PNG bytes come from
`ppt/media/image1.png` and JPEG bytes from `docProps/thumbnail.jpeg` of the same
sealed presentation. Member hashes are fixture provenance checks, never
rendering or generated-image equivalence gates. Recipe operations run only on
in-memory copies: literal replacements require exactly one occurrence;
`copy-member` requires an absent destination and preserves the source member.
No source fixture or package member is copied into a parallel fixture root.

The successful package adds exactly the receipt's media member. Only the slide,
its relationship member and `[Content_Types].xml` may change. Existing
relationships, default MIME declarations and unselected shape XML remain
literal. If an existing extension mapping differs, add a specific override
without rewriting that default. Save/reopen must retain exact media bytes,
placement, identities, relationship targets and types, and all unrelated member
payloads. Changes to the caller's bytes after return cannot alter stored media.

## Refusal and rollback

Reject malformed or duplicate identities, unsupported shape-tree ownership,
lexical barriers, nonidentity root group coordinates, protection and exhausted
IDs before committing. Geometry/options/shape-tree errors map to
`PPTX_PICTURE_UNSUPPORTED`; protection and exhaustion retain `PPTX_PROTECTED`
and `PPTX_ID_EXHAUSTED`. Native error class identity is not required.
Package/XML admission errors keep their existing categories. If serialization
fails, roll back slide XML, media, relationships and content types together;
slide versions change only after success. Every refusal preserves the complete
member set, payloads and prior handle usability.

Format vocabulary follows ECMA-376 Part 1, PresentationML picture elements
(section 19.3.1.37) and DrawingML blips/transforms (sections 20.1.8 and 20.1.9).
Links, crop editing, fitting, SVG, rendering, replace/delete and grouped
placement are outside this slice.
