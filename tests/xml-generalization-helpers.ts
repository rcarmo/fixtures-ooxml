import {beforeUniformApi18Feature,beforeUniformApi18Case,beforeUniformApi18Ledger} from './uniform-api18-history.ts';
import retainedTable from '../ledgers/retained-table-properties.json';
export function beforeRetainedTableFeature(path:string,text:string):string{
 text=beforeUniformApi18Feature(path,text);
 const f=retainedTable.files.find(f=>f.path===path);if(!f||text===f.beforeText)return text;
 if(new Bun.CryptoHasher('sha256').update(text).digest('hex')!==f.afterSha256)throw Error('Unreviewed retained table feature hash');
 if(JSON.stringify(cases(path,text).filter(c=>retainedTable.records.some(r=>r.id===c.scenarioId)))!==JSON.stringify(f.scenarios.flatMap(s=>s.after)))throw Error('Unreviewed retained table predicates');return f.beforeText;
}
export function beforeRetainedTableLedger(ledger:any){const copy=beforeUniformApi18Ledger(ledger),added=new Set(retainedTable.records.map(r=>r.id));for(const f of retainedTable.files)for(const row of f.afterLedgerRows){const current=copy.workflows.find((r:any)=>r.id===row.id);if(JSON.stringify(current)!==JSON.stringify(row))throw Error('Unreviewed retained table ledger');}copy.workflows=copy.workflows.filter((r:any)=>!added.has(r.id));return copy;}
import retainedStyleWord from '../ledgers/retained-style-word.json';
export function beforeRetainedStyleWordFeature(path:string,text:string):string {
 text=beforeRetainedTableFeature(path,text);
 const file=retainedStyleWord.files.find(f=>f.path===path);if(!file||text===file.beforeText)return text;
 if(new Bun.CryptoHasher('sha256').update(text).digest('hex')!==file.afterSha256)throw Error('Unreviewed retained style/Word feature hash: '+path);
 const current=cases(path,text).filter(c=>retainedStyleWord.records.some(r=>r.id===c.scenarioId));
 if(JSON.stringify(current)!==JSON.stringify(file.scenarios.flatMap(s=>s.after)))throw Error('Unreviewed retained style/Word predicates: '+path);
 return file.beforeText;
}
export function beforeRetainedStyleWordLedger(ledger:any){
 const copy=beforeRetainedTableLedger(ledger),added=new Set(retainedStyleWord.records.map(r=>r.id));
 for(const file of retainedStyleWord.files)for(const row of file.afterLedgerRows){const actual=copy.workflows.find((r:any)=>r.id===row.id);if(JSON.stringify(actual)!==JSON.stringify(row))throw Error('Unreviewed retained style/Word ledger: '+row.id);}
 copy.features=copy.features.filter((p:string)=>!retainedStyleWord.files.some(f=>f.path===p&&!f.beforeText));copy.workflows=copy.workflows.filter((r:any)=>!added.has(r.id));return copy;
}
import pptxFormatting from '../ledgers/pptx-formatting.json';
/** Reverse only exact additive direct-formatting contracts for historical checks. */
export function beforePptxFormattingFeature(path:string,text:string):string {
 text=beforeRetainedStyleWordFeature(path,text);
 const f=pptxFormatting.files.find(f=>f.path===path);if(!f||text===f.beforeText)return text;
 if(new Bun.CryptoHasher('sha256').update(text).digest('hex')!==f.afterSha256)throw Error('Unreviewed PPTX formatting feature bytes');
 for(const s of f.scenarios)if(JSON.stringify(cases(path,text).filter(c=>c.scenarioId===s.id))!==JSON.stringify(s.after))throw Error('Unreviewed PPTX formatting predicates: '+s.id);
 return f.beforeText;
}
export function beforePptxFormattingLedger(ledger:any){
 ledger=beforeRetainedStyleWordLedger(ledger);
 const added=pptxFormatting.files.flatMap(f=>f.afterLedgerRows);
 for(const row of added){const current=ledger.workflows.find((r:any)=>r.id===row.id);if(JSON.stringify(current)!==JSON.stringify(row))throw Error('Unreviewed PPTX formatting ledger: '+row.id);}
 return {...ledger,features:ledger.features.filter((p:string)=>!pptxFormatting.files.some(f=>f.path===p&&!f.beforeText)),workflows:ledger.workflows.filter((r:any)=>!added.some(s=>s.id===r.id))};
}
import pptxManipulation from '../ledgers/pptx-manipulation.json';
/** Remove only the exact reviewed additive PPTX profiles for historical receipts. */
export function beforePptxManipulationFeature(path:string,text:string):string {
  text=beforePptxFormattingFeature(path,text);
  const f=pptxManipulation.files.find(f=>f.path===path);if(!f)return text;
  if(text===f.beforeText)return text;
  if(new Bun.CryptoHasher('sha256').update(text).digest('hex')!==f.afterSha256)throw Error('Unreviewed PPTX manipulation feature bytes');
  for(const s of f.scenarios)if(JSON.stringify(cases(path,text).filter(c=>c.scenarioId===s.id))!==JSON.stringify(s.after))throw Error('Unreviewed PPTX manipulation predicates: '+s.id);
  return f.beforeText;
}
export function beforePptxManipulationLedger(ledger:any){
  ledger=beforePptxFormattingLedger(ledger);
  const added=pptxManipulation.files.flatMap(f=>f.afterLedgerRows);
  for(const row of added){const current=ledger.workflows.find((r:any)=>r.id===row.id);if(JSON.stringify(current)!==JSON.stringify(row))throw Error('Unreviewed PPTX manipulation ledger: '+row.id);}
  return {...ledger,features:ledger.features.filter((p:string)=>!pptxManipulation.files.some(f=>f.path===p&&!f.beforeText)),workflows:ledger.workflows.filter((r:any)=>!added.some(s=>s.id===r.id))};
}
import xmlMigration from '../ledgers/xml-runtime-generalization.json';
import cellMigration from '../ledgers/cell-runtime-generalization.json';
import packageMigration from '../ledgers/package-runtime-generalization.json';
import transactionMigration from '../ledgers/transaction-runtime-generalization.json';
import lexicalAlignment from '../ledgers/xml-lexical-alignment.json';
import packageAlignment from '../ledgers/package-alignment.json';
export function beforePackageAlignmentFeature(path:string,text:string):string {
  text=beforePptxManipulationFeature(path,text);
  const m=packageAlignment.files.find(f=>f.path===path);if(!m)return text;
  if(text===m.beforeText)return text;
  for(const s of m.scenarios)if(JSON.stringify(cases(path,text).filter(c=>c.scenarioId===s.id))!==JSON.stringify(s.after))throw Error('Unreviewed package alignment predicates: '+s.id);
  if(new Bun.CryptoHasher('sha256').update(text).digest('hex')!==m.afterSha256)throw Error('Unreviewed package alignment feature bytes');
  return m.beforeText;
}
export function beforePackageAlignmentCase<T extends {scenarioId:string;steps:unknown[]}>(row:T):T {
  row=beforeUniformApi18Case(row);
  const f=packageAlignment.files.find(f=>f.scenarios.some(s=>s.id===row.scenarioId));
  const s=f?.scenarios.find(s=>s.id===row.scenarioId);
  const n=s?.after.findIndex(c=>JSON.stringify(c)===JSON.stringify(row))??-1;
  return n<0?row:{...row,...cases(f!.path,f!.beforeText).filter(c=>c.scenarioId===row.scenarioId)[n]} as T;
}
export function beforePackageAlignmentLedger(ledger:any){
  ledger=beforePptxManipulationLedger(ledger);
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
