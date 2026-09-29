const pptxTableIds = new Set(["@id-pptx-table-roundtrip-geometry","@id-pptx-table-formatting","@id-pptx-table-stale-handle","@id-pptx-table-atomic-refusals"]);
const pptxNoopId = new Set(['@id-pptx-bun-open-save-noop']);
const threadIds = new Set(["@id-docx-existing-thread-inspection","@id-docx-existing-thread-resolution","@id-docx-existing-thread-noop","@id-docx-existing-thread-refusal","@id-docx-existing-thread-rollback","@id-docx-existing-thread-encoding","@id-docx-existing-thread-unsupported","@id-docx-existing-thread-limit"]);
const commentIds = new Set(["@id-docx-comments-inspection","@id-docx-comments-resolution","@id-docx-comments-noop","@id-docx-comments-refusal"]);
import { test, expect } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { cases } from '../scripts/verify.ts';

const path = 'workflows/package/relationship-namespaces.feature';
const specs = [
  {
    id: '@id-office-relationship-prefix-alias',
    steps: ['the shared <format> fixture with its relationship prefix changed to link', 'the document editor opens it edits its text and saves then reopens it', 'the requested <format> value survives and all relationship targets resolve', 'the original relationship attribute spelling is preserved'],
    markers: ['alternate-prefix', 'link:id', 'exact text/cell value', 'without an r:id spelling'],
  },
  {
    id: '@id-office-relationship-wrong-uri',
    steps: ['the shared <format> fixture with r bound to package relationships', 'the document reader attempts to open the namespace-mismatched Office document', 'the <format> reader refuses with its structural error code', 'the supplied archive bytes remain unchanged'],
    markers: ['wrong-namespace', 'PPTX_PRESENTATION_INVALID', 'xlsx-workbook-invalid', 'archive bytes unchanged'],
  },
];

test('Bun executes four exact PPTX/XLSX relationship expanded-name cases without Go/Python credit', async () => {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'c511c5677d57423caf832319932974454c54a711:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (const { id, steps, markers } of specs) {
    const now = ledger.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    const rows = compiled.filter((row: any) => row.scenarioId === id);
    expect(now.feature).toBe(path); expect(now.expandedCases).toBe(2);
    expect(rows.map((row: any) => row.steps.map((s: any) => s.text))).toEqual(['pptx', 'xlsx'].map(format => steps.map(s => s.replaceAll('<format>', format))));
    const expected = [...new Set(rows.flatMap(row => row.steps.slice(2).map(s => s.text)))];
    expect(now.expectedOutcomes).toEqual(expected);
    expect(old.consumers.bun.status).toBe('planned'); expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of [...markers, '529dce0c5909c1fa5e23ce5d742cc1614172094b', 'shared v0.90.0', 'tests/acceptance/relationship-namespaces.ts', 'four canonical cases (16 steps)', 'tests/unit/relationship-namespaces.test.ts', 'Fresh post-push GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go); expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun; expect(unchanged).toEqual(old);
  }
  const changed = new Set(specs.map(s => s.id));
  expect(ledger.workflows.filter((w: any) =>!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&& !changed.has(w.id)));
});
