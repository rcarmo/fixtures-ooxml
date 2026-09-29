const pythonPackageIds = new Set(['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision']);
const goXmlNegativeIds = new Set(['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments']);
const goLatentPackageIds = new Set(['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision']);
const pythonXmlNegativeIds = new Set(['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments']);
const pythonPhysicalOverlapId = '@id-zip-physical-member-overlap-refusal';
const goRemainingFormulaIds = new Set(['@id-xlsx-go-formula-literal-punctuation','@id-xlsx-go-static-remap-exact','@id-xlsx-go-static-remap-refusal','@id-xlsx-go-static-reference-properties']);
const pythonCommentVmlId = '@id-xlsx-comment-vml-existing-graph';
const styleAuthoringIds = new Set(['@id-docx-paragraph-style-authoring','@id-docx-paragraph-style-authoring-refusal']);
const goFormulaAnalysisIds = new Set(['@id-xlsx-go-formula-analysis-counts','@id-xlsx-go-formula-quoted-sheet-flags','@id-xlsx-go-formula-analysis-refusal']);
const pageLayoutIds = new Set(['@id-docx-final-section-layout','@id-docx-final-section-layout-refusal']);
const effectiveIds = new Set(['@id-docx-effective-run-formatting','@id-docx-effective-run-formatting-refusal']);
const trackingIds = new Set(['persistence','custody','no-op','refusal','rollback','plain-edit','author-refusal'].map(name => '@id-docx-tracking-settings-'+name));
const goDirectRangeIds = new Set(['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal']);
const formulaIds = new Set(["@id-xlsx-go-formula-analysis-counts","@id-xlsx-go-formula-quoted-sheet-flags","@id-xlsx-go-formula-analysis-refusal","@id-xlsx-go-formula-literal-punctuation","@id-xlsx-go-direct-range-parsing","@id-xlsx-go-direct-range-refusal","@id-xlsx-go-static-remap-exact","@id-xlsx-go-static-remap-refusal","@id-xlsx-go-static-reference-properties"]);
const commentVmlId = '@id-xlsx-comment-vml-existing-graph';
const cellStyleIds = new Set(["@id-xlsx-cell-style-selection","@id-xlsx-cell-style-refusal"]);
const xlsxCreateIds = new Set(["@id-xlsx-create-native-default","@id-xlsx-create-add-worksheet","@id-xlsx-create-prefixed-missing-cell","@id-xlsx-create-coordinate-boundary","@id-xlsx-create-row-ordering","@id-xlsx-create-invalid-params-atomic","@id-xlsx-create-existing-fixture-append"]);
const slideOrderIds = new Set(["@id-pptx-slide-permutation","@id-pptx-slide-permutation-refusal"]);
const textBoxIds = new Set(["@id-pptx-text-box-authoring","@id-pptx-text-box-refusal"]);
const pptxTableIds = new Set(["@id-pptx-table-roundtrip-geometry","@id-pptx-table-formatting","@id-pptx-table-stale-handle","@id-pptx-table-atomic-refusals"]);
const pptxNoopId = new Set(['@id-pptx-bun-open-save-noop']);
const threadIds = new Set(["@id-docx-existing-thread-inspection","@id-docx-existing-thread-resolution","@id-docx-existing-thread-noop","@id-docx-existing-thread-refusal","@id-docx-existing-thread-rollback","@id-docx-existing-thread-encoding","@id-docx-existing-thread-unsupported","@id-docx-existing-thread-limit"]);
const commentIds = new Set(["@id-docx-comments-inspection","@id-docx-comments-resolution","@id-docx-comments-noop","@id-docx-comments-refusal"]);
const relationshipIds = new Set(["@id-office-relationship-prefix-alias","@id-office-relationship-wrong-uri"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/package/preservation.feature';
const ids = ['@id-bun-opc-open-refusal', '@id-bun-opc-detached-byte-copies', '@id-bun-opc-preserve-utf16le-edit', '@id-bun-opc-async-transaction-refusal', '@id-bun-opc-thenable-transaction-result', '@id-bun-opc-save-invalid-target-custody', '@id-bun-opc-symlink-destination-refusal'];
const expectedCases = [5, 1, 1, 1, 1, 1, 1];
const expectedSteps = [9, 10, 10, 10, 10, 11, 12];
const markers = [
  ['Five exact nine-step', 'noncanonical part name', 'duplicate relationship ID'],
  ['One exact ten-step', 'caller archive bytes', 'unchanged serialization/reopen'],
  ['One exact ten-step', 'FF FE', 'UTF-16 XML declaration'],
  ['One exact ten-step', 'opc-async-transaction', 'before its body runs'],
  ['One exact ten-step', 'identical thenable', 'without invoking then()'],
  ['One exact eleven-step', 'existing destination file', 'original package bytes'],
  ['One exact twelve-step', 'symlink identity/target', 'unchanged'],
];
const outcomes = (rows: Array<{ steps: Array<{ text: string }> }>) => [...new Set(rows.flatMap(row => row.steps.map(s => s.text).filter(text =>
  text.startsWith('it throws') || text.startsWith('the error message') || text.startsWith('the ran flag') ||
  text.startsWith('a fresh get') || text.startsWith('serializing') || text.startsWith('the saved document') ||
  text.startsWith('decoding') || text.startsWith('the transaction returns') || text.startsWith('the document text') ||
  text.includes('destination file bytes equal')
)))];

test('Bun executes eleven exact OPC custody and save-path cases without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '57555eeed6204e0a8fa2266b29a4fed838a5bf8e:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]!, rows = compiled.filter((row: any) => row.scenarioId === id);
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(expectedCases[i]);
    expect(rows).toHaveLength(expectedCases[i]!); expect(rows.every(row => row.steps.length === expectedSteps[i])).toBe(true);
    expect(now.expectedOutcomes).toEqual(outcomes(rows));
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers[i]!, 'd71b9b673304b7437a6d5ce9c745ce42ab23792a', 'shared v0.89.0', 'tests/acceptance/opc-custody.ts', 'tests/unit/opc-custody-bindings.test.ts', 'eleven exact cases/108 compiled steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    if (now.id==="@id-xml-unicode-qname-components") {expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented')} else expect(now.consumers.go).toEqual(old.consumers.go); if (["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes"].includes(now.id)) {expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented')} else expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); if (["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes"].includes(now.id)) unchanged.consumers.python=old.consumers.python; if (now.id==="@id-xml-unicode-qname-components") unchanged.consumers.go=old.consumers.go; unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(expectedCases.reduce((a, b) => a + b, 0)).toBe(11);
  expect(expectedCases.reduce((sum, count, i) => sum + count * expectedSteps[i]!, 0)).toBe(108);
  const changed = new Set(ids);
  expect(ledger.workflows.filter((w:any)=>w.id!=="@id-xml-entity-values"&&w.id!=="@id-xml-go-attribute-splice-custody"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&!["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-xml-unicode-qname-components"].includes(w.id)&&!['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-xml-entity-values"&&w.id!=="@id-xml-go-attribute-splice-custody"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&!["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-xml-unicode-qname-components"].includes(w.id)&&!['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&& !changed.has(w.id)));
});
