# Document editing and package operations

The Gherkin features specify inputs, expected results, error handling and which
package members an edit may change.

| Feature | Scope |

|---|---|
| `workflows/docx/comments.feature` | Existing comment inspection and per-entry done flags |
| `workflows/docx/text.feature` | Cross-run replacement, paragraph ordering and stale spans |
| `workflows/docx/creation.feature` | Minimal document/paragraph authoring and guarded append |
| `workflows/docx/tables.feature` | Rectangular table creation and bounded cell edits |
| `workflows/pptx/creation.feature` | Minimal title slides and compatible-layout append |
| `workflows/pptx/tables.feature` | Rectangular slide tables, geometry and bounded cell edits |
| `workflows/xlsx/creation.feature` | Initial workbook, sheet naming and ordinary cell creation |
| `workflows/package/preservation.feature` | No-op archive custody and package rollback |
| `workflows/package/zip32.feature` | ZIP32 admission, budgets and deterministic writing |
| `workflows/package/relationship-namespaces.feature` | Expanded-name relationship IDs in slide/sheet readers |

Other features cover revisions, styles, page geometry, slide order and worksheet
edits. Each operation has explicit limits; opening or editing a simple document
does not establish support for every OOXML element. Rendering and calculation
require separate tests against the relevant specification requirements.
