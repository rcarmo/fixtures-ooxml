import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases,validateConsumerMappings} from '../scripts/verify.ts';

const retained='@id-pptx-slide-visibility-retained-inputs';
const office='@id-pptx-office-hidden-slide-positive';
const feature='workflows/pptx/slide-visibility.feature';
const ids={source:'fixture-e01ded1106a28f94a3439e8368f9a12ec360891f4a9e2810f6504c4c328ed79c',control:'fixture-fa245a3df00fef7f7bf4739921ee840194040161e06490589e3d52cc9fa7a71d'};

test('retained PPTX inputs distinguish a namespaced marker from CT_Slide visibility',async()=>{
 const rows=cases(feature,await Bun.file(feature).text());expect(rows.map(r=>r.scenarioId)).toEqual([retained,office]);
 const manifest=await Bun.file('manifest.json').json(),groups=await Bun.file('ledgers/fixture-groups.json').json();
 const group=groups.groups.find((g:any)=>g.format==='pptx'&&g.scenarioGroup==='slides');
 expect(group.fixtureIds).toEqual([ids.source,ids.control]);expect(group.scenarioIds).toEqual([retained]);
 for(const id of Object.values(ids))expect(manifest.files.find((f:any)=>f.id===id).scenarioIds).toEqual([retained]);
 for(const [role,id] of Object.entries(ids)){
  const fixture=manifest.files.find((f:any)=>f.id===id);
  const names=execFileSync('unzip',['-Z1',fixture.path],{encoding:'utf8'}).trim().split('\n').filter(name=>/^ppt\/slides\/slide\d+\.xml$/.test(name)).sort();
  expect(names).toEqual([1,2,3,4].map(n=>`ppt/slides/slide${n}.xml`));
  for(let n=1;n<=4;n++){
   const xml=execFileSync('unzip',['-p',fixture.path,`ppt/slides/slide${n}.xml`],{encoding:'utf8'});
   const root=xml.match(/<p:sld\b[^>]*>/)?.[0];expect(root).toBeDefined();
   expect(/(?:^|\s)p:show="0"/.test(root!)).toBe(role==='source'&&n===3);
   expect(/(?:^|\s)show=/.test(root!)).toBe(false);
   if(role==='control'||n!==3)expect(/(?:^|\s)p:show=/.test(root!)).toBe(false);
  }
 }
 const ledger=await Bun.file('ledgers/workflows.json').json();
 for(const id of [retained,office]){const w=ledger.workflows.find((x:any)=>x.id===id);expect(w.expandedCases).toBe(1);for(const consumer of ['bun','go','python'])expect(w.consumers[consumer].status).toBe('planned');}
 const scenarioSet=new Set(ledger.workflows.map((w:any)=>w.id));
 for(const path of ['ledgers/consumers/bun-pptx-slide-visibility.json','ledgers/consumers/pptx-slide-visibility.json','ledgers/consumers/python-pptx-slide-visibility.json']){
  const mapping=await Bun.file(path).json();validateConsumerMappings(mapping,scenarioSet);
  expect(mapping.mappings).toHaveLength(mapping.declarationCount);
  expect(mapping.mappings.every((r:any)=>r.executionCredit===false)).toBe(true);
 }
 const bun=await Bun.file('ledgers/consumers/bun-pptx-slide-visibility.json').json();expect(bun.mappings).toHaveLength(3);expect(bun.mappings.map((r:any)=>r.coverage)).toEqual(Array(3).fill('partial'));
 const go=await Bun.file('ledgers/consumers/pptx-slide-visibility.json').json();expect(go.mappings.map((r:any)=>r.coverage)).toEqual(Array(5).fill('partial'));
 const python=await Bun.file('ledgers/consumers/python-pptx-slide-visibility.json').json();expect(python.mappings.map((r:any)=>r.coverage)).toEqual([...Array(6).fill('unmapped'),...Array(2).fill('partial')]);
});
