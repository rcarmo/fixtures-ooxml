const budgetId = new Set(['@id-package-admission-negative-budget']);
const descriptorId = new Set(['@id-zip-unsigned-descriptor-signature-collision']);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const id = '@id-zip-refuse-unsafe';
const path = 'workflows/package/zip32.feature';
const outcomes = [
  'the module refuses duplicate member names',
  'the module refuses ASCII case-colliding member names',
  'the module refuses noncanonical member paths',
  'the module refuses encrypted or unsupported-compression members',
  'the module refuses multi-disk archives and ZIP64 sentinels without valid end records',
  'the module refuses local-header metadata that disagrees with the central directory',
  'the module refuses CRC failures, size mismatches, and undeclared trailing structure',
];

test('Bun alone executes broad ZIP32 unsafe structural refusal without bounds or cross-consumer credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '423398e552dd737bd7dc1d89707165927d894d75:ledgers/workflows.json']).toString());
  const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
  expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
  expect(cases(path, await Bun.file(path).text()).filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual([[
    'a ZIP archive whose structure has no single safe reading',
    'the archive is read through the shared ZIP module',
    ...outcomes,
  ]]);
  expect(now.expectedOutcomes).toEqual(outcomes);
  expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
  for (const marker of ['98138f740215c8bca8f94512198824c2b330b269', 'shared v0.84.0', 'nine-step', 'eleven distinct archives', 'independent literal code', 'tests/acceptance/core.ts', 'tests/unit/zip32-bindings.test.ts', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
  expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  expect(ledger.workflows.filter((w: any) =>!budgetId.has(w.id)&&!descriptorId.has(w.id)&& w.id !== id && w.id !== '@id-zip-bounds')).toEqual(prior.workflows.filter((w: any) =>!budgetId.has(w.id)&&!descriptorId.has(w.id)&& w.id !== id && w.id !== '@id-zip-bounds'));
  expect(ledger.workflows.find((w: any) => w.id === '@id-zip-bounds').consumers.bun.status).toBe('implemented');
});
