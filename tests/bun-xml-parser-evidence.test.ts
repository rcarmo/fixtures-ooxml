import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/xml/parsing.feature';
const specs=[
 {id:'@id-xml-parse-offsets',steps:['an XML document with a declaration, comments, processing instructions and namespaces','the document is parsed','the root element and descendants expose decoded text, decoded attributes and namespace URIs','each element exposes UTF-16 source offsets, parent links, child links, root links and self-closing state'],outcomes:2,markers:['four exact','UTF-16 source offsets']},
 {id:'@id-xml-normalise-line-endings',steps:['XML text and attributes containing raw CRLF and character references','that XML is parsed without rewriting the source','decoded text normalises raw line endings but preserves referenced carriage returns','decoded attributes normalise literal whitespace while preserving referenced whitespace','element offsets still address the original source string'],outcomes:3,markers:['five exact','unmodified source']},
 {id:'@id-xml-parse-refusals',steps:['XML containing a malformed declaration or processing instruction','XML containing invalid comment termination or missing attribute whitespace','XML containing reserved namespace misuse, a DTD or an undeclared entity','XML containing a duplicate attribute, an unbound prefix or a mismatched tag','the document is parsed','parsing is refused with a stable XML error code'],outcomes:1,markers:['six exact','no returned document','stable XML error code']},
 {id:'@id-xml-parse-bounds',steps:['XML whose nesting depth, node count or input length exceeds the configured parser limits','the document is parsed','parsing is refused before returning a partial tree'],outcomes:1,markers:['three exact','no partial parsed document']},
];
test('Bun executes four exact XML parsing and refusal scenarios without Go or Python credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','8789e30b55f34ff7c0b04b6a5c9fe538d5fe4f65:ledgers/workflows.json']).toString());
 const rows=cases(path,await Bun.file(path).text());
 for(const {id,steps,outcomes,markers} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(1);
  expect(rows.filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual([steps]);
  expect(current.expectedOutcomes).toEqual(steps.slice(-outcomes));
  expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
  expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
  for(const marker of [...markers,'a85530c6853a0736860e7649f7fe131a9f5e5a41','shared v0.75.0','tests/acceptance/core.ts','Fresh GitHub recursive make check','732/732'])expect(current.consumers.bun.evidence).toContain(marker);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-direct-font-size-half-points']);expect(ledger.workflows.filter((w:any)=>!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.has(w.id)));
});
