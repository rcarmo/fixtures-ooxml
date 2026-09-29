import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-docx-direct-font-size-half-points',path='workflows/docx/font-size.feature';
const steps=['a new Word document with one body paragraph and one run containing "Size sample"',"that run's direct font size is set to 10.5 points",'the Word document is saved and reopened','the paragraph text is "Size sample"','the run has exactly one direct WordprocessingML w:sz element with w:val "21"',"the reopened run's direct font size is 10.5 points"];
test('Bun executes exact saved half-point direct font size without Go, Python or rendering credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','39f6fd8b7e77273fd310ee56e217b15130a939c2:ledgers/workflows.json']).toString());
 const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 expect(current.feature).toBe(path);expect(current.expandedCases).toBe(1);
 expect(cases(path,await Bun.file(path).text()).filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual([steps]);
 expect(current.expectedOutcomes).toEqual(steps.slice(-3));
 expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
 for(const marker of ['fd658221d642f99b36e707263a5a218521712ab0','shared v0.74.0','exact six-step','saved/reopened','exactly one w:sz','w:val 21','10.5 points','tests/unit/docx-font-size.test.ts','Fresh GitHub recursive make check','732/732'])expect(current.consumers.bun.evidence).toContain(marker);
 expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 expect(ledger.workflows.filter((w:any)=>w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!==id));
});
