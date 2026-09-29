import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-xml-apply-edits',path='workflows/xml/editing.feature';
const steps=['a well-formed XML document and source offsets for text or element content','disjoint edits are applied with escaped replacement text or XML fragments','the resulting XML stays well formed and DTD free','overlapping edits or edits that leave malformed or DTD-bearing XML are refused before returning changed text'];
test('Bun executes exact XML editing success and three refusal predicates without package or cross-consumer credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','a2f3ef721fe5bbb5c757b5a3dc2b1108c5f05971:ledgers/workflows.json']).toString());
 const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 expect(current.feature).toBe(path);expect(current.expandedCases).toBe(1);
 expect(cases(path,await Bun.file(path).text()).filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual([steps]);
 expect(current.expectedOutcomes).toEqual(steps.slice(-2));
 expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
 for(const marker of ['664c581eb4289ffb7952f10aff729f533595d4c3','shared v0.76.0','all four exact','tests/acceptance/core.ts','XML_EDIT_OVERLAP','XML_EDIT_UNSAFE','Fresh GitHub recursive make check','732/732','Lexical XML edit only'])expect(current.consumers.bun.evidence).toContain(marker);
 expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 const laterIds=new Set(["@id-xml-entity-values","@id-xml-stylesheet-processing-instruction","@id-xml-expanded-attribute-lookup","@id-xml-implicit-xml-prefix","@id-xml-prototype-safe-attributes","@id-xml-immutable-namespace-metadata","@id-xml-escaping-values","@id-xml-escaping-invalid-character","@id-xml-escaping-whitespace-roundtrip","@id-xml-typed-parse-error","@id-xml-invalid-qname-components","@id-xml-unicode-qname-components","@id-xml-outside-root-nbsp","@id-xml-comparison-prefix-and-opc-order","@id-xml-comparison-significant-content","@id-xml-comparison-prefix-attribute-binding","@id-xml-comparison-unsafe-input","@id-xml-comparison-processing-instructions-and-comments","@id-package-admission-unsafe-members","@id-package-admission-resource-limits","@id-package-admission-unsupported-compression","@id-package-admission-unsafe-xml-members","@id-package-diff-equivalent-xml-and-binary-changes","@id-zip-crc32-standard-vector","@id-bun-zip32-reader-refusal","@id-bun-zip32-writer-refusal","@id-bun-zip32-configured-bounds"]);expect(ledger.workflows.filter((w:any)=>w.id!==id&&!laterIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>w.id!==id&&!laterIds.has(w.id)));
});
