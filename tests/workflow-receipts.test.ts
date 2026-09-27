import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';
const path='workflows/workflow-receipts.feature';
test('shared receipt contracts preserve the two retained Bun identities and concrete steps',async()=>{
 const text=await Bun.file(path).text(),rows=cases(path,text);expect(text.startsWith('@planned\n')).toBe(true);
 expect(rows).toEqual([
  {scenarioId:'@id-office-preview-details',name:'A dry-run preview describes the requested edit without committing it',steps:[
   {text:'a presentation with the title "Original title"',argument:null},
   {text:'a title change to "Changed by dry run" is previewed',argument:null},
   {text:'the preview identifies the original target and requested replacement',argument:null},
   {text:'the preview reports zero committed changes',argument:null},
  ]},
  {scenarioId:'@id-office-docx-exact-match-counts',name:'Word match counts belong to each requested placeholder',steps:[
   {text:'a document containing "<Present>" once and not containing "<Missing>"',argument:null},
   {text:'both placeholders are resolved before mutation',argument:null},
   {text:'"<Present>" reports exactly one match',argument:null},
   {text:'"<Missing>" reports exactly zero matches',argument:null},
  ]},
 ]);
 const ledger=await Bun.file('ledgers/workflows.json').json();
 for(const row of rows){const entries=ledger.workflows.filter((w:any)=>w.id===row.scenarioId);expect(entries).toHaveLength(1);expect(entries[0].feature).toBe(path);expect(entries[0].expandedCases).toBe(1);expect(Object.values(entries[0].consumers).every((c:any)=>c.status==='planned')).toBe(true);}
});
