import {Parser, AstBuilder, GherkinClassicTokenMatcher, compile} from '@cucumber/gherkin';
import {IdGenerator} from '@cucumber/messages';
import {join, resolve} from 'node:path';

export const categories = ['generalized', 'profile-specific', 'runtime-specific', 'incomplete'] as const;
export type Category = typeof categories[number];
export const families = ['docx', 'pptx', 'xlsx', 'package', 'xml', 'office'];
const base = resolve(import.meta.dir, '..');
const digest = (text: string) => new Bun.CryptoHasher('sha256').update(text).digest('hex');
const cell = (value: unknown) => String(value ?? '').replace(/\|/g, '&#124;').replace(/\r?\n/g, ' ');
const csv = (rows: unknown[][]) => rows.map(row => row.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(',')).join('\n') + '\n';
const sorted = (values: string[]) => [...values].sort();
function same(actual: string[], expected: string[], label: string) {
  if (new Set(actual).size !== actual.length || new Set(expected).size !== expected.length || JSON.stringify(sorted(actual)) !== JSON.stringify(sorted(expected))) throw Error(label);
}
export function parseFeature(path: string, text: string) {
  const ids = IdGenerator.incrementing();
  const doc = new Parser(new AstBuilder(ids), new GherkinClassicTokenMatcher()).parse(text);
  if (!doc.feature) throw Error('Missing Feature: ' + path);
  const pickles = compile(doc, path, ids);
  const scenarios: any[] = [];
  function visit(children: any[], inherited: string[], rule = '') {
    for (const child of children) {
      if (child.rule) visit(child.rule.children, [...inherited, ...child.rule.tags.map((t: any) => t.name)], child.rule.name);
      if (!child.scenario) continue;
      const s = child.scenario;
      const tags = [...inherited, ...s.tags.map((t: any) => t.name)];
      const names = tags.filter(t => t.startsWith('@id-'));
      const cases = pickles.filter(p => p.astNodeIds.includes(s.id));
      scenarios.push({id: names[0], name: s.name, line: s.location.line, rule, profiles: sorted(tags.filter(t => t.startsWith('@profile-'))), cases: cases.length});
    }
  }
  visit(doc.feature.children, doc.feature.tags.map(t => t.name));
  return {name: doc.feature.name, scenarios, cases: pickles.length};
}
export function validateReview(review: any, features: any[]) {
  if (review.schemaVersion !== 1 || !/^[a-f0-9]{40}$/.test(review.reviewedRevision ?? '') || !Array.isArray(review.features) || !Array.isArray(review.scenarios)) throw Error('Invalid feature reuse review');
  same(review.features.map((r: any) => r.path), features.map(f => f.path), 'Feature review ownership drift');
  same(review.scenarios.map((r: any) => r.id), features.flatMap(f => f.scenarios.map((s: any) => s.id)), 'Scenario reuse inventory drift');
  for (const f of features) {
    const recorded = review.features.find((r: any) => r.path === f.path);
    if (recorded.reviewedSha256 !== f.sha256) throw Error('Feature changed since reuse review: ' + f.path);
    for (const s of f.scenarios) {
      const row = review.scenarios.find((r: any) => r.id === s.id);
      if (row.feature !== f.path || !categories.includes(row.category) || !row.reason?.trim() || !row.evidence?.length) throw Error('Invalid reuse classification: ' + s.id);
      if (!['none', 'javascript', 'bun-error-api', 'go-nil-api'].includes(row.runtimeConstraint)) throw Error('Invalid runtime constraint: ' + s.id);
      if ((row.category === 'runtime-specific') !== (row.runtimeConstraint !== 'none')) throw Error('Runtime classification mismatch: ' + s.id);
      const js = s.profiles.some((p: string) => p.startsWith('@profile-javascript-'));
      const errorClass = s.profiles.some((p: string) => ['@profile-ooxml-error-api', '@profile-zip32-error-api', '@profile-xml-error-api'].includes(p));
      if (js && row.runtimeConstraint !== 'javascript') throw Error('JavaScript profile cannot be portable: ' + s.id);
      if (!js && errorClass && row.runtimeConstraint !== 'bun-error-api') throw Error('Literal error class requires runtime profile: ' + s.id);
      if (s.profiles.includes('@profile-nullable-cell-api') && row.runtimeConstraint !== 'go-nil-api') throw Error('Literal nil API requires runtime profile: ' + s.id);
    }
  }
}
export async function validateEvidence(review: any, root = base) {
  const paths = sorted([...new Set<string>(review.scenarios.flatMap((r: any) => r.evidence))]);
  same(Object.keys(review.evidenceSha256 ?? {}), paths, 'Reuse evidence inventory drift');
  for (const path of paths) {
    if (!/^(contracts|workflows|docs|ledgers)\/[a-zA-Z0-9/._-]+$/.test(path) || path.split('/').includes('..') || !await Bun.file(join(root, path)).exists()) throw Error('Missing/local evidence required: ' + path);
    if (digest(await Bun.file(join(root, path)).text()) !== review.evidenceSha256[path]) throw Error('Evidence changed since reuse review: ' + path);
  }
}
export async function buildCatalogue(root = base) {
  const ledger = await Bun.file(join(root, 'ledgers/workflows.json')).json();
  const review = await Bun.file(join(root, 'ledgers/feature-reuse.json')).json();
  const features = [];
  const orderedPaths = [...ledger.features].sort((a, b) => families.indexOf(a.split('/')[1]) - families.indexOf(b.split('/')[1]) || a.localeCompare(b));
  for (const path of orderedPaths) {
    const text = await Bun.file(join(root, path)).text();
    features.push({path, family: path.split('/')[1], sha256: digest(text), ...parseFeature(path, text)});
  }
  validateReview(review, features);
  same(ledger.workflows.map((w: any) => w.id), features.flatMap(f => f.scenarios.map((s: any) => s.id)), 'Canonical ledger ID drift');
  for (const f of features) for (const s of f.scenarios) {
    const row = ledger.workflows.find((w: any) => w.id === s.id);
    if (row.feature !== f.path || row.expandedCases !== s.cases) throw Error('Canonical case ownership/count drift: ' + s.id);
  }
  const source = await Bun.file(join(root, 'ledgers/feature-source-consolidation.json')).json();
  const staged = [];
  for (const c of [...source.candidates].sort((a, b) => a.path.localeCompare(b.path))) {
    const parsed = parseFeature(c.path, await Bun.file(join(root, c.path)).text());
    staged.push({path: c.path, family: c.consumer, category: 'staged-unreviewed', reason: c.reconciliation, ...parsed});
  }
  const actualStaged = await Array.fromAsync(new Bun.Glob('staging/**/*.feature').scan({cwd: root, onlyFiles: true}));
  const actualCanonical = await Array.fromAsync(new Bun.Glob('workflows/**/*.feature').scan({cwd: root, onlyFiles: true}));
  same(actualStaged, staged.map(s => s.path), 'Unindexed staged feature');
  same(actualCanonical, features.map(f => f.path), 'Unindexed canonical feature');
  await validateEvidence(review, root);
  for (const f of features) {
    f.rows = f.scenarios.map(s => ({...s, ...review.scenarios.find(r => r.id === s.id)}));
    f.counts = Object.fromEntries(categories.map(c => [c, f.rows.filter(r => r.category === c).length]));
    f.classes = categories.filter(c => f.counts[c]);
    f.category = f.classes.length === 1 ? f.classes[0] : 'mixed';
    f.fullyGeneralized = f.counts.generalized === f.scenarios.length;
  }
  const featureHeader = ['Group', 'Feature', 'IDs', 'Cases', 'Tags (scenario counts)', 'Fully generalized?'];
  const featureRows = (family: string) => features.filter(f => f.family === family).map(f => `| ${family.toUpperCase()} | [${f.path.split('/').at(-1)}](${f.path.slice('workflows/'.length)}) | ${f.scenarios.length} | ${f.cases} | ${f.classes.map(c => `${c}: ${f.counts[c]}`).join('; ')} | ${f.fullyGeneralized ? 'yes' : 'no'} |`);
  let index = '# Workflow operation index\n\nGenerated by `bun scripts/feature-catalogue.ts --write`; checked by `bun run check`.\n\nCanonical files stay grouped by format and operation, not source runtime. Rule and\nscenario profiles distinguish policies within a family. Historical runtime names in\nIDs are provenance, not portability verdicts. Feature tags below aggregate scenario\nreviews; a mixed file is never labelled fully generalized.\n\nSee [classification criteria and all scenario rows](../docs/feature-reuse.md),\n[feature CSV](../docs/feature-reuse.csv), [scenario CSV](../docs/scenario-reuse.csv)\nand [contribution guidance](../CATALOGUE.md). The CSV also includes every staged\ncandidate file; those candidates are not canonical or presumed portable.\n\n';
  for (const family of families) index += `## ${family.toUpperCase()}\n\n| ${featureHeader.map(cell).join(' | ')} |\n|---|---|---:|---:|---|---|\n${featureRows(family).join('\n')}\n\n`;
  index += '## Mutation fixture selection\n\n`contracts/mutation-safety.json` selects eight IDs from five format-local files\n(nineteen compiled cases). Loading a file does not activate its other scenarios.\nImplementation status remains in `ledgers/workflows.json`; reuse tags grant no\nexecution credit.\n';
  let report = '# Feature reuse review\n\nGenerated from `ledgers/feature-reuse.json` and the official Gherkin compiler.\nReview baseline: `' + review.reviewedRevision + '`. Only this repository was inspected.\nFeature and local evidence hashes require re-review when their source bytes change.\n\n## Classification criteria\n\n| Tag | Meaning | Fully generalized? |\n|---|---|---|\n| generalized | Concrete language-neutral inputs and outcomes reusable within the stated bounded operation. Ordinary native adapters are still needed. | yes |\n| profile-specific | Portable in principle, but tied to a selected API vocabulary, response shape, coordinate convention or compatibility policy. Requires deliberate profile adoption. | no |\n| runtime-specific | Literal JavaScript object/callback semantics, the Bun-origin `OoxmlError` class, or Go-style nil API returns without a defined neutral mapping. A similarly named foreign exception does not satisfy the literal contract without a documented mapping. | no |\n| incomplete | Missing shared recipes, expected values, fixtures/oracles, or only weak shape/status checks. Neutral wording alone does not make this fully reusable. | no |\n| staged-unreviewed | Source-runtime candidate, not yet reconciled into the canonical catalogue. Its origin is recorded; portability is not adjudicated. | no |\n\nClassification concerns the current contract, not implementation coverage, universal\nOOXML validity or feature completeness. A bounded refusal or read-only scenario can\nbe generalized without implementing a whole format. UTF-16 and UTF-8 coordinates\nare portable conventions, not inherently JavaScript/Go runtime requirements.\nError codes and JSON keys alone are API profiles; literal class identity and\nprototype/thenable assertions are runtime-specific. Generic immutability does not\nimply JavaScript `Object.freeze`. The literal Go `nil` cell API needs an explicit\nforeign-runtime absence mapping before it can be a portable profile. Missing case recipes take precedence over a\nportable API profile; the scenario reason records the gap.\n\n## Organisation findings\n\n- All canonical feature paths use the six allowed format/common-operation folders,\n  with one owning file per stable scenario ID. No contract moves or step/tag changes\n  were needed; published bindings and historical seals remain untouched.\n- The old manual index had appended package entries out of order and inconsistent\n  per-file planned labels. This index is generated in fixed family/path order.\n- Same-format operation families intentionally contain multiple profiles: comments\n  keep existing-entry, authored-root and complete-thread policies separate; table\n  getters and physical merges remain different operations. Cross-format relationship\n  namespaces belong under package; full-coverage obligations belong under office.\n- Staging keeps its source-runtime layout to preserve captured provenance. The table\n  below separates all staged files from canonical operation contracts; no staged\n  file is silently promoted, renamed or duplicated into a new catalogue.\n- The inherited `@planned` tag is not a per-consumer result. Consult\n  `ledgers/workflows.json` for implementation credit; this review changes none.\n\n## Canonical totals\n\n| Group | Features | IDs | Cases | generalized | profile-specific | runtime-specific | incomplete |\n|---|---:|---:|---:|---:|---:|---:|---:|\n';
  for (const family of [...families, 'all']) {
    const fs = features.filter(f => family === 'all' || f.family === family), rows = fs.flatMap(f => f.rows);
    report += `| ${family.toUpperCase()} | ${fs.length} | ${rows.length} | ${fs.reduce((n,f)=>n+f.cases,0)} | ${categories.map(c => rows.filter(r=>r.category===c).length).join(' | ')} |\n`;
  }
  report += `\n${features.filter(f => f.fullyGeneralized).length} of ${features.length} canonical feature files are fully generalized throughout.\nThe remaining files contain profile-specific, runtime-specific or incomplete\nscenarios; ${features.filter(f => f.category === 'mixed').length} files mix categories and require ID-level selection.\nThe four category columns count scenario IDs, not expanded example cases.\nA complete [feature-level table](../workflows/README.md) and downloadable\n[${features.length + staged.length}-file CSV](feature-reuse.csv) accompany the [scenario CSV](scenario-reuse.csv).\n\n## Scenario decisions\n\n`;
  for (const f of features) {
    report += `### ${f.path.slice(10)}\n\n${cell(f.name)} — **${f.category}**; fully generalized: **${f.fullyGeneralized ? 'yes' : 'no'}**.\n\n| ID / source | Cases | Tag | Profiles | Reason / local evidence |\n|---|---:|---|---|---|\n`;
    for (const r of f.rows) report += `| [${r.id}](../${f.path}#L${r.line}) | ${r.cases} | ${r.category} | ${r.profiles.map(cell).join(', ') || '—'} | ${cell(r.reason)} ${r.evidence.filter(p=>p!==f.path).map(p=>`[${p.split('/').at(-1)}](../${p})`).join(' ')} |\n`;
    report += '\n';
  }
  report += '## Staged source candidates — separate inventory\n\nAll rows are **staged-unreviewed** for portability and grant no execution credit.\nReconciliation status is copied from the source-consolidation ledger. File and\ncase totals describe the current captured candidates, not additional canonical\nbehaviours; overlap and source-specific helpers may remain.\n\n| Source runtime | Feature file | Captured feature | Cases | Reconciliation |\n|---|---|---|---:|---|\n';
  for (const f of staged) report += `| ${f.family} | [${cell(f.path)}](../${f.path}) | ${cell(f.name)} | ${f.cases} | ${cell(f.reason)} |\n`;
  report += `\n${staged.length} staged files; ${staged.reduce((n,f)=>n+f.cases,0)} compiled source cases.\n`;
  const featureCSV: unknown[][] = [['scope','group_or_source_runtime','feature','title','scenario_declarations','compiled_cases','category','fully_generalized','generalized_ids','profile_specific_ids','runtime_specific_ids','incomplete_ids','runtime_constraints','review_or_reconciliation']];
  for (const f of features) featureCSV.push(['canonical',f.family,f.path,f.name,f.scenarios.length,f.cases,f.category,f.fullyGeneralized,...categories.map(c=>f.counts[c]),[...new Set(f.rows.map(r=>r.runtimeConstraint).filter(v=>v!=='none'))].join('; '),'See scenario-reuse.csv for all reasons']);
  for (const f of staged) featureCSV.push(['staged',f.family,f.path,f.name,f.scenarios.length,f.cases,f.category,false,'','','','','unreviewed',f.reason]);
  const scenarioCSV: unknown[][] = [['group','feature','line','id','scenario','cases','category','fully_generalized','runtime_constraint','profiles','reason','evidence']];
  for (const f of features) for (const r of f.rows) scenarioCSV.push([f.family,f.path,r.line,r.id,r.name,r.cases,r.category,r.category==='generalized',r.runtimeConstraint,r.profiles.join('; '),r.reason,r.evidence.join('; ')]);
  return {features, staged, outputs: {'workflows/README.md': index, 'docs/feature-reuse.md': report, 'docs/feature-reuse.csv': csv(featureCSV), 'docs/scenario-reuse.csv': csv(scenarioCSV)}};
}
export async function verifyFeatureCatalogue(root = base) {
  const result = await buildCatalogue(root);
  for (const [path, expected] of Object.entries(result.outputs)) if (!await Bun.file(join(root,path)).exists() || await Bun.file(join(root,path)).text() !== expected) throw Error('Feature catalogue stale: ' + path + '; run bun scripts/feature-catalogue.ts --write');
  return result;
}
if (import.meta.main) {
  if (process.argv.includes('--write')) {
    const result = await buildCatalogue();
    for (const [path, text] of Object.entries(result.outputs)) await Bun.write(join(base,path),text);
    console.log(`Indexed ${result.features.length} canonical and ${result.staged.length} staged feature files`);
  } else { await verifyFeatureCatalogue(); console.log('Feature reuse catalogue is current'); }
}
