import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only sealed existing-extension comment resolution and lexical restoration',async()=>{
 const id='@id-docx-comments-resolution',feature='workflows/docx/comments.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','3571c17d9e13f67e24d7ec8a562f961c4c3f18f9:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Resolve and reopen one comment without rewriting its body or anchors');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'the pinned threaded Word comments package is opened',
  'Word comment "1" is marked resolved',
  'saving and reopening shows that comment resolved and its reply link intact',
  'only the existing commentsExtended part differs from the input',
  'Word comment "1" is reopened',
  'the original comment package member bytes are restored',
 ]);
 expect(now.expectedOutcomes).toEqual([selected[0].steps[2],selected[0].steps[3],selected[0].steps[5]].map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['07d9c019e9709834148783af0bd415980715f5f1','shared v0.133.0','tests/docx_comment_resolution/{cases,conftest,test_resolution,test_controls}.py','2,824-byte','all 20 unrelated','1,452 tests','CI 36626328058','no-op/refusal workflows'])expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-docx-comments-inspection','@id-docx-comments-refusal','@id-docx-thread-authoring']){
  const current=ledger.workflows.find((w:any)=>w.id===sibling),previous=prior.workflows.find((w:any)=>w.id===sibling);
  expect(current).toEqual(previous);
 }
 expect(ledger.workflows.filter((w:any)=>w.id!==id&&w.id!=='@id-xml-expanded-attribute-lookup'&&w.id!=='@id-docx-comments-noop'&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies')).toEqual(prior.workflows.filter((w:any)=>w.id!==id&&w.id!=='@id-xml-expanded-attribute-lookup'&&w.id!=='@id-docx-comments-noop'&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies'));
});
