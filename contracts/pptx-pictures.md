# Read-only picture inspection

Graphics item 1 returns detached picture metadata in shape-tree traversal order.
Recipes and complete expected records live in
[`ledgers/pptx-picture-inspection.json`](../ledgers/pptx-picture-inspection.json).
The [picture workflow](../workflows/pptx/pictures.feature) owns six planned IDs
and twelve cases. Registration grants no consumer execution credit.

## Inputs and records

Resolve `baseFixtureId` through the manifest and verify its provenance seal.
Apply each recipe's `replace-literal-once` operations in order to an in-memory
copy: each `before` string must occur exactly once. Never edit the sealed input.
The expected records are literal observations of the input XML, relationships,
content-type registry and media member lengths, with declared variant changes.

Each record contains the exact integer shape ID, name, optional description,
slide part, ancestor groups, embedded and linked assets, direct transform and
crop. Names never substitute for IDs. Media records report relationship IDs,
original targets, resolved internal part names, declared MIME types and payload
byte lengths. Linked assets report the literal external target without fetching
or opening it. An embedded and linked asset may coexist.

Positions and extents use EMUs. Rotation uses DrawingML angle units (60000 per
degree). Crop uses the original signed DrawingML percentage units (1000 per
percent). Missing crop sides are zero. Missing direct transforms are null;
inspection does not infer layout inheritance or absolute group placement.
Ancestor transforms include local child origins and extents in outer-to-inner
order. Returned records contain no live XML nodes or payload handles.

## Bounded refusal policy

Refuse the entire collection with semantic code `PPTX_PICTURE_INVALID` for the
seven named malformed cases. An adapter may use its native exception type;
class identity is not part of this contract. Picture IDs must be unique across
the slide, pictures must be direct shape-tree or group children, and required
picture metadata and image leaves must have unambiguous cardinalities.
Relationship attributes are matched by expanded name, image relationships by
exact type, embedded assets by internal target and image MIME declaration.
Extent integers must be non-negative; coordinates must be safe integers.
Unqualified and foreign-namespace image attributes are refused. Package/XML
admission errors keep their existing native categories.

## Custody and limits

Compare exact member sets and every member payload before and after inspection,
including refusals, then save and reopen successful inputs and compare records.
The caller's input bytes stay unchanged. Mutating any returned field must not
change the package or later reads. ZIP compression and container metadata are
not generated-output equality gates.

No pixel decoding, image signature certification, inherited geometry, rendering,
SVG fallback editing or picture mutation is included. Unknown extension/effect
payloads remain untouched. Format vocabulary follows ECMA-376 Part 1,
PresentationML pictures (`p:pic`, section 19.3.1.37), DrawingML blips and transform
attributes (sections 20.1.8 and 20.1.9); these input observations certify no
rendering quality or general Office compatibility.
