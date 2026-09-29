const threadIds = new Set(["@id-docx-existing-thread-inspection","@id-docx-existing-thread-resolution","@id-docx-existing-thread-noop","@id-docx-existing-thread-refusal","@id-docx-existing-thread-rollback","@id-docx-existing-thread-encoding","@id-docx-existing-thread-unsupported","@id-docx-existing-thread-limit"]);
const commentIds = new Set(["@id-docx-comments-inspection","@id-docx-comments-resolution","@id-docx-comments-noop","@id-docx-comments-refusal"]);
const relationshipIds = new Set(["@id-office-relationship-prefix-alias","@id-office-relationship-wrong-uri"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/package/preservation.feature';
const ids = ['@id-bun-opc-open-refusal', '@id-bun-opc-detached-byte-copies', '@id-bun-opc-preserve-utf16le-edit', '@id-bun-opc-async-transaction-refusal', '@id-bun-opc-thenable-transaction-result', '@id-bun-opc-save-invalid-target-custody', '@id-bun-opc-symlink-destination-refusal'];
const expectedCases = [5, 1, 1, 1, 1, 1, 1];
const expectedSteps = [9, 10, 10, 10, 10, 11, 12];
const markers = [
  ['Five exact nine-step', 'noncanonical part name', 'duplicate relationship ID'],
  ['One exact ten-step', 'caller archive bytes', 'unchanged serialization/reopen'],
  ['One exact ten-step', 'FF FE', 'UTF-16 XML declaration'],
  ['One exact ten-step', 'opc-async-transaction', 'before its body runs'],
  ['One exact ten-step', 'identical thenable', 'without invoking then()'],
  ['One exact eleven-step', 'existing destination file', 'original package bytes'],
  ['One exact twelve-step', 'symlink identity/target', 'unchanged'],
];
const outcomes = (rows: Array<{ steps: Array<{ text: string }> }>) => [...new Set(rows.flatMap(row => row.steps.map(s => s.text).filter(text =>
  text.startsWith('it throws') || text.startsWith('the error message') || text.startsWith('the ran flag') ||
  text.startsWith('a fresh get') || text.startsWith('serializing') || text.startsWith('the saved document') ||
  text.startsWith('decoding') || text.startsWith('the transaction returns') || text.startsWith('the document text') ||
  text.includes('destination file bytes equal')
)))];

test('Bun executes eleven exact OPC custody and save-path cases without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '57555eeed6204e0a8fa2266b29a4fed838a5bf8e:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]!, rows = compiled.filter((row: any) => row.scenarioId === id);
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(expectedCases[i]);
    expect(rows).toHaveLength(expectedCases[i]!); expect(rows.every(row => row.steps.length === expectedSteps[i])).toBe(true);
    expect(now.expectedOutcomes).toEqual(outcomes(rows));
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers[i]!, 'd71b9b673304b7437a6d5ce9c745ce42ab23792a', 'shared v0.89.0', 'tests/acceptance/opc-custody.ts', 'tests/unit/opc-custody-bindings.test.ts', 'eleven exact cases/108 compiled steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(expectedCases.reduce((a, b) => a + b, 0)).toBe(11);
  expect(expectedCases.reduce((sum, count, i) => sum + count * expectedSteps[i]!, 0)).toBe(108);
  const changed = new Set(ids);
  expect(ledger.workflows.filter((w: any) =>!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&& !changed.has(w.id)));
});
