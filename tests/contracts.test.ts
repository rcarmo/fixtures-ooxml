import {test,expect} from 'bun:test';
import {sourceCases} from './catalogue-helpers.ts';
import {cases,verify,validateFixtureLayout,validateMutationContract} from '../scripts/verify.ts';
test('all pinned references and contract links verify',async()=>{const r=await verify();expect(r.assets).toBe(369);expect(r.facts).toBe(149);expect(r.workflows).toBe(424);expect(r.cases).toBe(911);});
test('official Gherkin compilation expands shared cases',async()=>{const {sourceCases}=await import('./catalogue-helpers.ts');const result=await sourceCases('workflows/mutation-safety.feature');expect(result).toHaveLength(19);expect(new Set(result.map(r=>r.scenarioId)).size).toBe(8);});
test('workflow identity is required',()=>{expect(()=>cases('bad.feature','Feature: Bad\n Scenario: unnamed\n  Given input\n')).toThrow();});
test('canonical scenario IDs cannot be reused within a feature, including Rule blocks',()=>{
 for(const text of [
  'Feature: Duplicate\n @id-same\n Scenario: First\n  Given input\n  Then result\n @id-same\n Scenario: Second\n  Given input\n  Then result\n',
  'Feature: Duplicate\n Rule: One\n  @id-same\n  Scenario: First\n   Given input\n   Then result\n Rule: Two\n  @id-same\n  Scenario: Second\n   Given input\n   Then result\n',
 ])expect(()=>cases('duplicate.feature',text)).toThrow('Duplicate scenario ID');
});
test('outline rows legitimately share a scenario ID',()=>{
 const text='Feature: Outline\n @id-outline\n Scenario Outline: Row <value>\n  Given <value>\n  Then result\n  Examples:\n   | value |\n   | one   |\n   | two   |\n';
 expect(cases('outline.feature',text)).toHaveLength(2);
});

test('fixture IDs are stored once, grouped by format and scenario purpose',async()=>{
 const manifest=await Bun.file('manifest.json').json();
 const fixtures=manifest.files.filter((f:any)=>f.role==='fixture');
 expect(fixtures).toHaveLength(85);
 expect(new Set(fixtures.map((f:any)=>f.sha256)).size).toBe(85);
 expect(()=>validateFixtureLayout(manifest)).not.toThrow();
 for(const path of ['testdata/a.docx','fixtures/a.docx','fixtures/pptx/comments/a.docx','fixtures/docx/comments/deeper/a.docx']){
  const copy=structuredClone(manifest);copy.files.find((f:any)=>f.role==='fixture').path=path;
  expect(()=>validateFixtureLayout(copy)).toThrow();
 }
 const duplicate=structuredClone(manifest);duplicate.files.push({...fixtures[0],id:'alias',path:'fixtures/docx/comments/duplicate.docx'});
 expect(()=>validateFixtureLayout(duplicate)).toThrow('Duplicate');
 const badGroup=structuredClone(manifest);badGroup.files.find((f:any)=>f.role==='fixture').scenarioGroup='../comments';
 expect(()=>validateFixtureLayout(badGroup)).toThrow();
});

test('mutation policy references one canonical asset and one member hash map',async()=>{
 const manifest=await Bun.file('manifest.json').json(),contract=await Bun.file('contracts/mutation-safety.json').json();
 expect(()=>validateMutationContract(contract,manifest)).not.toThrow();
 for(const change of [
  (c:any)=>{c.fixtures[0].assetId='fixture-'+ '0'.repeat(64);},
  (c:any)=>{c.fixtures[0].path='duplicate-path';},
  (c:any)=>{c.fixtures[0].mustPreservePayloads={};},
  (c:any)=>{c.fixtures[0].allowedChangedPartsForSuccess.push('missing.xml');},
  (c:any)=>{c.fixtures.push(c.fixtures[0]);},
 ]){const copy=structuredClone(contract);change(copy);expect(()=>validateMutationContract(copy,manifest)).toThrow();}
});

test('each mutation fixture retains hash-linked original derivation in the root manifest',async()=>{
 const manifest=await Bun.file('manifest.json').json(),contract=await Bun.file('contracts/mutation-safety.json').json();
 for(const policy of contract.fixtures){
  const asset=manifest.files.find((a:any)=>a.id===policy.assetId);
  const origins=asset.origins.filter((o:any)=>o.kind==='derived-from');expect(origins).toHaveLength(1);
  const origin=origins[0],source=manifest.files.find((a:any)=>a.id===origin.assetId);
  expect(source.sha256).toBe(origin.sha256);expect(origin.transformation.length).toBeGreaterThan(0);
  expect(source.origins.some((o:any)=>o.repository===origin.repository&&o.revision===origin.revision&&o.path===origin.path)).toBe(true);
 }
});

test('format and remaining package profiles compile62cases with19bounded comment mappings',async()=>{
 const paths=['docx/comments','docx/text','docx/creation','docx/tables','pptx/creation','pptx/tables','xlsx/creation','package/preservation','package/zip32','package/relationship-namespaces'];
 const all=[];
 for(const name of paths){const path='workflows/'+name+'.feature',text=await Bun.file(path).text();expect(text.startsWith('@planned\n')).toBe(true);all.push(...await sourceCases(path,path));}
 expect(all).toHaveLength(62);expect(new Set(all.map(c=>c.scenarioId)).size).toBe(40);
 const commentIds=new Set(cases('workflows/docx/comments.feature',await Bun.file('workflows/docx/comments.feature').text()).map(c=>c.scenarioId));
 const mapping=await Bun.file('ledgers/consumers/bun-comments.json').json();expect(mapping.mappings).toHaveLength(19);
 for(const row of mapping.mappings){expect(row.executionCredit).toBe(false);expect(row.coverage).toBe('partial');expect(row.gaps.length).toBeGreaterThan(0);expect(row.scenarioIds.every((id:string)=>commentIds.has(id))).toBe(true);}
});

test('tracked dispatcher retains the planned obligation ID with explicit outcome and refusal variants',async()=>{
 const path='workflows/docx/tracked-workflow.feature',rows=await sourceCases(path);expect(rows).toHaveLength(17);
 expect(new Set(rows.map(c=>c.scenarioId))).toEqual(new Set(['@id-docx-track-changes-option-outcome','@id-docx-workflow-tracked-refusal']));
 const outcomes=rows.filter(c=>c.scenarioId==='@id-docx-track-changes-option-outcome');expect(outcomes).toHaveLength(5);
 expect(outcomes.map(c=>c.steps.find(s=>s.text.startsWith('the tracked workflow outcome'))!.text)).toEqual([
  'the tracked workflow outcome is committed with 1 committed changes and 2 committed revisions',
  'the tracked workflow outcome is committed with 1 committed changes and 0 committed revisions',
  'the tracked workflow outcome is committed with 0 committed changes and 0 committed revisions',
  'the tracked workflow outcome is preview with 0 committed changes and 0 committed revisions',
  'the tracked workflow outcome is committed with 1 committed changes and 1 committed revisions',
 ]);
 expect(rows.filter(c=>c.scenarioId==='@id-docx-workflow-tracked-refusal')).toHaveLength(12);
});

test('direct run formatting profile has four output policies and eleven refusal variants',async()=>{
 const path='workflows/docx/run-formatting.feature',rows=await sourceCases(path);
 expect(rows).toHaveLength(15);expect(rows.filter(r=>r.scenarioId==='@id-docx-direct-run-formatting')).toHaveLength(4);expect(rows.filter(r=>r.scenarioId==='@id-docx-direct-formatting-refusal')).toHaveLength(11);
 expect(rows.slice(0,4).map(r=>r.name)).toEqual(['Apply the enable direct formatting policy','Apply the disable direct formatting policy','Apply the remove direct formatting policy','Apply the no-op direct formatting policy']);
});

test('paragraph style profile preserves five output policies and fourteen atomic refusal variants',async()=>{
 const p='workflows/docx/paragraph-style.feature',rows=await sourceCases(p);expect(rows).toHaveLength(19);expect(rows.filter(r=>r.scenarioId==='@id-docx-paragraph-style-selection')).toHaveLength(5);expect(rows.filter(r=>r.scenarioId==='@id-docx-paragraph-style-refusal')).toHaveLength(14);
});

test('paragraph style authoring distinguishes new definitions and atomic refusals',async()=>{
 const path='workflows/docx/style-authoring.feature',rows=cases(path,await Bun.file(path).text());expect(rows).toHaveLength(24);expect(rows.filter(r=>r.scenarioId==='@id-docx-paragraph-style-authoring')).toHaveLength(7);expect(rows.filter(r=>r.scenarioId==='@id-docx-paragraph-style-authoring-refusal')).toHaveLength(17);
});

test('positioned slide text boxes separate authoring outcomes from atomic refusals',async()=>{
 const path='workflows/pptx/text-box.feature',rows=cases(path,await Bun.file(path).text());expect(rows).toHaveLength(23);expect(rows.filter(r=>r.scenarioId==='@id-pptx-text-box-authoring')).toHaveLength(8);expect(rows.filter(r=>r.scenarioId==='@id-pptx-text-box-refusal')).toHaveLength(15);
});

test('cell-style contracts separate explicit zero, removal and unsafe cached inputs',async()=>{
 const path='workflows/xlsx/cell-style.feature',rows=await sourceCases(path);expect(rows).toHaveLength(27);expect(rows.filter(r=>r.scenarioId==='@id-xlsx-cell-style-selection')).toHaveLength(9);expect(rows.filter(r=>r.scenarioId==='@id-xlsx-cell-style-refusal')).toHaveLength(18);
});

test('final section layout separates preserved geometry changes from unsafe inputs',async()=>{
 const path='workflows/docx/page-layout.feature',rows=await sourceCases(path);expect(rows).toHaveLength(22);expect(rows.filter(r=>r.scenarioId==='@id-docx-final-section-layout')).toHaveLength(8);expect(rows.filter(r=>r.scenarioId==='@id-docx-final-section-layout-refusal')).toHaveLength(14);
});

test('slide permutations retain seven positive and fourteen refusal variants',async()=>{
 const path='workflows/pptx/slide-order.feature',rows=cases(path,await Bun.file(path).text());expect(rows).toHaveLength(23);expect(rows.filter(r=>r.scenarioId==='@id-pptx-slide-permutation')).toHaveLength(7);expect(rows.filter(r=>r.scenarioId==='@id-pptx-slide-permutation-refusal')).toHaveLength(14);
});

test('effective formatting distinguishes nine inspected outcomes and sixteen refusals',async()=>{
 const path='workflows/docx/effective-formatting.feature',rows=cases(path,await Bun.file(path).text());expect(rows).toHaveLength(25);expect(rows.filter(r=>r.scenarioId==='@id-docx-effective-run-formatting')).toHaveLength(9);expect(rows.filter(r=>r.scenarioId==='@id-docx-effective-run-formatting-refusal')).toHaveLength(16);
});

test('every workflow is registered and sealed once',async()=>{
 const {validateWorkflowRegistration}=await import('../scripts/verify.ts');
 const paths=['workflows/xml/a.feature','workflows/xml/b.feature'];
 const ledger={features:paths},manifest={files:paths.map(path=>({path,role:'workflow'}))};
 expect(()=>validateWorkflowRegistration(paths,ledger,manifest)).not.toThrow();
 expect(()=>validateWorkflowRegistration([...paths,'workflows/xml/forgotten.feature'],ledger,manifest)).toThrow('Unregistered');
 expect(()=>validateWorkflowRegistration(paths,{features:[paths[0]]},manifest)).toThrow('Unregistered');
 expect(()=>validateWorkflowRegistration(paths,ledger,{files:[manifest.files[0]]})).toThrow('Unsealed');
 expect(()=>validateWorkflowRegistration(paths,ledger,{files:[...manifest.files,manifest.files[0]]})).toThrow('Duplicate');
 expect(()=>validateWorkflowRegistration(paths,{features:[...paths,'workflows/missing.feature']},manifest)).toThrow('Missing');
});
