const goFormulaAnalysisIds = new Set(['@id-xlsx-go-formula-analysis-counts','@id-xlsx-go-formula-quoted-sheet-flags','@id-xlsx-go-formula-analysis-refusal']);
const pageLayoutIds = new Set(['@id-docx-final-section-layout','@id-docx-final-section-layout-refusal']);
const effectiveIds = new Set(['@id-docx-effective-run-formatting','@id-docx-effective-run-formatting-refusal']);
const trackingIds = new Set(['persistence','custody','no-op','refusal','rollback','plain-edit','author-refusal'].map(name => '@id-docx-tracking-settings-'+name));
const goDirectRangeIds = new Set(['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal']);
const formulaIds = new Set(["@id-xlsx-go-formula-analysis-counts","@id-xlsx-go-formula-quoted-sheet-flags","@id-xlsx-go-formula-analysis-refusal","@id-xlsx-go-formula-literal-punctuation","@id-xlsx-go-direct-range-parsing","@id-xlsx-go-direct-range-refusal","@id-xlsx-go-static-remap-exact","@id-xlsx-go-static-remap-refusal","@id-xlsx-go-static-reference-properties"]);
const commentVmlId = '@id-xlsx-comment-vml-existing-graph';
const cellStyleIds = new Set(["@id-xlsx-cell-style-selection","@id-xlsx-cell-style-refusal"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/xlsx/creation.feature';
const specs = [
  { id: '@id-xlsx-create-native-default', steps: ['a native-created XLSX workbook', 'I write "Alpha" to A1, 7 to B2, true to C3 and save and reopen it', 'the reopened created workbook has Sheet1 values at A1, B2 and C3', 'the saved created workbook contains only the minimal workbook, worksheet and styles parts', 'Sheet1 dimension becomes A1:C3'], markers: ['Alpha at A1, 7 at B2 and true at C3', 'minimal six package parts'] },
  { id: '@id-xlsx-create-add-worksheet', steps: ['a native-created XLSX workbook', 'I add worksheets "Data" and "Summary", write 5 to Data A1 and "done" to Summary B2, and save and reopen the workbook', 'the reopened workbook sheetnames are Sheet1, Data and Summary', 'the saved workbook assigns independent worksheet relationship and sheet ids'], markers: ['sheet IDs 1/2/3', 'rId1/rId3/rId4'] },
  { id: '@id-xlsx-create-prefixed-missing-cell', steps: ['a prefixed XLSX fixture with a missing B2 target', 'I write "Prefixed" to its missing B2 and save and reopen it', 'the saved prefixed worksheet uses qualified dimension row cell and text nodes for B2', 'the reopened prefixed workbook reads B2 as "Prefixed"'], markers: ['qualified dimension/row/cell/text XML nodes'] },
  { id: '@id-xlsx-create-coordinate-boundary', steps: ['a native-created XLSX workbook', 'I write 1 to XFD1048576 and save and reopen it', 'the reopened created workbook reads XFD1048576 as 1', 'Sheet1 dimension becomes XFD1048576:XFD1048576'], markers: ['XFD1048576:XFD1048576'] },
  { id: '@id-xlsx-create-row-ordering', steps: ['a native-created XLSX workbook', 'I write 3 to C3, 1 to A1, 2 to B1 and 4 to A2 and save and reopen it', 'the saved created worksheet stores rows and cells in ascending numeric order', 'the reopened created workbook keeps those ordered values'], markers: ['ascending numeric rows 1/2/3', 'A1/B1/A2/C3'] },
  { id: '@id-xlsx-create-invalid-params-atomic', steps: ['a native-created XLSX workbook', 'I try invalid worksheet coordinates and names', 'every invalid create-side refusal leaves the workbook bytes unchanged', 'the workbook still has only Sheet1'], markers: ['three invalid coordinates and seven invalid worksheet names', 'original workbook bytes'] },
  { id: '@id-xlsx-create-existing-fixture-append', steps: ['the go-ooxml formatting workbook fixture for append', 'I append the missing cell E7 text to "tail" and save and reopen the workbook', 'the reopened existing worksheet has the appended value at E7', 'the existing worksheet keeps its surrounding nodes and unrelated parts'], markers: ['five unrelated parts byte-for-byte', 'A1:E7'] },
];

test('Bun executes seven exact XLSX creation and missing-cell cases without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '8718db461c552d17960ea8709c6ed67f1231bc86:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, steps, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
    expect(compiled.filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual([steps]);
    expect(now.expectedOutcomes).toEqual(steps.slice(2));
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, '61721658e5f3284c3b942cea7455f60e8f8fdeee', 'shared v0.97.0', 'features/shared.json', 'tests/acceptance/create-xlsx.ts', 'tests/unit/xlsx-create.test.ts', 'seven exact cases/29 steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(specs.reduce((n, s) => n + s.steps.length, 0)).toBe(29);
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) =>!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&& !changed.has(w.id)));
});
