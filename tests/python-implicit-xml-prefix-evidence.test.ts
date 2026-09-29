import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only implicit xml-prefix binding on the sealed literal',async()=>{
 const id='@id-xml-implicit-xml-prefix',feature='workflows/xml/parsing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','afcd7f046d34ec6a64db2276475979c93829b1e8:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'XML values input encoded as JSON "<r xml:lang=\\"en\\"/>"',
  'the XML values input is parsed',
  'the root namespace URI equals JSON ""',
  'the root attribute xml:lang equals JSON "en"',
  'the implicit xml namespace URI is http://www.w3.org/XML/1998/namespace',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['94576f57f8471086fcc140595d357700ee9f2325','shared v0.122.0','tests/xml_implicit_prefix/{cases,conftest,test_prefix}.py','18 UTF-8 bytes','no explicit xmlns:xml declaration','XPath namespace axis','1,401 tests','Python CI 36584450241'])expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-typed-parse-error','@id-xml-comparison-prefix-and-opc-order','@id-opc-diff-content-type'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!==id));
});
