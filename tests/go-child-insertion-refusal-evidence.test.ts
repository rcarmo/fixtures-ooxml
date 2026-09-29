import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only exact nested child-insertion refusal and separate empty batch',async()=>{
 const id='@id-xml-go-child-insertion-refusal',feature='workflows/xml/editing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','5e29c97b491a12f06d931d025e649d6de541c121:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Overlapping insertion targets refuse and a separate no-op preserves bytes');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'the XML source is <root xmlns="u" xmlns:n1="occupied"><a/><b>keep</b></root>',
  'one structured insertion batch targets both the root and its nested a element',
  'the insertion returns an error',
  'a separate empty insertion batch returns the exact original source bytes',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['40eeb71a03b6e3ac6752dd1794a6d7b80b12f2a8','shared v0.125.0','acceptance/{acceptance,inventory,child_insertion_refusal}_test.go','line 45','nonnil error AND nil output','415 cases/1425 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-go-child-insertion-custody','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 const matrix=ledger.workflows.find((w:any)=>w.id==='@id-xml-go-child-namespace-matrix');expect(matrix.consumers.go.status).toBe('implemented');expect(matrix.consumers.bun.status).toBe('planned');expect(matrix.consumers.python.status).toBe('planned');
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!==id));
});
