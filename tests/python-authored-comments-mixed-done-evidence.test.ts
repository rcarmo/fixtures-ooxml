import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the authored two-comment mixed done-state case',async()=>{
 const id='@id-python-comments-mixed-done',feature='workflows/docx/comments.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','395288ab04931002c7022f6bd206a79eef17e8ac:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Resolve one of two authored comments and read mixed states');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has paragraphs "Alpha target" and "Beta target"',
  'comment authoring adds "Comment alpha" by "Manuel" to the first target and "Comment beta" by "Rui Carmo" to the second',
  'the two comment IDs are read in their returned order',
  'the first comment ID is resolved in the saved document',
  'the resolve response reports success true',
  'a fresh unfiltered comment read reports the first ID done true and the second ID done false',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(4).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['ec7359daca5beae2054bd3799248570b518e4258','shared v0.142.0',
   'tests/docx_comments_mixed_done/{cases,conftest,test_mixed_done}.py','six exact authored steps',
   'first done true, second done false','first-to-second-ID test mutation','1,456 tests',
   'CI 36657300112','Windows CI 36657300071','No existing-extension refusal'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-docx-comments-inspection','@id-docx-comments-resolution','@id-docx-comments-noop',
   '@id-docx-comments-refusal',
   '@id-python-comments-reply-root-resolution','@id-docx-existing-thread-inspection'])
  expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!==id));
});
