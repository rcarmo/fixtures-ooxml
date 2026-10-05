// Bun 1.4.2 test runner does not flush --cpu-prof/--heap-prof CLI profiles.
// Capture process-local test work before it exits; subprocesses remain unprofiled.
import {afterAll} from 'bun:test';
import {profile} from 'bun:jsc';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
const output=process.env.OOXML_PROFILE_DIR;
if(!output)throw Error('Tests require make test profiling entrypoint');
let finish!:()=>void;
const done=new Promise<void>(resolve=>{finish=resolve});
const pending=profile(async()=>await done,1000);
afterAll(async()=>{
 finish();
 const cpu=await pending;
 writeFileSync(join(output,'cpu-jsc.json'),JSON.stringify(cpu));
 writeFileSync(join(output,'cpu-jsc.txt'),cpu.functions);
 writeFileSync(join(output,'heap.heapprofile'),Bun.generateHeapSnapshot('v8'));
});
