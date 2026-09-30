import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

test('Go credits one four-step preserved-package corpus case', async () => {
  const id = '@id-opc-package-corpus-noop';
  const feature = 'workflows/package/preservation.feature';
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '2ab5f6c91cd3434d3d63fe0282a627d1ee628513:ledgers/workflows.json']).toString());
  const now = ledger.workflows.find((w: any) => w.id === id);
  const old = prior.workflows.find((w: any) => w.id === id);
  const selected = cases(feature, await Bun.file(feature).text()).filter((c: any) => c.scenarioId === id);
  expect(now.feature).toBe(feature);
  expect(now.expandedCases).toBe(1);
  expect(selected).toHaveLength(1);
  expect(selected[0].name).toBe('Opening and reopening the fixture corpora without edits preserves whole archives');
  const authored = [
    'the go-ooxml and python-office-mcp-server fixture corpora are enumerated',
    'each OOXML fixture package is opened and serialized without edits through the OPC layer',
    'every reopened package matches its original whole-archive bytes',
    'both fixture corpora contribute their exact known nonzero fixture counts',
  ];
  expect(selected[0].steps.map((s: any) => s.text)).toEqual(authored);
  expect(now.expectedOutcomes).toEqual(authored.slice(2));
  expect(old.consumers.go.status).toBe('planned');
  expect(now.consumers.go.status).toBe('implemented');
  for (const marker of [
    '0f3d4bec02fe0d9c7d66839fa77e3ce8a294fc38',
    'shared v0.138.0',
    'acceptance/{acceptance,inventory,opc_corpus_noop}_test.go',
    'reports/batches/285.md',
    '36 distinct Go-origin and 35 direct Python testdata-origin',
    '427 cases/1479 executed steps',
    'Go has no GitHub Actions CI',
  ]) expect(now.consumers.go.evidence).toContain(marker);
  expect(now.consumers.bun).toEqual(old.consumers.bun);
  expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged = structuredClone(now);
  unchanged.consumers.go = old.consumers.go;
  expect(unchanged).toEqual(old);
  expect(ledger.workflows.filter((w: any) => w.id !== '@id-python-comments-mixed-done' && w.id !== id && w.id !== '@id-package-admission-unsupported-compression' && w.id !== '@id-package-admission-unsafe-members' && w.id !== '@id-xml-escaping-whitespace-roundtrip')).toEqual(prior.workflows.filter((w: any) => w.id !== '@id-python-comments-mixed-done' && w.id !== id && w.id !== '@id-package-admission-unsupported-compression' && w.id !== '@id-package-admission-unsafe-members' && w.id !== '@id-xml-escaping-whitespace-roundtrip'));
});
