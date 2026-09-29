const slideOrderIds = new Set(["@id-pptx-slide-permutation","@id-pptx-slide-permutation-refusal"]);
const textBoxIds = new Set(["@id-pptx-text-box-authoring","@id-pptx-text-box-refusal"]);
const pptxTableIds = new Set(["@id-pptx-table-roundtrip-geometry","@id-pptx-table-formatting","@id-pptx-table-stale-handle","@id-pptx-table-atomic-refusals"]);
const pptxNoopId = new Set(['@id-pptx-bun-open-save-noop']);
const threadIds = new Set(["@id-docx-existing-thread-inspection","@id-docx-existing-thread-resolution","@id-docx-existing-thread-noop","@id-docx-existing-thread-refusal","@id-docx-existing-thread-rollback","@id-docx-existing-thread-encoding","@id-docx-existing-thread-unsupported","@id-docx-existing-thread-limit"]);
const commentIds = new Set(["@id-docx-comments-inspection","@id-docx-comments-resolution","@id-docx-comments-noop","@id-docx-comments-refusal"]);
const relationshipIds = new Set(["@id-office-relationship-prefix-alias","@id-office-relationship-wrong-uri"]);
const custodyIds = new Set(["@id-bun-opc-open-refusal","@id-bun-opc-detached-byte-copies","@id-bun-opc-preserve-utf16le-edit","@id-bun-opc-async-transaction-refusal","@id-bun-opc-thenable-transaction-result","@id-bun-opc-save-invalid-target-custody","@id-bun-opc-symlink-destination-refusal"]);
const coreOpcIds = new Set(["@id-opc-package-corpus-noop","@id-opc-package-transaction-rollback","@id-opc-package-preserve-unrelated"]);
const budgetId = new Set(['@id-package-admission-negative-budget']);
const descriptorId = new Set(['@id-zip-unsigned-descriptor-signature-collision']);
const boundId = new Set(['@id-zip-bounds']);
const unsafeId = new Set(['@id-zip-refuse-unsafe']);
const positiveIds = new Set(["@id-zip-read-valid","@id-zip-write-deterministic"]);
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
 const laterBunIds=new Set(['@id-docx-go-run-color-getter','@id-docx-go-run-highlight','@id-docx-go-run-vertical-align','@id-docx-go-roundtrip-selected-formatting','@id-docx-go-table-merge-properties','@id-docx-go-table-style-getter','@id-docx-go-table-header-getter','@id-docx-go-cell-shading-getter','@id-docx-go-cell-properties-getters','@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts','@id-docx-go-new-empty-body','@id-docx-go-roundtrip-table-text','@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology', '@id-docx-create-minimal-package', '@id-docx-create-style-validation', '@id-docx-create-stale-opaque', '@id-docx-create-atomic-refusals', '@id-docx-table-create-roundtrip', '@id-docx-table-opaque-preserve', '@id-docx-table-stale-cell', '@id-docx-table-atomic-refusals', '@id-docx-direct-font-size-half-points','@id-xml-parse-offsets','@id-xml-normalise-line-endings','@id-xml-parse-refusals','@id-xml-parse-bounds','@id-xml-apply-edits','@id-xml-entity-values','@id-xml-stylesheet-processing-instruction','@id-xml-expanded-attribute-lookup','@id-xml-implicit-xml-prefix','@id-xml-prototype-safe-attributes','@id-xml-immutable-namespace-metadata','@id-xml-escaping-values','@id-xml-escaping-invalid-character','@id-xml-escaping-whitespace-roundtrip','@id-xml-typed-parse-error','@id-xml-invalid-qname-components','@id-xml-unicode-qname-components','@id-xml-outside-root-nbsp','@id-xml-comparison-prefix-and-opc-order','@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments','@id-package-admission-unsafe-members','@id-package-admission-resource-limits','@id-package-admission-unsupported-compression','@id-package-admission-unsafe-xml-members','@id-package-diff-equivalent-xml-and-binary-changes','@id-zip-crc32-standard-vector','@id-bun-zip32-reader-refusal','@id-bun-zip32-writer-refusal','@id-bun-zip32-configured-bounds']);
 expect(registry.workflows.filter((w:any)=>!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.includes(w.id)&&!laterBunIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.includes(w.id)&&!laterBunIds.has(w.id)));
});
