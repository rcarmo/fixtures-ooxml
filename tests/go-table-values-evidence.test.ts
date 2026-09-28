import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/tables.feature';
const dimensions=[[1,1],[1,5],[5,1],[2,2],[3,3],[5,5],[10,3],[3,10]].map(([r,c])=>[
 'a new Word document',`a table with ${r} rows and ${c} columns is added`,
 `RowCount equals ${r} and ColumnCount equals ${c} in memory`,
]);
const specs=[
 {id:'@id-docx-go-table-dimensions-getters',steps:dimensions},
 {id:'@id-docx-go-table-cell-access',steps:[['a new Word table with three rows and three columns','its Cell getter is called for all nine coordinates from zero through two','each of those nine calls returns a nonnil cell','calls for row or column negative one or three at the tested boundary coordinates return nil']]},
 {id:'@id-docx-go-table-cell-text-getters',steps:[['a new Word table with two rows and two columns','its cells are set by row to A1, B1, A2 and B2','the four cell text getters equal A1, B1, A2 and B2 in those positions','FirstRowText returns exactly A1 and B1']]},
 {id:'@id-docx-go-table-row-counts',steps:[['a new Word table with two rows and three columns','one row is appended, one is inserted at index one, and index one is deleted','row counts after each step are three, four and three respectively','deletion at index ten returns an error']]},
];
test('Go executes exact table value rows without extending saved or Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','0f0b56c6744c5ef7e6c5c5a8fd750da3f6227fc1:ledgers/workflows.json']).toString());
 const compiled=cases(path,await Bun.file(path).text());
 for(const {id,steps} of specs){
  const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
  expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(steps.length);
  expect(compiled.filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual(steps);
  expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
  expect(entry.consumers.python).toEqual(former.consumers.python);
  for(const marker of ['7ffcec37a34a3cbc1aa7e12313fa966bb66aaa7c','970296224e0c79758fbe2140113a34eeca80833f','329 selected cases/1126 steps/0 failures','fresh GitHub recursive clone','reports/batches/188.md'])expect(entry.consumers.go.evidence).toContain(marker);
  const unchanged=structuredClone(entry);unchanged.consumers.bun=former.consumers.bun;unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 }
 const ids=new Set(specs.map(s=>s.id));expect(registry.workflows.filter((w:any)=>!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.has(w.id)));
});
