import {sourceCases} from './catalogue-helpers.ts';
import {test,expect} from 'bun:test';
import {cases,validateConsumerMappings} from '../scripts/verify.ts';

test('Bun ZIP32 examples keep concrete typed refusal and bound variants',async()=>{
 const p='workflows/package/zip32.feature',rows=await sourceCases(p,'workflows/package/bun-zip32-profile.feature');
 expect(rows).toHaveLength(20);expect(new Set(rows.map(r=>r.scenarioId)).size).toBe(4);
 expect(rows.filter(r=>r.scenarioId==='@id-bun-zip32-reader-refusal')).toHaveLength(12);
 expect(rows.filter(r=>r.scenarioId==='@id-bun-zip32-writer-refusal')).toHaveLength(2);
 expect(rows.filter(r=>r.scenarioId==='@id-bun-zip32-configured-bounds')).toHaveLength(5);
 for(const row of rows)for(const step of row.steps){const m=/encoded as JSON (.+)$/.exec(step.text);if(m)expect(JSON.parse(m[1]!)).toBeArray();}
 const mapping=await Bun.file('ledgers/consumers/bun-zip32.json').json();expect(mapping.declarationCount).toBe(19);
 expect(mapping.mappings.map((r:any)=>r.nativeId)).toEqual(mapping.sourceFiles[0].declarations);
 expect(mapping.mappings.filter((r:any)=>r.coverage==='unmapped')).toHaveLength(1);
 for(const row of mapping.mappings.filter((r:any)=>r.exampleVariant))expect(rows.some(r=>r.scenarioId===row.scenarioIds[0]&&r.name.includes(row.exampleVariant))).toBe(true);
 expect(mapping.helpers.find((r:any)=>r.symbol==='expectZipError').assertions).toHaveLength(3);
});
test('Python cache family leaves the existing unified-analysis declaration in its original ledger',async()=>{
 const p='workflows/docx/template-analysis.feature',rows=await sourceCases(p,'workflows/docx/python-template-cache.feature');expect(rows).toHaveLength(7);
 const mapping=await Bun.file('ledgers/consumers/python-template-cache.json').json(),previous=await Bun.file('ledgers/consumers/python-template-analysis.json').json();
 const already=new Set(previous.mappings.map((r:any)=>r.nativeId));expect(mapping.mappings.filter((r:any)=>already.has(r.nativeId))).toEqual([]);
 expect(mapping.mappings).toHaveLength(7);expect(new Set(mapping.mappings.map((r:any)=>r.sourceSha256)).size).toBe(1);
 const reuse=rows.find(r=>r.scenarioId==='@id-python-template-cache-sow-reuse')!;expect(reuse.steps.at(-1)!.text).toContain('nonempty anchors and nonempty warnings');
});
test('source mapping sets refuse overlapping declarations and contradictory same-revision source hashes',async()=>{
 const {validateConsumerMappingSets}=await import('../scripts/verify.ts');
 const a=await Bun.file('ledgers/consumers/python-template-analysis.json').json(),b=await Bun.file('ledgers/consumers/python-template-cache.json').json();
 const ids=new Set<string>([...a.mappings,...b.mappings].flatMap(r=>r.scenarioIds));
 expect(()=>validateConsumerMappingSets([a,b],ids)).not.toThrow();
 expect(()=>validateConsumerMappingSets([a,a],ids)).toThrow('Overlapping');
 const changed=structuredClone(b);changed.mappings[0].sourceSha256='a'.repeat(64);
 expect(()=>validateConsumerMappingSets([a,changed],ids)).toThrow('Conflicting source');
 const historical=structuredClone(b);historical.source.revision='a'.repeat(40);
 for(const row of historical.mappings)row.sourceSha256='b'.repeat(64);
 expect(()=>validateConsumerMappingSets([a,historical],ids)).not.toThrow();
 const overlap=structuredClone(a);overlap.source.revision='b'.repeat(40);
 expect(()=>validateConsumerMappingSets([a,overlap],ids)).toThrow('Overlapping');
 const otherConsumer=structuredClone(b);otherConsumer.consumer='go';
 expect(()=>validateConsumerMappingSets([b,otherConsumer],ids)).not.toThrow();
});

test('Go formula profile keeps exact rewrites and explicit unmapped fuzz predicates',async()=>{
 const p='workflows/xlsx/formula-references.feature',rows=cases(p,await Bun.file(p).text());
 expect(rows).toHaveLength(45);expect(new Set(rows.map(r=>r.scenarioId)).size).toBe(9);
 const rewrites=rows.filter(r=>r.scenarioId==='@id-xlsx-go-static-remap-exact');expect(rewrites).toHaveLength(5);
 expect(rewrites.map(r=>JSON.parse(r.steps[2]!.text.split('JSON ')[1]!))).toEqual(['IF(A1="A2",A3,Other!A2)',"'O''Brien'!$b$2 + Main!D1",'SUM(A7:A1)','a1 + Other!b2','Main!A1:A4']);
 expect(rows.filter(r=>r.scenarioId==='@id-xlsx-go-static-remap-refusal')).toHaveLength(7);
 const matrix=rows.filter(r=>r.scenarioId==='@id-xlsx-go-static-reference-properties');expect(matrix).toHaveLength(1);expect(matrix[0]!.steps[2]!.text).toContain('3 by 4 by 4 by 6');
 const mapping=await Bun.file('ledgers/consumers/go-formula-references.json').json();expect(mapping.declarationCount).toBe(6);
 expect(mapping.mappings.filter((r:any)=>r.coverage==='partial')).toHaveLength(5);
 const fuzz=mapping.mappings.find((r:any)=>r.nativeId.includes('FuzzStaticReferenceAnalysis'));expect(fuzz.coverage).toBe('unmapped');expect(fuzz.scenarioIds).toEqual([]);expect(fuzz.verifiedAspects).toEqual([]);
});
test('all new family outcomes and byte seals are registered without execution credit',async()=>{
 const {registerWorkflow}=await import('../scripts/register-workflow.ts');
 const ledger=await Bun.file('ledgers/workflows.json').json(),manifest=await Bun.file('manifest.json').json();
 for(const [feature,mapping,contract] of [
  ['workflows/package/zip32.feature','ledgers/consumers/bun-zip32.json','contracts/bun-zip32-profile.md'],
  ['workflows/docx/template-analysis.feature','ledgers/consumers/python-template-cache.json','contracts/python-template-cache.md'],
  ['workflows/xlsx/formula-references.feature','ledgers/consumers/go-formula-references.json','contracts/go-formula-references.md'],
 ]){
  const generated=registerWorkflow(feature!,await Bun.file(feature!).text(),{files:[]},{features:[],workflows:[]});
  for(const w of generated.ledger.workflows)expect(ledger.workflows.find((r:any)=>r.id===w.id)).toMatchObject({id:w.id,feature:w.feature,expandedCases:w.expandedCases});
  for(const p of [feature,mapping,contract]){const bytes=await Bun.file(p!).bytes(),asset=manifest.files.find((r:any)=>r.path===p);expect(asset?.sha256).toBe(new Bun.CryptoHasher('sha256').update(bytes).digest('hex'));expect(asset?.bytes).toBe(bytes.length);}
  const source=await Bun.file(mapping!).json();validateConsumerMappings(source,new Set(ledger.workflows.map((w:any)=>w.id)));
  for(const row of source.mappings)expect(row.executionCredit).toBe(false);
 }
});
