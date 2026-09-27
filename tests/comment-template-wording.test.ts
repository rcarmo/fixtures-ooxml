import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';
import {beforeWordingCase} from './runtime-wording-helpers.ts';
import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';import {IdGenerator} from '@cucumber/messages';
const paths=['workflows/docx/comments.feature','workflows/docx/template-analysis.feature','workflows/docx/template-cache.feature','workflows/xlsx/creation.feature','workflows/xml/parsing.feature'];
const hash=(s:string)=>new Bun.CryptoHasher('sha256').update(s).digest('hex');
test('comment/template wording retains every selected predicate and compatible historical profile boundary',async()=>{
 const text=await Bun.file('ledgers/comment-template-wording-migration.json').text(),m=JSON.parse(text);expect(hash(text)).toBe('2016b1fea13747e7673d48a41cd2ff0cc180d5caedb4942669103e12a63895be');expect(m.sourceRevision).toBe('4095fc356a72a4d839ece2d647402b6928041553');expect(m.retiredScenarioIds).toEqual([]);expect(m.executionCredit).toBe(false);expect(m.files.map((f:any)=>f.path)).toEqual(paths);
 const records=m.files.flatMap((f:any)=>f.scenarios);expect(records).toHaveLength(24);expect(records.reduce((n:number,r:any)=>n+r.afterCaseSha256.length,0)).toBe(25);expect(m.files[3].scenarios).toEqual([]);expect(m.files[3].stepRenames).toEqual([]);
 for(const f of m.files){const s=await Bun.file(f.path).text();expect(hash(f.path==='workflows/docx/template-analysis.feature'?s.split('\n  @profile-concrete-template-inventory')[0]!:f.path==='workflows/docx/comments.feature'?s.split('\n  @profile-existing-complete-thread')[0]!:s)).toBe(f.afterSha256);const rows=cases(f.path,s),g=IdGenerator.incrementing(),d=new Parser(new AstBuilder(g),new GherkinClassicTokenMatcher()).parse(s),ps=compile(d,f.path,g);
  for(const r of f.scenarios){const selected=rows.filter(c=>c.scenarioId===r.id);expect(selected.map(c=>hash(JSON.stringify(c)))).toEqual(r.afterCaseSha256);expect(selected.map(c=>hash(JSON.stringify(beforeWordingCase(c))))).toEqual(r.beforeCaseSha256);expect(ps.filter(p=>p.tags.some(t=>t.name===r.id)).map(p=>p.tags.map(t=>t.name).sort())).toEqual(r.afterTags);}
  for(const e of f.stepRenames)expect(rows.some(c=>c.scenarioId===e.id&&c.steps.some(s=>s.text===e.to))).toBe(true);
 }
 const previous=await Promise.all(['runtime','package','word','xml-formula'].map(n=>Bun.file(`ledgers/${n}-wording-migration.json`).json())),ids=[...previous.flatMap(p=>p.files.flatMap((f:any)=>f.scenarios)),...records].map(r=>r.id);expect(ids).toHaveLength(111);expect(new Set(ids).size).toBe(111);
});
test('normalization cannot hide weak response semantics thread policy or cache invalidation changes',async()=>{
 for(const [path,id,from,to] of [
  [paths[0],'@id-python-comments-reply-root-resolution','root comment done true','reply comment done true'],
  [paths[0],'@id-python-comments-filter-predicates','each nonempty','each empty'],
  [paths[1],'@id-python-word-template-analysis-plain-response','is a dictionary','has accurate sections'],
  [paths[2],'@id-python-template-cache-source-change','"stale"','"hit"'],
 ]){const row=cases(path!,await Bun.file(path!).text()).find(c=>c.scenarioId===id)!,bad=structuredClone(row);for(const step of bad.steps)step.text=step.text.replace(from!,to!);expect(beforeWordingCase(bad)).not.toEqual(beforeWordingCase(row));}
});
test('all shared workflow steps and profiles avoid runtime-origin labels',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();expect(ledger.features).toHaveLength(59);
 for(const path of ledger.features){const text=await Bun.file(path).text();expect(text).not.toMatch(/@profile-(?:python|go|bun)-/);for(const c of cases(path,text))for(const s of c.steps)expect(s.text).not.toMatch(/\b(?:Python|Bun|Go)\b/);}
 const xml=await Bun.file('workflows/xml/parsing.feature').text();expect(xml).toContain('@profile-javascript-xml-model');expect(xml).toContain('@profile-xml-error-api');expect(xml).toContain('OoxmlError instance');
});
test('comment template and creation actors are neutral while provenance stays intact',async()=>{
 for(const path of paths){const text=await Bun.file(path).text();expect(text).not.toMatch(/@profile-(?:python|go|bun)-/);for(const c of cases(path,text))for(const s of c.steps)expect(s.text).not.toMatch(/\b(?:Python|Bun|Go)\b/);}
 expect(await Bun.file(paths[0]!).text()).toContain('@profile-comment-extension-authoring');expect(await Bun.file(paths[0]!).text()).toContain('@profile-comment-thread-root-resolution');expect(await Bun.file(paths[1]!).text()).toContain('@profile-template-response-shape-api');expect(await Bun.file(paths[2]!).text()).toContain('@profile-template-cache-api');
 const xlsx=await Bun.file(paths[3]!).text();expect(xlsx).not.toContain('Bun authors');expect(xlsx).toContain('go-ooxml formatting workbook fixture');
});
