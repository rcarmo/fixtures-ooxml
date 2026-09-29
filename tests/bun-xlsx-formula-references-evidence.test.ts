import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/xlsx/formula-references.feature';
const ids = [
  ['@id-xlsx-go-formula-analysis-counts', 6, 24, 'six example formulas'],
  ['@id-xlsx-go-formula-quoted-sheet-flags', 1, 5, 'independent first/last'],
  ['@id-xlsx-go-formula-analysis-refusal', 7, 21, 'seven unsupported/invalid'],
  ['@id-xlsx-go-formula-literal-punctuation', 5, 15, 'five punctuation-string'],
  ['@id-xlsx-go-direct-range-parsing', 6, 24, 'no second-endpoint credit'],
  ['@id-xlsx-go-direct-range-refusal', 7, 21, 'seven non-direct/unsupported'],
  ['@id-xlsx-go-static-remap-exact', 5, 15, 'five static row/column'],
  ['@id-xlsx-go-static-remap-refusal', 7, 21, 'seven invalid/unsupported'],
  ['@id-xlsx-go-static-reference-properties', 1, 6, '288-expression matrix'],
] as const;

test('Bun executes 45 exact static-reference API cases without formula calculation or cross-consumer credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'ff43afe10044040f33b82513798c2019ba96942b:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const [id, count, steps, scope] of ids) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    const rows = compiled.filter((r: any) => r.scenarioId === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(count); expect(rows).toHaveLength(count);
    expect(rows.reduce((n: number, r: any) => n + r.steps.length, 0)).toBe(steps);
    expect(now.expectedOutcomes).toEqual([...new Set(rows.flatMap((r: any) => r.steps.slice(2).map((s: any) => s.text)).filter((text: string) => text !== 'the static analyser checks all 3 by 4 by 4 by 6 source expressions'))]);
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [scope, '9aa63cf33a5b602fed7479748f6922e74d669621', 'shared v0.100.0', 'features/shared.json', '45 exact cases/152 steps', 'tests/acceptance/formula-analysis.ts', 'tests/acceptance/xlsx-range.ts', 'tests/acceptance/formula-remap.ts', 'Fresh post-push recursive Bun make check', '732/732', '36534553649', 'no formula evaluation', 'Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    if (!['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal'].includes(id)) expect(now.consumers.go).toEqual(old.consumers.go);
    expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; unchanged.consumers.go = old.consumers.go; expect(unchanged).toEqual(old);
  }
  expect(ids.reduce((n, [, cases]) => n + cases, 0)).toBe(45);
  expect(ids.reduce((n, [, , steps]) => n + steps, 0)).toBe(152);
  const changed = new Set(ids.map(([id]) => id));
  expect(ledger.workflows.filter((w: any) => w.feature !== 'workflows/docx/tracking-settings.feature' && !['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal'].includes(w.id) && !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) => w.feature !== 'workflows/docx/tracking-settings.feature' && !['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal'].includes(w.id) && !changed.has(w.id)));
});
