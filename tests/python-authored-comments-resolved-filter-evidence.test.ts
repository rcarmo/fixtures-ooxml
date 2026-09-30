import {historicalWorkflowLedger} from './xml-generalization-helpers.ts';
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored resolved-filter comment case',async()=>{
 const id='@id-python-comments-resolved-filter',feature='workflows/docx/comments.feature';
 const ledger=await historicalWorkflowLedger();
 const prior=JSON.parse(execFileSync('git',['show','9b643c8e122cd0bb82b95053fd19bfc0878a2a23:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Resolve an authored comment and read it through the resolved filter');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"',
  'the first returned comment ID is selected',
  'that comment ID is resolved in the saved document',
  'the resolve response reports success true and done true',
  'a fresh resolved-filter comment read contains that ID with done true',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(3).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['0ccc95b10fdce18243500636ca4eb9653f955aa0','shared v0.143.0',
  'tests/docx_comments_resolved_filter/{cases,conftest,test_resolved_filter}.py','five exact authored steps',
  'resolved-filter read returns only that ID with done true','resolved-to-open filter mutation',
  '1,459 tests','CI 36659454106','Windows CI 36659454125','No mixed-done re-credit'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-comments-mixed-done',
   '@id-docx-comments-refusal',
   '@id-docx-existing-thread-inspection'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!==id));
});
