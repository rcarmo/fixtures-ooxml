import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only one staged DOCX OPC unrelated-payload preservation case',async()=>{
 const id='@id-opc-package-preserve-unrelated',feature='workflows/package/preservation.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','9e0883aa75d46a5c9ac709b7cb3503347c00310d:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a valid OPC package with a main XML part and an unrelated binary payload',
  'the main XML part text is changed and the package is reopened',
  'the edited part contains the new text after reopen',
  'the unrelated payload bytes remain unchanged',
 ]);
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['98e3f013df10ef57129407f34b6d12b48438a8bf','shared v0.115.0','tests/opc_preservation/{cases,conftest,test_preservation}.py','stage_patch','Alpha→Beta','8324 literal bytes','thumbnail-tamper','1,363 tests','Python CI 36566873654','no generic OPC setter'])expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-opc-package-corpus-noop','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 const rollback=ledger.workflows.find((w:any)=>w.id==='@id-opc-package-transaction-rollback');expect(rollback.consumers.python.status).toBe('implemented');expect(rollback.consumers.go.status).toBe('planned');
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-xml-go-element-removal-custody"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-xml-go-attribute-batch-refusal"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xml-go-attribute-splice-custody"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-xml-go-element-removal-custody"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-xml-go-attribute-batch-refusal"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xml-go-attribute-splice-custody"&&w.id!==id));
});
