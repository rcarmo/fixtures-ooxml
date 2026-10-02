import {beforeContract20Feature,beforeContract20Case,beforeContract20Ledger} from './contract20-history.ts';
import migration from '../ledgers/uniform-api18.json';
import {cases} from '../scripts/verify.ts';
const hash=(text:string)=>new Bun.CryptoHasher('sha256').update(text).digest('hex');
/** Exact reviewed predicate strengthening reversal for history tests only. */
export function beforeUniformApi18Feature(path:string,text:string):string{
 text=beforeContract20Feature(path,text);
 const f=migration.files.find(f=>f.path===path);if(!f||text===f.beforeText)return text;
 if(hash(text)!==f.afterSha256)throw Error('Unreviewed uniformAPI18 feature bytes '+path);
 for(const s of f.scenarios)if(JSON.stringify(cases(path,text).filter(c=>c.scenarioId===s.id))!==JSON.stringify(s.after))throw Error('Unreviewed uniformAPI18 predicates '+s.id);
 return f.beforeText;
}
export function beforeUniformApi18Case<T extends{scenarioId:string;steps:unknown[]}>(row:T):T{
 row=beforeContract20Case(row);
 const s=migration.files.flatMap(f=>f.scenarios).find(s=>s.id===row.scenarioId),i=s?.after.findIndex(c=>JSON.stringify(c)===JSON.stringify(row))??-1;
 return i<0?row:{...row,...s!.before[i]} as T;
}
export function beforeUniformApi18Ledger(ledger:any){
 const copy=beforeContract20Ledger(ledger);for(const f of migration.files)for(const after of f.afterLedgerRows){const i=copy.workflows.findIndex((r:any)=>r.id===after.id);const before=f.beforeLedgerRows.find(r=>r.id===after.id)!;if(i>=0&&JSON.stringify(copy.workflows[i])===JSON.stringify(before))continue;if(i<0||JSON.stringify(copy.workflows[i])!==JSON.stringify(after))throw Error('Unreviewed uniformAPI18 ledger '+after.id);copy.workflows[i]=before;}return copy;
}
