import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const specs=[
 {id:'@id-docx-go-new-empty-body',path:'workflows/docx/creation.feature',steps:['a new Word document','its body paragraphs and tables are enumerated','the body is present with zero paragraphs and zero tables']},
 {id:'@id-docx-go-roundtrip-table-text',path:'workflows/docx/tables.feature',steps:['a new Word table with three rows and three columns','its cells contain Header1, Header2, Header3, A1, B1, C1, A2, B2 and C2 in row order','the document is saved and reopened','exactly one table is readable','all nine cell text getters equal their original row-order values']},
];
test('Go executes exact empty-body and saved nine-cell table predicates without Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','78612e1447921af26f640a97ec4591463ba872e9:ledgers/workflows.json']).toString());
 for(const {id,path,steps} of specs){
  const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
  expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(1);
  expect(cases(path,await Bun.file(path).text()).filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual([steps]);
  expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
  expect(entry.consumers.python).toEqual(former.consumers.python);
  for(const marker of ['2d8a1596a2a1ddd9143176eb302b728db2c05f0d','d825dbe2172bfb90fbbf82715073415392724f82','331 selected cases/1134 steps/0 failures','fresh GitHub recursive clone','reports/batches/190.md'])expect(entry.consumers.go.evidence).toContain(marker);
  const unchanged=structuredClone(entry);unchanged.consumers.bun=former.consumers.bun;unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order']);expect(registry.workflows.filter((w:any)=>!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.has(w.id)));
});
