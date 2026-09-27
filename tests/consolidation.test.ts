import {test,expect} from 'bun:test';
import {sourceCases} from './catalogue-helpers.ts';
import {cases} from '../scripts/verify.ts';
test('unified operation families retain all source scenario IDs and expanded cases exactly',async()=>{
 const migration=await Bun.file('ledgers/feature-consolidation.json').json();
 expect(migration.schemaVersion).toBe(1);expect(migration.retiredScenarioIds).toEqual([]);
 const seen=new Set<string>();
 for(const group of migration.groups){
  const actual=(await Promise.all(group.sources.map((s:any)=>sourceCases(group.target,s.path)))).flat();
  const fingerprint=(c:any)=>({scenarioId:c.scenarioId,sha256:new Bun.CryptoHasher('sha256').update(JSON.stringify(c)).digest('hex')});
  expect(actual.map(fingerprint)).toEqual(group.sources.flatMap((s:any)=>s.cases));
  for(const source of group.sources){
   for(const id of new Set(source.cases.map((c:any)=>c.scenarioId))){expect(seen.has(id as string)).toBe(false);seen.add(id as string);}
   if(source.path!==group.target)expect(await Bun.file(source.path).exists()).toBe(false);
  }
 }
});
test('policy tags stay at scenario scope and new API backgrounds do not leak into existing cases',async()=>{
 const {Parser,AstBuilder,GherkinClassicTokenMatcher,compile}=await import('@cucumber/gherkin');const {IdGenerator}=await import('@cucumber/messages');
 const gen=IdGenerator.incrementing(),p='workflows/package/preservation.feature',doc=new Parser(new AstBuilder(gen),new GherkinClassicTokenMatcher()).parse(await Bun.file(p).text()),rows=compile(doc,p,gen);
 expect(doc.feature!.tags.map(t=>t.name)).toEqual(['@planned']);
 const common=rows.find(r=>r.tags.some(t=>t.name==='@id-opc-package-corpus-noop'))!;
 expect(common.steps).toHaveLength(4);expect(common.tags.some(t=>t.name==='@profile-bun-opc')).toBe(false);
 const api=rows.find(r=>r.tags.some(t=>t.name==='@id-bun-opc-detached-byte-copies'))!;
 expect(api.tags.some(t=>t.name==='@profile-bun-opc')).toBe(true);expect(api.steps[0]!.text).toStartWith('a ZIP contains word/document.xml');
});

test('published catalogue has no runtime-named feature silos or unresolved local contract links',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 for(const p of ledger.features)expect(p).not.toMatch(/\/(?:bun|go|python)-/);
 const {resolve,dirname}=await import('node:path');
 for await(const p of new Bun.Glob('contracts/*.md').scan()){
  const text=await Bun.file(p).text();
  for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
   if(/^(?:https?:|#)/.test(match[1]!))continue;
   expect(await Bun.file(resolve(dirname(p),match[1]!.split('#')[0]!)).exists()).toBe(true);
  }
 }
});
