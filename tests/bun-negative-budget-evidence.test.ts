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
const custodyIds = new Set(["@id-bun-opc-open-refusal","@id-bun-opc-detached-byte-copies","@id-bun-opc-preserve-utf16le-edit","@id-bun-opc-async-transaction-refusal","@id-bun-opc-thenable-transaction-result","@id-bun-opc-save-invalid-target-custody","@id-bun-opc-symlink-destination-refusal"]);
const coreOpcIds = new Set(["@id-opc-package-corpus-noop","@id-opc-package-transaction-rollback","@id-opc-package-preserve-unrelated"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const id = '@id-package-admission-negative-budget';
const path = 'workflows/package/admission-limit-configuration.feature';
const fixture = 'fixture-d9d6a313182a71a73d75a26a0ff3b7826dbd2e300e1d202114ec9f8fb018fda5';
const outcomes = [
  'it refuses the invalid caller budget before reading source metadata or ZIP members and returns no package or parts',
  'the refusal is an invalid-argument result, not a resource-limit or malformed-archive result',
  "the caller's archive bytes remain unchanged",
];

test('Bun executes two exact negative-budget admission refusals without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '2c7c0a74d172ed7da9b40c51c159a9d0c78e6776:ledgers/workflows.json']).toString());
  const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
  expect(now.feature).toBe(path); expect(now.expandedCases).toBe(2);
  expect(cases(path, await Bun.file(path).text()).filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual(['source bytes', 'entry count'].map(budget => [
    `the byte-sealed valid DOCX archive ${fixture} and a separate caller byte snapshot`,
    `only the ${budget} admission budget is set to -1`,
    'bounded package admission checks that archive',
    ...outcomes,
  ]));
  expect(now.expectedOutcomes).toEqual(outcomes);
  expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
  for (const marker of ['b52d9a282878b0193a857f33e758703698415b54', 'shared v0.87.0', 'two exact six-step', 'source bytes and entry count', 'package-admission-limit-invalid', 'broken one-byte ZIP control', 'byte-identical', 'tests/acceptance/package-admission.ts', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python', 'no filesystem source-metadata read']) expect(now.consumers.bun.evidence).toContain(marker);
  expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  expect(ledger.workflows.filter((w: any) =>!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&& w.id !== id)).toEqual(prior.workflows.filter((w: any) =>!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&& w.id !== id));
});
