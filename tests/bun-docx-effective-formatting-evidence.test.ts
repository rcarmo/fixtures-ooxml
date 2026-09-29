import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/effective-formatting.feature';
const specs=[
 {id:'@id-docx-effective-run-formatting',kinds:['implicit','defaults','default-style','inherited','toggle-chain','style-false','direct-off','aliased','multiple-runs'],steps:(kind:string)=>[`a document prepared for effective formatting ${kind}`,'its plain paragraph run formatting is inspected',`effective flags and provenance match ${kind} after reopening`,'formatting inspection preserves all bytes and existing handles'],marker:'selected provenance'},
 {id:'@id-docx-effective-run-formatting-refusal',kinds:['missing-style','cycle','duplicate-id','duplicate-default','wrong-type','malformed-flag','duplicate-flag','character-style','numbering','table-context','revision','complex-script','external-styles','wrong-mime','styles-effects','stale-paragraph'],steps:(kind:string)=>[`an unsafe effective-formatting document ${kind}`,'its plain paragraph run formatting is inspected','effective formatting inspection refuses without changing package bytes'],marker:'sixteen three-step'},
];

test('Bun executes exact bounded DOCX effective-formatting resolutions and typed refusals',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show','a041e642b5afd9093c8d34773db90c40a27f8592:ledgers/workflows.json']).toString()),compiled=cases(path,await Bun.file(path).text());
 for(const {id,kinds,steps,marker} of specs){
  const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id),rows=compiled.filter((r:any)=>r.scenarioId===id);
  expect(now.feature).toBe(path);expect(now.expandedCases).toBe(kinds.length);expect(rows.map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual(kinds.map(steps));
  expect(now.expectedOutcomes).toEqual([...new Set(kinds.flatMap(kind=>steps(kind).slice(2)))]);
  expect(old.consumers.bun.status).toBe('planned');expect(now.consumers.bun.status).toBe('implemented');
  for(const m of [marker,'b8cb75c1fd13342f0ada2927c2ed7a00f663e005','shared v0.102.0','features/shared.json','25 exact cases/84 steps','tests/acceptance/effective-formatting.ts','tests/unit/docx-effective-formatting.test.ts','Fresh post-push GitHub recursive Bun make check','732/732','36537874042','Go/Python'])expect(now.consumers.bun.evidence).toContain(m);
  expect(now.consumers.go).toEqual(old.consumers.go);expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged=structuredClone(now);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 expect(specs.reduce((n,s)=>n+s.kinds.length,0)).toBe(25);expect(specs.reduce((n,s)=>n+s.kinds.reduce((m,k)=>m+s.steps(k).length,0),0)).toBe(84);
 const changed=new Set(specs.map(s=>s.id));expect(ledger.workflows.filter((w:any)=>!changed.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!changed.has(w.id)));
});
