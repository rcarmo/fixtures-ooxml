import {sourceCases} from './catalogue-helpers.ts';
import {test,expect} from 'bun:test';
import {cases,validateConsumerMappings} from '../scripts/verify.ts';

test('Bun package API scenarios isolate callback semantics and exact destination custody',async()=>{
 const p='workflows/package/preservation.feature',rows=await sourceCases(p,'workflows/package/bun-opc-custody.feature');
 expect(rows).toHaveLength(11);expect(new Set(rows.map(r=>r.scenarioId)).size).toBe(7);
 const refusals=rows.filter(r=>r.scenarioId==='@id-bun-opc-open-refusal');expect(refusals).toHaveLength(5);
 expect(refusals.map(r=>r.steps.find(s=>s.text.startsWith('it throws'))!.text)).toEqual([
 'it throws an OoxmlError with code opc-part-name-invalid','it throws an OoxmlError with code opc-target-invalid','it throws an OoxmlError with code opc-content-types-invalid','it throws an OoxmlError with code opc-relationship-target-missing','it throws an OoxmlError with code opc-relationship-duplicate']);
 const thenable=rows.find(r=>r.scenarioId==='@id-bun-opc-thenable-transaction-result')!;
 expect(thenable.steps.map(s=>s.text)).toContain('the transaction returns the same object by identity without invoking then');
 const mapping=await Bun.file('ledgers/consumers/bun-opc-custody.json').json();expect(mapping.declarationCount).toBe(9);
 expect(mapping.mappings.map((r:any)=>r.nativeId)).toEqual(mapping.sourceFiles[0].declarations);
 const corpus=mapping.mappings.find((r:any)=>r.nativeId.includes('every no-op fixture archive'));
 expect(corpus.scenarioIds).toEqual(['@id-opc-package-corpus-noop']);expect(corpus.gaps.join(' ')).toContain('without reopening');
});
test('Python anchors distinguish response counts from saved insertion outcomes',async()=>{
 const p='workflows/docx/anchor-discovery.feature',rows=cases(p,await Bun.file(p).text());expect(rows).toHaveLength(5);
 const insertion=rows.find(r=>r.scenarioId==='@id-python-word-anchor-discover-insert')!;
 expect(insertion.steps.at(-1)!.text).toBe('reading the saved Word document shows "Inserted after discovered anchor" immediately after "Delivery approach"');
 const filtering=rows.find(r=>r.scenarioId==='@id-python-word-anchor-text-filter')!;
 expect(filtering.steps.map(s=>s.text)).toContain('the anchor count is at least 1');
 const mapping=await Bun.file('ledgers/consumers/python-anchor-discovery.json').json();expect(mapping.declarationCount).toBe(5);
 for(const row of mapping.mappings){expect(row.coverage).toBe('partial');expect(row.executionCredit).toBe(false);}
});
test('document family assets and compiled outcomes are registered together',async()=>{
 const {registerWorkflow}=await import('../scripts/register-workflow.ts');
 const ledger=await Bun.file('ledgers/workflows.json').json(),manifest=await Bun.file('manifest.json').json();
 for(const [feature,mapping,contract] of [
  ['workflows/package/preservation.feature','ledgers/consumers/bun-opc-custody.json','contracts/bun-opc-custody.md'],
  ['workflows/docx/anchor-discovery.feature','ledgers/consumers/python-anchor-discovery.json','contracts/python-anchor-discovery.md'],
  ['workflows/docx/document-model.feature','ledgers/consumers/go-document-api.json','contracts/go-document-api.md'],
 ]){
  const generated=registerWorkflow(feature!,await Bun.file(feature!).text(),{files:[]},{features:[],workflows:[]});
  for(const w of generated.ledger.workflows)expect(ledger.workflows.find((r:any)=>r.id===w.id)).toMatchObject({id:w.id,feature:w.feature,expandedCases:w.expandedCases});
  for(const p of [feature,mapping,contract]){const b=await Bun.file(p!).bytes(),asset=manifest.files.find((r:any)=>r.path===p);expect(asset?.sha256).toBe(new Bun.CryptoHasher('sha256').update(b).digest('hex'));expect(asset?.bytes).toBe(b.length);}
  const source=await Bun.file(mapping!).json();validateConsumerMappings(source,new Set(ledger.workflows.map((w:any)=>w.id)));
  for(const row of source.mappings)expect(row.executionCredit).toBe(false);
 }
});

test('Go document API excludes fixture smoke loops and preserves in-memory versus reopened gaps',async()=>{
 const p='workflows/docx/document-model.feature',rows=cases(p,await Bun.file(p).text());
 expect(rows).toHaveLength(70);expect(new Set(rows.map(r=>r.scenarioId)).size).toBe(29);
 expect(rows.some(r=>r.scenarioId.includes('fixture-save-open')||r.scenarioId.includes('fixture-roundtrip-body'))).toBe(false);
 const mapping=await Bun.file('ledgers/consumers/go-document-api.json').json();expect(mapping.declarationCount).toBe(33);
 for(const name of ['TestDocument_SaveAs_Fixtures','TestRoundTrip_Fixtures','TestRun_SymbolAndLastRenderedPageBreak']){
  const row=mapping.mappings.find((r:any)=>r.nativeId.endsWith('::'+name));expect(row.coverage).toBe('unmapped');expect(row.scenarioIds).toEqual([]);expect(row.verifiedAspects).toEqual([]);expect(row.gaps.length).toBeGreaterThan(0);
 }
 const font=mapping.mappings.find((r:any)=>r.nativeId.endsWith('::TestRun_FontSize'));
 expect(font.coverage).toBe('partial');expect(font.scenarioIds).toContain('@id-docx-direct-font-size-half-points');expect(font.gaps.join(' ')).toMatch(/serializ|reopen/i);
 const formatted=rows.find(r=>r.scenarioId==='@id-docx-go-roundtrip-selected-formatting')!;expect(formatted.steps.map(s=>s.text)).toContain('the third run reports colour FF0000, font size 14 and font Arial');
 const table=rows.find(r=>r.scenarioId==='@id-docx-go-roundtrip-table-text')!;expect(table.steps.at(-1)!.text).toBe('all nine cell text getters equal their original row-order values');
});
