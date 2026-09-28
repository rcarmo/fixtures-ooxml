import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-office-xlsx-independent-style-reader',path='workflows/xlsx/style-readback.feature';
test('independent XLSX style readback records one Bun execution without assigning Go or Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json(),entry=registry.workflows.find((w:any)=>w.id===id);
 expect(cases(path,await Bun.file(path).text()).filter(row=>row.scenarioId===id)).toHaveLength(1);
 expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(1);
 expect(entry.consumers.bun.status).toBe('implemented');
 for(const marker of ['0546d6dd009149af248f5ad092b60e4821d39d22','four exact shared steps','DocumentFormat.OpenXml 3.5.1','Office2019','locked mode','732/732 selected cases','36481577065'])expect(entry.consumers.bun.evidence).toContain(marker);
 expect(entry.consumers.go.status).toBe('planned');expect(entry.consumers.python.status).toBe('planned');
 const previous=JSON.parse(execFileSync('git',['show','4063149c5fb48028471588db79a4ab440ccbe0a1:ledgers/workflows.json']).toString()),prior=previous.workflows.find((w:any)=>w.id===id);
 expect(prior.consumers.bun.status).toBe('planned');const unchanged=structuredClone(entry);unchanged.consumers.bun=prior.consumers.bun;expect(unchanged).toEqual(prior);
 const runEffectsId='@id-docx-go-run-effects-getters';
 expect(registry.workflows.filter((w:any)=>w.id!==id&&w.id!==runEffectsId)).toEqual(previous.workflows.filter((w:any)=>w.id!==id&&w.id!==runEffectsId));
 const steps=cases(path,await Bun.file(path).text()).find(row=>row.scenarioId===id)!.steps.map(step=>step.text);
 expect(steps).toEqual(['a saved workbook containing a newly introduced cell style','an independent reader opens the workbook','it reads the edited cell without an invalid style index','its identity and version are recorded separately from the writer']);
});
