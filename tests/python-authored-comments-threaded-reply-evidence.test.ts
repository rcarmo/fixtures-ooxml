import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored threaded-reply read case',async()=>{
 const id='@id-python-comments-threaded-reply',feature='workflows/docx/comments.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','49008239d2a3babc292499d7fc559771f9fb4294:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Threaded read groups an authored reply under its root');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraph "Thread me" and an authored root comment "Root"',
  'a reply "Reply" is added to the root comment',
  'Word comments are read in threaded format from the saved document',
  'the reply creation response reports success true',
  'the response has a threads field and thread_count at least 1',
  "the first thread's root ID equals the original root ID",
  "that first thread's replies contain the added reply ID",
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(3).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['aecbea8acaa5e209cc1e09759d607b83730aabc0','shared v0.150.0',
  'tests/docx_comments_threaded_reply/{cases,conftest,test_threaded_reply}.py',
  'seven exact authored steps','w14:paraIdParent points to the root',
  'flat read reports is_reply true','fresh threaded read leaves package bytes unchanged',
  'thread_count 1','original root ID in the first thread','added reply ID in its replies',
  'second of two roots','unknown reply target leaves bytes unchanged',
  'wrong-group and wrong-root mutations','1,478 tests','CI 36670095219',
  'Windows CI 36670095275','No auto-resolve'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-comments-ids-fallback','@id-python-comments-create-extension',
  '@id-python-comments-filter-predicates',
  '@id-docx-existing-thread-inspection','@id-docx-comments-refusal'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!==id));
});
