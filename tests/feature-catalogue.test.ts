import {test, expect} from 'bun:test';
import {buildCatalogue, verifyFeatureCatalogue, validateReview, validateEvidence, parseFeature, categories, families} from '../scripts/feature-catalogue.ts';

const load = () => buildCatalogue();
test('every canonical and staged feature has exactly one generated table row', async () => {
  const result = await verifyFeatureCatalogue();
  expect(result.features).toHaveLength(90);
  expect(result.staged).toHaveLength(143);
  expect(new Set([...result.features, ...result.staged].map(f => f.path)).size).toBe(233);
  expect(result.features.flatMap(f => f.rows)).toHaveLength(480);
  expect(result.features.reduce((n, f) => n + f.cases, 0)).toBe(1234);
  expect(result.staged.reduce((n, f) => n + f.cases, 0)).toBe(1532);
  expect(result.outputs['docs/feature-reuse.csv'].trim().split('\n')).toHaveLength(234);
  expect(result.outputs['docs/scenario-reuse.csv'].trim().split('\n')).toHaveLength(481);
  expect(result.features.map(f => f.path)).toEqual(result.features.map(f => f.path).sort((a, b) => families.indexOf(a.split('/')[1]!) - families.indexOf(b.split('/')[1]!) || a.localeCompare(b)));
  expect(result.staged.every(f => f.category === 'staged-unreviewed')).toBe(true);
});
test('literal JavaScript and named error-class contracts remain runtime-specific; provenance does not decide portability', async () => {
  const {features} = await load();
  const rows = features.flatMap(f => f.rows), row = (id: string) => rows.find(r => r.id === '@id-' + id)!;
  for (const id of ['bun-opc-async-transaction-refusal', 'bun-opc-thenable-transaction-result']) {
    expect(row(id).category).toBe('generalized');
    expect(row(id).runtimeConstraint).toBe('none');
  }
  for (const id of ['bun-opc-open-refusal', 'bun-zip32-configured-bounds']) {
    expect(row(id).category).toBe('generalized');
    expect(row(id).runtimeConstraint).toBe('none');
  }
  for (const id of ['xml-prototype-safe-attributes', 'xml-immutable-namespace-metadata', 'xml-typed-parse-error']) {
    expect(row(id).category).toBe('generalized'); expect(row(id).runtimeConstraint).toBe('none');
  }
  expect(row('pptx-bun-open-save-noop').category).toBe('generalized');
  expect(row('xml-go-child-namespace-matrix').category).toBe('profile-specific');
  expect(row('python-comments-filter-predicates').category).toBe('profile-specific');
  expect(row('xlsx-go-formula-quoted-sheet-flags').category).toBe('profile-specific');
  expect(row('docx-go-table-cell-access').category).toBe('generalized');
  expect(row('docx-go-table-cell-access').runtimeConstraint).toBe('none');
  expect(row('docx-go-table-cell-access').reason).toContain('presence/absence');
});
test('weak analysis, broad obligations and unavailable Office positives cannot be labelled fully generalized', async () => {
  const {features} = await load(), rows = features.flatMap(f => f.rows);
  for (const id of ['python-word-template-analysis-plain-response', 'python-word-template-analysis-sow-response', 'parity-inherited', 'pptx-office-hidden-slide-positive']) expect(rows.find(r => r.id === '@id-' + id)?.category).toBe('incomplete');
  for (const f of features) {
    expect(f.fullyGeneralized).toBe(f.rows.every(r => r.category === 'generalized'));
    expect(Object.values(f.counts).reduce((n: number, v: any) => n + v, 0)).toBe(f.scenarios.length);
  }
  expect(rows.find(r=>r.id==='@id-xml-parse-bounds')?.category).toBe('generalized');
  const parsing = features.find(f => f.path === 'workflows/xml/parsing.feature')!;
  expect(parsing.category).toBe('mixed');
  expect(parsing.fullyGeneralized).toBe(false);
  expect(parsing.classes).not.toContain('runtime-specific');
});
test('new/duplicate/moved/unreviewed IDs and changed feature bytes fail closed', async () => {
  const {features} = await load(), review = await Bun.file('ledgers/feature-reuse.json').json();
  const change = (fn: (r: any) => void, error: string) => {const r = structuredClone(review); fn(r); expect(() => validateReview(r, features)).toThrow(error);};
  change(r => r.scenarios.pop(), 'inventory drift');
  change(r => r.scenarios.push(r.scenarios[0]), 'inventory drift');
  change(r => r.scenarios[0].feature = 'workflows/docx/moved.feature', 'Invalid reuse classification');
  change(r => r.scenarios[0].category = 'unknown', 'Invalid reuse classification');
  change(r => r.scenarios[0].reason = '', 'Invalid reuse classification');
  change(r => r.features[0].reviewedSha256 = '0'.repeat(64), 'changed since reuse review');
  const first = review.scenarios.findIndex((r: any) => r.id === '@id-bun-opc-thenable-transaction-result');
  change(r => {r.scenarios[first].category = 'runtime-specific'; r.scenarios[first].runtimeConstraint = 'none';}, 'Runtime classification mismatch');
  change(r => r.scenarios[0].runtimeConstraint = 'javascript', 'Runtime classification mismatch');
});
test('changing or dropping local classification evidence requires a new review', async () => {
  const review = await Bun.file('ledgers/feature-reuse.json').json();
  const missing = structuredClone(review); delete missing.evidenceSha256['contracts/xml-values.md'];
  await expect(validateEvidence(missing)).rejects.toThrow('evidence inventory drift');
  const changed = structuredClone(review); changed.evidenceSha256['contracts/xml-values.md'] = '0'.repeat(64);
  await expect(validateEvidence(changed)).rejects.toThrow('Evidence changed since reuse review');
});
test('parser retains Rule-inherited profiles and expands example rows once', () => {
  const parsed = parseFeature('sample.feature', '@planned\nFeature: Sample\n  @profile-sample\n  Rule: Values\n    @id-sample\n    Scenario Outline: Value <n>\n      Given input <n>\n      Then output equals <n>\n      Examples:\n        | n |\n        | 1 |\n        | 2 |\n');
  expect(parsed.cases).toBe(2);
  expect(parsed.scenarios).toHaveLength(1);
  expect(parsed.scenarios[0]).toMatchObject({id: '@id-sample', profiles: ['@profile-sample'], rule: 'Values', cases: 2});
  expect(categories).toEqual(['generalized', 'profile-specific', 'runtime-specific', 'incomplete']);
});
