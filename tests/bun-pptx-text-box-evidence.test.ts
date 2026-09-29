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
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/pptx/text-box.feature';
const specs = [
  {
    id: '@id-pptx-text-box-authoring',
    kinds: ['plain', 'multiline', 'empty', 'formatted', 'alias', 'default-namespace', 'extension-tail', 'nested-id'],
    steps: (kind: string) => [`a native slide prepared for text-box ${kind}`, `a positioned text box is appended for ${kind}`, `reopened text-box identity geometry and paragraphs match ${kind}`, 'existing slide shapes and unrelated package payloads are unchanged'],
    markers: ['Eight exact four-step', 'integer EMU geometry', 'unrelated package payloads remain byte-identical'],
  },
  {
    id: '@id-pptx-text-box-refusal',
    kinds: ['negative-position', 'zero-extent', 'fractional-geometry', 'oversized-geometry', 'invalid-text', 'invalid-options', 'duplicate-id', 'malformed-id', 'exhausted-id', 'duplicate-tree', 'missing-prefix-properties', 'misplaced-extension', 'alternate-content', 'transformed-tree', 'protected-presentation'],
    steps: (kind: string) => [`an unsafe text-box authoring input ${kind}`, 'the unsafe positioned text box is attempted', 'text-box creation refuses before package bytes or slide version change'],
    markers: ['Fifteen exact three-step', 'before changing package bytes or slide version', 'typed PPTX_/XML_ refusal'],
  },
];

test('Bun executes exact positioned PPTX text-box outcomes and atomic refusals without cross-consumer credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'c96ada79a51ebf8124268745e4d0211d642c9cac:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, kinds, steps, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(kinds.length);
    expect(compiled.filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual(kinds.map(steps));
    expect(now.expectedOutcomes).toEqual([...new Set(kinds.flatMap(kind => steps(kind).slice(2)))]);
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, '4512330b3a81a459d697afb1e6502b5ff7f3a9c6', 'shared v0.95.0', 'features/shared.json', 'tests/acceptance/text-box.ts', 'tests/unit/pptx-text-box.test.ts', '23 exact cases/77 steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    if (now.id==="@id-xml-unicode-qname-components") {expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented')} else expect(now.consumers.go).toEqual(old.consumers.go); if (["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes"].includes(now.id)) {expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented')} else expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); if (["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes"].includes(now.id)) unchanged.consumers.python=old.consumers.python; if (now.id==="@id-xml-unicode-qname-components") unchanged.consumers.go=old.consumers.go; unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(specs.reduce((n, s) => n + s.kinds.length, 0)).toBe(23);
  expect(specs.reduce((n, s) => n + s.kinds.reduce((m, k) => m + s.steps(k).length, 0), 0)).toBe(77);
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w:any)=>!["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-xml-unicode-qname-components"].includes(w.id)&&!['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!["@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-xml-unicode-qname-components"].includes(w.id)&&!['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !pythonPackageIds.has(w.id)&&!goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&& !changed.has(w.id)));
});
