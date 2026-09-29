const trackingIds = new Set(['persistence','custody','no-op','refusal','rollback','plain-edit','author-refusal'].map(name => '@id-docx-tracking-settings-'+name));
const goDirectRangeIds = new Set(['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal']);
const formulaIds = new Set(["@id-xlsx-go-formula-analysis-counts","@id-xlsx-go-formula-quoted-sheet-flags","@id-xlsx-go-formula-analysis-refusal","@id-xlsx-go-formula-literal-punctuation","@id-xlsx-go-direct-range-parsing","@id-xlsx-go-direct-range-refusal","@id-xlsx-go-static-remap-exact","@id-xlsx-go-static-remap-refusal","@id-xlsx-go-static-reference-properties"]);
const commentVmlId = '@id-xlsx-comment-vml-existing-graph';
const cellStyleIds = new Set(["@id-xlsx-cell-style-selection","@id-xlsx-cell-style-refusal"]);
const xlsxCreateIds = new Set(["@id-xlsx-create-native-default","@id-xlsx-create-add-worksheet","@id-xlsx-create-prefixed-missing-cell","@id-xlsx-create-coordinate-boundary","@id-xlsx-create-row-ordering","@id-xlsx-create-invalid-params-atomic","@id-xlsx-create-existing-fixture-append"]);
const slideOrderIds = new Set(["@id-pptx-slide-permutation","@id-pptx-slide-permutation-refusal"]);
const textBoxIds = new Set(["@id-pptx-text-box-authoring","@id-pptx-text-box-refusal"]);
const pptxTableIds = new Set(["@id-pptx-table-roundtrip-geometry","@id-pptx-table-formatting","@id-pptx-table-stale-handle","@id-pptx-table-atomic-refusals"]);
const pptxNoopId = new Set(['@id-pptx-bun-open-save-noop']);
const threadIds = new Set(["@id-docx-existing-thread-inspection","@id-docx-existing-thread-resolution","@id-docx-existing-thread-noop","@id-docx-existing-thread-refusal","@id-docx-existing-thread-rollback","@id-docx-existing-thread-encoding","@id-docx-existing-thread-unsupported","@id-docx-existing-thread-limit"]);
const commentIds = new Set(["@id-docx-comments-inspection","@id-docx-comments-resolution","@id-docx-comments-noop","@id-docx-comments-refusal"]);
const relationshipIds = new Set(["@id-office-relationship-prefix-alias","@id-office-relationship-wrong-uri"]);
const custodyIds = new Set(["@id-bun-opc-open-refusal","@id-bun-opc-detached-byte-copies","@id-bun-opc-preserve-utf16le-edit","@id-bun-opc-async-transaction-refusal","@id-bun-opc-thenable-transaction-result","@id-bun-opc-save-invalid-target-custody","@id-bun-opc-symlink-destination-refusal"]);
const coreOpcIds = new Set(["@id-opc-package-corpus-noop","@id-opc-package-transaction-rollback","@id-opc-package-preserve-unrelated"]);
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
  expect(ledger.workflows.filter((w: any) =>!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&& !changed.has(w.id)));
});
