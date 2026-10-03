import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';
import {registerWorkflow} from '../scripts/register-workflow.ts';
import {inspectFixtureArchive} from '../scripts/fixture-content.ts';
import {beforeOfficeSmartArtLedger} from './smartart-office-source-history.ts';
test('committed Office SmartArt fixture has exact provenance, members and planned workflows',async()=>{
 const r=await Bun.file('ledgers/pptx-smartart-office-source.json').json(),m=await Bun.file('manifest.json').json(),l=await Bun.file('ledgers/workflows.json').json(),f=m.files.find((f:any)=>f.id===r.fixtureId);
 expect(f.path).toBe('fixtures/pptx/smartart/office-smartart.pptx');expect(f.bytes).toBe(41382);expect(f.origins).toEqual([{repository:'https://github.com/apache/poi',revision:'33f89110dd72c7b94710322ce7e795d0f464f68f',path:'test-data/slideshow/SmartArt.pptx',gitBlob:'7b7731d78f27352ccea5713400d4994058bcc381',licence:'Apache-2.0'}]);
 const bytes=await Bun.file(f.path).bytes();expect(new Bun.CryptoHasher('sha256').update(bytes).digest('hex')).toBe(f.sha256);expect(bytes.length).toBe(f.bytes);const members=inspectFixtureArchive(bytes).members;expect(members).toHaveLength(42);expect(Object.fromEntries(members.map(m=>[m.name,m.sha256]))).toEqual(r.expected.memberSha256);
 const text=await Bun.file(r.feature).text(),compiled=cases(r.feature,text);expect(compiled).toHaveLength(3);expect(r.cases).toHaveLength(3);expect(new Set(compiled.map(c=>c.scenarioId)).size).toBe(2);expect(r.executionCredit).toBe(false);
 const rows=l.workflows.filter((w:any)=>w.feature===r.feature);expect(rows).toEqual(registerWorkflow(r.feature,text,{files:[]},{features:[],workflows:[]}).ledger.workflows);for(const row of rows)for(const runtime of ['bun','go','python'])expect(row.consumers[runtime].status).toBe('planned');
 expect(beforeOfficeSmartArtLedger(l).workflows).toHaveLength(478);const forged=structuredClone(l);forged.workflows.find((w:any)=>w.feature===r.feature).consumers.bun.status='implemented';expect(()=>beforeOfficeSmartArtLedger(forged)).toThrow('Unreviewed Office SmartArt');
 for(const path of ['notices/apache-poi-license.txt','notices/apache-poi-notice.txt','notices/apache-poi-smartart-provenance.md'])expect(m.files.some((f:any)=>f.path===path&&f.role==='notice')).toBe(true);
});
