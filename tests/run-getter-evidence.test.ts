import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/run-formatting.feature';
const ids=['@id-docx-go-run-underline-style','@id-docx-go-run-font-name'];
const expected=[
 {id:ids[0],values:['single','double','thick','dotted','dash','wave'],when:(v:string)=>`its underline style is set to ${v}`,then:(v:string)=>`Underline is true and UnderlineStyle equals ${v}`},
 {id:ids[1],values:['Arial','Times New Roman','Calibri','Courier New','Georgia','Verdana'],when:(v:string)=>`its font name is set to ${v}`,then:(v:string)=>`its font-name getter equals ${v}`},
];
test('exact underline and font getter rows record Bun and Go execution without Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','7502c11d5fbf98af56b9360031609bd96f20cce8:ledgers/workflows.json']).toString());
 const compiled=cases(path,await Bun.file(path).text());
 for(const spec of expected){
  const entry=registry.workflows.find((w:any)=>w.id===spec.id),former=prior.workflows.find((w:any)=>w.id===spec.id);
  expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(6);expect(former.consumers.bun.status).toBe('planned');expect(former.consumers.go.status).toBe('planned');
  expect(entry.consumers.bun.status).toBe('implemented');expect(entry.consumers.go.status).toBe('implemented');expect(entry.consumers.python).toEqual(former.consumers.python);
  for(const marker of ['e505d84f6818aff1a80ead8ccd7c978b4b2289f5','six exact three-step rows','fresh GitHub recursive make check','732/732','in-memory'])expect(entry.consumers.bun.evidence).toContain(marker);
  for(const marker of ['85b5b85c4ec31a0b285f53c8cef5d94ea8d300cd','4e07f23fb0ee4b0d75e11730fd6041b62369c48b','307 selected cases/1052 steps/0 failures','reports/batches/179.md','In-memory API only'])expect(entry.consumers.go.evidence).toContain(marker);
  const rows=compiled.filter((row:any)=>row.scenarioId===spec.id);expect(rows).toHaveLength(6);
  expect(rows.map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual(spec.values.map(value=>['a new Word run',spec.when(value),spec.then(value)]));
  const unchanged=structuredClone(entry);unchanged.consumers.bun=former.consumers.bun;unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 }
 const laterBunIds=new Set(['@id-docx-go-run-color-getter','@id-docx-go-run-highlight','@id-docx-go-run-vertical-align','@id-docx-go-roundtrip-selected-formatting','@id-docx-go-table-merge-properties','@id-docx-go-table-style-getter','@id-docx-go-table-header-getter','@id-docx-go-cell-shading-getter','@id-docx-go-cell-properties-getters','@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts','@id-docx-go-new-empty-body','@id-docx-go-roundtrip-table-text','@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology', '@id-docx-create-minimal-package', '@id-docx-create-style-validation', '@id-docx-create-stale-opaque', '@id-docx-create-atomic-refusals', '@id-docx-table-create-roundtrip', '@id-docx-table-opaque-preserve', '@id-docx-table-stale-cell', '@id-docx-table-atomic-refusals', '@id-docx-direct-font-size-half-points','@id-xml-parse-offsets','@id-xml-normalise-line-endings','@id-xml-parse-refusals','@id-xml-parse-bounds','@id-xml-apply-edits']);
 expect(registry.workflows.filter((w:any)=>!ids.includes(w.id)&&!laterBunIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.includes(w.id)&&!laterBunIds.has(w.id)));
});
