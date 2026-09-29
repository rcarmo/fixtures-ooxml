const commentIds = new Set(["@id-docx-comments-inspection","@id-docx-comments-resolution","@id-docx-comments-noop","@id-docx-comments-refusal"]);
const relationshipIds = new Set(["@id-office-relationship-prefix-alias","@id-office-relationship-wrong-uri"]);
const custodyIds = new Set(["@id-bun-opc-open-refusal","@id-bun-opc-detached-byte-copies","@id-bun-opc-preserve-utf16le-edit","@id-bun-opc-async-transaction-refusal","@id-bun-opc-thenable-transaction-result","@id-bun-opc-save-invalid-target-custody","@id-bun-opc-symlink-destination-refusal"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/package/preservation.feature';
const specs = [
  {
    id: '@id-opc-package-corpus-noop',
    steps: ['the go-ooxml and python-office-mcp-server fixture corpora are enumerated', 'each OOXML fixture package is opened and serialized without edits through the OPC layer', 'every reopened package matches its original whole-archive bytes', 'both fixture corpora contribute their exact known nonzero fixture counts'],
    markers: ['one exact four-step', '36 Go-origin and 35 Python-origin', '71 total', 'byte-identical'],
  },
  {
    id: '@id-opc-package-transaction-rollback',
    steps: ['a valid OPC package with XML and opaque payload parts', 'a transactional edit changes multiple parts and then fails', 'the package reverts to the original bytes and parts after the refusal'],
    markers: ['one exact three-step', 'changes both', 'both part bytes equal'],
  },
  {
    id: '@id-opc-package-preserve-unrelated',
    steps: ['a valid OPC package with a main XML part and an unrelated binary payload', 'the main XML part text is changed and the package is reopened', 'the edited part contains the new text after reopen', 'the unrelated payload bytes remain unchanged'],
    markers: ['one exact four-step', 'saves and reopens', 'unrelated opaque binary payload bytes'],
  },
];

test('Bun executes three exact OPC corpus, rollback and unrelated-payload preservation cases', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'f4a15b68615220686620529f7469a8e5aa801a48:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, steps, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(1);
    expect(compiled.filter((row: any) => row.scenarioId === id).map((row: any) => row.steps.map((s: any) => s.text))).toEqual([steps]);
    expect(now.expectedOutcomes).toEqual(steps.slice(id === '@id-opc-package-transaction-rollback' ? -1 : -2));
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, 'edc342eba89bfe62d790059083732ae09f9c043a', 'shared v0.88.0', 'features/shared.json', 'tests/acceptance/core.ts', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) =>!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&& !changed.has(w.id)));
});
