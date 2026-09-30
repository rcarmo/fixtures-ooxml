import {historicalWorkflowLedger} from './xml-generalization-helpers.ts';
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored reply auto-resolve case',async()=>{
 const id='@id-python-comments-reply-auto-resolve',feature='workflows/docx/comments.feature';
 const ledger=await historicalWorkflowLedger();
 const prior=JSON.parse(execFileSync('git',['show','56d63f35a44834be9719cf05460a29817e1b12bd:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Adding a reply with auto-resolve marks the root done');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraph "Auto resolve target" and an authored root comment "Needs action"',
  'a reply "Done now" is added to that root comment with auto_resolve true',
  'the reply response reports success true and resolved true',
  'a fresh resolved-filter comment read contains the root ID with done true',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['08557eb531c4a40b4482a796c25da0675df5671f','shared v0.151.0',
  'tests/docx_comments_reply_auto_resolve/{cases,conftest,test_reply_auto_resolve}.py',
  'four exact authored steps','w14:paraIdParent pointing to its root',
  'success true, resolved true and the original root ID','fresh resolved-filter read returns exactly the root ID',
  'reply stays open','root w15:done 1','auto_resolve false control',
  'second-thread targeting keeps the first root open','unknown-ID reply leaves source bytes unchanged',
  'wrong-state, wrong-response-root and first-root-default mutations',
  'passing reply-ID substitution is not a red','1,482 tests','CI 36671535751',
  'Windows CI 36671535660','No complete-thread editing'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-comments-ids-fallback','@id-python-comments-create-extension',
  '@id-python-comments-filter-predicates','@id-python-comments-threaded-reply',
  '@id-docx-existing-thread-inspection','@id-docx-comments-refusal'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!==id));
});
