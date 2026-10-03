import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {inspectFixtureArchive,verifyFixtureContents} from '../scripts/fixture-content.ts';

const oldRef='a47c51ada71dfe1561f403c8861954bdbf5b9023';
const sha=(bytes:Uint8Array)=>new Bun.CryptoHasher('sha256').update(bytes).digest('hex');
test('the retained ZIP fixtures have unique decompressed member sets and exactly two historical storage retirements',async()=>{
 const manifest=await Bun.file('manifest.json').json(),ledger=await Bun.file('ledgers/fixture-content-consolidation.json').json();
 expect(ledger.releaseSource).toEqual({repository:'https://github.com/rcarmo/fixtures-ooxml',commit:oldRef,tag:'v0.40.0'});
 expect(ledger.retired.map((r:any)=>r.id)).toEqual([
  'fixture-1780cc7a1c0ee45df6c78afcea721d995bdb67846f6bdfb78cfe78c27e28b897',
  'fixture-9726b477472ddb7595875c9f30493df2577e587416b18418d0dc7221046690fe',
 ]);
 expect(await verifyFixtureContents(process.cwd(),manifest)).toEqual({archives:85,uniqueContents:85,retired:2});
 for(const r of ledger.retired){
  // Immutable published Git objects preserve the *different* historical ZIP bytes.
  const old=execFileSync('git',['show',`${oldRef}:${r.path}`],{maxBuffer:1024*1024});
  expect(old.length).toBe(r.bytes);expect(sha(old)).toBe(r.sha256);
  const retained=manifest.files.find((f:any)=>f.id===r.retainedId);
  expect(retained.path).toBe(r.retainedPath);expect(retained.sha256).toBe(r.retainedSha256);
  expect(await Bun.file(r.path).exists()).toBe(false);
  const former=inspectFixtureArchive(old),current=inspectFixtureArchive(await Bun.file(retained.path).bytes());
  expect(former.logicalSha256).toBe(r.logicalSha256);expect(current.logicalSha256).toBe(r.logicalSha256);
  expect(former.members.map(({name,bytes,sha256})=>({name,bytes,sha256}))).toEqual(r.members);
  expect(former.members.length).toBe(current.members.length);
  expect(former.members.map(m=>m.name).sort()).toEqual(current.members.map(m=>m.name).sort());
  if(r.path.includes('/creation/')){
   expect(former.members.map(m=>m.name)).toEqual(current.members.map(m=>m.name));
   expect(new Set(former.members.map(m=>m.timestamp)).size).toBe(1);
   expect(former.members[0]!.timestamp).not.toBe(current.members[0]!.timestamp);
  }else expect(former.members.map(m=>m.name)).not.toEqual(current.members.map(m=>m.name));
 }
});

test('ZIP content audit rejects a second physical archive with identical decompressed members',async()=>{
 const manifest=await Bun.file('manifest.json').json(),copy=structuredClone(manifest),original=copy.files.find((f:any)=>f.id==='fixture-d9d6a313182a71a73d75a26a0ff3b7826dbd2e300e1d202114ec9f8fb018fda5');
 copy.files.push({...original,id:'fixture-duplicate',path:original.path});
 await expect(verifyFixtureContents(process.cwd(),copy)).rejects.toThrow('Duplicate fixture ZIP content');
});
