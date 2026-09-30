import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only exact XML whitespace serialization and reparse',async()=>{
 const id='@id-xml-escaping-whitespace-roundtrip',feature='workflows/xml/parsing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','5e29c97b491a12f06d931d025e649d6de541c121:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'an XML escaping value encoded as JSON "x\\r\\n\\ty"',
  'the value is escaped separately as text and as an attribute and both are parsed',
  'the decoded text and attribute both equal JSON "x\\r\\n\\ty"',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['c43c2ca8dc785533aa138c5c9761ff8c54eb995d','shared v0.125.0','tests/xml_whitespace_roundtrip/{cases,conftest,test_roundtrip}.py','five ASCII/UTF-8 bytes [120,13,10,9,121]','production parse(bytes)','1,408 tests','Python CI 36590816334'])expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-escaping-values','@id-xml-escaping-invalid-character','@id-xml-normalise-line-endings','@id-xml-outside-root-nbsp'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!==id&&w.id!=='@id-xml-go-child-insertion-refusal')).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!==id&&w.id!=='@id-xml-go-child-insertion-refusal'));
});
