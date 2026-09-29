import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/style-authoring.feature';
const positive='@id-docx-paragraph-style-authoring',negative='@id-docx-paragraph-style-authoring-refusal';
const combinations=[['absent','plain'],['existing','based'],['existing','flags'],['empty','flags'],['aliased','based'],['default-namespace','based'],['collision','plain']];
const defects=['duplicate-id','character-id','missing-base','character-base','duplicate-base','cyclic-base','broken-base-chain','malformed-base','duplicate-relationship','external-styles','wrong-mime','wrong-root','wrong-id-namespace','protected','invalid-argument','stale-document','styles-with-effects'];
const specs=[
 {id:positive,rows:combinations.map(([input,kind])=>[`a native style authoring document with ${input}`,`a named paragraph style is authored with ${kind}`,`its saved definition and relationship are correct for ${kind}`,'pre-existing style definitions and unrelated package bytes are preserved','the authored style can be selected and reopened']),marker:'seven five-step'},
 {id:negative,rows:defects.map(kind=>[`an unsafe native style authoring input ${kind}`,'its paragraph style creation is attempted','style authoring refuses without changing archive bytes or handle state']),marker:'seventeen three-step'},
];

test('Bun executes exact DOCX paragraph style authoring and atomic refusal cases',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show','8312404125486650956807f940a1e5ab583f79c3:ledgers/workflows.json']).toString()),compiled=cases(path,await Bun.file(path).text());
 for(const{id,rows,marker}of specs){const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id),actual=compiled.filter((r:any)=>r.scenarioId===id);
  expect(now.feature).toBe(path);expect(now.expandedCases).toBe(rows.length);expect(actual.map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual(rows);
  expect(now.expectedOutcomes).toEqual([...new Set(rows.flatMap(row=>row.slice(2)))]);
  expect(old.consumers.bun.status).toBe('planned');expect(now.consumers.bun.status).toBe('implemented');
  for(const m of [marker,'105eab90fe0f2e940b327e4916fa11fdb411783f','shared v0.105.0','features/shared.json','24 exact cases/86 steps','tests/acceptance/style-authoring.ts','tests/unit/docx-style-authoring.test.ts','Fresh post-push GitHub recursive Bun make check','732/732','36540848016','Go/Python'])expect(now.consumers.bun.evidence).toContain(m);
  expect(now.consumers.go).toEqual(old.consumers.go);expect(now.consumers.python).toEqual(old.consumers.python);const unchanged=structuredClone(now);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 expect(specs.reduce((n,s)=>n+s.rows.length,0)).toBe(24);expect(specs.reduce((n,s)=>n+s.rows.reduce((m,r)=>m+r.length,0),0)).toBe(86);
 const changed=new Set(specs.map(s=>s.id));expect(ledger.workflows.filter((w:any)=>!['@id-xlsx-go-formula-literal-punctuation','@id-xlsx-go-static-remap-exact','@id-xlsx-go-static-remap-refusal','@id-xlsx-go-static-reference-properties'].includes(w.id) && w.id !== '@id-xlsx-comment-vml-existing-graph' && !changed.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!['@id-xlsx-go-formula-literal-punctuation','@id-xlsx-go-static-remap-exact','@id-xlsx-go-static-remap-refusal','@id-xlsx-go-static-reference-properties'].includes(w.id) && w.id !== '@id-xlsx-comment-vml-existing-graph' && !changed.has(w.id)));
});
