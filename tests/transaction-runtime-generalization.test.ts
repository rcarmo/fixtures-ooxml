import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';
import {beforeTransactionFeature,beforeXmlGeneralizationCase} from './xml-generalization-helpers.ts';
test('portable transactions retain two IDs and exact5+5 outcome steps without JS protocols',async()=>{
 const m=await Bun.file('ledgers/transaction-runtime-generalization.json').json(),text=await Bun.file(m.path).text(),now=cases(m.path,text),old=cases(m.path,m.beforeText);
 expect(m.beforeText).toBe(execFileSync('git',['show',m.sourceRevision+':'+m.path],{encoding:'utf8'}));expect(beforeTransactionFeature(m.path,text)).toBe(m.beforeText);
 expect(now.map(row=>m.scenarios.some((s:any)=>s.id===row.scenarioId)?beforeXmlGeneralizationCase(row):row)).toEqual(old);
 expect(m.scenarios.map((s:any)=>s.id)).toEqual(['@id-bun-opc-async-transaction-refusal','@id-bun-opc-thenable-transaction-result']);
 // Each compiled case includes its five unchanged OPC-envelope Background steps.
 expect(m.scenarios.map((s:any)=>s.after[0].steps.length)).toEqual([10,10]);
 for(const s of m.scenarios){expect(now.filter(r=>r.scenarioId===s.id)).toEqual(s.after);expect(s.after[0].steps.slice(0,5)).toEqual(s.before[0].steps.slice(0,5));}
 expect(text).not.toMatch(/OoxmlError|async callback|then function|@profile-javascript/);expect(text).toContain('reason opc-deferred-transaction and no result');expect(text).toContain('original identity and its evaluation count is zero');expect(text).toContain('saving and reopening reads Beta');
 expect(m.executionCredit).toBe(false);for(const row of m.afterLedgerRows)expect(Object.values(row.consumers).every((c:any)=>c.status==='planned')).toBe(true);
 expect(()=>beforeTransactionFeature(m.path,text.replace('evaluation count is zero','evaluation count is one'))).toThrow('Unreviewed');
});
