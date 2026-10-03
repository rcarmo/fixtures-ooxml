# SmartArt from Microsoft PowerPoint source bytes

The sealed Apache POI `SmartArt.pptx` source supplies a schema-valid positive input. Its application metadata identifies Microsoft Office PowerPoint. The bytes come from a committed Apache-2.0 repository; metadata establishes the reported producer, not a newly executed PowerPoint test.

The [workflow](../workflows/pptx/smartart-office-source.feature) and [literal ledger](../ledgers/pptx-smartart-office-source.json) require inspection and isolated copying of slide 1 frame 4, named `Diagram 3`. The data model's `dsp:dataModelExt relId="rId6"` refers to the slide-owned diagramDrawing relationship. Inspection must include that drawing and its slide-owned edge in the graph. Preserve existing synthetic owner-local profiles; ambiguity between two different matching owners refuses.

Copy the four role roots plus the drawing into fresh parts. Allocate the drawing relationship on the destination slide and replace the copied data metadata's relId. Remap 46 GUID definitions from the instance data part, including cxnId, transition IDs, associations and drawing model references. The layout part's numeric sample identities and presId layout-template URI are semantic template data and remain literal. Repeated zero drawing IDs without connector references are an Office-produced encoding: allocate six positive unique IDs in document order. Ambiguous referenced repeated IDs refuse; retain nonzero duplicate refusal.

Cross-presentation copies preserve every source member. Same-slide copies preserve every pre-existing payload except the target slide, its relationships and content-type registration. Save/reopen retains all five copied parts, external/media custody, isolated model identities and consistent drawing bindings.

All consumers remain planned. Microsoft Open XML SDK validation and LibreOffice import/export are external checks. Actual PowerPoint open/no-repair/render/edit/save/reopen evidence remains unverified. Existing synthetic graphs keep their original contract and limitations; this fixture does not certify arbitrary graph closure or SmartArt editing/layout evaluation.
