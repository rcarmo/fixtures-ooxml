import {test,expect} from 'bun:test';import {cases} from '../scripts/verify.ts';
const path='workflows/docx/table-merging.feature',suffixes=['roundtrip','content-refusal','structure-refusal','coordinate-refusal','rollback','encoding','stale'];
test('vertical rule adds seven scenarios26 cases without changing historical horizontal predicates',async()=>{
 const rows=cases(path,await Bun.file(path).text()),old=rows.filter(r=>r.scenarioId.startsWith('@id-docx-horizontal-')),added=rows.filter(r=>r.scenarioId.startsWith('@id-docx-vertical-'));expect(old).toHaveLength(26);expect(new Bun.CryptoHasher('sha256').update(JSON.stringify(old)).digest('hex')).toBe('33d500e62d38f72602ee3b9aad57656bbc531f7ab3528d21c8a67028d2abeaba');expect(added).toHaveLength(26);expect([...new Set(added.map(r=>r.scenarioId))]).toEqual(suffixes.map(n=>'@id-docx-vertical-merge-'+n));
 const ledger=await Bun.file('ledgers/workflows.json').json();for(const id of suffixes.map(n=>'@id-docx-vertical-merge-'+n)){const row=ledger.workflows.find((w:any)=>w.id===id);expect(row.feature).toBe(path);expect(row.expandedCases).toBe(added.filter(r=>r.scenarioId===id).length);expect(Object.values(row.consumers).every((c:any)=>c.status==='planned')).toBe(true);}
});
test('vertical contract retains every physical cell and explicit flags with exact custody and reached rollback',async()=>{
 const source=await Bun.file(path).text(),contract=await Bun.file('contracts/table-merging.md').text();for(const s of ['restart','continue','nine physical cells','UTF-16BE','continuation','serialization','old-handles'])expect(source).toContain(s);for(const s of ['17.4.84','2,880','removing only','continuation'])expect(contract).toContain(s);
});
