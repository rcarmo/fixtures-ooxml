import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';
import {IdGenerator} from '@cucumber/messages';
import {join,resolve} from 'node:path';
export const root=resolve(import.meta.dir,'..');
const hash=(b:Uint8Array)=>new Bun.CryptoHasher('sha256').update(b).digest('hex');
const safe=(p:string)=>!!p&&!/[\\:\u0000-\u001f]/.test(p)&&p.split('/').every(s=>s&&s!=='.'&&s!=='..');
export function cases(path:string,text:string){
 const id=IdGenerator.incrementing(),doc=new Parser(new AstBuilder(id),new GherkinClassicTokenMatcher()).parse(text);
 const pickles=compile(doc,path,id);
 return pickles.map(p=>{
  const ids=p.tags.map(t=>t.name).filter(t=>/^@id-/.test(t));if(ids.length!==1)throw Error('Expected unique scenario ID: '+path);
  return {scenarioId:ids[0]!,name:p.name,steps:p.steps.map(s=>({text:s.text,argument:s.argument??null}))};
 });
}
export async function verify(base=root){
 const manifest=await Bun.file(join(base,'manifest.json')).json();const seen=new Set<string>();
 for(const f of manifest.files){if(!safe(f.path)||seen.has(f.path))throw Error('Invalid manifest path');seen.add(f.path);const bytes=await Bun.file(join(base,f.path)).bytes();if(bytes.length!==f.bytes||hash(bytes)!==f.sha256)throw Error('Asset drift: '+f.path);if(!f.origin)throw Error('Missing provenance');}
 for(const dir of ['fixtures','notices'])for await(const path of new Bun.Glob('**/*').scan({cwd:join(base,dir),onlyFiles:true}))if(!seen.has(dir+'/'+path))throw Error('Unpinned asset '+path);
 const forbidden=/\.(py|pyi|go|cs|java|rs|swift)$/i;
 for await(const path of new Bun.Glob('**/*').scan({cwd:base,onlyFiles:true,dot:false}))if(!path.startsWith('node_modules/')&&forbidden.test(path))throw Error('External implementation source is not a reference asset: '+path);
 const evidence=await Bun.file(join(base,'facts/evidence.json')).json(),eids=new Set(evidence.items.map((e:any)=>e.id));
 const factIds=new Set<string>();for(const group of ['content-types','namespaces','relationships','constants']){const facts=await Bun.file(join(base,'facts',group+'.json')).json();for(const f of facts.values){if(factIds.has(f.id)||!f.value||!['observed','specified','disputed'].includes(f.status)||!f.evidence.length||f.evidence.some((id:string)=>!eids.has(id)))throw Error('Invalid fact '+f.id);factIds.add(f.id);}}
 const ledger=await Bun.file(join(base,'ledgers/workflows.json')).json();const actual=[];
 for(const path of ledger.features){const text=await Bun.file(join(base,path)).text();for(const c of cases(path,text))actual.push({...c,path});}
 const ids=[...new Set(actual.map(c=>c.scenarioId))].sort();if(JSON.stringify(ids)!==JSON.stringify(ledger.workflows.map((w:any)=>w.id).sort()))throw Error('Workflow ledger scenario drift');
 for(const w of ledger.workflows){if(w.expandedCases!==actual.filter(c=>c.scenarioId===w.id).length||!w.expectedOutcomes?.length||w.factIds.some((id:string)=>!factIds.has(id)))throw Error('Incomplete workflow '+w.id);}
 const pack=await Bun.file(join(base,'shared/v2/pack/pack-manifest.json')).json();for(const [path,digest]of Object.entries(pack.files)){if(!safe(path)||hash(await Bun.file(join(base,'shared/v2/pack',path)).bytes())!==digest)throw Error('Pack drift '+path);}
 console.log(`Verified ${seen.size} assets, ${factIds.size} facts, ${ids.length} workflows / ${actual.length} cases`);
 return {assets:seen.size,facts:factIds.size,workflows:ids.length,cases:actual.length};
}
if(import.meta.main)await verify();
