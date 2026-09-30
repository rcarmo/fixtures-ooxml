import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored commentsIds fallback case',async()=>{
 const id='@id-python-comments-ids-fallback',feature='workflows/docx/comments.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','b5258883249f4454a9690fd26fb453df3475b8b4:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe("Inspect a comment's para ID through commentsIds when its first paragraph lacks paraId");
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraph "Legacy mapping target" and an authored comment "Legacy style comment"',
  "its comment's first paragraph has no w14:paraId",
  'word/commentsIds.xml maps that comment ID to para ID "0F0E0D0C"',
  'Word comments are read from the modified saved package',
  'that comment\'s returned para_id equals "0F0E0D0C"',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(4).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['0a4bcc1c54ab4c7ef2286e631e482997f92c9ce9','shared v0.147.0',
  'tests/docx_comments_ids_fallback/{cases,conftest,test_ids_fallback}.py',
  'five exact authored steps','w14:paraId 12345678','positional decoy ABCD1234',
  'returns 0F0E0D0C','No-map, original-ID precedence and decoy-only controls',
  'explicit-lookup and wrong-value mutations','1,469 tests','CI 36665518534',
  'Windows CI 36665518539','No sibling comment scenario'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-comments-threaded-reply','@id-python-comments-reply-auto-resolve',
  '@id-docx-existing-thread-inspection'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!==id));
});
