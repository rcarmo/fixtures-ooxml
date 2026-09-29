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
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/docx/comments.feature';
const suffixes = ['inspection', 'resolution', 'noop', 'refusal', 'rollback', 'encoding', 'unsupported', 'limit'];
const counts = [3, 3, 1, 9, 2, 3, 1, 1];
const steps = [5, 7, 4, 4, 5, 4, 6, 4];
const markers = [
  ['pinned, nested and reordered', 'immutable detached records'],
  ['root/member/changed-flag receipt', 'original member bytes'],
  ['first full-thread edit changes one flag', 'repeated edit changes zero'],
  ['Nine exact four-step', 'typed OoxmlError and no receipt'],
  ['part-write and serialization failures', 'prior unrelated edit'],
  ['UTF-8-BOM, UTF-16LE and UTF-16BE', 'aliased namespace meaning'],
  ['two immutable root groups', 'nonempty unsupported report'],
  ['10001-comment', 'docx-comments-limit'],
];

test('Bun executes twenty-three exact existing-thread cases without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '92dc81cc00958b57611faa4025a63d7a81f301ec:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (let i = 0; i < suffixes.length; i++) {
    const id = '@id-docx-existing-thread-' + suffixes[i], rows = compiled.filter((r: any) => r.scenarioId === id);
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(counts[i]);
    expect(rows).toHaveLength(counts[i]!); expect(rows.every(r => r.steps.length === steps[i])).toBe(true);
    const observed = [...new Set(rows.flatMap(r => r.steps.filter(s => s.text.startsWith('the ') || s.text.startsWith('a typed ') || s.text.startsWith('all returned ') || s.text.startsWith('reopened ') || s.text.startsWith('both operations ') || s.text.startsWith('two immutable ')).map(s => s.text)))];
    expect(now.expectedOutcomes).toEqual(observed.filter(s => s !== 'the selected thread is reopened and saved again' && s !== 'the main document has a prior unrelated edit'));
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers[i]!, '4aa1f0960305c9665e500725b693976174bfb104', 'shared v0.92.0', 'features/shared.json', 'tests/acceptance/comment-threads.ts', 'tests/unit/comment-thread-outcomes.test.ts', '23 cases/108 steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(counts.reduce((n, c) => n + c, 0)).toBe(23);
  expect(counts.reduce((n, c, i) => n + c * steps[i]!, 0)).toBe(108);
  const changed = new Set(suffixes.map(s => '@id-docx-existing-thread-' + s));
  expect(ledger.workflows.filter((w: any) =>!['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&& !changed.has(w.id)));
});
