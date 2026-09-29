const unsafeId = new Set(['@id-zip-refuse-unsafe']);
const positiveIds = new Set(["@id-zip-read-valid","@id-zip-write-deterministic"]);
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/run-formatting.feature';
const specs=[
 {id:'@id-docx-go-run-color-getter',steps:[
  ['a new Word run','its colour is set to FF0000','its in-memory colour getter equals FF0000'],
  ['a new Word run','its colour is set to #FF0000','its in-memory colour getter equals FF0000'],
  ['a new Word run','its colour is set to ff0000','its in-memory colour getter equals ff0000'],
 ]},
 {id:'@id-docx-go-run-highlight',steps:['yellow','cyan','darkBlue','lightGray','black'].map(v=>['a new Word run',`highlight is set to ${v}`,`the Highlight getter equals ${v}`])},
 {id:'@id-docx-go-run-vertical-align',steps:[['two new Word runs','Superscript is enabled on the first and Subscript on the second','the first reports superscript true and subscript false','the second reports subscript true and superscript false']]},
 {id:'@id-docx-go-roundtrip-selected-formatting',steps:[['a new Word paragraph with three runs Bold-space, Italic-space and Colored','the first run is bold, the second italic, and the third has colour FF0000, font size 14 and font Arial','the document is saved and reopened','at least one paragraph and three runs are readable','the first run is bold and the second italic','the third run reports colour FF0000, font size 14 and font Arial']]},
];
test('Bun executes exact direct appearance and selected saved-formatting rows without Go or Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','d983be75704bc5a531cddf97d4b2405ee82b9c08:ledgers/workflows.json']).toString());
 const compiled=cases(path,await Bun.file(path).text());
 for(const {id,steps} of specs){
  const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
  expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(steps.length);
  expect(compiled.filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual(steps);
  expect(former.consumers.bun.status).toBe('planned');expect(entry.consumers.bun.status).toBe('implemented');
  expect(entry.consumers.go.status).toBe('implemented');
  expect(entry.consumers.python).toEqual(former.consumers.python);
  for(const marker of ['a79dc7917cfcdbdd43238298649b05769eafd554','Fresh GitHub recursive make check','732/732'])expect(entry.consumers.bun.evidence).toContain(marker);
  const unchanged=structuredClone(entry);unchanged.consumers.bun=former.consumers.bun;unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-go-table-merge-properties','@id-docx-go-table-style-getter','@id-docx-go-table-header-getter','@id-docx-go-cell-shading-getter','@id-docx-go-cell-properties-getters','@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts','@id-docx-go-new-empty-body','@id-docx-go-roundtrip-table-text','@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology', '@id-docx-create-minimal-package', '@id-docx-create-style-validation', '@id-docx-create-stale-opaque', '@id-docx-create-atomic-refusals', '@id-docx-table-create-roundtrip', '@id-docx-table-opaque-preserve', '@id-docx-table-stale-cell', '@id-docx-table-atomic-refusals', '@id-docx-direct-font-size-half-points','@id-xml-parse-offsets','@id-xml-normalise-line-endings','@id-xml-parse-refusals','@id-xml-parse-bounds','@id-xml-apply-edits','@id-xml-entity-values','@id-xml-stylesheet-processing-instruction','@id-xml-expanded-attribute-lookup','@id-xml-implicit-xml-prefix','@id-xml-prototype-safe-attributes','@id-xml-immutable-namespace-metadata','@id-xml-escaping-values','@id-xml-escaping-invalid-character','@id-xml-escaping-whitespace-roundtrip','@id-xml-typed-parse-error','@id-xml-invalid-qname-components','@id-xml-unicode-qname-components','@id-xml-outside-root-nbsp','@id-xml-comparison-prefix-and-opc-order','@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments','@id-package-admission-unsafe-members','@id-package-admission-resource-limits','@id-package-admission-unsupported-compression','@id-package-admission-unsafe-xml-members','@id-package-diff-equivalent-xml-and-binary-changes','@id-zip-crc32-standard-vector','@id-bun-zip32-reader-refusal','@id-bun-zip32-writer-refusal','@id-bun-zip32-configured-bounds']);expect(registry.workflows.filter((w:any)=>!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id)));
});
