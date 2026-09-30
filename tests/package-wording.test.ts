import {test,expect} from 'bun:test';
import {historicalXmlFeature} from './xml-generalization-helpers.ts';
import {cases} from '../scripts/verify.ts';
import {beforeWordingCase} from './runtime-wording-helpers.ts';
import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';import {IdGenerator} from '@cucumber/messages';
const paths=['workflows/package/preservation.feature','workflows/package/zip32.feature'];
const hash=(s:string)=>new Bun.CryptoHasher('sha256').update(s).digest('hex');
test('package wording allowlist retains all inputs refusal strings callbacks and historical fingerprints',async()=>{
 const text=await Bun.file('ledgers/package-wording-migration.json').text(),m=JSON.parse(text);expect(hash(text)).toBe('f09952d8d83960416eb986de8b20dfb541fa3f97d3862e940b19ed7299afbb3f');
 expect(m.sourceRevision).toBe('7b38bbb9609e6a7ab9b3f5188f3a8c09c1a81d2a');expect(m.retiredScenarioIds).toEqual([]);expect(m.executionCredit).toBe(false);expect(m.files.map((f:any)=>f.path)).toEqual(paths);expect(m.files.flatMap((f:any)=>f.scenarios)).toHaveLength(18);
 for(const f of m.files){const s=historicalXmlFeature(f.path,await Bun.file(f.path).text());expect(hash(s)).toBe(f.afterSha256);const rows=cases(f.path,s),gen=IdGenerator.incrementing(),d=new Parser(new AstBuilder(gen),new GherkinClassicTokenMatcher()).parse(s),pickles=compile(d,f.path,gen);
  for(const r of f.scenarios){const selected=rows.filter(c=>c.scenarioId===r.id);expect(selected.map(c=>hash(JSON.stringify(c)))).toEqual(r.afterCaseSha256);expect(selected.map(c=>hash(JSON.stringify(beforeWordingCase(c))))).toEqual(r.beforeCaseSha256);expect(pickles.filter(p=>p.tags.some(t=>t.name===r.id)).map(p=>p.tags.map(t=>t.name).sort())).toEqual(r.afterTags);}
  for(const e of f.stepRenames)expect(rows.some(c=>c.scenarioId===e.id&&c.steps.some(s=>s.text===e.to))).toBe(true);
 }
 expect(m.files.flatMap((f:any)=>f.scenarios).reduce((n:number,r:any)=>n+r.afterCaseSha256.length,0)).toBe(38);
 const prior=await Bun.file('ledgers/runtime-wording-migration.json').json(),ids=[...prior.files,...m.files].flatMap((f:any)=>f.scenarios.map((r:any)=>r.id));expect(ids).toHaveLength(34);expect(new Set(ids).size).toBe(34);
});
test('API errors and callback results cannot be hidden by actor normalization',async()=>{
 const rows=cases(paths[0]!,historicalXmlFeature(paths[0]!,await Bun.file(paths[0]!).text())),row=rows.find(r=>r.scenarioId==='@id-bun-opc-async-transaction-refusal')!,baseline=beforeWordingCase(row);
 for(const [a,b]of [['opc-async-transaction','wrong-code'],['ran flag is false','ran flag is true'],['OoxmlError','Error']]){const bad=structuredClone(row);for(const s of bad.steps)s.text=s.text.replace(a!,b!);expect(beforeWordingCase(bad)).not.toEqual(baseline);}
});
test('package and ZIP actors are portable while API-specific profiles remain explicit',async()=>{
 for(const path of paths){const text=await Bun.file(path).text();for(const row of cases(path,text))for(const step of row.steps)expect(step.text).not.toMatch(/\bBun\b/);expect(text).not.toMatch(/@profile-bun-/);}
 const custody=await Bun.file(paths[0]!).text(),zip=await Bun.file(paths[1]!).text();
 expect(custody).toContain('@profile-portable-transactions');expect(custody).not.toContain('@profile-ooxml-error-api');expect(custody).toContain('@profile-opc-byte-custody');expect(zip).toContain('@profile-zip32-refusal-reasons');
 expect(custody).not.toContain('it throws an OoxmlError with code');expect(zip).not.toContain('it throws an OoxmlError with code');expect(zip).toContain('reading refuses with reason');expect(custody).toContain('go-ooxml and python-office-mcp-server fixture corpora');
});
