import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/tables.feature';
const specs=[
 {id:'@id-docx-go-table-style-getter',steps:['a new Word two-by-two table','its style is read, then set to TableGrid and read again','the first style is empty and the second style is TableGrid']},
 {id:'@id-docx-go-table-header-getter',steps:['the first row of a new Word three-by-two table','IsHeader is read, SetHeader true is applied and IsHeader is read again','the first result is false and the second is true']},
 {id:'@id-docx-go-cell-shading-getter',steps:['cell zero-zero of a new Word two-by-two table','its shading is set to FFFF00','its shading getter equals FFFF00']},
 {id:'@id-docx-go-cell-properties-getters',steps:['cell zero-zero of a new Word one-by-one table','width is set to 2400 dxa, vertical alignment center and text direction tbRl','a top border with single style, size eight and colour 000000 is assigned','width equals 2400, width type dxa, alignment center and direction tbRl','the border collection and top border are nonnil']},
];
test('Bun executes four exact table and cell direct getter cases without Go or Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','11f21b29c3c4c93db03fd04a47eb1e92c21e2456:ledgers/workflows.json']).toString());
 const compiled=cases(path,await Bun.file(path).text());
 for(const {id,steps} of specs){
  const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
  expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(1);
  expect(compiled.filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual([steps]);
  expect(former.consumers.bun.status).toBe('planned');expect(entry.consumers.bun.status).toBe('implemented');
  expect(entry.consumers.go).toEqual(former.consumers.go);expect(entry.consumers.python).toEqual(former.consumers.python);
  for(const marker of ['8ca59cab7b9ce3926c426bbf83cc985852655b0a','Fresh GitHub recursive make check','732/732'])expect(entry.consumers.bun.evidence).toContain(marker);
  const unchanged=structuredClone(entry);unchanged.consumers.bun=former.consumers.bun;expect(unchanged).toEqual(former);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-go-run-vertical-align','@id-docx-go-table-merge-properties','@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts','@id-docx-go-new-empty-body','@id-docx-go-roundtrip-table-text','@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology', '@id-docx-create-minimal-package', '@id-docx-create-style-validation', '@id-docx-create-stale-opaque', '@id-docx-create-atomic-refusals', '@id-docx-table-create-roundtrip', '@id-docx-table-opaque-preserve', '@id-docx-table-stale-cell', '@id-docx-table-atomic-refusals', '@id-docx-direct-font-size-half-points', '@id-xml-parse-offsets', '@id-xml-normalise-line-endings', '@id-xml-parse-refusals', '@id-xml-parse-bounds']);expect(registry.workflows.filter((w:any)=>!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.has(w.id)));
});
