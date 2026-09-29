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

const source='380ba5ae65674a0a544fa283bf5683e8a979495e';
const id='@id-xlsx-cross-sheet-cache-invalidation';
const path='workflows/xlsx/formula-cache.feature';

test('published Go cross-sheet case replaces one native selection without changing any other workflow',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show',`${source}:ledgers/workflows.json`]).toString());
 const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
 expect(entry?.feature).toBe(path);expect(entry?.expandedCases).toBe(1);
 expect(cases(path,await Bun.file(path).text()).filter(c=>c.scenarioId===id)).toHaveLength(1);
 expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
 for(const marker of ['d929fc78b52b2ab28c3695eec486761414c7aede','@CACHE-001','14-step','294 selected cases/1013 steps/0 other','go-cache-github-published-gate.log','0fa74dad775f9458ce9212ed8c8dac84ce18cadea9fcc511c5c02557cb573e5a'])expect(entry.consumers.go.evidence).toContain(marker);
 const unchanged=structuredClone(entry);unchanged.consumers.go=former.consumers.go;
 expect(unchanged).toEqual(former);
 const visibility='workflows/pptx/slide-visibility.feature';
 expect(registry.features.filter((p:string)=>p!==visibility)).toEqual(prior.features);
 const exceptions=new Set([id,'@id-xlsx-owned-calculation-chain-invalidation','@id-zip-physical-member-overlap-refusal','@id-office-xlsx-independent-style-reader','@id-docx-go-run-effects-getters','@id-docx-go-run-underline-style','@id-docx-go-run-font-name','@id-docx-go-run-color-getter','@id-docx-go-run-highlight','@id-docx-go-run-vertical-align','@id-docx-go-roundtrip-selected-formatting','@id-docx-go-table-merge-properties','@id-docx-go-table-style-getter','@id-docx-go-table-header-getter','@id-docx-go-cell-shading-getter','@id-docx-go-cell-properties-getters','@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts','@id-docx-go-new-empty-body','@id-docx-go-roundtrip-table-text','@id-docx-go-core-properties-getters','@id-docx-go-section-title-background-getters','@id-docx-go-paragraph-text-getter', '@id-docx-go-paragraph-alignment-getter', '@id-docx-go-paragraph-spacing-getters', '@id-docx-go-paragraph-advanced-toggles', '@id-docx-go-paragraph-multiple-runs', '@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology', '@id-docx-create-minimal-package', '@id-docx-create-style-validation', '@id-docx-create-stale-opaque', '@id-docx-create-atomic-refusals', '@id-docx-table-create-roundtrip', '@id-docx-table-opaque-preserve', '@id-docx-table-stale-cell', '@id-docx-table-atomic-refusals', '@id-docx-direct-font-size-half-points','@id-xml-parse-offsets','@id-xml-normalise-line-endings','@id-xml-parse-refusals','@id-xml-parse-bounds','@id-xml-apply-edits', '@id-xml-entity-values', '@id-xml-stylesheet-processing-instruction', '@id-xml-expanded-attribute-lookup', '@id-xml-implicit-xml-prefix', '@id-xml-prototype-safe-attributes', '@id-xml-immutable-namespace-metadata', '@id-xml-escaping-values', '@id-xml-escaping-invalid-character', '@id-xml-escaping-whitespace-roundtrip', '@id-xml-typed-parse-error', '@id-xml-invalid-qname-components', '@id-xml-unicode-qname-components', '@id-xml-outside-root-nbsp', '@id-xml-comparison-prefix-and-opc-order', '@id-xml-comparison-significant-content', '@id-xml-comparison-prefix-attribute-binding', '@id-xml-comparison-unsafe-input', '@id-xml-comparison-processing-instructions-and-comments', '@id-package-admission-unsafe-members', '@id-package-admission-resource-limits', '@id-package-admission-unsupported-compression', '@id-package-admission-unsafe-xml-members', '@id-package-diff-equivalent-xml-and-binary-changes', '@id-zip-crc32-standard-vector', '@id-bun-zip32-reader-refusal', '@id-bun-zip32-writer-refusal', '@id-bun-zip32-configured-bounds']);
 expect(registry.workflows.filter((w:any)=>!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!exceptions.has(w.id)&&w.feature!==visibility)).toEqual(prior.workflows.filter((w:any)=>!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!exceptions.has(w.id)));
});
