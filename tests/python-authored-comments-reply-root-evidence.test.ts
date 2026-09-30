import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored reply-to-root resolution case',async()=>{
 const id='@id-python-comments-reply-root-resolution',feature='workflows/docx/comments.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','23643b74367845c6564b1a98888cb272dca8eecf:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Resolving a reply marks its root thread done');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraph "Resolve this thread"',
  'comment authoring adds "Root comment" to that paragraph',
  'a reply "Reply comment" is added to the root comment',
  'the reply comment ID is resolved in the saved document',
  'the reply creation and resolve responses report success true',
  'the resolve response identifies the original root comment ID',
  'a fresh comment read reports the root comment done true',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(4).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['f74d17d40fd896c9bac68bec2c37a89fd70d2753','shared v0.146.0',
  'tests/docx_comments_reply_root/{cases,conftest,test_reply_root}.py','seven exact authored steps',
  'w14:paraIdParent bound to the root','root done true, reply done false',
  'second of two separate threads','wrong-target and wrong-state test mutations','1,466 tests',
  'CI 36662921637','Windows CI 36662921784','No complete-thread editor'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-comments-mixed-done','@id-python-comments-resolved-filter',
  '@id-python-comments-reopen-filter',
  '@id-docx-comments-refusal','@id-docx-existing-thread-inspection'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!==id));
});
