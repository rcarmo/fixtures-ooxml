const positiveIds = new Set(["@id-zip-read-valid","@id-zip-write-deterministic"]);
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const specs=[
 {id:'@id-docx-go-core-properties-getters',path:'workflows/docx/properties.feature',steps:['a new Word document','its core properties are set to title Doc Title, creator Doc Author and subject Doc Subject','description Doc Description, keywords one;two, category Category and language en-US are supplied','content status Draft, identifier urn:example:doc, last modifier Reviewer, revision 2 and version 1.0 are supplied','created, modified and last-printed W3CDTF timestamps are supplied for 2026-02-03T00:00:00Z, 2026-02-03T01:00:00Z and 2026-02-03T02:00:00Z','the setter and getter return no error','only the in-memory title creator and subject are compared to Doc Title, Doc Author and Doc Subject']},
 {id:'@id-docx-go-section-title-background-getters',path:'workflows/docx/page-layout.feature',steps:['a new Word document with a first section','TitlePage is set true on that section and BackgroundColor to EEEEEE','the section TitlePage getter is true and the document BackgroundColor getter equals EEEEEE']},
];
test('Go executes selected in-memory core and section getters without unrelated field or Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','8450367177a03798b8c49b9bb1553ba1df51bd2b:ledgers/workflows.json']).toString());
 for(const {id,path,steps} of specs){
  const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
  expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(1);
  expect(cases(path,await Bun.file(path).text()).filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual([steps]);
  expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
  expect(entry.consumers.python).toEqual(former.consumers.python);
  for(const marker of ['0f627605c1a8afc8f7a739eb2be1e73a0d650252','56b999644e27091436ae85120ea2d210c3eaf7eb','333 selected cases/1144 steps/0 failures','fresh GitHub recursive clone','reports/batches/192.md'])expect(entry.consumers.go.evidence).toContain(marker);
  const unchanged=structuredClone(entry);unchanged.consumers.bun=former.consumers.bun;unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology', '@id-docx-create-minimal-package', '@id-docx-create-style-validation', '@id-docx-create-stale-opaque', '@id-docx-create-atomic-refusals', '@id-docx-table-create-roundtrip', '@id-docx-table-opaque-preserve', '@id-docx-table-stale-cell', '@id-docx-table-atomic-refusals', '@id-docx-direct-font-size-half-points', '@id-xml-parse-offsets', '@id-xml-normalise-line-endings', '@id-xml-parse-refusals', '@id-xml-parse-bounds','@id-xml-apply-edits','@id-xml-entity-values','@id-xml-stylesheet-processing-instruction','@id-xml-expanded-attribute-lookup','@id-xml-implicit-xml-prefix','@id-xml-prototype-safe-attributes','@id-xml-immutable-namespace-metadata','@id-xml-escaping-values','@id-xml-escaping-invalid-character','@id-xml-escaping-whitespace-roundtrip','@id-xml-typed-parse-error','@id-xml-invalid-qname-components','@id-xml-unicode-qname-components','@id-xml-outside-root-nbsp','@id-xml-comparison-prefix-and-opc-order','@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments','@id-package-admission-unsafe-members','@id-package-admission-resource-limits','@id-package-admission-unsupported-compression','@id-package-admission-unsafe-xml-members','@id-package-diff-equivalent-xml-and-binary-changes','@id-zip-crc32-standard-vector','@id-bun-zip32-reader-refusal','@id-bun-zip32-writer-refusal','@id-bun-zip32-configured-bounds']);expect(registry.workflows.filter((w:any)=>!positiveIds.has(w.id)&&!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!positiveIds.has(w.id)&&!ids.has(w.id)));
});
