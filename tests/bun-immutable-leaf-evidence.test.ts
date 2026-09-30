import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Bun credits only the four-step caller-owned XML byte seed',async()=>{
 const id='@id-xml-go-immutable-leaf-seed',feature='workflows/xml/editing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','70952ab86d0c6fff45cd489d3af3057ca98636ab:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('A seeded immutable parse and no-op leave the caller bytes and parsed snapshot intact');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'the XML source is <r><t>hello</t></r>',
  'the XML editor parses a caller-owned byte slice and performs an empty edit',
  'the caller input bytes still equal the original XML source',
  'the empty edit returns the exact original source bytes',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.bun.status).toBe('planned');expect(now.consumers.bun.status).toBe('implemented');
 for(const marker of ['c996c7d6d26a3a0ceb7a8305458d55e961951925','shared v0.131.0','tests/acceptance/{xml-byte-snapshot,steps}.ts','tests/unit/xml-byte-snapshot.test.ts','remove([])','1,112 tests','36618963045'])expect(now.consumers.bun.evidence).toContain(marker);
 expect(now.consumers.go).toEqual(old.consumers.go);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-go-element-removal-custody','@id-xml-go-element-removal-refusal','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-xml-implicit-xml-prefix'&&w.id!=='@id-docx-comments-resolution'&&w.id!=='@id-xml-expanded-attribute-lookup'&&w.id!=='@id-docx-comments-noop'&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies')).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-xml-implicit-xml-prefix'&&w.id!=='@id-docx-comments-resolution'&&w.id!=='@id-xml-expanded-attribute-lookup'&&w.id!=='@id-docx-comments-noop'&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies'));
});
