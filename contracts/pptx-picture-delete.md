# Safe picture deletion and conservative media collection

Delete one exact picture ID through `Slide.deletePicture(id, {collectMedia})`.
The boolean option defaults to false. Shared
[recipes](../ledgers/pptx-picture-delete.json) provide two planned IDs and
seventeen cases owned by the [workflow](../workflows/pptx/picture-delete.feature).
A receipt contains shape ID, owning slide part, removed relationship IDs and
removed media part names in deterministic traversal order.

## Dependencies

Default deletion removes only the selected `p:pic` element. Retain all
relationships and media, including unreferenced assets. With collection enabled,
consider only image dependencies referenced inside the removed picture. Include
ordinary embedded/linked attributes and SVG-extension references. Every
candidate must resolve to one exact image relationship; ambiguity refuses.
Do not fetch external targets. Remove a slide relationship only after proving
that no attribute anywhere in the remaining slide XML has a decoded value equal
to that relationship ID. This deliberately conserves unfamiliar/opaque
reference spellings. Comments, processing instructions or non-whitespace
text/CDATA outside ordinary DrawingML `a:t` text leaves in remaining slide XML
block collection altogether because their
reference grammar is unknown. Picture deletion still succeeds with retained
dependencies. No sweeping of unrelated orphan media occurs.

After removing proven-unused owner relationships, scan every package
relationship owner, including package root and orphans. Remove a candidate media
part only if no remaining internal relationship targets it. Relationship entries
from another picture or owner protect media even if their owner XML does not
currently use them. Only `ppt/media/` PNG/JPEG/SVG image parts without an owned
relationship part are eligible for removal. Other targets remain conserved.
Do not recursively collect outgoing dependencies. Default extension mappings
stay literal; remove a collected part's specific content-type override only.

## Custody and atomicity

The source slide equals its previous XML with the selected picture span removed.
Preserve all other XML, including group properties and empty groups. Remove only
receipt-named relationship elements; preserve their siblings and the relationship
member itself. Exact membership differs only by receipt-named removed media.
Only slide XML, slide relationship XML and content types may change. Shared
assets and every unrelated payload stay literal. SVG fallback and vector edges
are both considered; collect them only when each proof succeeds independently.
Save/reopen retains the remaining pictures and a valid complete package graph.

If the selected picture is referenced by a DrawingML start/end connector
endpoint, refuse with `PPTX_PICTURE_UNSUPPORTED` instead of leaving a dangling
attachment. No connector detachment or cascade is implicit.

A missing/nonpicture ID maps to `PPTX_PICTURE_NOT_FOUND`; existing inspection
ambiguities retain `PPTX_PICTURE_INVALID`. Invalid option/ID/dependency categories
use `PPTX_PICTURE_UNSUPPORTED`; protection retains `PPTX_PROTECTED`. Accessors and
unknown options refuse without invocation. Late serialization errors roll back
picture XML, removed relationships, media and content types together. Versions
change only after success. No rendering, inherited geometry or cross-package
reference proof is included. The proof scope is the current OPC package.
