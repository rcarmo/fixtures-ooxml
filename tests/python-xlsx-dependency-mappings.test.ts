import {test,expect} from 'bun:test';
import {validateConsumerMappings} from '../scripts/verify.ts';

const source='1c3755770f80bde5ecf0863f9591181ced9aa7fd';
const path='tests/test_xlsx_dependency_preservation.py';
const sourceSha256='20eaf9d71ab81fecf7ae58b8848595c9737127783ed3e0270eb2ddc51bd097ed';

test('five Python XLSX dependency declarations retain exact source custody and bounded predicates',async()=>{
 const ledger=await Bun.file('ledgers/consumers/python-xlsx-dependencies.json').json();
 const workflows=await Bun.file('ledgers/workflows.json').json();
 expect(ledger.declarationCount).toBe(5);expect(ledger.mappings).toHaveLength(5);
 expect(ledger.source.revision).toBe(source);
 expect(ledger.mappings.map((r:any)=>r.nativeId)).toEqual([
  'test_multiline_edit_saves_style_dependency_and_retains_opaque_parts',
  'test_cross_sheet_formula_cache_is_invalidated_without_calculation',
  'test_existing_custom_style_indices_remain_valid',
  'test_style_reindexing_is_refused',
  'test_calculation_chain_relationship_and_content_type_are_removed',
 ].map(name=>`${path}::${name}`));
 const staged=await Bun.file('staging/python/features/test_xlsx_dependency_preservation.feature').text();
 for(const row of ledger.mappings){
  expect(row.sourceSha256).toBe(sourceSha256);
  expect(staged).toContain(`# Native: ${row.nativeId}`);
  expect(row.executionCredit).toBe(false);
 }
 expect(ledger.mappings.map((r:any)=>r.coverage)).toEqual(['partial','partial','unmapped','unmapped','partial']);
 validateConsumerMappings(ledger,new Set(workflows.workflows.map((w:any)=>w.id)));
 const chain=ledger.mappings.at(-1)!;
 expect(chain.scenarioIds).toEqual(['@id-xlsx-owned-calculation-chain-invalidation']);
 expect(chain.verifiedAspects.join(' ')).toContain('standard-path xl/calcChain.xml');
 for(const missing of ['nonstandard xl/chains/order.xml','two dependent formula entries','source bytes','unrelated member custody'])expect(chain.gaps.join(' ')).toContain(missing);
 expect(workflows.workflows.find((w:any)=>w.id===chain.scenarioIds[0]).consumers.python.status).toBe('planned');
});
