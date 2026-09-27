# Workflow operation index

Canonical features are grouped by format and operation. Each scenario ID has one owner.
See [catalogue guidance](../CATALOGUE.md) for profiles and execution limits.
Go and Python source candidates live in [staging](../staging/README.md); they are not canonical workflows.

## DOCX

- [anchor-discovery.feature](docx/anchor-discovery.feature) — 5 scenarios, 5 cases
- [comment-content-type.feature](docx/comment-content-type.feature) — 1 scenario, 1 case
- [comments.feature](docx/comments.feature) — 21 scenarios, 46 cases
- [creation.feature](docx/creation.feature) — 5 scenarios, 9 cases
- [effective-formatting.feature](docx/effective-formatting.feature) — 2 scenarios, 25 cases
- [font-size.feature](docx/font-size.feature) — 1 scenario, 1 case
- [mutation-safety.feature](docx/mutation-safety.feature) — 3 scenarios, 7 cases
- [page-layout.feature](docx/page-layout.feature) — 3 scenarios, 23 cases
- [paragraph-style.feature](docx/paragraph-style.feature) — 3 scenarios, 24 cases
- [paragraphs.feature](docx/paragraphs.feature) — 6 scenarios, 16 cases
- [properties.feature](docx/properties.feature) — 1 scenario, 1 case
- [review-integration.feature](docx/review-integration.feature) — 2 scenarios, 2 cases
- [revisions.feature](docx/revisions.feature) — 23 scenarios, 88 cases
- [run-formatting.feature](docx/run-formatting.feature) — 10 scenarios, 43 cases
- [stories.feature](docx/stories.feature) — 3 scenarios, 3 cases
- [style-authoring.feature](docx/style-authoring.feature) — 2 scenarios, 24 cases
- [table-merging.feature](docx/table-merging.feature) — 14 scenarios, 52 cases
- [tables.feature](docx/tables.feature) — 14 scenarios, 24 cases
- [template-analysis.feature](docx/template-analysis.feature) — 14 scenarios, 28 cases
- [template-cache.feature](docx/template-cache.feature) — 7 scenarios, 7 cases
- [text.feature](docx/text.feature) — 5 scenarios, 7 cases
- [tracked-workflow.feature](docx/tracked-workflow.feature) — 3 scenarios, 18 cases
- [tracking-settings.feature](docx/tracking-settings.feature) — 7 scenarios, 24 cases

## PPTX

- [creation.feature](pptx/creation.feature) — 3 scenarios, 3 cases
- [layout-recommendation.feature](pptx/layout-recommendation.feature) — 2 scenarios, 6 cases
- [mutation-safety.feature](pptx/mutation-safety.feature) — 3 scenarios, 6 cases
- [notes.feature](pptx/notes.feature) — 10 scenarios, 11 cases
- [preservation.feature](pptx/preservation.feature) — 1 scenario, 1 case
- [slide-import.feature](pptx/slide-import.feature) — 1 scenario, 1 case
- [slide-order.feature](pptx/slide-order.feature) — 2 scenarios, 21 cases
- [tables.feature](pptx/tables.feature) — 4 scenarios, 5 cases
- [text-box.feature](pptx/text-box.feature) — 2 scenarios, 23 cases
- [text.feature](pptx/text.feature) — 3 scenarios, 3 cases

## XLSX

- [cache-completeness.feature](xlsx/cache-completeness.feature) — 1 scenario, 1 case
- [calculation-engine.feature](xlsx/calculation-engine.feature) — 1 scenario, 1 case
- [cell-style.feature](xlsx/cell-style.feature) — 3 scenarios, 28 cases
- [cells.feature](xlsx/cells.feature) — 7 scenarios, 7 cases
- [comment-vml-custody.feature](xlsx/comment-vml-custody.feature) — 6 scenarios, 6 cases
- [creation.feature](xlsx/creation.feature) — 7 scenarios, 7 cases
- [formula-cache.feature](xlsx/formula-cache.feature) — 4 scenarios, 5 cases
- [formula-references.feature](xlsx/formula-references.feature) — 9 scenarios, 45 cases
- [mutation-safety.feature](xlsx/mutation-safety.feature) — 2 scenarios, 6 cases
- [structural-edits.feature](xlsx/structural-edits.feature) — 1 scenario, 1 case
- [style-readback.feature](xlsx/style-readback.feature) — 1 scenario, 1 case

## PACKAGE

- [graph.feature](package/graph.feature) — 4 scenarios, 4 cases
- [preservation.feature](package/preservation.feature) — 10 scenarios, 14 cases
- [relationship-namespaces.feature](package/relationship-namespaces.feature) — 2 scenarios, 4 cases
- [semantic-diff.feature](package/semantic-diff.feature) — 1 scenario, 1 case
- [xml-member-admission.feature](package/xml-member-admission.feature) — 1 scenario, 3 cases
- [zip-admission.feature](package/zip-admission.feature) — 3 scenarios, 10 cases
- [zip32.feature](package/zip32.feature) — 8 scenarios, 24 cases
- [zip64.feature](package/zip64.feature) — 4 scenarios, 4 cases

## XML

- [comparison.feature](xml/comparison.feature) — 5 scenarios, 10 cases
- [editing.feature](xml/editing.feature) — 11 scenarios, 16 cases
- [names.feature](xml/names.feature) — 3 scenarios, 6 cases
- [parsing.feature](xml/parsing.feature) — 14 scenarios, 15 cases

## OFFICE

- [full-coverage.feature](office/full-coverage.feature) — 1 scenario, 3 cases

## Mutation fixture contract

`contracts/mutation-safety.json` schema 2 selects eight scenario IDs from five
format-local files (nineteen cases). Consumers load each declared feature, verify
its seal, select only those IDs, and reject missing or duplicate case identities.
Other scenarios in those files have their own implementation status.
