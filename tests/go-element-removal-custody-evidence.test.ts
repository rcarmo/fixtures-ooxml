import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only exact two-target XML element removal and byte custody',async()=>{
 const id='@id-xml-go-element-removal-custody',feature='workflows/xml/editing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','fe6862522c7d7df4836bd034b12a500986c3b63c:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  `the XML source is <r xmlns:p="u"><!--keep--><p:a x = '1'><p:b>text</p:b></p:a> gap <p:c /></r>`,
  'the XML editor removes the p:a subtree and the p:c element from one parsed snapshot',
  'the complete output bytes equal <r xmlns:p="u"><!--keep--> gap </r>',
  'a separate empty removal returns the exact original source bytes',
 ]);
 expect(now.expectedOutcomes).toEqual(['the complete output bytes equal <r xmlns:p="u"><!--keep--> gap </r>','a separate empty removal returns the exact original source bytes']);
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['d16a3652cb39a9fa7b5873bf32ad6c4da80920f6','shared v0.120.0','acceptance/{acceptance,inventory,element_removal}_test.go','line 72','Independently coded complete output','411 cases/1411 steps','Go has no GitHub Actions workflow'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 const refusal=ledger.workflows.find((w:any)=>w.id==='@id-xml-go-element-removal-refusal');expect(refusal.consumers.go.status).toBe('implemented');expect(refusal.consumers.bun.status).toBe('planned');expect(refusal.consumers.python.status).toBe('planned');
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!==id));
});
