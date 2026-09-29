const pythonPhysicalOverlapId = '@id-zip-physical-member-overlap-refusal';
const goRemainingFormulaIds = new Set(['@id-xlsx-go-formula-literal-punctuation','@id-xlsx-go-static-remap-exact','@id-xlsx-go-static-remap-refusal','@id-xlsx-go-static-reference-properties']);
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
const ids = ['@id-zip-crc32-standard-vector', '@id-bun-zip32-reader-refusal', '@id-bun-zip32-writer-refusal', '@id-bun-zip32-configured-bounds'];
const code = (value: string) => `it throws an OoxmlError with code ${value}`;
const message = (value: string) => `the error message contains ${value}`;
const reader: Array<[string[][], string, string, string]> = [
  [[['word/document.xml', 'one'], ['word/document.xml', 'two']], 'none', 'zip-duplicate-entry', 'duplicate ZIP member'],
  [[['word/document.xml', 'one'], ['WORD/document.xml', 'two']], 'none', 'zip-case-collision', 'ASCII case-collides'],
  [[['../word/document.xml', 'bad']], 'none', 'zip-name-invalid', 'noncanonical'],
  [[['word/document.xml', 'secret']], 'general-purpose bit 0 is set in both headers', 'zip-encryption-unsupported', 'encrypted'],
  [[['word/document.xml', 'x']], 'both methods are 12 and payload bytes are stored uncompressed', 'zip-method-unsupported', 'compression method'],
  [[['word/document.xml', 'x']], 'end record disk number is 1', 'zip-multi-disk-unsupported', 'multi-disk'],
  [[['word/document.xml', 'x']], 'both end-record counts are 65535 without ZIP64 records', 'zip-structure-invalid', 'ZIP64'],
  [[['word/document.xml', 'x']], 'local name is word/other.xml', 'zip-local-metadata-mismatch', 'local and central'],
  [[['word/document.xml', 'payload']], 'both CRC fields are hexadecimal DEADBEEF', 'zip-crc-mismatch', 'CRC'],
  [[['word/document.xml', 'payload']], 'method is STORED and all size fields are 99', 'zip-size-mismatch', 'declared size'],
  [[['word/document.xml', 'A']], 'payload repeats A 4096 times but both expanded sizes are 32', 'zip-size-mismatch', 'declared size'],
  [[['word/document.xml', 'x']], 'a newline byte follows the complete uncommented archive', 'zip-end-record-missing', 'end-of-central-directory'],
];
const writer: Array<[string[][], string, string]> = [
  [[['word/document.xml', 'one'], ['WORD/document.xml', 'two']], 'zip-case-collision', 'ASCII case-collides'],
  [[['word/', 'not empty']], 'zip-directory-entry-invalid', 'must be empty'],
];
const bounds: Array<[string, string, string, string]> = [
  ['maxArchiveBytes', 'archive byte length minus 1', 'zip-archive-too-large', 'archive bytes'],
  ['maxEntries', '1', 'zip-too-many-entries', 'entry limit'],
  ['maxEntryBytes', '8', 'zip-entry-too-large', 'entry limit'],
  ['maxTotalBytes', '8', 'zip-total-too-large', 'total expanded'],
  ['maxCompressionRatio', '2', 'zip-compression-ratio-exceeded', 'compression ratio'],
];
const expected = [
  [['checksum input is the UTF-8 string "123456789"', 'its ZIP CRC32 is calculated', 'the unsigned checksum equals hexadecimal CBF43926']],
  reader.map(([pairs, mutation, c, m]) => [
    `a ZIP32 reader sample with these ordered member and payload pairs encoded as JSON ${JSON.stringify(pairs)}`,
    `the sample has the mutation ${mutation}`, 'the ZIP reader reads the sample with default limits', code(c), message(m),
  ]),
  writer.map(([pairs, c, m]) => [`ordered writer entries are encoded as JSON ${JSON.stringify(pairs)}`, 'the ZIP writer writes the entries with default options', code(c), message(m)]),
  bounds.map(([limit, value, c, m]) => ['a raw-DEFLATE ZIP32 archive contains a.bin with 4096 A bytes followed by b.bin with two b bytes', `the ZIP reader reads the archive with only ${limit} set to ${value}`, code(c), message(m)]),
];

test('Bun alone executes twenty exact ZIP32 checksum and typed refusal rows (91 steps)', async () => {
  const current = await Bun.file('ledgers/workflows.json').json();
  const prior = JSON.parse(execFileSync('git', ['show', 'c29984984d60a622a358804508dd7ec101137c5e:ledgers/workflows.json']).toString());
  const compiled = cases(path, await Bun.file(path).text());
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]!, rows = expected[i]!;
    const now = current.workflows.find((w: any) => w.id === id), old = prior.workflows.find((w: any) => w.id === id);
    expect(now.feature).toBe(path);
    expect(now.expandedCases).toBe(rows.length);
    expect(compiled.filter((row: any) => row.scenarioId === id).map((row: any) => row.steps.map((s: any) => s.text))).toEqual(rows);
    expect(now.expectedOutcomes).toEqual([...new Set(rows.flatMap(row => row.filter(s => s.startsWith('it throws') || s.startsWith('the error message') || s.startsWith('the unsigned checksum'))))]);
    expect(old.consumers.bun.status).toBe('planned');
    expect(now.consumers.bun.status).toBe('implemented');
    for (const marker of ['870b697dba4dba1cd89187a6308912674943273e', 'shared v0.82.0', 'tests/acceptance/zip32.ts', 'tests/unit/zip32-bindings.test.ts', '20 cases/91 steps', 'Fresh GitHub recursive make check', '732/732', 'No Go/Python']) expect(now.consumers.bun.evidence).toContain(marker);
    expect(now.consumers.go).toEqual(old.consumers.go);
    expect(now.consumers.python).toEqual(old.consumers.python);
    const unchanged = structuredClone(now); unchanged.consumers.bun = old.consumers.bun;
    expect(unchanged).toEqual(old);
  }
  expect(expected.flat().reduce((n, row) => n + row.length, 0)).toBe(91);
  const changed = new Set([...ids, '@id-zip-read-valid', '@id-zip-write-deterministic', '@id-zip-refuse-unsafe']);
  expect(current.workflows.filter((w: any) =>w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&& !changed.has(w.id))).toEqual(prior.workflows.filter((w: any) =>w.id!==pythonPhysicalOverlapId&&!goRemainingFormulaIds.has(w.id)&&w.id!==pythonCommentVmlId&&!styleAuthoringIds.has(w.id)&&!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&& !changed.has(w.id)));
});
