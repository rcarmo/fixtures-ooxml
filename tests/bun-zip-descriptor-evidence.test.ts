const textBoxIds = new Set(["@id-pptx-text-box-authoring","@id-pptx-text-box-refusal"]);
const pptxTableIds = new Set(["@id-pptx-table-roundtrip-geometry","@id-pptx-table-formatting","@id-pptx-table-stale-handle","@id-pptx-table-atomic-refusals"]);
const pptxNoopId = new Set(['@id-pptx-bun-open-save-noop']);
const threadIds = new Set(["@id-docx-existing-thread-inspection","@id-docx-existing-thread-resolution","@id-docx-existing-thread-noop","@id-docx-existing-thread-refusal","@id-docx-existing-thread-rollback","@id-docx-existing-thread-encoding","@id-docx-existing-thread-unsupported","@id-docx-existing-thread-limit"]);
const commentIds = new Set(["@id-docx-comments-inspection","@id-docx-comments-resolution","@id-docx-comments-noop","@id-docx-comments-refusal"]);
const relationshipIds = new Set(["@id-office-relationship-prefix-alias","@id-office-relationship-wrong-uri"]);
const custodyIds = new Set(["@id-bun-opc-open-refusal","@id-bun-opc-detached-byte-copies","@id-bun-opc-preserve-utf16le-edit","@id-bun-opc-async-transaction-refusal","@id-bun-opc-thenable-transaction-result","@id-bun-opc-save-invalid-target-custody","@id-bun-opc-symlink-destination-refusal"]);
const coreOpcIds = new Set(["@id-opc-package-corpus-noop","@id-opc-package-transaction-rollback","@id-opc-package-preserve-unrelated"]);
const budgetId = new Set(['@id-package-admission-negative-budget']);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const id = '@id-zip-unsigned-descriptor-signature-collision';
const path = 'workflows/package/data-descriptor-integrity.feature';
const steps = [
  'a single-disk ZIP32 archive has one DEFLATED data.bin member with declared size 7 and stored payload "payload"',
  'its unsigned twelve-byte data descriptor and central directory both declare CRC32 08074B50, equal to the optional descriptor signature value',
  'independent CRC32 of the decompressed payload differs from 08074B50',
  'ZIP admission validates the descriptor shape and then opens the archive with default bounds',
  'the unsigned descriptor is recognised as twelve bytes without borrowing a four-byte signature or central-directory bytes',
  'complete admission refuses the corrupt payload as a CRC or invalid-package failure, not as an ambiguous descriptor-shape failure',
  'no package or member payloads are delivered',
  "the caller's original archive bytes remain unchanged",
];

test('Bun executes unsigned ZIP32 descriptor signature-collision CRC refusal without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '0dc4e5e15e93d584b7cb65eee93afb1302db233b:ledgers/workflows.json']).toString());
  const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
  expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
  expect(cases(path, await Bun.file(path).text()).filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual([steps]);
  expect(now.expectedOutcomes).toEqual(steps.slice(-4));
  expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
  for (const marker of ['1dcbeed05ba69ec7f20cdc25c90220e4bae51bd4', 'shared v0.86.0', 'one exact eight-step', '08074B50', '422C6A15', 'unsigned twelve-byte descriptor', 'zip-crc-mismatch', 'byte-identical', 'features/shared.json', 'tests/acceptance/data-descriptor-integrity.ts', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
  expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  expect(ledger.workflows.filter((w: any) =>!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&& w.id !== id)).toEqual(prior.workflows.filter((w: any) =>!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&& w.id !== id));
});
