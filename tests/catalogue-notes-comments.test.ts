import {sourceCases} from './catalogue-helpers.ts';
import {test,expect} from 'bun:test';
import {cases,validateConsumerMappings} from '../scripts/verify.ts';

test('Go notes predicates preserve fixture identity and separate delivery from in-memory checks',async()=>{
 const p='workflows/native/pptx-text.feature',rows=await sourceCases(p,'workflows/pptx/go-notes-editing.feature');expect(rows).toHaveLength(8);
 const manifest=await Bun.file('manifest.json').json();
 const fixture=manifest.files.find((f:any)=>f.id==='fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc');expect(fixture?.format).toBe('pptx');
 expect(new Bun.CryptoHasher('sha256').update(await Bun.file(fixture.path).bytes()).digest('hex')).toBe(fixture.sha256);
 const saved=rows.find(r=>r.scenarioId==='@id-pptx-go-notes-exact-splice')!;
 expect(saved.steps.at(-1)!.text).toBe('reopening the saved PPTX reads Updated speaker notes for ppt/slides/slide1.xml');
 const multiline=rows.find(r=>r.scenarioId==='@id-pptx-go-notes-multiline-template')!;
 const value=multiline.steps.find(s=>s.text.startsWith('the editor replaces through that target with JSON '))!.text;
 expect(JSON.parse(value.split('JSON ')[1]!)).toBe('\n A&B \n雪\n');
 const ledger=await Bun.file('ledgers/consumers/go-notes-editing.json').json();expect(ledger.declarationCount).toBe(2);
 expect(new Set(ledger.mappings.flatMap((r:any)=>r.scenarioIds)).size).toBe(8);
 expect(ledger.mappings.flatMap((r:any)=>r.scenarioIds)).not.toContain('@id-pptx-order-notes-read');
});
test('Python comment scenarios deduplicate reopen behavior and require non-vacuous filter results',async()=>{
 const p='workflows/docx/comments.feature',rows=await sourceCases(p,'workflows/docx/python-comment-resolution.feature');expect(rows).toHaveLength(9);
 expect(rows.some(r=>r.scenarioId==='@id-python-comments-resolve-reopen-roundtrip')).toBe(false);
 const ledger=await Bun.file('ledgers/consumers/python-comment-resolution.json').json();expect(ledger.declarationCount).toBe(10);
 expect(ledger.mappings.filter((r:any)=>r.scenarioIds.includes('@id-python-comments-reopen-filter'))).toHaveLength(2);
 const filters=rows.find(r=>r.scenarioId==='@id-python-comments-filter-predicates')!;
 expect(filters.steps.some(s=>s.text.includes('nonempty'))).toBe(true);
 const filterMap=ledger.mappings.find((r:any)=>r.scenarioIds.includes(filters.scenarioId));expect(filterMap.gaps.join(' ')).toMatch(/empty|nonempty/i);
 const create=rows.find(r=>r.scenarioId==='@id-python-comments-create-extension')!;
 expect(create.steps.at(-1)!.text).toContain('w15:done "1"');
 expect(ledger.mappings.flatMap((r:any)=>r.scenarioIds)).not.toContain('@id-docx-comments-resolution');
});
test('Bun PPTX mappings reuse all four existing native outcomes and pin their helpers',async()=>{
 const ledger=await Bun.file('ledgers/consumers/bun-pptx.json').json();expect(ledger.declarationCount).toBe(6);
 expect(ledger.mappings.map((r:any)=>r.nativeId)).toEqual(ledger.sourceFiles[0].declarations);
 const ids=new Set(ledger.mappings.flatMap((r:any)=>r.scenarioIds));
 expect([...ids].sort()).toEqual(['@id-pptx-order-notes-read','@id-pptx-readable-unsupported-topology','@id-pptx-cross-run-replace','@id-pptx-stale-anchor-refusal','@id-pptx-bun-open-save-noop'].sort());
 expect(ledger.helpers.some((r:any)=>r.path==='tests/acceptance/pptx.ts')).toBe(true);
 const p='workflows/native/pptx-text.feature',rows=await sourceCases(p,'workflows/pptx/bun-open-save.feature');expect(rows).toHaveLength(1);
 expect(rows[0]!.steps.at(-1)!.text).toBe('that destination file contains the exact original archive bytes');
});
test('notes and comments assets are sealed and match compiled planned outcomes',async()=>{
 const {registerWorkflow}=await import('../scripts/register-workflow.ts');
 const ledger=await Bun.file('ledgers/workflows.json').json(),manifest=await Bun.file('manifest.json').json();
 for(const [feature,mapping,contract] of [
  ...['text','notes','preservation'].map(name=>[`workflows/pptx/${name}.feature`,'ledgers/consumers/bun-pptx.json','contracts/bun-pptx.md']),
  ['workflows/pptx/notes.feature','ledgers/consumers/go-notes-editing.json','contracts/go-notes-editing.md'],
  ['workflows/docx/comments.feature','ledgers/consumers/python-comment-resolution.json','contracts/python-comment-resolution.md'],
 ]){
  const generated=registerWorkflow(feature!,await Bun.file(feature!).text(),{files:[]},{features:[],workflows:[]});
  for(const w of generated.ledger.workflows)expect(ledger.workflows.find((r:any)=>r.id===w.id)).toMatchObject({id:w.id,feature:w.feature,expandedCases:w.expandedCases});
  for(const p of [feature,mapping,contract]){const b=await Bun.file(p!).bytes(),asset=manifest.files.find((r:any)=>r.path===p);expect(asset?.sha256).toBe(new Bun.CryptoHasher('sha256').update(b).digest('hex'));expect(asset?.bytes).toBe(b.length);}
  const source=await Bun.file(mapping!).json();validateConsumerMappings(source,new Set(ledger.workflows.map((w:any)=>w.id)));
  for(const row of source.mappings)expect(row.executionCredit).toBe(false);
 }
});
