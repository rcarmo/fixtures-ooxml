import {test,expect} from 'bun:test';
import {cases,validateWorkflowOwnership} from '../scripts/verify.ts';
import {registerWorkflow} from '../scripts/register-workflow.ts';
import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';
import {IdGenerator} from '@cucumber/messages';
import {beforeWordingCase,beforeWordingTags} from './runtime-wording-helpers.ts';

test('every canonical feature belongs to a format or common package/XML operation family',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 for(const path of ledger.features)expect(path).toMatch(/^workflows\/(docx|pptx|xlsx|package|xml)\/[a-z0-9]+(?:-[a-z0-9]+)*\.feature$/);
 for(const path of ['workflows/native','workflows/mutation-safety.feature','workflows/workflow-receipts.feature','workflows/docx/document-model.feature']){
  expect(ledger.features.some((p:string)=>p===path||p.startsWith(path+'/'))).toBe(false);
 }
});
test('registration refuses root runtime and cross-format workflow paths',()=>{
 const text='@planned\nFeature: Sample\n  @id-sample\n  Scenario: Sample\n    Given an input\n    When it is read\n    Then its value is unchanged\n';
 for(const path of ['workflows/sample.feature','workflows/native/sample.feature','workflows/bun/sample.feature','workflows/docx/pptx-notes.feature','workflows/docx/sample_extra.feature']){
  expect(()=>registerWorkflow(path,text,{files:[]},{features:[],workflows:[]})).toThrow('workflow path');
 }
});
test('format migration preserves every scenario and compiled case with no retired identity',async()=>{
 const migration=await Bun.file('ledgers/workflow-layout-migration.json').json(),ledger=await Bun.file('ledgers/workflows.json').json();
 expect(migration.sourceRevision).toBe('d07ee96ea18f765c0c7de849a5d166d75678bd29');expect(migration.retiredScenarioIds).toEqual([]);expect(migration.scenarios).toHaveLength(229);
 // Computed independently via git show d07ee96:<path>, official compiler, and
 // original ledger order; excludes destinations authored during this migration.
 const baseline=migration.scenarios.map(({id,from,sourceSha256,caseSha256,tags}:any)=>({id,from,sourceSha256,caseSha256,tags}));
 expect(new Bun.CryptoHasher('sha256').update(JSON.stringify(baseline)).digest('hex')).toBe('49ad0c905402375a2852854085c0175a88c8e965d91c34be98fd849e8bedc63d');
 const actual=new Map<string,{path:string,hashes:string[]}>();
 for(const path of ledger.features)for(const row of cases(path,await Bun.file(path).text())){
  const record=actual.get(row.scenarioId)??{path,hashes:[]};expect(record.path).toBe(path);
  record.hashes.push(new Bun.CryptoHasher('sha256').update(JSON.stringify(beforeWordingCase(row))).digest('hex'));actual.set(row.scenarioId,record);
 }
 expect([...actual.values()].reduce((n,r)=>n+r.hashes.length,0)).toBe(660);expect(actual.size).toBe(258);
 const added=[...actual.keys()].filter(id=>!migration.scenarios.some((s:any)=>s.id===id));expect(added.sort()).toEqual([...['author-refusal','custody','no-op','persistence','plain-edit','refusal','rollback'].map(n=>'@id-docx-tracking-settings-'+n),...['roundtrip','content-refusal','structure-refusal','coordinate-refusal','rollback','encoding','stale'].map(n=>'@id-docx-horizontal-merge-'+n),...['roundtrip','content-refusal','structure-refusal','coordinate-refusal','rollback','encoding','stale'].map(n=>'@id-docx-vertical-merge-'+n),...['values','empty','placeholders','refusal','bounds','encoding','snapshot','scope'].map(n=>'@id-docx-template-inventory-'+n)].sort());
 expect(migration.scenarios.reduce((n:number,s:any)=>n+actual.get(s.id)!.hashes.length,0)).toBe(562);
 for(const row of migration.scenarios){expect(actual.get(row.id)).toEqual({path:row.to,hashes:row.caseSha256});expect(ledger.workflows.find((w:any)=>w.id===row.id)?.feature).toBe(row.to);}
 for(const path of ledger.features){const gen=IdGenerator.incrementing(),doc=new Parser(new AstBuilder(gen),new GherkinClassicTokenMatcher()).parse(await Bun.file(path).text()),rows=compile(doc,path,gen);
  for(const record of migration.scenarios.filter((s:any)=>s.to===path))expect(rows.filter(r=>r.tags.some(t=>t.name===record.id)).map(r=>beforeWordingTags(record.id,r.tags.map(t=>t.name).sort()))).toEqual(record.tags);
 }
 for(const path of migration.removedFeatures)expect(await Bun.file(path).exists()).toBe(false);
});
test('stale scenario destinations and undeclared mutation owners refuse',()=>{
 const path='workflows/docx/paragraphs.feature',id='@id-test',ledger={workflows:[{id,feature:path}]},actual=[{scenarioId:id,path}],contract={scenarioIds:[id],features:[path]};
 expect(()=>validateWorkflowOwnership(ledger,actual,contract)).not.toThrow();
 expect(()=>validateWorkflowOwnership({workflows:[{id,feature:'workflows/docx/tables.feature'}]},actual,contract)).toThrow('Workflow feature ownership');
 expect(()=>validateWorkflowOwnership(ledger,actual,{...contract,features:[]})).toThrow('Mutation feature ownership');
 expect(()=>validateWorkflowOwnership(ledger,[],contract)).toThrow('ownership');
});
test('mutation fixture policy selects exact cases from format-local features',async()=>{
 const contract=await Bun.file('contracts/mutation-safety.json').json(),ledger=await Bun.file('ledgers/workflows.json').json();
 expect(contract.schemaVersion).toBe(2);expect(contract.feature).toBeUndefined();expect(contract.features.length).toBeGreaterThan(1);
 const rows=(await Promise.all(contract.features.map(async(p:string)=>cases(p,await Bun.file(p).text())))).flat().filter(r=>contract.scenarioIds.includes(r.scenarioId));
 expect(rows).toHaveLength(19);expect(new Set(rows.map(r=>r.scenarioId)).size).toBe(8);
 for(const id of contract.scenarioIds)expect(contract.features).toContain(ledger.workflows.find((w:any)=>w.id===id).feature);
});
