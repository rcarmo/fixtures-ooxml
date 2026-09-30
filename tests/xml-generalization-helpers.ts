import xmlMigration from '../ledgers/xml-runtime-generalization.json';
import cellMigration from '../ledgers/cell-runtime-generalization.json';
import packageMigration from '../ledgers/package-runtime-generalization.json';
import transactionMigration from '../ledgers/transaction-runtime-generalization.json';
import lexicalAlignment from '../ledgers/xml-lexical-alignment.json';
import packageAlignment from '../ledgers/package-alignment.json';
export function beforePackageAlignmentFeature(path:string,text:string):string {
  const m=packageAlignment.files.find(f=>f.path===path);if(!m)return text;
  if(text===m.beforeText)return text;
  for(const s of m.scenarios)if(JSON.stringify(cases(path,text).filter(c=>c.scenarioId===s.id))!==JSON.stringify(s.after))throw Error('Unreviewed package alignment predicates: '+s.id);
  if(new Bun.CryptoHasher('sha256').update(text).digest('hex')!==m.afterSha256)throw Error('Unreviewed package alignment feature bytes');
  return m.beforeText;
}
export function beforePackageAlignmentCase<T extends {scenarioId:string;steps:unknown[]}>(row:T):T {
  const f=packageAlignment.files.find(f=>f.scenarios.some(s=>s.id===row.scenarioId));
  const s=f?.scenarios.find(s=>s.id===row.scenarioId);
  const n=s?.after.findIndex(c=>JSON.stringify(c)===JSON.stringify(row))??-1;
  return n<0?row:{...row,...cases(f!.path,f!.beforeText).filter(c=>c.scenarioId===row.scenarioId)[n]} as T;
}
export function beforePackageAlignmentLedger(ledger:any){
  return {...ledger,workflows:ledger.workflows.map((row:any)=>{
    const current=packageAlignment.files.flatMap(m=>m.afterLedgerRows).find(r=>r.id===row.id);if(!current)return row;
    if(JSON.stringify(row)!==JSON.stringify(current))throw Error('Unreviewed package alignment ledger: '+row.id);
    return packageAlignment.files.flatMap(m=>m.beforeLedgerRows).find(r=>r.id===row.id)!;
  })};
}
/** Undo only the exact reviewed next-layer contract completion for historical checks. */
export function beforeLexicalAlignmentFeature(path: string, text: string): string {
  text=beforePackageAlignmentFeature(path,text);
  const m = lexicalAlignment.files.find(f => f.path === path);
  if (!m) return text;
  for (const s of m.scenarios) if (JSON.stringify(cases(path,text).filter(c=>c.scenarioId===s.id)) !== JSON.stringify(s.after)) throw Error('Unreviewed lexical alignment predicates: '+s.id);
  if (new Bun.CryptoHasher('sha256').update(text).digest('hex') !== m.afterSha256) throw Error('Unreviewed lexical alignment feature bytes');
  return m.beforeText;
}
export function beforeLexicalAlignmentCase<T extends {scenarioId: string; steps: unknown[]}>(row:T):T {
  row=beforePackageAlignmentCase(row);
  const s=lexicalAlignment.files.flatMap(f=>f.scenarios).find(s=>s.id===row.scenarioId);
  const n=s?.after.findIndex(c=>JSON.stringify(c)===JSON.stringify(row))??-1;
  return n<0?row:{...row,...s!.before[n]} as T;
}
export function beforeLexicalAlignmentLedger(ledger:any) {
  ledger=beforePackageAlignmentLedger(ledger);
  const ms=lexicalAlignment.files;
  return {...ledger,workflows:ledger.workflows.map((row:any)=>{
    const current=ms.flatMap(m=>m.afterLedgerRows).find(r=>r.id===row.id);if(!current)return row;
    if(JSON.stringify(row)!==JSON.stringify(current))throw Error('Unreviewed lexical alignment ledger: '+row.id);
    return ms.flatMap(m=>m.beforeLedgerRows).find(r=>r.id===row.id)!;
  })};
}
const migrations = [xmlMigration, cellMigration, ...packageMigration.files, transactionMigration];
const migration = {scenarios: migrations.flatMap(m=>m.scenarios), beforeLedgerRows: migrations.flatMap(m=>m.beforeLedgerRows), afterLedgerRows: migrations.flatMap(m=>m.afterLedgerRows)};
import {cases} from '../scripts/verify.ts';
const exact = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
/** Explicit historical comparison only. Never used by an execution binding. */
export function beforeXmlGeneralizationCase<T extends {scenarioId: string; steps: unknown[]}>(row: T): T {
  row = beforeLexicalAlignmentCase(row);
  const s = migration.scenarios.find(r => r.id === row.scenarioId);
  const n = s?.after.findIndex(r => exact(r, row)) ?? -1;
  return n < 0 ? row : {...row, ...s!.before[n]} as T;
}
export function beforeXmlGeneralizationTags(id: string, tags: string[]): string[] {
  const s = migration.scenarios.find(r => r.id === id);
  if (!s) return tags;
  const after = ['@planned', id, ...s.afterProfiles].sort();
  return exact(tags, after) ? ['@planned', id, ...s.beforeProfiles].sort() : tags;
}
/** Reconstruct the old file only when the changed cases exactly match the reviewed
 * migration. Unknown predicate changes fail instead of being hidden by this helper. */
export function beforeTransactionFeature(path: string, text: string): string {
  if(path!==transactionMigration.path)return text;
  text=beforePackageAlignmentFeature(path,text);
  for(const s of transactionMigration.scenarios)if(!exact(cases(path,text).filter(r=>r.scenarioId===s.id),s.after))throw Error('Unreviewed transaction predicates: '+s.id);
  if(new Bun.CryptoHasher('sha256').update(text).digest('hex')!==transactionMigration.afterSha256)throw Error('Unreviewed transaction feature bytes');
  return transactionMigration.beforeText;
}
export function historicalXmlFeature(path: string, text: string): string {
  text=beforeLexicalAlignmentFeature(path,text);
  text=beforeTransactionFeature(path,text);
  const fileMigration = migrations.find(m=>m.path===path);
  if (!fileMigration) return text;
  for (const s of fileMigration.scenarios) {
    if (!exact(cases(path, text).filter(r => r.scenarioId === s.id), s.after)) throw Error('Unreviewed XML generalization predicates: ' + s.id);
  }
  const sha = new Bun.CryptoHasher('sha256').update(text).digest('hex');
  if (sha !== fileMigration.afterSha256) throw Error('Unreviewed generalized feature bytes');
  return fileMigration.beforeText;
}
/** Historical evidence snapshots still compare all consumer status/evidence and
 * every other row. Reviewed migrated rows must match their exact planned state;
 * their original predicates/credit are reconstructed solely for historical tests. */
export async function historicalWorkflowLedger() {
  const ledger = beforeLexicalAlignmentLedger(await Bun.file('ledgers/workflows.json').json());
  return {...ledger, workflows: ledger.workflows.map((row: any) => {
    const s = migration.scenarios.find(r => r.id === row.id);
    if (!s) return row;
    const current = migration.afterLedgerRows.find(r => r.id === row.id)!;
    if (!exact(row.expectedOutcomes, current.expectedOutcomes)) throw Error('Unreviewed generalized ledger outcome change: ' + row.id);
    const old = migration.beforeLedgerRows.find(r => r.id === row.id)!;
    if (!exact(row.consumers, current.consumers)) throw Error('Unreviewed current XML consumer evidence: ' + row.id);
    return {...row, expectedOutcomes: old.expectedOutcomes, consumers: old.consumers};
  })};
}
