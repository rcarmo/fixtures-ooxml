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
 const newRunIds=new Set(['@id-docx-go-run-effects-getters','@id-docx-go-run-underline-style','@id-docx-go-run-font-name','@id-docx-go-run-color-getter','@id-docx-go-run-highlight','@id-docx-go-run-vertical-align','@id-docx-go-roundtrip-selected-formatting','@id-docx-go-table-merge-properties','@id-docx-go-table-style-getter','@id-docx-go-table-header-getter','@id-docx-go-cell-shading-getter','@id-docx-go-cell-properties-getters','@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts','@id-docx-go-new-empty-body','@id-docx-go-roundtrip-table-text','@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology']);
 expect(registry.workflows.filter((w:any)=>w.id!==id&&!newRunIds.has(w.id))).toEqual(previous.workflows.filter((w:any)=>w.id!==id&&!newRunIds.has(w.id)));
 const steps=cases(path,await Bun.file(path).text()).find(row=>row.scenarioId===id)!.steps.map(step=>step.text);
 expect(steps).toEqual(['a saved workbook containing a newly introduced cell style','an independent reader opens the workbook','it reads the edited cell without an invalid style index','its identity and version are recorded separately from the writer']);
});
