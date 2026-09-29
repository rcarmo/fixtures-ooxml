import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-docx-go-run-vertical-align',path='workflows/docx/run-formatting.feature';
test('Go executes two-run opposite vertical flags in memory without Python or table credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show','11f21b29c3c4c93db03fd04a47eb1e92c21e2456:ledgers/workflows.json']).toString());
 const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
 expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(1);
 expect(cases(path,await Bun.file(path).text()).filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual([[
  'two new Word runs','Superscript is enabled on the first and Subscript on the second',
  'the first reports superscript true and subscript false','the second reports subscript true and superscript false',
 ]]);
 expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
 expect(entry.consumers.bun).toEqual(former.consumers.bun);expect(entry.consumers.python).toEqual(former.consumers.python);
 for(const marker of ['3d138c5ea5286263389e6dfa55e9c9b593c25920','57e767fdbc9ad45a8cd8b91ce0c54a60b1e01253','317 selected cases/1086 steps/0 failures','fresh GitHub recursive clone','reports/batches/184.md','in-memory'])expect(entry.consumers.go.evidence).toContain(marker);
 const unchanged=structuredClone(entry);unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 const laterTableIds=new Set(['@id-docx-go-table-merge-properties','@id-docx-go-table-style-getter','@id-docx-go-table-header-getter','@id-docx-go-cell-shading-getter','@id-docx-go-cell-properties-getters','@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts','@id-docx-go-new-empty-body','@id-docx-go-roundtrip-table-text','@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology', '@id-docx-create-minimal-package', '@id-docx-create-style-validation', '@id-docx-create-stale-opaque', '@id-docx-create-atomic-refusals', '@id-docx-table-create-roundtrip', '@id-docx-table-opaque-preserve', '@id-docx-table-stale-cell', '@id-docx-table-atomic-refusals']);
 expect(registry.workflows.filter((w:any)=>w.id!==id&&!laterTableIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>w.id!==id&&!laterTableIds.has(w.id)));
});
