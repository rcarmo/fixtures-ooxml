import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/xlsx/comment-vml-custody.feature';
const id = '@id-xlsx-comment-vml-existing-graph';
const steps = [
  'fixture fixture-264be55e012d4bc2b3bf25e59824fdd30022e94f70869ea7d6ad960b803a902f',
  'a namespace-aware reader opens xl/worksheets/sheet1.xml and its relationship part',
  'the legacyDrawing relationship ID is anysvml and resolves internally to xl/drawings/commentsDrawing1.vml',
  'the corresponding relationship Type is http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing',
  'a separate comments relationship resolves internally to xl/comments/comment1.xml',
  'the comment part contains A2 with text This is the protagonist who creates the creature.',
  "the comment part contains A3 with text Often mistakenly called 'Frankenstein' - that is the creator's name.",
];

test('Bun executes only the existing XLSX comment/VML graph, not five editing profiles', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '279042ea89365318b03097bc7883e80148978090:ledgers/workflows.json']).toString());
  const rows = cases(path, await Bun.file(path).text());
  const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
  expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
  expect(rows.filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual([steps]);
  expect(now.expectedOutcomes).toEqual(steps.slice(2));
  expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
  for (const marker of ['edfb914fcc5c1801253ff5a3b7f2aa87b46e11a3', 'shared v0.99.0', 'seven-step existing-graph case', 'anysvml', 'vmlDrawing', 'xl/comments/comment1.xml', 'A2 and A3', 'read-only input/package byte custody', 'tests/acceptance/xlsx-comment-vml.ts', 'tests/unit/xlsx-comment-vml-bindings.test.ts', 'features/shared.json', 'Bun make check', '732/732', '36533344489', 'five preservation-row/limited-number editor scenarios', 'Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
  expect(now.consumers.go).toEqual(old.consumers.go); expect(old.consumers.python.status).toBe('planned'); expect(now.consumers.python.status).toBe('implemented');
  const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; unchanged.consumers.python = old.consumers.python; expect(unchanged).toEqual(old);
  expect(rows.filter((r: any) => r.scenarioId !== id)).toHaveLength(5);
  expect(ledger.workflows.filter((w: any) => w.id !== '@id-xlsx-comment-vml-existing-graph' && !['@id-docx-paragraph-style-authoring','@id-docx-paragraph-style-authoring-refusal'].includes(w.id) && !['@id-xlsx-go-formula-analysis-counts','@id-xlsx-go-formula-quoted-sheet-flags','@id-xlsx-go-formula-analysis-refusal'].includes(w.id) && !['@id-docx-final-section-layout','@id-docx-final-section-layout-refusal'].includes(w.id) && w.feature !== 'workflows/docx/effective-formatting.feature' && w.feature !== 'workflows/docx/tracking-settings.feature' && !['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal'].includes(w.id) && w.id !== id && !w.feature.endsWith('/formula-references.feature'))).toEqual(prior.workflows.filter((w: any) => w.id !== '@id-xlsx-comment-vml-existing-graph' && !['@id-docx-paragraph-style-authoring','@id-docx-paragraph-style-authoring-refusal'].includes(w.id) && !['@id-xlsx-go-formula-analysis-counts','@id-xlsx-go-formula-quoted-sheet-flags','@id-xlsx-go-formula-analysis-refusal'].includes(w.id) && !['@id-docx-final-section-layout','@id-docx-final-section-layout-refusal'].includes(w.id) && w.feature !== 'workflows/docx/effective-formatting.feature' && w.feature !== 'workflows/docx/tracking-settings.feature' && !['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal'].includes(w.id) && w.id !== id && !w.feature.endsWith('/formula-references.feature')));
});
