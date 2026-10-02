import migration from '../ledgers/contract20.json';
import retainedTable from '../ledgers/retained-table-properties.json';
import retainedStyleWord from '../ledgers/retained-style-word.json';
import pptxFormatting from '../ledgers/pptx-formatting.json';
import pptxManipulation from '../ledgers/pptx-manipulation.json';
const predecessorFiles=[...retainedTable.files,...retainedStyleWord.files,...pptxFormatting.files,...pptxManipulation.files];
import {cases} from '../scripts/verify.ts';
const hash=(text:string)=>new Bun.CryptoHasher('sha256').update(text).digest('hex');
/** Reverse exact reviewed Contract20 changes for historical checks only. */
export function beforeContract20Feature(path:string,text:string):string {
 const file=migration.files.find(f=>f.path===path);if(!file||text===file.beforeText)return text;
 // Earlier history layers may call this entry point again after reversing a
 // reviewed additive layer. Admit only their already sealed whole-file bytes.
 if(predecessorFiles.some(f=>f.path===path&&(text===f.beforeText||hash(text)===f.afterSha256)))return text;
 if(hash(text)!==file.afterSha256)throw Error('Unreviewed Contract20 feature bytes '+path);
 for(const s of file.scenarios)if(JSON.stringify(cases(path,text).filter(c=>c.scenarioId===s.id))!==JSON.stringify(s.after))throw Error('Unreviewed Contract20 predicates '+s.id);
 return file.beforeText;
}
export function beforeContract20Case<T extends {scenarioId:string;steps:unknown[]}>(row:T):T {
 const s=migration.files.flatMap(f=>f.scenarios).find(s=>s.id===row.scenarioId),index=s?.after.findIndex(c=>JSON.stringify(c)===JSON.stringify(row))??-1;
 return index<0?row:{...row,...s!.before[index]} as T;
}
export function beforeContract20Ledger(ledger:any) {
 const copy=structuredClone(ledger);
 for(const f of migration.files)for(const after of f.afterLedgerRows){const i=copy.workflows.findIndex((r:any)=>r.id===after.id),before=f.beforeLedgerRows.find(r=>r.id===after.id)!;
  if(i>=0&&JSON.stringify(copy.workflows[i])===JSON.stringify(before))continue;
  if(i<0||JSON.stringify(copy.workflows[i])!==JSON.stringify(after))throw Error('Unreviewed Contract20 ledger '+after.id);
  copy.workflows[i]=before;
 }
 return copy;
}
