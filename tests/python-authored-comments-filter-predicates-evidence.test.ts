import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored comment metadata and filter predicates case',async()=>{
 const id='@id-python-comments-filter-predicates',feature='workflows/docx/comments.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','6029dd937a55221a7d81d9c2cf2077d1bfec4164:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Comment metadata and each filter satisfy the inspected predicates');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"',
  'all comments are read and the first returned ID is resolved in the saved document',
  'the first unfiltered comment has keys "done", "is_reply", "parent_id", and "para_id"',
  'the resolve response reports success true',
  'the open-filter, resolved-filter, and mine-filter results are each nonempty',
  'every returned open-filter comment has done false',
  'every returned resolved-filter comment has done true',
  'every returned mine-filter comment for "Rui Carmo" has that author ignoring case',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['e74f445bca86746d7c5f97a3830877e2a673bfee','shared v0.149.0',
  'tests/docx_comments_filter_predicates/{cases,conftest,test_filter_predicates}.py',
  'eight exact authored steps','verified range anchors and IDs','first returned ID is resolved',
  'Fresh nonempty open, resolved and mine reads','Beta/open, Alpha/resolved and Beta/Rui',
  'mixed-case author input','Opposite-ID and missing-ID controls',
  'empty-open, wrong-resolved and wrong-mine mutations','1,475 tests','CI 36668631326',
  'Windows CI 36668631328','No sibling threaded/auto-resolve'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-comments-ids-fallback','@id-python-comments-create-extension',
  '@id-docx-existing-thread-inspection','@id-docx-comments-refusal'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!==id));
});
