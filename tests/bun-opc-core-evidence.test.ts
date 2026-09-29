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
const custodyIds = new Set(["@id-bun-opc-open-refusal","@id-bun-opc-detached-byte-copies","@id-bun-opc-preserve-utf16le-edit","@id-bun-opc-async-transaction-refusal","@id-bun-opc-thenable-transaction-result","@id-bun-opc-save-invalid-target-custody","@id-bun-opc-symlink-destination-refusal"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/package/preservation.feature';
const specs = [
  {
    id: '@id-opc-package-corpus-noop',
    steps: ['the go-ooxml and python-office-mcp-server fixture corpora are enumerated', 'each OOXML fixture package is opened and serialized without edits through the OPC layer', 'every reopened package matches its original whole-archive bytes', 'both fixture corpora contribute their exact known nonzero fixture counts'],
    markers: ['one exact four-step', '36 Go-origin and 35 Python-origin', '71 total', 'byte-identical'],
  },
  {
    id: '@id-opc-package-transaction-rollback',
    steps: ['a valid OPC package with XML and opaque payload parts', 'a transactional edit changes multiple parts and then fails', 'the package reverts to the original bytes and parts after the refusal'],
    markers: ['one exact three-step', 'changes both', 'both part bytes equal'],
  },
  {
    id: '@id-opc-package-preserve-unrelated',
    steps: ['a valid OPC package with a main XML part and an unrelated binary payload', 'the main XML part text is changed and the package is reopened', 'the edited part contains the new text after reopen', 'the unrelated payload bytes remain unchanged'],
    markers: ['one exact four-step', 'saves and reopens', 'unrelated opaque binary payload bytes'],
  },
];

test('Bun executes three exact OPC corpus, rollback and unrelated-payload preservation cases', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'f4a15b68615220686620529f7469a8e5aa801a48:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, steps, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
    expect(compiled.filter((row: any) => row.scenarioId === id).map((row: any) => row.steps.map((s: any) => s.text))).toEqual([steps]);
    expect(now.expectedOutcomes).toEqual(steps.slice(id === '@id-opc-package-transaction-rollback' ? -1 : -2));
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, 'edc342eba89bfe62d790059083732ae09f9c043a', 'shared v0.88.0', 'features/shared.json', 'tests/acceptance/core.ts', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) =>!['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && !['@id-package-admission-negative-budget','@id-zip-unsigned-descriptor-signature-collision'].includes(w.id) && !goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id) && w.id !== pythonPhysicalOverlapId && !goXmlNegativeIds.has(w.id)&&!goLatentPackageIds.has(w.id)&&!pythonXmlNegativeIds.has(w.id)&&w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&& !changed.has(w.id)));
});
