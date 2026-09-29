import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-docx-go-paragraph-text-getter',path='workflows/docx/paragraphs.feature';
const values=['','Hello World','  spaces  ','日本語テキスト','a < b > c & d'];
test('Go executes only five exact paragraph text getter rows without saved or Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show','6ed911b4c547f7a74a58122b6564c11247bff9c1:ledgers/workflows.json']).toString());
 const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
 expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(5);
 expect(cases(path,await Bun.file(path).text()).filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual(values.map(value=>[
  'a new Word paragraph',`its text is set to JSON ${JSON.stringify(value)}`,`the paragraph text getter equals JSON ${JSON.stringify(value)}`,
 ]));
 expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
 expect(entry.consumers.python).toEqual(former.consumers.python);
 for(const marker of ['89e6dcf77eb8e8461cd7b1571d38105d3031a9b4','4ac68b6204b49970d38bdd8233fa0a322cf65b81','338 selected cases/1159 steps/0 failures','fresh GitHub recursive clone','reports/batches/194.md','five exact'])expect(entry.consumers.go.evidence).toContain(marker);
 const laterIds=new Set(["@id-docx-go-paragraph-alignment-getter","@id-docx-go-paragraph-spacing-getters","@id-docx-go-paragraph-advanced-toggles","@id-docx-go-paragraph-multiple-runs"]);
 const unchanged=structuredClone(entry);unchanged.consumers.bun=former.consumers.bun;unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 expect(registry.workflows.filter((w:any)=>w.id!==id&&!laterIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>w.id!==id&&!laterIds.has(w.id)));
});
