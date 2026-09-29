const relationshipIds = new Set(["@id-office-relationship-prefix-alias","@id-office-relationship-wrong-uri"]);
const custodyIds = new Set(["@id-bun-opc-open-refusal","@id-bun-opc-detached-byte-copies","@id-bun-opc-preserve-utf16le-edit","@id-bun-opc-async-transaction-refusal","@id-bun-opc-thenable-transaction-result","@id-bun-opc-save-invalid-target-custody","@id-bun-opc-symlink-destination-refusal"]);
const coreOpcIds = new Set(["@id-opc-package-corpus-noop","@id-opc-package-transaction-rollback","@id-opc-package-preserve-unrelated"]);
const budgetId = new Set(['@id-package-admission-negative-budget']);
const descriptorId = new Set(['@id-zip-unsigned-descriptor-signature-collision']);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const id = '@id-zip-bounds';
const path = 'workflows/package/zip32.feature';
const steps = [
  'a ZIP archive whose declared archive size, entry count, entry size, total expanded size, or compression ratio exceeds the configured limit',
  'the archive is read through the shared ZIP module',
  'the module refuses before allocating unbounded output',
];

test('Bun checks broad ZIP32 limits before invalid DEFLATE without Go/Python or allocator-budget credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'f1104579f56526b50e155ab4550a91050768a373:ledgers/workflows.json']).toString());
  const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
  expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
  expect(cases(path, await Bun.file(path).text()).filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual([steps]);
  expect(now.expectedOutcomes).toEqual(steps.slice(-1));
  expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
  for (const marker of ['7745d19daa9c8f50a34882ff51bc460dde162200', 'shared v0.85.0', 'one exact three-step', 'maxArchiveBytes', 'maxEntries', 'maxEntryBytes', 'maxTotalBytes', 'maxCompressionRatio', 'zip-data-invalid without limits', 'before inflation is attempted', 'caller archive bytes unchanged', 'tests/acceptance/core.ts', 'tests/unit/zip.test.ts', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python', 'not a measured allocator cap']) expect(now.consumers.bun.evidence).toContain(marker);
  expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  expect(ledger.workflows.filter((w: any) =>!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&& w.id !== id)).toEqual(prior.workflows.filter((w: any) =>!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&& w.id !== id));
});
