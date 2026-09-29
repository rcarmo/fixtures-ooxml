import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits one guarded 100-combination child namespace matrix, not 100 cases',async()=>{
 const id='@id-xml-go-child-namespace-matrix',feature='workflows/xml/editing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','c96f8202070fc80e575d08f098453208a30db702:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Inserted element and attribute meanings survive a bounded namespace matrix');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'these four XML root sources, each interpreted as a JSON string',
  'these five namespace URI choices independently for each child element and flag attribute',
  'the XML editor inserts child with a flag attribute of JSON value "\\t\\r\\n & 😀" and a plain grandchild of JSON text "x\\ry\\nz" for all 4 by 5 by 5 choices',
  'reparsing preserves the root child and grandchild expanded names and the child attribute name and value for every choice',
  'the grandchild text equals JSON "x\\ry\\nz" for every choice',
  'a separate empty edit returns each exact original root source',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(3).map((s:any)=>s.text));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['53b070f7e83fc166331a63cffbe98868f7901d20','shared v0.126.0','acceptance/{acceptance,inventory,child_namespace_matrix}_test.go','line 52','4×5×5=100','416 cases/1431 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-go-child-insertion-custody','@id-xml-go-child-insertion-refusal','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!==id));
});
