import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';
import {beforeXmlGeneralizationCase,historicalXmlFeature,beforeTransactionFeature} from './xml-generalization-helpers.ts';
test('six refusal contracts retain all26 concrete variants and limits without exception/message identity',async()=>{
 const m=await Bun.file('ledgers/package-runtime-generalization.json').json();expect(m.executionCredit).toBe(false);expect(m.retiredScenarioIds).toEqual([]);
 expect(m.files.flatMap((f:any)=>f.scenarios).map((r:any)=>r.after.length)).toEqual([5,1,1,12,2,5]);
 for(const f of m.files){
  expect(f.beforeText).toBe(execFileSync('git',['show',m.sourceRevision+':'+f.path],{encoding:'utf8'}));
  const text=await Bun.file(f.path).text(),now=cases(f.path,beforeTransactionFeature(f.path,text)),old=cases(f.path,f.beforeText);
  expect(now.map(row=>f.scenarios.some((s:any)=>s.id===row.scenarioId)?beforeXmlGeneralizationCase(row):row)).toEqual(old);expect(historicalXmlFeature(f.path,text)).toBe(f.beforeText);
  for(const s of f.scenarios){expect(now.filter(r=>r.scenarioId===s.id)).toEqual(s.after);
   const outcomes=s.id.includes('save-invalid')||s.id.includes('symlink')?3:2;
   for(let i=0;i<s.after.length;i++)expect(s.after[i].steps.slice(0,-outcomes)).toEqual(s.before[i].steps.slice(0,-outcomes));
   for(const r of s.after){expect(r.steps.map((x:any)=>x.text).join('\n')).not.toMatch(/OoxmlError|message contains/);expect(r.steps.slice(-2).some((x:any)=>/unchanged|original regular destination|equal the original archive/.test(x.text))).toBe(true);}
  }
  for(const w of f.afterLedgerRows)expect(Object.values(w.consumers).every((c:any)=>c.status==='planned')).toBe(true);
 }
 const s=m.files[1].scenarios.find((r:any)=>r.id==='@id-bun-zip32-configured-bounds');
 expect(s.after.map((r:any)=>r.steps[1].text)).toEqual(s.before.map((r:any)=>r.steps[1].text));
});
