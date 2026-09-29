import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only exact structured XML child-insertion custody',async()=>{
 const id='@id-xml-go-child-insertion-custody',feature='workflows/xml/editing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','63a8aef12b2e2f0e5ea00684e5a5f9f2e7a737ec:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Insert a child with independently scoped element and attribute names');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'the XML source is <root xmlns="u" xmlns:n1="occupied"><a/><b>keep</b></root>',
  'a structured edit inserts a new-namespace x child with an other-namespace a attribute and a plain text child under the existing a element',
  'reparsing finds expanded element names new/x and empty-namespace plain',
  'the unedited sibling bytes <b>keep</b> remain in the output',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['8b8180f512899c21b6be8697211a074b19a47607','shared v0.124.0','acceptance/{acceptance,inventory,child_insertion_custody}_test.go','line 38','other/a attribute v','414 cases/1421 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 const matrix=ledger.workflows.find((w:any)=>w.id==='@id-xml-go-child-namespace-matrix');expect(matrix.consumers.go.status).toBe('implemented');expect(matrix.consumers.bun.status).toBe('planned');expect(matrix.consumers.python.status).toBe('planned');
 const refusal=ledger.workflows.find((w:any)=>w.id==='@id-xml-go-child-insertion-refusal');expect(refusal.consumers.go.status).toBe('implemented');expect(refusal.consumers.bun.status).toBe('planned');expect(refusal.consumers.python.status).toBe('planned');
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!==id));
});
