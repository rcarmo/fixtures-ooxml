const cellStyleIds = new Set(["@id-xlsx-cell-style-selection","@id-xlsx-cell-style-refusal"]);
const xlsxCreateIds = new Set(["@id-xlsx-create-native-default","@id-xlsx-create-add-worksheet","@id-xlsx-create-prefixed-missing-cell","@id-xlsx-create-coordinate-boundary","@id-xlsx-create-row-ordering","@id-xlsx-create-invalid-params-atomic","@id-xlsx-create-existing-fixture-append"]);
const slideOrderIds = new Set(["@id-pptx-slide-permutation","@id-pptx-slide-permutation-refusal"]);
const textBoxIds = new Set(["@id-pptx-text-box-authoring","@id-pptx-text-box-refusal"]);
const pptxTableIds = new Set(["@id-pptx-table-roundtrip-geometry","@id-pptx-table-formatting","@id-pptx-table-stale-handle","@id-pptx-table-atomic-refusals"]);
const pptxNoopId = new Set(['@id-pptx-bun-open-save-noop']);
const threadIds = new Set(["@id-docx-existing-thread-inspection","@id-docx-existing-thread-resolution","@id-docx-existing-thread-noop","@id-docx-existing-thread-refusal","@id-docx-existing-thread-rollback","@id-docx-existing-thread-encoding","@id-docx-existing-thread-unsupported","@id-docx-existing-thread-limit"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/docx/comments.feature';
const specs = [
  { id: '@id-docx-comments-inspection', names: ['the pinned threaded Word comments package is opened', 'existing Word comments are inspected', 'the three comment bodies and reply parent match the pinned fixture', 'the Word comment package bytes remain unchanged'], markers: ['one exact four-step', 'three body strings', 'complete archive unchanged'] },
  { id: '@id-docx-comments-resolution', names: ['the pinned threaded Word comments package is opened', 'Word comment "1" is marked resolved', 'saving and reopening shows that comment resolved and its reply link intact', 'only the existing commentsExtended part differs from the input', 'Word comment "1" is reopened', 'the original comment package member bytes are restored'], markers: ['one exact six-step', 'reply link intact', 'every original member byte'] },
  { id: '@id-docx-comments-noop', names: ['the pinned threaded Word comments package is opened', 'Word comment "1" is reopened', 'the Word comment package bytes remain unchanged'], markers: ['one exact three-step', 'whole package bytes unchanged'] },
  { id: '@id-docx-comments-refusal', names: ['missing-extension', 'duplicate-id', 'duplicate-para', 'missing-parent', 'cycle', 'invalid-done', 'wrong-mime', 'external-link', 'protected', 'revision-body', 'orphan-entry'], markers: ['Eleven exact three-step', 'typed OoxmlError', 'every package byte'] },
];

test('Bun executes fourteen exact existing-comment inspection, resolution, noop and refusal cases', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'af04b1d42b787f76b88f21009ac105888b9d16bd:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, names, markers } of specs) {
    const rows = compiled.filter((r: any) => r.scenarioId === id);
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(rows.length);
    if (id === '@id-docx-comments-refusal') expect(rows.map(r => r.steps[0]!.text)).toEqual(names.map(name => `an existing Word comment refusal package ${name}`));
    else expect(rows.map(r => r.steps.map(s => s.text))).toEqual([names]);
    expect(now.expectedOutcomes).toEqual(id === '@id-docx-comments-refusal' ? ['a typed comment refusal leaves every package byte unchanged'] : id === '@id-docx-comments-noop' ? names.slice(-1) : id === '@id-docx-comments-inspection' ? names.slice(-2) : [names[2]!, names[3]!, names[5]!]);
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, 'bfb7f3e820040bdc8f2f5e4da3db90800fbe29b8', 'shared v0.91.0', 'tests/acceptance/comments-docx.ts', 'tests/unit/docx-comments.test.ts', 'fourteen selected cases/46 steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(compiled.filter(r => specs.some(s => s.id === r.scenarioId)).reduce((n, r) => n + r.steps.length, 0)).toBe(46);
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) =>!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&& !changed.has(w.id)));
});
