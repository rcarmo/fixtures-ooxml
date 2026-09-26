import {test,expect} from 'bun:test';
import {cases,verify,validateFixtureLayout,validateMutationContract} from '../scripts/verify.ts';
test('all pinned references and contract links verify',async()=>{const r=await verify();expect(r.assets).toBe(122);expect(r.facts).toBeGreaterThan(130);expect(r.workflows).toBeGreaterThanOrEqual(39);});
test('official Gherkin compilation expands shared cases',async()=>{const p='workflows/mutation-safety.feature';const result=cases(p,await Bun.file(p).text());expect(result).toHaveLength(19);expect(new Set(result.map(r=>r.scenarioId)).size).toBe(8);});
test('workflow identity is required',()=>{expect(()=>cases('bad.feature','Feature: Bad\n Scenario: unnamed\n  Given input\n')).toThrow();});

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
