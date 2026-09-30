import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Python credits only the saved Word heading and paragraph anchor case',async()=>{
 const id='@id-python-word-anchor-headings-paragraphs',feature='workflows/docx/anchor-discovery.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','5e485c44f08df457a9c6416a3a2285dd4f37582e:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Headings and body text appear among discovered anchors');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'a saved Word document has headings "Introduction" and "Delivery approach" and paragraphs "Customer context paragraph" and "Use iterative delivery"',
  'Word anchors are listed without a query',
  'the anchor count is at least 4',
  'an anchor has type "section_heading" and text "Introduction"',
  'a "paragraph" anchor contains "Customer context" in its text',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
 for(const marker of ['3c9c20f7ec1c75fdb452a081e80cf4267e2c2d79','shared v0.152.0',
  'tests/docx_anchor_headings_paragraphs/{cases,conftest,test_anchors}.py',
  'one case/five exact authored steps','saved DOCX is reread','no-query anchor read',
  'section_heading Introduction','paragraph containing Customer context','source bytes unchanged',
  'wrong-heading-type and missing-paragraph mutations','1,484 tests','exact 5/5',
  'CI 36673418759','Windows CI 36673418830','No query-filter'])
  expect(now.consumers.python.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
 const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 expect(ledger.workflows.map((w:any)=>w.id)).toEqual(prior.workflows.map((w:any)=>w.id));
 for(const sibling of ['@id-python-word-anchor-text-filter','@id-python-word-document-map',
  '@id-python-word-anchor-insert','@id-python-word-section-hints']){
  const before=prior.workflows.find((w:any)=>w.id===sibling);
  if(before)expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(before);
 }
 expect(ledger.workflows.filter((w:any)=>w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!==id));
});
