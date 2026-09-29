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

const zip='workflows/package/zip-admission.feature',xml='workflows/package/xml-member-admission.feature';
const refusal='package admission is refused',defaultCheck='the package admission guard checks the archive with default limits';
const specs=[
 {id:'@id-package-admission-unsafe-members',path:zip,steps:[[[['a.xml','<a/>'],['a.xml','<b/>']]],[[['../a.xml','<a/>']]],[[['/a.xml','<a/>']]],[[['x\\a.xml','<a/>']]],[[['a/','payload']]]].map(([pairs])=>[`an ordered ZIP_STORED archive has member pairs encoded as JSON ${JSON.stringify(pairs)}`,defaultCheck,refusal]),outcomes:[refusal],markers:['Five exact three-step','unchanged caller bytes']},
 {id:'@id-package-admission-resource-limits',path:zip,steps:['max_members|0','max_member_bytes|2','max_total_bytes|2','max_ratio|1'].map(v=>{const [limit,n]=v.split('|');return ['a ZIP_DEFLATED archive contains a.xml with UTF-8 XML enclosing exactly 10000 spaces between <a> and </a>',`the package admission guard checks the archive with only ${limit} set to ${n}`,refusal]}),outcomes:[refusal],markers:['Four exact three-step','distinct typed limit code']},
 {id:'@id-package-admission-unsupported-compression',path:zip,steps:[['a ZIP_BZIP2 archive contains a.xml with UTF-8 text <a/>',defaultCheck,refusal,'the admission error contains compression']],outcomes:[refusal,'the admission error contains compression'],markers:['One exact four-step','zip-method-unsupported']},
 {id:'@id-package-admission-unsafe-xml-members',path:xml,steps:[['UTF-8','<!DOCTYPE a [<!ENTITY e "text">]><a>&e;</a>'],['UTF-16 with BOM','<!DOCTYPE a><a/>'],['UTF-8','<broken>']].map(([encoding,text])=>[`a ZIP_STORED archive contains a.xml with ${encoding} text ${text}`,defaultCheck,refusal]),outcomes:[refusal],markers:['Three exact three-step','XML_DTD_FORBIDDEN/XML_MALFORMED']},
];
test('Bun executes thirteen bounded ZIP and XML package-admission refusal rows without cross-consumer credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','5c871881e36d6a9c899b82d9ec5c97b1c47ff587:ledgers/workflows.json']).toString());
 for(const {id,path,steps,outcomes,markers} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(steps.length);expect(current.expectedOutcomes).toEqual(outcomes);
  expect(cases(path,await Bun.file(path).text()).filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual(steps);
  expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
  for(const marker of [...markers,'67b8db48ab46cdab07e6722dd25a4dd6e2932e2b','shared v0.80.0','tests/acceptance/package-admission.ts','tests/unit/package-admission.test.ts','13 cases/40 steps','Fresh GitHub recursive make check','732/732','No Go/Python'])expect(current.consumers.bun.evidence).toContain(marker);
  expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-package-diff-equivalent-xml-and-binary-changes', '@id-zip-crc32-standard-vector', '@id-bun-zip32-reader-refusal', '@id-bun-zip32-writer-refusal', '@id-bun-zip32-configured-bounds']);expect(ledger.workflows.filter((w:any)=>!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id)));
});
