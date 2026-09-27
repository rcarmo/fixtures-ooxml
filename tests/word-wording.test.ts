import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';
import {beforeWordingCase} from './runtime-wording-helpers.ts';
import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';import {IdGenerator} from '@cucumber/messages';
const names=['creation','properties','paragraphs','paragraph-style','run-formatting','tables','page-layout','tracked-workflow','anchor-discovery'];
const hash=(s:string)=>new Bun.CryptoHasher('sha256').update(s).digest('hex');
test('Word wording allowlist preserves all values arguments outcomes and scenario identities',async()=>{
 const text=await Bun.file('ledgers/word-wording-migration.json').text(),m=JSON.parse(text);expect(hash(text)).toBe('341fb83ef1cf379bc226235ed4727ca81acfb630b3fb39b1157e160f138bd0ec');expect(m.sourceRevision).toBe('d3734216fdd32f592a513f476fed0c4fbda3f32c');expect(m.retiredScenarioIds).toEqual([]);expect(m.executionCredit).toBe(false);expect(m.files.map((f:any)=>f.path)).toEqual(names.map(n=>`workflows/docx/${n}.feature`));
 const records=m.files.flatMap((f:any)=>f.scenarios);expect(records).toHaveLength(34);expect(records.reduce((n:number,r:any)=>n+r.afterCaseSha256.length,0)).toBe(75);
 for(const f of m.files){const s=await Bun.file(f.path).text();expect(hash(s)).toBe(f.afterSha256);const rows=cases(f.path,s),g=IdGenerator.incrementing(),d=new Parser(new AstBuilder(g),new GherkinClassicTokenMatcher()).parse(s),ps=compile(d,f.path,g);
  for(const r of f.scenarios){const selected=rows.filter(c=>c.scenarioId===r.id);expect(selected.map(c=>hash(JSON.stringify(c)))).toEqual(r.afterCaseSha256);expect(selected.map(c=>hash(JSON.stringify(beforeWordingCase(c))))).toEqual(r.beforeCaseSha256);expect(ps.filter(p=>p.tags.some(t=>t.name===r.id)).map(p=>p.tags.map(t=>t.name).sort())).toEqual(r.afterTags);}
  for(const e of f.stepRenames)expect(rows.some(c=>c.scenarioId===e.id&&c.steps.some(s=>s.text===e.to))).toBe(true);
 }
 const previous=await Promise.all(['runtime','package'].map(n=>Bun.file(`ledgers/${n}-wording-migration.json`).json())),ids=[...previous.flatMap(p=>p.files.flatMap((f:any)=>f.scenarios)),...records].map(r=>r.id);expect(ids).toHaveLength(68);expect(new Set(ids).size).toBe(68);
});
test('Word compatibility predicates cannot be weakened by actor reversal',async()=>{
 for(const [name,id,from,to] of [
  ['paragraph-style','@id-docx-go-paragraph-style-getters','HeadingLevel equals','OtherLevel equals'],
  ['tables','@id-docx-go-table-cell-access','return nil','return an error'],
  ['run-formatting','@id-docx-go-run-effects-getters','all eight','all seven'],
  ['anchor-discovery','@id-python-word-anchor-section-discovery-hints','word_list_anchors','missing_tool'],
 ]){const path=`workflows/docx/${name}.feature`,row=cases(path,await Bun.file(path).text()).find(c=>c.scenarioId===id)!,bad=structuredClone(row);for(const step of bad.steps)step.text=step.text.replace(from!,to!);expect(beforeWordingCase(bad)).not.toEqual(beforeWordingCase(row));}
});
test('Word actions and profiles identify operations instead of their source runtime',async()=>{
 for(const name of names){const path=`workflows/docx/${name}.feature`,text=await Bun.file(path).text();expect(text).not.toMatch(/@profile-(?:go|python)-/);for(const row of cases(path,text))for(const step of row.steps)expect(step.text).not.toMatch(/\bGo Word\b/);}
 const style=await Bun.file('workflows/docx/paragraph-style.feature').text(),tables=await Bun.file('workflows/docx/tables.feature').text(),runs=await Bun.file('workflows/docx/run-formatting.feature').text(),anchors=await Bun.file('workflows/docx/anchor-discovery.feature').text();
 expect(style).toContain('@profile-heading-classification-api');expect(tables).toContain('@profile-nullable-cell-api');expect(runs).toContain('@profile-in-memory-effects-api');expect(runs).toContain('@profile-selected-formatting-readback');expect(anchors).toContain('@profile-anchor-response-api');expect(anchors).toContain('@profile-tool-discovery-hints');
});
