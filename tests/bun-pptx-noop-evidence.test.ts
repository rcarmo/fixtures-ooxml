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
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const id = '@id-pptx-bun-open-save-noop';
const path = 'workflows/pptx/preservation.feature';
const steps = [
  'fixture fixture-1b848867cffb781112dc5778fa8cc7b9c9bd472c3636a348ec5d50005f05489e',
  'the presentation reader opens the fixture path and separately opens its archive bytes',
  "the path-opened presentation's first inspected paragraph on its first slide is Frankenstein",
  'serializing the byte-opened presentation returns the exact original archive bytes',
  'the path-opened presentation is saved without edits to a new PPTX path',
  'that destination file contains the exact original archive bytes',
];

test('Bun executes exact PPTX open/save no-op byte custody without Go/Python or rendering credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '347011f9c49850e69d931655af4e0b5686326ae1:ledgers/workflows.json']).toString());
  const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
  expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
  expect(cases(path, await Bun.file(path).text()).filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual([steps]);
  expect(now.expectedOutcomes).toEqual([steps[2], steps[3], steps[5]]);
  expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
  for (const marker of ['29348e87fdb34ddfefd6d3fc65ac7df73765738e', 'shared v0.93.0', 'one exact six-step', 'Frankenstein', 'byte-identical in-memory serialization', 'destination and source whole-archive bytes', 'tests/acceptance/pptx-custody.ts', 'tests/unit/pptx-custody-bindings.test.ts', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
  if (now.id==="@id-xml-unicode-qname-components") {expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented')} else expect(now.consumers.go).toEqual(old.consumers.go); if (["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes"].includes(now.id)) {expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented')} else expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged = structuredClone(now); if (["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes"].includes(now.id)) unchanged.consumers.python=old.consumers.python; if (now.id==="@id-xml-unicode-qname-components") unchanged.consumers.go=old.consumers.go; unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  expect(ledger.workflows.filter((w:any)=>w.id!=="@id-xml-go-attribute-splice-custody"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&!["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-xml-unicode-qname-components"].includes(w.id)&&!['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&& w.id !== id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-xml-go-attribute-splice-custody"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&!["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-xml-unicode-qname-components"].includes(w.id)&&!['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&& w.id !== id));
});
