import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/xlsx/cell-style.feature';
const specs = [
  {
    id: '@id-xlsx-cell-style-selection',
    kinds: ['assign', 'replace', 'explicit-zero', 'remove', 'no-op', 'absent-removal', 'formula', 'blank', 'aliased'],
    steps: (kind: string) => [`a native workbook prepared for cell-style ${kind}`, `the existing cell style is selected for ${kind}`, `reopened cell style and change receipt match ${kind}`, 'values formulas caches and unrelated package parts retain exact custody'],
    markers: ['Nine exact four-step', 'formula, blank and namespace alias', 'caches'],
  },
  {
    id: '@id-xlsx-cell-style-refusal',
    kinds: ['missing-cell', 'invalid-index', 'missing-index', 'duplicate-relationship', 'external-styles', 'wrong-mime', 'wrong-root', 'duplicate-cellxfs', 'incorrect-count', 'invalid-font', 'invalid-base', 'missing-number-format', 'protected-sheet', 'protected-workbook', 'stale-sheet', 'stale-relationship', 'malformed-old-index', 'worksheet-alias'],
    steps: (kind: string) => [`an unsafe cell-style selection input ${kind}`, 'its existing cell-style selection is attempted', 'cell-style selection refuses without changing package bytes or cached cell state'],
    markers: ['Eighteen exact three-step', 'package bytes and cached cell state unchanged'],
  },
];

test('Bun executes exact XLSX cell-style selection and refusal cases without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '8c5ff348937951701da07b44a05acaf88fdada1a:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, kinds, steps, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(kinds.length);
    expect(compiled.filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual(kinds.map(steps));
    expect(now.expectedOutcomes).toEqual([...new Set(kinds.flatMap(kind => steps(kind).slice(2)))]);
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, 'd4b3c351b529ee658a0d90b507b37365b92c2c56', 'shared v0.98.0', 'features/shared.json', 'tests/acceptance/cell-style.ts', 'tests/unit/xlsx-cell-style.test.ts', '27 exact cases/90 steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(specs.reduce((n, s) => n + s.kinds.length, 0)).toBe(27);
  expect(specs.reduce((n, s) => n + s.kinds.reduce((m, k) => m + s.steps(k).length, 0), 0)).toBe(90);
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) => w.id !== '@id-xlsx-comment-vml-existing-graph' && !['@id-docx-paragraph-style-authoring','@id-docx-paragraph-style-authoring-refusal'].includes(w.id) && !['@id-xlsx-go-formula-analysis-counts','@id-xlsx-go-formula-quoted-sheet-flags','@id-xlsx-go-formula-analysis-refusal'].includes(w.id) && !['@id-docx-final-section-layout','@id-docx-final-section-layout-refusal'].includes(w.id) && w.feature !== 'workflows/docx/effective-formatting.feature' && w.feature !== 'workflows/docx/tracking-settings.feature' && !['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal'].includes(w.id) && w.id !== '@id-xlsx-comment-vml-existing-graph' && !w.feature.endsWith('/formula-references.feature') && !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) => w.id !== '@id-xlsx-comment-vml-existing-graph' && !['@id-docx-paragraph-style-authoring','@id-docx-paragraph-style-authoring-refusal'].includes(w.id) && !['@id-xlsx-go-formula-analysis-counts','@id-xlsx-go-formula-quoted-sheet-flags','@id-xlsx-go-formula-analysis-refusal'].includes(w.id) && !['@id-docx-final-section-layout','@id-docx-final-section-layout-refusal'].includes(w.id) && w.feature !== 'workflows/docx/effective-formatting.feature' && w.feature !== 'workflows/docx/tracking-settings.feature' && !['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal'].includes(w.id) && w.id !== '@id-xlsx-comment-vml-existing-graph' && !w.feature.endsWith('/formula-references.feature') && !changed.has(w.id)));
});
