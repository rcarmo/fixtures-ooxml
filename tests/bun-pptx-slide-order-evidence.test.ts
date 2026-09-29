const pythonCommentVmlId = '@id-xlsx-comment-vml-existing-graph';
const styleAuthoringIds = new Set(['@id-docx-paragraph-style-authoring','@id-docx-paragraph-style-authoring-refusal']);
const goFormulaAnalysisIds = new Set(['@id-xlsx-go-formula-analysis-counts','@id-xlsx-go-formula-quoted-sheet-flags','@id-xlsx-go-formula-analysis-refusal']);
const pageLayoutIds = new Set(['@id-docx-final-section-layout','@id-docx-final-section-layout-refusal']);
const effectiveIds = new Set(['@id-docx-effective-run-formatting','@id-docx-effective-run-formatting-refusal']);
const trackingIds = new Set(['persistence','custody','no-op','refusal','rollback','plain-edit','author-refusal'].map(name => '@id-docx-tracking-settings-'+name));
const goDirectRangeIds = new Set(['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal']);
const formulaIds = new Set(["@id-xlsx-go-formula-analysis-counts","@id-xlsx-go-formula-quoted-sheet-flags","@id-xlsx-go-formula-analysis-refusal","@id-xlsx-go-formula-literal-punctuation","@id-xlsx-go-direct-range-parsing","@id-xlsx-go-direct-range-refusal","@id-xlsx-go-static-remap-exact","@id-xlsx-go-static-remap-refusal","@id-xlsx-go-static-reference-properties"]);
const commentVmlId = '@id-xlsx-comment-vml-existing-graph';
const cellStyleIds = new Set(["@id-xlsx-cell-style-selection","@id-xlsx-cell-style-refusal"]);
const xlsxCreateIds = new Set(["@id-xlsx-create-native-default","@id-xlsx-create-add-worksheet","@id-xlsx-create-prefixed-missing-cell","@id-xlsx-create-coordinate-boundary","@id-xlsx-create-row-ordering","@id-xlsx-create-invalid-params-atomic","@id-xlsx-create-existing-fixture-append"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/pptx/slide-order.feature';
const specs = [
  {
    id: '@id-pptx-slide-permutation',
    kinds: ['reverse', 'rotate', 'same', 'empty', 'aliased', 'default-namespace', 'notes'],
    steps: (kind: string) => [`a native deck prepared for slide-order ${kind}`, `its slides are reordered for ${kind}`, `reopened slide order and change receipt match ${kind}`, 'slide identities and unrelated package bytes are retained'],
    markers: ['Seven exact four-step', 'linked notes', 'slide handle/identity', 'original slide-list XML bytes'],
  },
  {
    id: '@id-pptx-slide-permutation-refusal',
    kinds: ['duplicate-index', 'missing-index', 'out-of-range', 'fractional-index', 'duplicate-id', 'duplicate-target', 'wrong-mime', 'duplicate-list', 'lexical-barrier', 'custom-show', 'extension-metadata', 'protected', 'stale-main', 'stale-relationships'],
    steps: (kind: string) => [`an unsafe slide-order input ${kind}`, 'its slide permutation is attempted', 'slide-order refusal preserves archive bytes and handle order'],
    markers: ['Fourteen exact three-step', 'typed PPTX_ error', 'archive bytes and slide handles'],
  },
];

test('Bun executes twenty-one exact slide permutation and atomic refusal cases without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'b4a74ce5659a14f5d67990f54de6af7822f5d83d:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, kinds, steps, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(kinds.length);
    expect(compiled.filter((r: any) => r.scenarioId === id).map((r: any) => r.steps.map((s: any) => s.text))).toEqual(kinds.map(steps));
    expect(now.expectedOutcomes).toEqual([...new Set(kinds.flatMap(kind => steps(kind).slice(2)))]);
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, 'f1081532a5dbe7c44213d590ab8199635525eecd', 'shared v0.96.0', 'features/shared.json', 'tests/acceptance/slide-order.ts', 'tests/unit/pptx-slide-order.test.ts', '21 exact cases/70 steps', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  expect(specs.reduce((n, s) => n + s.kinds.length, 0)).toBe(21);
  expect(specs.reduce((n, s) => n + s.kinds.reduce((m, k) => m + s.steps(k).length, 0), 0)).toBe(70);
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) =>w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&& !changed.has(w.id)));
});
