import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';
import {beforeLexicalAlignmentFeature} from './xml-generalization-helpers.ts';
import {beforeWordingCase} from './runtime-wording-helpers.ts';
import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';import {IdGenerator} from '@cucumber/messages';
const paths=['workflows/xml/editing.feature','workflows/xlsx/formula-references.feature'];
const hash=(s:string)=>new Bun.CryptoHasher('sha256').update(s).digest('hex');
test('XML formula wording keeps exact source examples arguments results and tags',async()=>{
 const text=await Bun.file('ledgers/xml-formula-wording-migration.json').text(),m=JSON.parse(text);expect(hash(text)).toBe('c96a9ba6daf2e790f4b661aae56e01fdc728159f53a3c2b3d0e83b0dbfcdd64f');expect(m.sourceRevision).toBe('390101863775f611e33963e3c2ed0bc6a9a6d7cd');expect(m.retiredScenarioIds).toEqual([]);expect(m.executionCredit).toBe(false);expect(m.files.map((f:any)=>f.path)).toEqual(paths);
 const records=m.files.flatMap((f:any)=>f.scenarios);expect(records).toHaveLength(19);expect(records.reduce((n:number,r:any)=>n+r.afterCaseSha256.length,0)).toBe(60);
 for(const f of m.files){const s=beforeLexicalAlignmentFeature(f.path,await Bun.file(f.path).text());expect(hash(s)).toBe(f.afterSha256);const rows=cases(f.path,s),g=IdGenerator.incrementing(),d=new Parser(new AstBuilder(g),new GherkinClassicTokenMatcher()).parse(s),ps=compile(d,f.path,g);
  for(const r of f.scenarios){const selected=rows.filter(c=>c.scenarioId===r.id);expect(selected.map(c=>hash(JSON.stringify(c)))).toEqual(r.afterCaseSha256);expect(selected.map(c=>hash(JSON.stringify(beforeWordingCase(c))))).toEqual(r.beforeCaseSha256);expect(ps.filter(p=>p.tags.some(t=>t.name===r.id)).map(p=>p.tags.map(t=>t.name).sort())).toEqual(r.afterTags);}
  for(const e of f.stepRenames)expect(rows.some(c=>c.scenarioId===e.id&&c.steps.some(s=>s.text===e.to))).toBe(true);
 }
 const previous=await Promise.all(['runtime','package','word'].map(n=>Bun.file(`ledgers/${n}-wording-migration.json`).json())),ids=[...previous.flatMap(p=>p.files.flatMap((f:any)=>f.scenarios)),...records].map(r=>r.id);expect(ids).toHaveLength(87);expect(new Set(ids).size).toBe(87);
});
test('wording normalization does not mask changed lexical bytes spans or refusal results',async()=>{
 for(const [path,id,from,to] of [
  [paths[0],'@id-xml-go-element-removal-custody',' gap ',' altered '],
  [paths[0],'@id-xml-go-element-replacement-refusal','no edited output','partial output'],
  [paths[1],'@id-xlsx-go-formula-analysis-counts','byte span','character span'],
  [paths[1],'@id-xlsx-go-static-remap-refusal','empty replacement','partial replacement'],
 ]){const row=cases(path!,await Bun.file(path!).text()).find(c=>c.scenarioId===id)!,bad=structuredClone(row);for(const step of bad.steps)step.text=step.text.replace(from!,to!);expect(beforeWordingCase(bad)).not.toEqual(beforeWordingCase(row));}
});
test('XML and formula actors use operation profiles without claiming schema or calculation coverage',async()=>{
 for(const path of paths){const text=await Bun.file(path).text();for(const row of cases(path,text))for(const step of row.steps)expect(step.text).not.toMatch(/\bGo\b/);expect(text).not.toMatch(/@profile-go-/);}
 expect(await Bun.file(paths[0]!).text()).toContain('@profile-lexical-snapshot-api');expect(await Bun.file(paths[1]!).text()).toContain('@profile-static-reference-api');
});
