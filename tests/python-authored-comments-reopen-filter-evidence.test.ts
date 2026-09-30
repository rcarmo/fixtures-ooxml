import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored comment reopen-filter case',async()=>{
 const id='@id-python-comments-reopen-filter',feature='workflows/docx/comments.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','65ff30a1ca06428cf5c1db9e4749da60d2f64708:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Reopen a resolved authored comment and read it through the open filter');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"',
  'the first returned comment ID is selected',
  'that comment ID is resolved in the saved document',
  'the resolve response reports success true',
  'a resolved-filter read reports at least one comment',
  'that comment ID is reopened in the saved document',
  'the reopen response reports success true and done false',
  'a fresh open-filter comment read contains that ID with done false',
 ]);
 expect(now.expectedOutcomes).toEqual([selected[0].steps[3].text,selected[0].steps[4].text,selected[0].steps[6].text,selected[0].steps[7].text]);
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['f9c640d17230de2bc4d0e6b7dff909ca643367d2','shared v0.144.0',
  'tests/docx_comments_reopen_filter/{cases,conftest,test_reopen_filter}.py','eight exact authored steps',
  'fresh open-filter read contains that original ID with done false','wrong-ID reopen and wrong-final-filter',
  '1,462 tests','CI 36661042394','Windows CI 36661042448','No mixed-done or resolved-filter re-credit'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-comments-mixed-done','@id-python-comments-resolved-filter',
  '@id-docx-comments-refusal','@id-docx-existing-thread-inspection'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!==id));
});
