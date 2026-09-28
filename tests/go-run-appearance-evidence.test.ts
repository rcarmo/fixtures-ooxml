import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/run-formatting.feature';
const specs=[
 {id:'@id-docx-go-run-color-getter',steps:[
  ['a new Word run','its colour is set to FF0000','its in-memory colour getter equals FF0000'],
  ['a new Word run','its colour is set to #FF0000','its in-memory colour getter equals FF0000'],
  ['a new Word run','its colour is set to ff0000','its in-memory colour getter equals ff0000'],
 ]},
 {id:'@id-docx-go-run-highlight',steps:['yellow','cyan','darkBlue','lightGray','black'].map(v=>['a new Word run',`highlight is set to ${v}`,`the Highlight getter equals ${v}`])},
 {id:'@id-docx-go-roundtrip-selected-formatting',steps:[['a new Word paragraph with three runs Bold-space, Italic-space and Colored','the first run is bold, the second italic, and the third has colour FF0000, font size 14 and font Arial','the document is saved and reopened','at least one paragraph and three runs are readable','the first run is bold and the second italic','the third run reports colour FF0000, font size 14 and font Arial']]},
];
test('Go selects exact colour, highlight and saved selected-formatting cases without broader credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','af93651c5fca2d7e2d3eff76dd9b8ad10b90c71c:ledgers/workflows.json']).toString());
 const compiled=cases(path,await Bun.file(path).text());
 for(const {id,steps} of specs){
  const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
  expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(steps.length);
  expect(compiled.filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual(steps);
  expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
  expect(entry.consumers.bun).toEqual(former.consumers.bun);expect(entry.consumers.python).toEqual(former.consumers.python);
  for(const marker of ['3b3db209b4f6c86f5cae1a152e832b1743075a3b','2a7369a9d662619c174b5f9b23fe40323a7f7a98','316 selected cases/1082 steps/0 failures','fresh GitHub recursive clone','reports/batches/181.md'])expect(entry.consumers.go.evidence).toContain(marker);
  const unchanged=structuredClone(entry);unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 }
 const vertical=registry.workflows.find((w:any)=>w.id==='@id-docx-go-run-vertical-align');expect(vertical.consumers.go.status).toBe('implemented');
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-go-run-vertical-align','@id-docx-go-table-style-getter','@id-docx-go-table-header-getter','@id-docx-go-cell-shading-getter','@id-docx-go-cell-properties-getters']);expect(registry.workflows.filter((w:any)=>!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.has(w.id)));
});
