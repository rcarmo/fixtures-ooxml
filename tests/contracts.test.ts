import {test,expect} from 'bun:test';
import {cases,verify,validateFixtureLayout,validateMutationContract} from '../scripts/verify.ts';
test('all pinned references and contract links verify',async()=>{const r=await verify();expect(r.assets).toBe(140);expect(r.facts).toBeGreaterThan(130);expect(r.workflows).toBe(101);expect(r.cases).toBe(184);});
test('official Gherkin compilation expands shared cases',async()=>{const p='workflows/mutation-safety.feature';const result=cases(p,await Bun.file(p).text());expect(result).toHaveLength(19);expect(new Set(result.map(r=>r.scenarioId)).size).toBe(8);});
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
 expect(fixtures).toHaveLength(115);
 expect(new Set(fixtures.map((f:any)=>f.sha256)).size).toBe(115);
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
 for(const name of paths){const path='workflows/'+name+'.feature',text=await Bun.file(path).text();expect(text.startsWith('@planned\n')).toBe(true);all.push(...cases(path,text));}
 expect(all).toHaveLength(62);expect(new Set(all.map(c=>c.scenarioId)).size).toBe(40);
 const commentIds=new Set(cases('workflows/docx/comments.feature',await Bun.file('workflows/docx/comments.feature').text()).map(c=>c.scenarioId));
 const mapping=await Bun.file('ledgers/consumers/bun-comments.json').json();expect(mapping.mappings).toHaveLength(19);
 for(const row of mapping.mappings){expect(row.executionCredit).toBe(false);expect(row.coverage).toBe('partial');expect(row.gaps.length).toBeGreaterThan(0);expect(row.scenarioIds.every((id:string)=>commentIds.has(id))).toBe(true);}
});

test('tracked dispatcher retains the planned obligation ID with explicit outcome and refusal variants',async()=>{
 const path='workflows/docx/tracked-workflow.feature',rows=cases(path,await Bun.file(path).text());expect(rows).toHaveLength(17);
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
 const path='workflows/docx/run-formatting.feature',rows=cases(path,await Bun.file(path).text());
 expect(rows).toHaveLength(15);expect(rows.filter(r=>r.scenarioId==='@id-docx-direct-run-formatting')).toHaveLength(4);expect(rows.filter(r=>r.scenarioId==='@id-docx-direct-formatting-refusal')).toHaveLength(11);
 expect(rows.slice(0,4).map(r=>r.name)).toEqual(['Apply the enable direct formatting policy','Apply the disable direct formatting policy','Apply the remove direct formatting policy','Apply the no-op direct formatting policy']);
});
