import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only exact XML entity values, not general parsing or DTD refusal',async()=>{
 const id='@id-xml-entity-values',feature='workflows/xml/parsing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','a21200e44c7ae0d7e9dbb1139a55f39fc2113477:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'XML values input encoded as JSON "<r a=\\"&quot;&apos;\\">&#x41;&#65;&amp;&lt;&gt;</r>"',
  'the XML values input is parsed',
  'the root attribute a equals JSON "\\"\'"',
  'the root text equals JSON "AA&<>"',
 ]);
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['9354a5996f1ac3b87a4c9a343894d325ecfe7ecc','shared v0.116.0','tests/xml_entity_values/{cases,conftest,test_entities}.py','48 bytes','AA&<>','Seven separate one-reference mutations','ACCEPTS an internal DTD','1,373 tests','Python CI 36569839564'])expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-typed-parse-error','@id-xml-comparison-prefix-and-opc-order','@id-opc-diff-content-type'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-xml-go-element-removal-custody"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-xml-go-attribute-batch-refusal"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-xml-go-element-removal-custody"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-xml-go-attribute-batch-refusal"&&w.id!==id));
});
