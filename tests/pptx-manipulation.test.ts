import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';
import {inspectFixtureArchive} from '../scripts/fixture-content.ts';
import {beforePptxManipulationFeature,beforePptxManipulationLedger,beforeRetainedTableFeature} from './xml-generalization-helpers.ts';
const digest=(v:string|Uint8Array)=>new Bun.CryptoHasher('sha256').update(v).digest('hex');
const load=()=>Bun.file('ledgers/pptx-manipulation.json').json();
test('PPTX manipulation adds exactly20 concrete cases without retiring or crediting the predecessor captures',async()=>{
 const s=await load(),m=await Bun.file('manifest.json').json(),l=await Bun.file('ledgers/workflows.json').json(),all=[];
 expect(s.sourceRevision).toBe('14a7bf7ad72baa41028ff140802cbbfdbbd8a845');expect(s.bunPredecessor).toBe('69c8169a2241cf09dc769c71023dd2b7d5006354');expect(s.executionCredit).toBe(false);expect(s.retiredScenarioIds).toEqual([]);
 expect(s.baselineCounts).toEqual({features:62,scenarios:304,cases:791,assets:346});expect(s.records).toHaveLength(20);expect(new Set(s.records.map((r:any)=>r.id)).size).toBe(20);expect(new Set(s.records.map((r:any)=>r.sourceId)).size).toBe(20);
 for(const f of s.files){const text=beforeRetainedTableFeature(f.path,await Bun.file(f.path).text());expect(digest(text)).toBe(f.afterSha256);const rows=cases(f.path,text).filter(c=>s.records.some((r:any)=>r.id===c.scenarioId));all.push(...rows);expect(rows).toEqual(f.scenarios.flatMap((r:any)=>r.after));expect(beforePptxManipulationFeature(f.path,text)).toBe(f.beforeText);
  if(f.beforeText){const old=execFileSync('git',['show',`${s.sourceRevision}:${f.path}`],{stdio:['pipe','pipe','ignore']});expect(old.toString()).toBe(f.beforeText);}else expect(f.path).toMatch(/\/(bullets|text-autofit)\.feature$/);
 }
 expect(all).toHaveLength(20);expect(all.reduce((n,r)=>n+r.steps.length,0)).toBe(179);
 for(const r of s.records){expect(r.id).toBe('@id-pptx-manipulation-'+r.kind);expect(r.localId).toBe('@id-bun-pptx-next20-'+r.kind);expect(r.fixtureId).toBe(s.fixture.id);expect(r.executionCredit).toBe(false);expect(r.overlapReview.length).toBeGreaterThan(20);expect(digest(r.sourceBlock)).toBe(r.sourceBlockSha256);const source=await Bun.file(r.sourceFeature).text();expect(digest(source)).toBe(r.sourceSha256);expect(source).toContain(r.sourceBlock);expect(source.split('\n')[r.sourceLine-1].trim()).toBe(r.sourceId);expect(Object.keys(r.expected).length).toBeGreaterThan(0);
  const row=l.workflows.find((w:any)=>w.id===r.id);expect(row.expandedCases).toBe(1);expect(row.expectedOutcomes).toHaveLength(r.kind==='reorder-refusal'?4:5);expect(row.consumers).toEqual({bun:{status:'planned',evidence:[]},go:{status:'planned',evidence:[]},python:{status:'planned',evidence:[]}});
 }
 const asset=m.files.find((a:any)=>a.id===s.fixture.id);expect(asset.scenarioIds).toEqual(s.records.map((r:any)=>r.id));expect(asset.path).toBe(s.fixture.path);
 expect(beforePptxManipulationLedger(l)).toEqual(JSON.parse(execFileSync('git',['show',`${s.sourceRevision}:ledgers/workflows.json`]).toString()));
});
test('immutable PPTX fixture provenance and every input payload seal agree with archive topology',async()=>{
 const s=await load(),f=s.fixture,bytes=await Bun.file(f.path).bytes();expect(bytes.length).toBe(8464);expect(digest(bytes)).toBe('5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45');expect(digest(bytes)).toBe(f.sha256);
 const archive=inspectFixtureArchive(bytes);expect(archive.members.map(({name,sha256})=>({name,sha256})).sort((a,b)=>a.name.localeCompare(b.name))).toEqual([...f.members].sort((a:any,b:any)=>a.name.localeCompare(b.name)));expect(f.members).toHaveLength(20);expect(f.titles).toEqual(['Alpha','Beta','Gamma']);expect(f.body).toEqual({slide:2,shapeId:4,name:'Body',text:'Existing'});expect(f.notes.text).toBe('Original notes');expect(f.origin.recipe).toContain("Uint8Array.of(0,255,1,254,2,253)");
 expect(s.records.filter((r:any)=>r.kind.startsWith('insert')).every((r:any)=>r.changedMembers.length===3)).toBe(true);expect(s.records.find((r:any)=>r.kind==='reorder-refusal').changedMembers).toEqual([]);
});
test('historical reconstruction refuses changed PPTX predicates and consumer-credit drift',async()=>{
 const s=await load(),f=s.files[0],text=await Bun.file(f.path).text();expect(()=>beforePptxManipulationFeature(f.path,text.replace('New Title','Weak title'))).toThrow('Unreviewed PPTX');const ledger=await Bun.file('ledgers/workflows.json').json(),r=ledger.workflows.find((r:any)=>r.id===s.records[0].id);r.consumers.go.status='implemented';expect(()=>beforePptxManipulationLedger(ledger)).toThrow('Unreviewed PPTX');
});
