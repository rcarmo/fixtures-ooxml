import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits one exact seven-row expanded attribute lookup outcome',async()=>{
 const id='@id-xml-expanded-attribute-lookup',feature='workflows/xml/parsing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','b0f0c9926cc3542b87fc1fd427463dba44158c93:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].steps).toHaveLength(3);
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'XML values input encoded as JSON "<r xmlns=\\"urn:default\\" xmlns:a=\\"urn:a\\" xmlns:r=\\"urn:a\\" id=\\"plain\\" a:id=\\"outer\\"><child xmlns:r=\\"urn:b\\" r:id=\\"inner\\" xml:lang=\\"en\\"/><other r:id=\\"sibling\\"/></r>"',
  'the XML values input is parsed',
  'expanded attribute lookups return these JSON values',
 ]);
 const rows=selected[0].steps[2].argument?.dataTable?.rows?.map((r:any)=>r.cells.map((c:any)=>c.value));
 expect(rows).toEqual([
  ['element','local','namespace','value_json'],
  ['root','id','','"plain"'],['root','id','urn:default','null'],['root','id','urn:a','"outer"'],
  ['child','id','urn:b','"inner"'],['child','id','urn:a','null'],['other','id','urn:a','"sibling"'],
  ['child','lang','http://www.w3.org/XML/1998/namespace','"en"'],
 ]);
 expect(now.expectedOutcomes).toEqual(['expanded attribute lookups return these JSON values']);
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['c20eca69f9117dc1647f04e83ceba62a84fb0950','shared v0.120.0','tests/xml_expanded_attributes/{cases,conftest,test_attributes}.py','157-byte UTF-8','seven-row outcome table','1,391 tests','Python CI 36576009644'])expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-comparison-prefix-and-opc-order','@id-opc-diff-content-type'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 const implicit=ledger.workflows.find((w:any)=>w.id==='@id-xml-implicit-xml-prefix');expect(implicit.consumers.python.status).toBe('implemented');expect(implicit.consumers.go.status).toBe('implemented');
 expect(ledger.workflows.filter((w:any)=>w.id!=='@id-opc-package-corpus-noop'&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=='@id-opc-package-corpus-noop'&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!==id));
});
