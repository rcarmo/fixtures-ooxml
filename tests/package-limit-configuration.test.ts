import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';

const feature='workflows/package/admission-limit-configuration.feature';
const id='@id-package-admission-negative-budget';
const fixture='fixture-d9d6a313182a71a73d75a26a0ff3b7826dbd2e300e1d202114ec9f8fb018fda5';

test('unique negative-budget predicate retains two sealed cases with Bun execution and Go/Python planned',async()=>{
 const text=await Bun.file(feature).text(),rows=cases(feature,text),m=await Bun.file('manifest.json').json(),w=await Bun.file('ledgers/workflows.json').json();
 expect(rows).toHaveLength(2);expect(rows.map(r=>r.scenarioId)).toEqual([id,id]);
 expect(rows.map(r=>r.name)).toEqual(['A negative source bytes budget refuses before package intake','A negative entry count budget refuses before package intake']);
 const asset=m.files.find((a:any)=>a.path===feature),bytes=await Bun.file(feature).bytes();expect(asset.sha256).toBe(new Bun.CryptoHasher('sha256').update(bytes).digest('hex'));expect(asset.role).toBe('workflow');
 const input=m.files.find((a:any)=>a.id===fixture);expect(input.role).toBe('fixture');expect(input.format).toBe('docx');expect(input.sha256).toBe(fixture.slice('fixture-'.length));
 for(const row of rows){const steps=row.steps.map(s=>s.text);expect(steps).toContain(`the byte-sealed valid DOCX archive ${fixture} and a separate caller byte snapshot`);expect(steps).toContain('it refuses the invalid caller budget before reading source metadata or ZIP members and returns no package or parts');expect(steps).toContain('the refusal is an invalid-argument result, not a resource-limit or malformed-archive result');expect(steps).toContain("the caller's archive bytes remain unchanged");}
 const owner=w.workflows.find((x:any)=>x.id===id);expect(owner.feature).toBe(feature);expect(owner.expandedCases).toBe(2);expect(Object.keys(owner.consumers).sort()).toEqual(['bun','go','python']);expect(owner.consumers.bun.status).toBe('implemented');expect(owner.consumers.go.status).toBe('planned');expect(owner.consumers.python.status).toBe('planned');
});

test('budget parity does not retire the broader Go resource-ceiling source case or borrow execution credit',async()=>{
 const source=await Bun.file('staging/go/behaviors/archive-candidates.feature').text();expect(source).toContain('@candidate-go-archive-001');expect(source).toContain('And negative caller budgets are rejected as invalid arguments');
 const native=await Bun.file('staging/go/features/implemented/package/limits.feature').text();expect(native).toContain('@LIMIT-001');expect(native).toContain('@LIMIT-002');
 const ledger=await Bun.file('ledgers/feature-source-consolidation.json').json(),entry=ledger.candidates.find((x:any)=>x.path==='staging/go/behaviors/archive-candidates.feature');expect(entry.executionCredit).toBe(false);expect(entry.compiledCases).toBe(9);
 const review=await Bun.file('ledgers/functional-equivalence.json').json(),row=review.goNegativeBudgetParity;expect(row.sourceId).toBe('@candidate-go-archive-001');expect(row.canonicalId).toBe(id);expect(row.executionCredit).toBe(false);expect(row.sourceStatus).toBe('partial-overlap-source-retained');expect(row.caseRows).toHaveLength(2);expect(row.consumerGaps).toHaveProperty('bun');expect(row.consumerGaps).toHaveProperty('python');
});
