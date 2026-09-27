import {test,expect} from 'bun:test';
import {cases,validateWorkflowOwnership} from '../scripts/verify.ts';
const path='workflows/docx/table-merging.feature',ids=['roundtrip','content-refusal','structure-refusal','coordinate-refusal','rollback','encoding','stale'].map(n=>'@id-docx-horizontal-merge-'+n);
test('horizontal physical merge contracts register seven unique scenarios and 26 cases without editing the setter profile',async()=>{
 const source=await Bun.file(path).text(),rows=cases(path,source),ledger=await Bun.file('ledgers/workflows.json').json(),manifest=await Bun.file('manifest.json').json();expect(rows).toHaveLength(26);expect([...new Set(rows.map(r=>r.scenarioId))]).toEqual(ids);
 validateWorkflowOwnership(ledger,(await Promise.all(ledger.features.map(async(p:string)=>cases(p,await Bun.file(p).text()).map(r=>({path:p,scenarioId:r.scenarioId}))))).flat(),await Bun.file('contracts/mutation-safety.json').json());
 for(const id of ids){const entry=ledger.workflows.find((w:any)=>w.id===id);expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(rows.filter(r=>r.scenarioId===id).length);expect(Object.values(entry.consumers).every((c:any)=>c.status==='planned')).toBe(true);}
 expect(manifest.files.find((f:any)=>f.path===path)?.role).toBe('workflow');expect(manifest.files.find((f:any)=>f.path==='contracts/table-merging.md')?.role).toBe('workflow-contract');
 expect(new Bun.CryptoHasher('sha256').update(await Bun.file('workflows/docx/tables.feature').text()).digest('hex')).toBe('858a813b0f9ea0ac315ae1034057da288a510c638849f558f242d0ce4aa41f0d');
});
test('physical merges require exact output geometry custody and atomic refusal rather than setter-only values',async()=>{
 const source=await Bun.file(path).text();for(const text of ['gridSpan','reopened','source archive','unchanged','retained paragraph sequence','UTF-8-BOM','serialization','nested-unselected'])expect(source).toContain(text);
 const contract=await Bun.file('contracts/table-merging.md').text();for(const text of ['17.4.17','17.4.71','session','vertical','00 ff 2a'])expect(contract).toContain(text);
});
