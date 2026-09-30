import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only one OPC edit with unrelated binary byte custody',async()=>{
 const id='@id-opc-package-preserve-unrelated',feature='workflows/package/preservation.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','0c27fe243c109c21482cb528bc8f82d2fdd08ca0:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Changing one part preserves unrelated payload after reopen');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a valid OPC package with a main XML part and an unrelated binary payload',
  'the main XML part text is changed and the package is reopened',
  'the edited part contains the new text after reopen',
  'the unrelated payload bytes remain unchanged',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['7d12c2d2bc2214bd443808dc27c25d66666c13d4','shared v0.136.0','acceptance/{acceptance,feature_roots,inventory,opc_preserve_unrelated}_test.go','reports/batches/281.md','Alpha','Beta','425 cases/1465 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-opc-package-transaction-rollback','@id-opc-diff-content-type','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-bun-opc-detached-byte-copies')).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-bun-opc-detached-byte-copies'));
});
