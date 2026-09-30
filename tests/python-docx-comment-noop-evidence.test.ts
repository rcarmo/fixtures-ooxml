import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the exact pinned existing-comment archive no-op',async()=>{
 const id='@id-docx-comments-noop',feature='workflows/docx/comments.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','b417cf1cf5d954962c4e48e75f1814b1028589fa:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('An already-open comment is an exact archive no-op');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'the pinned threaded Word comments package is opened',
  'Word comment "1" is reopened',
  'the Word comment package bytes remain unchanged',
 ]);
 expect(now.expectedOutcomes).toEqual([selected[0].steps[2].text]);
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['c4466fca2fef7e980a11cd112dce84d89a7ae293','shared v0.135.0','tests/docx_comment_noop/{cases,conftest,test_noop}.py','31,618-byte','all 21 member bytes','1,453 tests','CI 36631498352','eleven refusal cases'])expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-docx-comments-inspection','@id-docx-comments-resolution','@id-docx-comments-refusal'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies')).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies'));
});
