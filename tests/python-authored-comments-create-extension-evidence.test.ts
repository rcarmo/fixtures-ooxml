import {historicalWorkflowLedger} from './xml-generalization-helpers.ts';
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored missing-extension creation case',async()=>{
 const id='@id-python-comments-create-extension',feature='workflows/docx/comments.feature';
 const ledger=await historicalWorkflowLedger();
 const prior=JSON.parse(execFileSync('git',['show','3bff02eed8f212c8e20822f43d93c917cc91e203:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Resolving an authored comment creates missing commentsExtended metadata');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraph "No commentsExtended yet" and an authored comment "Needs follow-up"',
  'word/commentsExtended.xml is absent from the saved package',
  'that comment ID is resolved in the saved document',
  'the resolve response reports success true',
  'a fresh comment read returns a nonempty para_id for that ID',
  'the saved package contains word/commentsExtended.xml with a commentEx for that para ID and w15:done "1"',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(3).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['f2c7a21d82a73a5ecd3017c7027490ce7baa287e','shared v0.148.0',
  'tests/docx_comments_create_extension/{cases,conftest,test_create_extension}.py',
  'six exact authored steps','without word/commentsExtended.xml','root w14:paraId',
  'single matching commentEx with w15:done 1','fresh read','content-type override and document relationship',
  'second authored comment stays open','unknown ID leaves the original archive unchanged',
  'wrong-done and wrong-target mutations','1,472 tests','CI 36667104061',
  'Windows CI 36667104371','No existing-extension editing/refusal'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-comments-ids-fallback',
  '@id-docx-existing-thread-inspection','@id-docx-comments-refusal'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!==id));
});
