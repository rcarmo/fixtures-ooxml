import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/xlsx/formula-references.feature';
const specs=[
 ['@id-xlsx-go-direct-range-parsing',6,24,'six exact direct-range examples'],
 ['@id-xlsx-go-direct-range-refusal',7,21,'seven exact non-direct inputs'],
] as const;

test('Go executes thirteen exact canonical direct-range API rows without sibling formula credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show','c110ab8a61a7c5c7c118c8c9b8b5a0b5fa4b7acf:ledgers/workflows.json']).toString()),compiled=cases(path,await Bun.file(path).text());
 for(const [id,count,steps,scope] of specs){
  const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id),rows=compiled.filter((r:any)=>r.scenarioId===id);
  expect(now.feature).toBe(path);expect(now.expandedCases).toBe(count);expect(rows).toHaveLength(count);expect(rows.reduce((n:number,r:any)=>n+r.steps.length,0)).toBe(steps);
  expect(now.expectedOutcomes).toEqual([...new Set(rows.flatMap((r:any)=>r.steps.slice(2).map((s:any)=>s.text)))]);
  expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
  for(const marker of [scope,'4967e0fde69db6248af036d2f6bc472750e7cbae','shared v0.101.0','acceptance/direct_range_test.go','acceptance/inventory_test.go','reports/batches/231.md','13 rows/45 steps','363 selected cases/1244 steps','seven sibling formula-reference IDs/32 cases','no formula evaluation','Bun/Python'])expect(now.consumers.go.evidence).toContain(marker);
  expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
  const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 }
 expect(compiled.filter((r:any)=>r.scenarioId.startsWith('@id-xlsx-go-')&&!specs.some(([id])=>id===r.scenarioId))).toHaveLength(32);
 expect(ledger.workflows.filter((w:any)=>w.feature !== 'workflows/docx/effective-formatting.feature' && w.feature!=='workflows/docx/tracking-settings.feature'&&!specs.some(([id])=>id===w.id))).toEqual(prior.workflows.filter((w:any)=>w.feature !== 'workflows/docx/effective-formatting.feature' && w.feature!=='workflows/docx/tracking-settings.feature'&&!specs.some(([id])=>id===w.id)));
});
