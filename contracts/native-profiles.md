# Native editing and package profiles

All implemented Bun Gherkin is stored in this reference repository. Consumers
select it with a local lifecycle overlay and bind their own operations. Existing
IDs, example rows and step text are retained; native API names, error codes,
resource limits and object-handle behaviour remain explicit where specified.

The additional profiles imported from Bun `13ead38` are:

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

These ten profiles contain 40 scenarios and 62 expanded cases. They supplement
existing mutation, XML, graph, ZIP64, story/revision, slide-text and worksheet
profiles. There are no local shared-feature copies to maintain after consumer
adoption. Temporary test projections are derived from the pinned feature text.

Central compilation validates inventory and identity; it executes no Office
editing operation. The Bun binding run supplies current Bun evidence only. Go or
Python declaration mappings require review against the specified inputs and
assertions, not feature-title similarity. Full authoring, import, calculation and
independent producer/rendering compatibility remain unimplemented or unverified.
