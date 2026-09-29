import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-docx-go-table-merge-properties',path='workflows/docx/tables.feature';
test('Go checks direct span and vertical-merge values without physical topology credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show','f8c2736194fd70594b33e2091334a3ebbceea9f6:ledgers/workflows.json']).toString());
 const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
 expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(1);
 expect(cases(path,await Bun.file(path).text()).filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual([[
  'a new Word table with three rows and four columns',
  'cell zero-zero gets GridSpan three and first-column rows one and two get restart and continue',
  'GridSpan at zero-zero equals three',
  'VerticalMerge at row one is restart and at row two is continue',
 ]]);
 expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
 expect(entry.consumers.bun).toEqual(former.consumers.bun);expect(entry.consumers.python).toEqual(former.consumers.python);
 for(const marker of ['243b57bb7cc86ed52c261359c5285885ffdca6d5','f0e709826f2896fb23776b95a2fbce2fd78c2672','318 selected cases/1090 steps/0 failures','fresh GitHub recursive clone','reports/batches/186.md','no physical merge topology'])expect(entry.consumers.go.evidence).toContain(marker);
 const unchanged=structuredClone(entry);unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 const laterBunIds=new Set(['@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts','@id-docx-go-new-empty-body','@id-docx-go-roundtrip-table-text','@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter']);
 expect(registry.workflows.filter((w:any)=>w.id!==id&&!laterBunIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>w.id!==id&&!laterBunIds.has(w.id)));
});
