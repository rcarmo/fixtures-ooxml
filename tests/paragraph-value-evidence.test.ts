import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/paragraphs.feature';
const alignment=[['left','left'],['center','center'],['right','right'],['justify','both']];
const spacing=[['zero','0','0'],['six-point','120','120'],['twelve','240','240'],['asymmetric','240','120']];
const specs=[
 {id:'@id-docx-go-paragraph-alignment-getter',rows:alignment.map(([requested,value])=>({name:`A ${requested} alignment reads back ${value} in memory`,steps:['a new Word paragraph',`its alignment is set to ${value}`,`its alignment getter equals ${value}`]})),markers:['four exact','justify','both','alignment']},
 {id:'@id-docx-go-paragraph-spacing-getters',rows:spacing.map(([variant,before,after])=>({name:`A ${variant} paragraph reads back spacing in twips`,steps:['a new Word paragraph',`spacing before is set to ${before} and after to ${after}`,`its before and after getters equal ${before} and ${after}`]})),markers:['four exact','twip','spacing']},
 {id:'@id-docx-go-paragraph-advanced-toggles',rows:[{name:'Three paragraph flags read true after being enabled',steps:['a new Word paragraph','KeepLines, PageBreakBefore and WidowControl are set true','all three getters are true in memory']}],markers:['three exact','KeepLines','PageBreakBefore','WidowControl']},
 {id:'@id-docx-go-paragraph-multiple-runs',rows:[{name:'Three added runs concatenate in paragraph text',steps:['a new Word paragraph','runs containing Hello-space, World and exclamation are appended in order','the paragraph has three runs and its text equals Hello World!']}],markers:['three exact','three','Hello World!']},
];
test('four bounded DOCX paragraph value workflows have exact shared steps and separate Bun/Go receipts',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','df3950c79dc3c688027b1e715eb8557e541d4a7c:ledgers/workflows.json']).toString());
 const rows=cases(path,await Bun.file(path).text());
 for(const {id,rows:expected,markers} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(expected.length);
  expect(rows.filter((r:any)=>r.scenarioId===id).map((r:any)=>({name:r.name,steps:r.steps.map((s:any)=>s.text)}))).toEqual(expected);
  expect(current.expectedOutcomes).toEqual(expected.map(r=>r.steps.at(-1)));
  for(const consumer of ['bun','go']){
   expect(old.consumers[consumer].status).toBe('planned');expect(current.consumers[consumer].status).toBe('implemented');
   const receipt=current.consumers[consumer].evidence;
   for(const marker of markers)expect(receipt).toContain(marker);
   for(const marker of consumer==='bun'?['69b6aa23a93b1b2f840f4dad8e8a43a95d0971bf','732/732','Fresh GitHub recursive make check']:['c88e8f84c58d5e52591834f42b71cedc0832bd9b','348 selected cases/1189 steps/0 failures/0 skips','reports/batches/196.md'])expect(receipt).toContain(marker);
   expect(receipt.toLowerCase()).toContain('in-memory');
  }
  expect(current.consumers.python).toEqual(old.consumers.python);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-go-body-insert-order', '@id-docx-format-preserve', '@id-docx-xml-space', '@id-docx-table-paragraph', '@id-docx-stale-span', '@id-docx-refuse-topology', '@id-docx-create-minimal-package', '@id-docx-create-style-validation', '@id-docx-create-stale-opaque', '@id-docx-create-atomic-refusals', '@id-docx-table-create-roundtrip', '@id-docx-table-opaque-preserve', '@id-docx-table-stale-cell', '@id-docx-table-atomic-refusals', '@id-docx-direct-font-size-half-points','@id-xml-parse-offsets','@id-xml-normalise-line-endings','@id-xml-parse-refusals','@id-xml-parse-bounds','@id-xml-apply-edits','@id-xml-entity-values','@id-xml-stylesheet-processing-instruction','@id-xml-expanded-attribute-lookup','@id-xml-implicit-xml-prefix','@id-xml-prototype-safe-attributes','@id-xml-immutable-namespace-metadata','@id-xml-escaping-values','@id-xml-escaping-invalid-character','@id-xml-escaping-whitespace-roundtrip','@id-xml-typed-parse-error','@id-xml-invalid-qname-components','@id-xml-unicode-qname-components','@id-xml-outside-root-nbsp','@id-xml-comparison-prefix-and-opc-order','@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments','@id-package-admission-unsafe-members','@id-package-admission-resource-limits','@id-package-admission-unsupported-compression','@id-package-admission-unsafe-xml-members','@id-package-diff-equivalent-xml-and-binary-changes','@id-zip-crc32-standard-vector','@id-bun-zip32-reader-refusal','@id-bun-zip32-writer-refusal','@id-bun-zip32-configured-bounds']);expect(ledger.workflows.filter((w:any)=>!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.has(w.id)));
});
