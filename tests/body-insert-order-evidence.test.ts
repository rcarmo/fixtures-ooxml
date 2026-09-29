import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-docx-go-body-insert-order',path='workflows/docx/paragraphs.feature';
const steps=['a new Word body with no elements','First and Third paragraphs are appended, then Second is inserted at index one','element counts after each operation are one, two and three','paragraph texts in order equal First, Second and Third'];
test('Bun and Go execute exact empty-body insertion counts and order without Python or saved credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','779415af623f7d7536a8bce5d4b3b7204193d653:ledgers/workflows.json']).toString());
 const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 expect(current.feature).toBe(path);expect(current.expandedCases).toBe(1);
 expect(cases(path,await Bun.file(path).text()).filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual([steps]);
 expect(current.expectedOutcomes).toEqual(steps.slice(2));
 expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
 for(const marker of ['e6a05f508a447da6d23ff5cc3681a7bccd879332','shared v0.70.0','tests/acceptance/body-insertion.ts','tests/unit/docx-insert-paragraph.test.ts','732/732','Fresh GitHub recursive make check','In-memory'])expect(current.consumers.bun.evidence).toContain(marker);
 expect(old.consumers.go.status).toBe('planned');expect(current.consumers.go.status).toBe('implemented');
 for(const marker of ['7f0a6b2e620ece9f1a962c78969dcf7b26ee77c5','shared v0.70.0','acceptance/body_insert_order_test.go','349 selected cases/1193 steps/0 failures/0 skips','reports/batches/198.md','Fresh post-push GitHub recursive test-batch','In-memory'])expect(current.consumers.go.evidence).toContain(marker);
 expect(current.consumers.python).toEqual(old.consumers.python);
 const laterIds=new Set(["@id-docx-format-preserve","@id-docx-xml-space","@id-docx-table-paragraph","@id-docx-stale-span","@id-docx-refuse-topology","@id-docx-create-minimal-package","@id-docx-create-style-validation","@id-docx-create-stale-opaque","@id-docx-create-atomic-refusals","@id-docx-table-create-roundtrip","@id-docx-table-opaque-preserve","@id-docx-table-stale-cell","@id-docx-table-atomic-refusals","@id-docx-direct-font-size-half-points"]);
 const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 expect(ledger.workflows.filter((w:any)=>w.id!==id&&!laterIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>w.id!==id&&!laterIds.has(w.id)));
});
