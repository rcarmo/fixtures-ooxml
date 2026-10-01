import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';
import {inspectFixtureArchive} from '../scripts/fixture-content.ts';
import {beforeRetainedStyleWordFeature,beforeRetainedStyleWordLedger} from './xml-generalization-helpers.ts';
const hash=(v:string|Uint8Array)=>new Bun.CryptoHasher('sha256').update(v).digest('hex');
const load=()=>Bun.file('ledgers/retained-style-word.json').json();
test('new retained edit batch seals exactly 20 PPTX and 20 Word cases with 401 steps and no execution credit',async()=>{
 const l=await load(),m=await Bun.file('manifest.json').json(),registry=await Bun.file('ledgers/workflows.json').json();
 expect(l.sourceRevision).toBe('f174097e68e4133ebbfb58daf0f336480d75f210');expect(l.baselineCounts).toEqual({features:67,scenarios:344,cases:831,assets:357});expect(l.executionCredit).toBe(false);expect(l.retiredScenarioIds).toEqual([]);expect(l.records).toHaveLength(40);expect(l.records.filter((r:any)=>r.format==='pptx')).toHaveLength(20);expect(l.records.filter((r:any)=>r.format==='docx')).toHaveLength(20);expect(new Set(l.records.map((r:any)=>r.id)).size).toBe(40);expect(l.files).toHaveLength(5);
 const all=[];for(const f of l.files){const text=await Bun.file(f.path).text();expect(hash(text)).toBe(f.afterSha256);expect(beforeRetainedStyleWordFeature(f.path,text)).toBe(f.beforeText);if(f.beforeText)expect(execFileSync('git',['show',`${l.sourceRevision}:${f.path}`]).toString()).toBe(f.beforeText);const rows=cases(f.path,text).filter(c=>l.records.some((r:any)=>r.id===c.scenarioId));expect(rows).toEqual(f.scenarios.flatMap((s:any)=>s.after));all.push(...rows);}
 expect(all).toHaveLength(40);expect(all.reduce((n,c)=>n+c.steps.length,0)).toBe(401);
 for(const r of l.records){expect(r.provenanceKind).toBe('new-project-authored-retained-edit-contract');expect(r.executionCredit).toBe(false);const row=registry.workflows.find((w:any)=>w.id===r.id);expect(row.expandedCases).toBe(1);expect(row.consumers).toEqual({bun:{status:'planned',evidence:[]},go:{status:'planned',evidence:[]},python:{status:'planned',evidence:[]}});expect(m.files.find((f:any)=>f.id===r.fixtureId).scenarioIds).toContain(r.id);}
 expect(beforeRetainedStyleWordLedger(registry)).toEqual(JSON.parse(execFileSync('git',['show',`${l.sourceRevision}:ledgers/workflows.json`]).toString()));
});
test('derived PPTX and Word inputs have exact recipe custody without replacing prior fixtures',async()=>{
 const l=await load();for(const format of ['pptx','docx']){const f=l.fixtures[format],bytes=await Bun.file(f.path).bytes(),old=await Bun.file(f.derivedFrom.path).bytes();expect(bytes.length).toBe(f.bytes);expect(hash(bytes)).toBe(f.sha256);expect(hash(old)).toBe(f.derivedFrom.sha256);const a=inspectFixtureArchive(old),b=inspectFixtureArchive(bytes);expect(b.members).toHaveLength(format==='pptx'?20:16);expect(b.members.map(({name,sha256})=>({name,sha256}))).toEqual(f.members);expect(b.members.filter(n=>a.members.find(o=>o.name===n.name)?.sha256!==n.sha256).map(n=>n.name)).toEqual([f.derivedFrom.part]);const read=(p:string)=>execFileSync('unzip',['-p',p,f.derivedFrom.part]).toString();const before=f.derivedFrom.beforeParagraph??f.derivedFrom.beforeStyle,after=f.derivedFrom.afterParagraph??f.derivedFrom.afterStyle;expect(read(f.path)).toBe(read(f.derivedFrom.path).replace(before,after));}
 expect(l.fixtures.docx.id).toBe('fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2');
 const line=l.records.find((r:any)=>r.id==='@id-docx-retained-paragraph-line');expect(line.expected).toEqual({line:480,lineRule:'auto'});
 const shapeNoFill=l.records.find((r:any)=>r.id==='@id-pptx-retained-shape-no-fill');expect(shapeNoFill.changedMembers).toEqual(['ppt/slides/slide2.xml']);
});
test('historical reconstruction refuses current predicate and consumer-status drift',async()=>{
 const l=await load(),f=l.files[0],text=await Bun.file(f.path).text();expect(()=>beforeRetainedStyleWordFeature(f.path,text.replace('invalid-style','false-success'))).toThrow('Unreviewed retained style/Word');const registry=await Bun.file('ledgers/workflows.json').json();registry.workflows.find((r:any)=>r.id===l.records[0].id).consumers.go.status='implemented';expect(()=>beforeRetainedStyleWordLedger(registry)).toThrow('Unreviewed retained style/Word');
});
