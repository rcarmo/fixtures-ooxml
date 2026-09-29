const budgetId = new Set(['@id-package-admission-negative-budget']);
const descriptorId = new Set(['@id-zip-unsigned-descriptor-signature-collision']);
const boundId = new Set(['@id-zip-bounds']);
const unsafeId = new Set(['@id-zip-refuse-unsafe']);
const positiveIds = new Set(["@id-zip-read-valid","@id-zip-write-deterministic"]);
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/creation.feature';
const fixture='fixture-9548a1ce68caae9df12bc85732f1c19a098658c5dce3d79488814e4145299e5e';
const specs=[
 {id:'@id-docx-create-minimal-package',steps:[['DOCX create source "new-document" is prepared','DOCX create paragraph "  <Frankenstein & friend>  " with bold and italic formatting is appended','DOCX create document is saved and reopened','DOCX create package members equal "[Content_Types].xml,_rels/.rels,word/document.xml"','DOCX create paragraph 1 text equals "  <Frankenstein & friend>  "','DOCX create paragraph 1 run has bold and italic formatting','DOCX create paragraph 1 XML preserves boundary spaces and escapes special characters','DOCX create paragraph 1 is stored before the section properties']],outcomes:5,markers:['all eight exact','saved and reopened','three members']},
 {id:'@id-docx-create-style-validation',steps:[[ `DOCX create source "${fixture}" is prepared`,'DOCX create styled paragraph "Created heading" with style "Heading1" is appended','DOCX create document is saved and reopened','DOCX create paragraph 5 text equals "Created heading"','DOCX create paragraph 5 uses paragraph style "Heading1"']],outcomes:2,markers:['all five exact','Heading1','saved and reopened']},
 {id:'@id-docx-create-stale-opaque',steps:[[ `DOCX create source "${fixture}" is prepared`,'DOCX create paragraph 2 exact text "Genevese" span is remembered','DOCX create opaque part "docProps/core.xml" bytes are remembered','DOCX create plain paragraph "Appendix line" is appended','DOCX create current saved bytes are remembered','DOCX create stale replacement "Citizen" is attempted on the remembered span','DOCX create refusal code equals "docx-stale-span"','DOCX create saved bytes equal the remembered bytes','DOCX create opaque part "docProps/core.xml" bytes are unchanged']],outcomes:3,markers:['all nine exact','docx-stale-span','docProps/core.xml']},
 {id:'@id-docx-create-atomic-refusals',steps:['text-number|new-document|docx-invalid-argument','options-string|new-document|docx-invalid-argument','bold-string|new-document|docx-invalid-argument','style-without-styles-part|new-document|docx-style-unsupported',`unknown-style|${fixture}|docx-style-missing`].map(line=>{const [name,source,code]=line.split('|');return [`DOCX create source "${source}" is prepared`,'DOCX create current saved bytes are remembered',`DOCX create append refusal "${name}" is attempted`,`DOCX create refusal code equals "${code}"`,'DOCX create saved bytes equal the remembered bytes']}),outcomes:0,markers:['five exact five-step','docx-style-unsupported','docx-style-missing']},
];
test('Bun executes eight exact DOCX creation cases without Go or Python credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','6c06b047d4e36b0aa27bd30a8d7443180e46c7a6:ledgers/workflows.json']).toString());
 const rows=cases(path,await Bun.file(path).text());
 for(const {id,steps,outcomes,markers} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(steps.length);
  expect(rows.filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual(steps);
  if(outcomes)expect(current.expectedOutcomes).toEqual(steps[0]!.slice(-outcomes));
  else expect(current.expectedOutcomes).toEqual([...new Set(steps.flatMap(row=>row.slice(-2)))]);
  expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
  expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
  for(const marker of [...markers,'65ab23d90e047e43be6865bf2078647983842782','Fresh GitHub recursive make check','732/732','canonical creation'])expect(current.consumers.bun.evidence).toContain(marker);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),...["@id-docx-table-create-roundtrip","@id-docx-table-opaque-preserve","@id-docx-table-stale-cell","@id-docx-table-atomic-refusals","@id-docx-direct-font-size-half-points","@id-xml-parse-offsets","@id-xml-normalise-line-endings","@id-xml-parse-refusals","@id-xml-parse-bounds","@id-xml-apply-edits","@id-xml-entity-values","@id-xml-stylesheet-processing-instruction","@id-xml-expanded-attribute-lookup","@id-xml-implicit-xml-prefix","@id-xml-prototype-safe-attributes","@id-xml-immutable-namespace-metadata","@id-xml-escaping-values","@id-xml-escaping-invalid-character","@id-xml-escaping-whitespace-roundtrip","@id-xml-typed-parse-error","@id-xml-invalid-qname-components","@id-xml-unicode-qname-components","@id-xml-outside-root-nbsp","@id-xml-comparison-prefix-and-opc-order","@id-xml-comparison-significant-content","@id-xml-comparison-prefix-attribute-binding","@id-xml-comparison-unsafe-input","@id-xml-comparison-processing-instructions-and-comments","@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-zip-crc32-standard-vector","@id-bun-zip32-reader-refusal","@id-bun-zip32-writer-refusal","@id-bun-zip32-configured-bounds"]]);expect(ledger.workflows.filter((w:any)=>!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id)));
});
