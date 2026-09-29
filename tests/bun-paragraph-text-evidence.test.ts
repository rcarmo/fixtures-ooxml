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

const id='@id-docx-go-paragraph-text-getter',path='workflows/docx/paragraphs.feature';
const values=['','Hello World','  spaces  ','日本語テキスト','a < b > c & d'];
test('Bun executes five exact paragraph text getter rows without saved or Python credit',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show','6ed911b4c547f7a74a58122b6564c11247bff9c1:ledgers/workflows.json']).toString());
 const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
 expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(5);
 expect(cases(path,await Bun.file(path).text()).filter((row:any)=>row.scenarioId===id).map((row:any)=>row.steps.map((step:any)=>step.text))).toEqual(values.map(value=>[
  'a new Word paragraph',`its text is set to JSON ${JSON.stringify(value)}`,`the paragraph text getter equals JSON ${JSON.stringify(value)}`,
 ]));
 expect(former.consumers.bun.status).toBe('planned');expect(entry.consumers.bun.status).toBe('implemented');
 expect(entry.consumers.go.status).toBe('implemented');expect(entry.consumers.python).toEqual(former.consumers.python);
 for(const marker of ['8381344e26be0f41901ce18a028e486474b3d92f','Fresh GitHub recursive make check','732/732','five exact JSON'])expect(entry.consumers.bun.evidence).toContain(marker);
 const laterIds=new Set(["@id-docx-go-paragraph-alignment-getter","@id-docx-go-paragraph-spacing-getters","@id-docx-go-paragraph-advanced-toggles","@id-docx-go-paragraph-multiple-runs","@id-docx-go-body-insert-order","@id-docx-format-preserve","@id-docx-xml-space","@id-docx-table-paragraph","@id-docx-stale-span","@id-docx-refuse-topology","@id-docx-create-minimal-package","@id-docx-create-style-validation","@id-docx-create-stale-opaque","@id-docx-create-atomic-refusals","@id-docx-table-create-roundtrip","@id-docx-table-opaque-preserve","@id-docx-table-stale-cell","@id-docx-table-atomic-refusals","@id-docx-direct-font-size-half-points","@id-xml-parse-offsets","@id-xml-normalise-line-endings","@id-xml-parse-refusals","@id-xml-parse-bounds","@id-xml-apply-edits","@id-xml-entity-values","@id-xml-stylesheet-processing-instruction","@id-xml-expanded-attribute-lookup","@id-xml-implicit-xml-prefix","@id-xml-prototype-safe-attributes","@id-xml-immutable-namespace-metadata","@id-xml-escaping-values","@id-xml-escaping-invalid-character","@id-xml-escaping-whitespace-roundtrip","@id-xml-typed-parse-error","@id-xml-invalid-qname-components","@id-xml-unicode-qname-components","@id-xml-outside-root-nbsp","@id-xml-comparison-prefix-and-opc-order","@id-xml-comparison-significant-content","@id-xml-comparison-prefix-attribute-binding","@id-xml-comparison-unsafe-input","@id-xml-comparison-processing-instructions-and-comments","@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-zip-crc32-standard-vector","@id-bun-zip32-reader-refusal","@id-bun-zip32-writer-refusal","@id-bun-zip32-configured-bounds"]);
 const unchanged=structuredClone(entry);unchanged.consumers.bun=former.consumers.bun;unchanged.consumers.go=former.consumers.go;expect(unchanged).toEqual(former);
 expect(registry.workflows.filter((w:any)=>!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&w.id!==id&&!laterIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&w.id!==id&&!laterIds.has(w.id)));
});
