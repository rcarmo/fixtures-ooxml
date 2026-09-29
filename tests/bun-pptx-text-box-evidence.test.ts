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
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(specs.reduce((n, s) => n + s.kinds.length, 0)).toBe(23);
  expect(specs.reduce((n, s) => n + s.kinds.reduce((m, k) => m + s.steps(k).length, 0), 0)).toBe(77);
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) => !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) => !changed.has(w.id)));
});
