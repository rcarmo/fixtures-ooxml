import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {verifyObservedGeneratedRetirement} from '../scripts/observed-generated-retirement.ts';

const source='5f07417b26d199e7b6c033fcb90773ae4208e1e3';
const hash=(bytes:Uint8Array)=>new Bun.CryptoHasher('sha256').update(bytes).digest('hex');

test('35 observed-generated archive identities remain in immutable v0.43 custody',async()=>{
 const manifest=await Bun.file('manifest.json').json();
 const ledger=await Bun.file('ledgers/observed-generated-retirement.json').json();
 const old=JSON.parse(execFileSync('git',['show',`${source}:manifest.json`],{maxBuffer:4*1024*1024}).toString());
 expect(hash(new Uint8Array(execFileSync('git',['show',`${source}:manifest.json`],{maxBuffer:4*1024*1024})))).toBe(ledger.releaseSource.manifestSha256);
 expect(await verifyObservedGeneratedRetirement(process.cwd(),manifest)).toBe(35);
 expect(ledger.retired.map((r:any)=>r.id)).toEqual(old.files.filter((f:any)=>f.role==='fixture'&&f.origins?.some((o:any)=>o.kind==='observed-generated')).map((f:any)=>f.id));
 for(const r of ledger.retired){
  const former=old.files.find((f:any)=>f.id===r.id);
  expect(r).toEqual({...former,reason:r.reason});
  const bytes=execFileSync('git',['show',`${source}:${r.path}`],{maxBuffer:4*1024*1024});
  expect(bytes.length).toBe(r.bytes);expect(hash(bytes)).toBe(r.sha256);
 }
});

test('v0.43 retired IDs cannot reappear as active fixture aliases',async()=>{
 const manifest=await Bun.file('manifest.json').json();
 const ledger=await Bun.file('ledgers/observed-generated-retirement.json').json();
 const copy=structuredClone(manifest);copy.files.push({...ledger.retired[0],path:'fixtures/docx/comments/new.docx'});
 expect(verifyObservedGeneratedRetirement(process.cwd(),copy)).rejects.toThrow('Invalid retired observed-generated identity');
});
