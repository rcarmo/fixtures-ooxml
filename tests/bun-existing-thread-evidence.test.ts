const pptxNoopId = new Set(['@id-pptx-bun-open-save-noop']);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/docx/comments.feature';
const suffixes = ['inspection', 'resolution', 'noop', 'refusal', 'rollback', 'encoding', 'unsupported', 'limit'];
const counts = [3, 3, 1, 9, 2, 3, 1, 1];
const steps = [5, 7, 4, 4, 5, 4, 6, 4];
const markers = [
  ['pinned, nested and reordered', 'immutable detached records'],
  ['root/member/changed-flag receipt', 'original member bytes'],
  ['first full-thread edit changes one flag', 'repeated edit changes zero'],
  ['Nine exact four-step', 'typed OoxmlError and no receipt'],
  ['part-write and serialization failures', 'prior unrelated edit'],
  ['UTF-8-BOM, UTF-16LE and UTF-16BE', 'aliased namespace meaning'],
  ['two immutable root groups', 'nonempty unsupported report'],
  ['10001-comment', 'docx-comments-limit'],
];

test('Bun executes twenty-three exact existing-thread cases without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', '92dc81cc00958b57611faa4025a63d7a81f301ec:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (let i = 0; i < suffixes.length; i++) {
    const id = '@id-docx-existing-thread-' + suffixes[i], rows = compiled.filter((r: any) => r.scenarioId === id);
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(counts[i]);
    expect(rows).toHaveLength(counts[i]!); expect(rows.every(r => r.steps.length === steps[i])).toBe(true);
    const observed = [...new Set(rows.flatMap(r => r.steps.filter(s => s.text.startsWith('the ') || s.text.startsWith('a typed ') || s.text.startsWith('all returned ') || s.text.startsWith('reopened ') || s.text.startsWith('both operations ') || s.text.startsWith('two immutable ')).map(s => s.text)))];
    expect(now.expectedOutcomes).toEqual(observed.filter(s => s !== 'the selected thread is reopened and saved again' && s !== 'the main document has a prior unrelated edit'));
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers[i]!, '4aa1f0960305c9665e500725b693976174bfb104', 'shared v0.92.0', 'features/shared.json', 'tests/acceptance/comment-threads.ts', 'tests/unit/comment-thread-outcomes.test.ts', '23 cases/108 steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(counts.reduce((n, c) => n + c, 0)).toBe(23);
  expect(counts.reduce((n, c, i) => n + c * steps[i]!, 0)).toBe(108);
  const changed = new Set(suffixes.map(s => '@id-docx-existing-thread-' + s));
  expect(ledger.workflows.filter((w: any) =>!pptxNoopId.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!pptxNoopId.has(w.id)&& !changed.has(w.id)));
});
