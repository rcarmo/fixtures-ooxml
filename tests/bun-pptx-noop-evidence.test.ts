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
  expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  expect(ledger.workflows.filter((w: any) =>!pptxTableIds.has(w.id)&& w.id !== id)).toEqual(prior.workflows.filter((w: any) =>!pptxTableIds.has(w.id)&& w.id !== id));
});
