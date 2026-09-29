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

const path='workflows/xml/comparison.feature',compare='the conservative XML comparator compares their UTF-8 bytes';
const specs=[
 {id:'@id-xml-comparison-prefix-and-opc-order',pairs:[['<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="a" Target="a.xml"/><Relationship Id="b" Target="b.xml"/></Relationships>','<r:Relationships xmlns:r="http://schemas.openxmlformats.org/package/2006/relationships"><r:Relationship Target="b.xml" Id="b"/><r:Relationship Target="a.xml" Id="a"/></r:Relationships>']],result:true,markers:['One exact four-step positive','OPC relationships']},
 {id:'@id-xml-comparison-significant-content',pairs:[['<a><b> x </b></a>','<a><b>x</b></a>'],['<a><b/><c/></a>','<a><c/><b/></a>'],['<a v="1"/>','<a v="2"/>']],result:false,markers:['Three exact four-step negative','text whitespace']},
 {id:'@id-xml-comparison-prefix-attribute-binding',pairs:[['<a xmlns:p="urn:one" value="p:x"/>','<a xmlns:p="urn:two" value="p:x"/>']],result:false,markers:['One exact four-step negative','prefix-valued attribute']},
 {id:'@id-xml-comparison-unsafe-input',pairs:[['<!DOCTYPE a [<!ENTITY e "text">]><a>&e;</a>','<!DOCTYPE a [<!ENTITY e "text">]><a>&e;</a>'],['broken','broken']],result:false,markers:['Two exact four-step negative','DTD-bearing','malformed']},
 {id:'@id-xml-comparison-processing-instructions-and-comments',pairs:[['<?one x?><a/>','<?two x?><a/>'],['<a><?one x?></a>','<a><?two x?></a>'],['<!--old--><a/>','<!--new--><a/>']],result:false,markers:['Three exact four-step negative','prolog PI target','prolog comment']},
];
test('Bun executes ten exact conservative XML comparison cases without Go, Python or general equivalence credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','492597abefbfe0d8c3f77f4ae98eb0f0e665a69f:ledgers/workflows.json']).toString());
 const rows=cases(path,await Bun.file(path).text());
 for(const {id,pairs,result,markers} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(pairs.length);
  expect(rows.filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual(pairs.map(([l,r])=>[`the left XML is ${l}`,`the right XML is ${r}`,compare,`the comparison result is ${result}`]));
  expect(current.expectedOutcomes).toEqual([`the comparison result is ${result}`]);
  expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
  for(const marker of [...markers,'7b5990e63b8ed11aa08ad4ffbd00abfef579d07f','shared v0.79.0','tests/acceptance/xml-comparison.ts','tests/unit/xml-comparison.test.ts','10 cases/40 steps','Fresh GitHub recursive make check','732/732','Go/Python planned'])expect(current.consumers.bun.evidence).toContain(marker);
  expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-package-admission-unsafe-members','@id-package-admission-resource-limits','@id-package-admission-unsupported-compression','@id-package-admission-unsafe-xml-members','@id-package-diff-equivalent-xml-and-binary-changes', '@id-zip-crc32-standard-vector', '@id-bun-zip32-reader-refusal', '@id-bun-zip32-writer-refusal', '@id-bun-zip32-configured-bounds']);expect(ledger.workflows.filter((w:any)=>!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id)));
});
