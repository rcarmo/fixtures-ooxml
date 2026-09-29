import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits exactly two XML removal refusals, not custody-case auxiliary checks',async()=>{
 const id='@id-xml-go-element-removal-refusal',feature='workflows/xml/editing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','5b668bd2ff33168da8dfa6935581dc5d294453e5:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(2);expect(selected).toHaveLength(2);
 expect(selected.map((c:any)=>c.name)).toEqual(['A root removal refuses','A p:a and its nested p:b removal refuses']);
 expect(selected.map((c:any)=>c.steps.map((s:any)=>s.text))).toEqual(['root','p:a and its nested p:b'].map(selection=>[
  `the XML source is <r xmlns:p="u"><!--keep--><p:a x = '1'><p:b>text</p:b></p:a> gap <p:c /></r>`,
  `a removal batch selects ${selection}`,
  'the removal returns an error',
 ]));
 expect(now.expectedOutcomes).toEqual(['the removal returns an error']);
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['da499fb74f7f170acc37b16f064f226e28a6f8e2','shared v0.122.0','acceptance/{acceptance,inventory,element_removal_refusal}_test.go','row lines 85','nonnil error AND nil output','413 cases/1417 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-go-element-removal-custody','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!==id));
});
