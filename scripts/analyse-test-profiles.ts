// Summarise cumulative Bun JSC CPU samples and live heap snapshot after a test run.
import {readFileSync,statSync} from 'node:fs';
import {join} from 'node:path';
const dir=process.argv[2];
if(!dir)throw Error('Expected retained evidence directory');
const cpuPath=join(dir,'cpu-jsc.json'),heapPath=join(dir,'heap.heapprofile');
const cpu=JSON.parse(readFileSync(cpuPath,'utf8'));
const heap=JSON.parse(readFileSync(heapPath,'utf8'));
const top=(m:Map<string,number>,n=14)=>[...m].sort((a,b)=>b[1]-a[1]).slice(0,n);
const traces=cpu.stackTraces?.traces??[];
const intervalUs=Math.round((cpu.stackTraces?.interval??0.001)*1_000_000);
const counts=new Map<string,number>();
for(const trace of traces){
 const f=trace.frames?.[0]??{};
 const name=`${f.name||'(anonymous)'} ${f.sourceURL||''}`.trim();
 counts.set(name,(counts.get(name)??0)+1);
}
console.log(`CPU samples=${traces.length}, cumulative sampled CPU=${(traces.length*intervalUs/1000).toFixed(2)} ms (${intervalUs} us interval; time in native code or waiting is not represented)`);
for(const [name,count] of top(counts))console.log(`CPU ${(count*intervalUs/1000).toFixed(2)} ms ${name}`);
const fields=heap.snapshot?.meta?.node_fields??[];
const stride=fields.length,sizeIndex=fields.indexOf('self_size'),typeIndex=fields.indexOf('type'),nameIndex=fields.indexOf('name');
if(!stride||sizeIndex<0||typeIndex<0||nameIndex<0||heap.nodes.length%stride)throw Error('Invalid V8 heap snapshot nodes');
const types=heap.snapshot.meta.node_types[typeIndex];
const sizes=new Map<string,number>(),objects=new Map<string,number>();
let totalBytes=0;
for(let i=0;i<heap.nodes.length;i+=stride){
 const type=types[heap.nodes[i+typeIndex]]??'unknown',name=heap.strings[heap.nodes[i+nameIndex]]??'unknown',bytes=heap.nodes[i+sizeIndex]??0;
 const key=`${type}: ${name}`;sizes.set(key,(sizes.get(key)??0)+bytes);objects.set(key,(objects.get(key)??0)+1);totalBytes+=bytes;
}
console.log(`Live heap snapshot objects=${heap.nodes.length/stride}, self bytes=${totalBytes}, file bytes=${statSync(heapPath).size}`);
for(const [name,bytes] of top(sizes))console.log(`live_heap ${bytes} B; objects ${objects.get(name)}; ${name}`);
console.log('alloc_space/alloc_objects: unavailable from Bun live heap snapshot; sampled allocation evidence is not captured. Subprocesses are not profiled.');
if(!traces.length)throw Error('Empty CPU samples; rerun a representative workload');
if(!heap.nodes.length)throw Error('Empty heap snapshot');
