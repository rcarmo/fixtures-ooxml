import {test,expect} from 'bun:test';
import {cases,validateWorkflowOwnership} from '../scripts/verify.ts';
const path='workflows/docx/tracking-settings.feature';
const ids=['persistence','custody','no-op','refusal','rollback','plain-edit','author-refusal'].map(n=>'@id-docx-tracking-settings-'+n);
test('saved tracking settings have seven unique contracts and 24 concrete cases without changing the getter scenario',async()=>{
 const text=await Bun.file(path).text(),rows=cases(path,text);expect(rows).toHaveLength(24);expect([...new Set(rows.map(r=>r.scenarioId))]).toEqual(ids);
 const ledger=await Bun.file('ledgers/workflows.json').json(),manifest=await Bun.file('manifest.json').json();validateWorkflowOwnership(ledger,(await Promise.all(ledger.features.map(async(p:string)=>cases(p,await Bun.file(p).text()).map(r=>({path:p,scenarioId:r.scenarioId}))))).flat(),await Bun.file('contracts/mutation-safety.json').json());
 for(const id of ids){const entry=ledger.workflows.find((r:any)=>r.id===id);expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(rows.filter(r=>r.scenarioId===id).length);expect(Object.values(entry.consumers).every((v:any)=>v.status==='planned')).toBe(true);expect(entry.expectedOutcomes.length).toBeGreaterThan(0);}
 expect(manifest.files.find((f:any)=>f.path===path)?.role).toBe('workflow');expect(manifest.files.find((f:any)=>f.path==='contracts/tracking-settings.md')?.role).toBe('workflow-contract');
 const old=await Bun.file('workflows/docx/tracked-workflow.feature').text();expect(new Bun.CryptoHasher('sha256').update(old).digest('hex')).toBe('f32ad31b4b4e03ad17894a8b246502e6d83f0253ec66abc1c5601764fd551ccd');
});
test('tracking contracts distinguish saved settings session authors explicit edits and atomic failure',async()=>{
 const text=await Bun.file(path).text();for(const value of ['Retained text','Session reviewer','opaque payload','source archive','no revisions','protected','relationship-write','UTF-16'])expect(text).toContain(value);
 for(const row of cases(path,text)){expect(row.steps.some(s=>s.text.includes('unchanged')||s.text.includes('reopened'))).toBe(true);}
 const contract=await Bun.file('contracts/tracking-settings.md').text();expect(contract).toContain('17.15.1.89');expect(contract).toContain('session');expect(contract).toContain('Office UI');
});
