import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only exact surviving-parent-scope subtree replacement bytes',async()=>{
 const id='@id-xml-go-element-replacement-custody',feature='workflows/xml/editing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','c327ce64d85c09f4a16c4e4114f937c525818e1a:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Replace one subtree using its surviving parent namespace scope');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  `the XML source is <root xmlns="outer" xmlns:p="bound"><!--a--><p:old xmlns:p="inner" x='1'><p:child/></p:old> tail <last/></root>`,
  'the XML editor replaces p:old with a bound-namespace new element containing value and an empty-namespace plain element',
  'the complete output bytes equal <root xmlns="outer" xmlns:p="bound"><!--a--><p:new>value</p:new><plain xmlns=""/> tail <last/></root>',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['9294da534ca144d6256ac5650cda0b90696b50c2','shared v0.127.0','acceptance/{acceptance,inventory,element_replacement_custody}_test.go','line 89','417 cases/1434 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 const refusal=ledger.workflows.find((w:any)=>w.id==='@id-xml-go-element-replacement-refusal');expect(refusal.consumers.go.status).toBe('implemented');expect(refusal.consumers.bun.status).toBe('planned');expect(refusal.consumers.python.status).toBe('planned');
 expect(ledger.workflows.filter((w:any)=>w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!==id&&w.id!=='@id-opc-package-transaction-rollback')).toEqual(prior.workflows.filter((w:any)=>w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!==id&&w.id!=='@id-opc-package-transaction-rollback'));
});
