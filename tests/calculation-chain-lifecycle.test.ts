import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';

const path='workflows/xlsx/calculation-chain-lifecycle.feature';
const id='@id-xlsx-owned-calculation-chain-invalidation';
test('the owned-chain case has one bounded planned identity and no native execution credit',async()=>{
 const text=await Bun.file(path).text(),rows=cases(path,text);
 expect(rows).toHaveLength(1);expect(rows[0]?.scenarioId).toBe(id);
 const registry=await Bun.file('ledgers/workflows.json').json(),entry=registry.workflows.find((w:any)=>w.id===id);
 expect(registry.features.filter((p:string)=>p===path)).toHaveLength(1);
 expect(entry?.feature).toBe(path);expect(entry?.expandedCases).toBe(1);
 for(const consumer of ['bun','go','python'])expect(entry?.consumers[consumer].status).toBe('planned');
 const predicates=rows[0]!.steps.map(s=>s.text).join('\n');
 for(const required of ['xl/chains/order.xml','Input!A1','Calc!A1','Calc!B1','Calc!C1','absent or empty cached values','source package bytes remain unchanged','content-type override are absent','destination relationship and content-type target resolves','byte-identical'])expect(predicates).toContain(required);
 const old=await Bun.file('staging/go/features/implemented/spreadsheet/calc-chain.feature').text();
 expect(old).toContain('@CHAIN-001');
 const source=await Bun.file('ledgers/feature-source-consolidation.json').json();
 const staged=source.candidates.find((c:any)=>c.path==='staging/go/features/implemented/spreadsheet/calc-chain.feature');
 expect(staged?.compiledCases).toBe(7);expect(staged?.executionCredit).toBe(false);
});
