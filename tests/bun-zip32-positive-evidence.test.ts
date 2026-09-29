const budgetId = new Set(['@id-package-admission-negative-budget']);
const descriptorId = new Set(['@id-zip-unsigned-descriptor-signature-collision']);
const boundId = new Set(['@id-zip-bounds']);
const unsafeId = new Set(['@id-zip-refuse-unsafe']);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/package/zip32.feature';
const specs = [
  {
    id: '@id-zip-read-valid',
    steps: [
      'a ZIP archive with canonical OPC member names',
      'the archive contains stored and deflated file entries',
      'the archive may contain zero-byte directory entries and a declared archive comment',
      'the archive is read through the shared ZIP module',
      'file entries are returned in central-directory order',
      'directory entries do not become package parts',
      'each returned payload matches its declared CRC and size',
    ],
    outcomes: ['file entries are returned in central-directory order', 'directory entries do not become package parts', 'each returned payload matches its declared CRC and size'],
    markers: ['one exact seven-step', 'data descriptor', 'central-directory order', 'lengths and CRCs'],
  },
  {
    id: '@id-zip-write-deterministic',
    steps: [
      'a map of canonical OPC member names and bytes',
      'the map is written through the shared ZIP module twice',
      'both outputs are byte-identical ZIP32 archives',
      'file entries use stored or deflated encoding',
      'names are emitted with the UTF-8 ZIP flag',
      'writer input that would collide by ASCII case is refused',
    ],
    outcomes: ['both outputs are byte-identical ZIP32 archives', 'file entries use stored or deflated encoding', 'names are emitted with the UTF-8 ZIP flag', 'writer input that would collide by ASCII case is refused'],
    markers: ['one exact six-step', 'byte-identical archives', 'stored and deflated', 'local and central headers', 'typed code'],
  },
];

test('Bun executes the two exact ZIP32 positive read/write contracts without cross-consumer credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '151b022133d2aefe60db860ee502f5812348b0dc:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, steps, outcomes, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
    expect(compiled.filter((row: any) => row.scenarioId === id).map((row: any) => row.steps.map((s: any) => s.text))).toEqual([steps]);
    expect(now.expectedOutcomes).toEqual(outcomes);
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, 'e4bcf69eb406509dc410d48d97162f89bd710ba4', 'shared v0.83.0', 'features/shared.json', 'tests/acceptance/core.ts', 'tests/unit/zip.test.ts', 'Fresh GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  const changed = new Set([...specs.map(s => s.id), '@id-zip-refuse-unsafe']);
  expect(ledger.workflows.filter((w: any) =>!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&& !changed.has(w.id)));
});
