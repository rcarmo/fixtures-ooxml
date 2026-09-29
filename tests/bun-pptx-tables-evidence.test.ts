const slideOrderIds = new Set(["@id-pptx-slide-permutation","@id-pptx-slide-permutation-refusal"]);
const textBoxIds = new Set(["@id-pptx-text-box-authoring","@id-pptx-text-box-refusal"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/pptx/tables.feature';
const specs = [
  { id: '@id-pptx-table-roundtrip-geometry', steps: [['PPTX table round-trip scenario is prepared from a new presentation', 'PPTX authors a rectangular table and saves then reopens it', 'PPTX preserves the table size, exact grid sums, and cell text after reopen']], markers: ['2x3 table', 'column/row grid sums'] },
  { id: '@id-pptx-table-formatting', steps: [['PPTX styled table fixture is prepared', 'PPTX replaces a styled table cell and saves then reopens the presentation', 'PPTX preserves table cell formatting across the update and reopen']], markers: ['existing styled-table', 'end-paragraph language'] },
  { id: '@id-pptx-table-stale-handle', steps: [['PPTX stale table handle scenario is prepared from a new presentation', 'PPTX mutates the slide and retries a stale table cell handle', 'PPTX refuses the stale table handle without mutating the package']], markers: ['PPTX_STALE_TABLE_HANDLE', 'without changing package bytes'] },
  { id: '@id-pptx-table-atomic-refusals', steps: [['PPTX table refusal scenario "merged-cell" is prepared', 'PPTX attempts the table refusal "merged-cell"', 'PPTX refusal "PPTX_TABLE_MERGE_UNSUPPORTED" is returned atomically for table refusal "merged-cell"'], ['PPTX table refusal scenario "malformed-merge" is prepared', 'PPTX attempts the table refusal "malformed-merge"', 'PPTX refusal "PPTX_TABLE_STRUCTURE_UNSUPPORTED" is returned atomically for table refusal "malformed-merge"']], markers: ['merged-cell', 'malformed-merge', 'empty package diff'] },
];

test('Bun executes five exact PPTX table authoring and refusal cases without cross-consumer credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '215b9c92b43b979c1a0f839bff31db7b27c9736c:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, steps, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(steps.length);
    expect(compiled.filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual(steps);
    expect(now.expectedOutcomes).toEqual(steps.map(row => row[2]));
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, '23ca11a6fee107c8abcf3e7552865866fbc944fa', 'shared v0.94.0', 'tests/acceptance/tables-pptx.ts', 'tests/unit/pptx-tables.test.ts', 'five cases/15 steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) =>!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&& !changed.has(w.id)));
});
