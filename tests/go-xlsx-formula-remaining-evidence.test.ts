import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/xlsx/formula-references.feature';
const specs=[
 ['@id-xlsx-go-formula-literal-punctuation',5,15,'five three-step literal-punctuation rows'],
 ['@id-xlsx-go-static-remap-exact',5,15,'five three-step insertion remaps'],
 ['@id-xlsx-go-static-remap-refusal',7,21,'seven three-step'],
 ['@id-xlsx-go-static-reference-properties',1,6,'one six-step finite 288-expression'],
] as const;

test('Go executes four exact static formula-reference IDs without calculation or cross-consumer credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show','7c57ee5c6ec4553ccd1f8b88ba4076c691e947a9:ledgers/workflows.json']).toString()),compiled=cases(path,await Bun.file(path).text());
 for(const [id,count,steps,scope] of specs){const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id),rows=compiled.filter((r:any)=>r.scenarioId===id);
  expect(now.feature).toBe(path);expect(now.expandedCases).toBe(count);expect(rows).toHaveLength(count);expect(rows.reduce((n:number,r:any)=>n+r.steps.length,0)).toBe(steps);
  expect(now.expectedOutcomes).toEqual([...new Set(rows.flatMap((r:any)=>r.steps.slice(2).map((s:any)=>s.text)).filter((s:string)=>s!=='the static analyser checks all 3 by 4 by 4 by 6 source expressions'))]);
  expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
  for(const marker of [scope,'c846cb384dc81e015392cefc9a21116bcc870816','shared v0.106.0','Four stable IDs total 18 cases/57 steps','acceptance/{remaining_formula_steps,remaining_formula,canonical_formula_analysis,inventory}_test.go','reports/batches/238.md','red checkpoint had 35 undefined steps','395 selected cases/1351 steps','fresh post-push GitHub recursive','no formula evaluation','Go CI workflow unavailable','Bun/Python'])expect(now.consumers.go.evidence).toContain(marker);
  expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 }
 expect(specs.reduce((n,[,cases])=>n+cases,0)).toBe(18);expect(specs.reduce((n,[,,steps])=>n+steps,0)).toBe(57);
 const ids=new Set(specs.map(([id])=>id));expect(ledger.workflows.filter((w:any)=>!['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && w.id !== '@id-zip-physical-member-overlap-refusal' && !ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!['@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments'].includes(w.id) && w.id !== '@id-zip-physical-member-overlap-refusal' && !ids.has(w.id)));
});
