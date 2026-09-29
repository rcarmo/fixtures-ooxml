const boundId = new Set(['@id-zip-bounds']);
const unsafeId = new Set(['@id-zip-refuse-unsafe']);
const positiveIds = new Set(["@id-zip-read-valid","@id-zip-write-deterministic"]);
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/xml/names.feature',refusal='parsing refuses with the malformed XML code';
const specs=[
 {id:'@id-xml-invalid-qname-components',steps:['element-local','attribute-local','declared-prefix'].map(part=>[`XML with a numeric-leading ${part} QName component`,'the namespace-name fixture is parsed',refusal]),outcomes:[refusal],markers:['all three exact','XML_MALFORMED']},
 {id:'@id-xml-unicode-qname-components',steps:[['XML with valid Unicode prefix and local name components','the namespace-name fixture is parsed','expanded element and attribute names retain their Unicode identity','source offsets still address the original Unicode element']],outcomes:['expanded element and attribute names retain their Unicode identity','source offsets still address the original Unicode element'],markers:['all four exact','UTF-16 source offsets']},
 {id:'@id-xml-outside-root-nbsp',steps:['before','after'].map(position=>[`XML with a non-breaking space ${position} the root element`,'the namespace-name fixture is parsed',refusal]),outcomes:[refusal],markers:['both exact','XML_MALFORMED']},
];
test('Bun executes six exact XML QName and outside-root NBSP cases without Go or Python credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','dd2984e9ad175261fd33d2c120b8cd2da8b4e881:ledgers/workflows.json']).toString());
 const rows=cases(path,await Bun.file(path).text());
 for(const {id,steps,outcomes,markers} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(steps.length);expect(current.expectedOutcomes).toEqual(outcomes);
  expect(rows.filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual(steps);
  expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
  for(const marker of [...markers,'ee1a099d8a1cd928ddb3814f3b94b35d9adee989','shared v0.78.0','tests/acceptance/xml-names.ts','tests/unit/xml-names.test.ts','fresh GitHub recursive make check','732/732','No Go/Python'])expect(current.consumers.bun.evidence).toContain(marker);
  expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),...["@id-xml-comparison-prefix-and-opc-order","@id-xml-comparison-significant-content","@id-xml-comparison-prefix-attribute-binding","@id-xml-comparison-unsafe-input","@id-xml-comparison-processing-instructions-and-comments","@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-zip-crc32-standard-vector","@id-bun-zip32-reader-refusal","@id-bun-zip32-writer-refusal","@id-bun-zip32-configured-bounds"]]);expect(ledger.workflows.filter((w:any)=>!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id)));
});
