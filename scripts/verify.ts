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
export function validateFixtureLayout(manifest:any){
 if(manifest.schemaVersion!==2||manifest.fixturePathBase!=='repository-root'||!Array.isArray(manifest.files))throw Error('Expected repository-root manifest schema 2');
 const paths=new Set<string>(),hashes=new Set<string>(),ids=new Set<string>();
 for(const asset of manifest.files){
  if(!safe(asset.path)||paths.has(asset.path)||hashes.has(asset.sha256)||ids.has(asset.id))throw Error('Duplicate asset path, hash or ID');
  paths.add(asset.path);hashes.add(asset.sha256);ids.add(asset.id);
  if(asset.role!=='fixture')continue;
  if(!/^[a-f0-9]{64}$/.test(asset.sha256)||asset.id!=='fixture-'+asset.sha256)throw Error('Invalid fixture identity');
  if(!['docx','pptx','xlsx','png'].includes(asset.format)||!/^\w[\w-]*$/.test(asset.scenarioGroup??''))throw Error('Invalid fixture format or scenario group');
  const prefix=`fixtures/${asset.format}/${asset.scenarioGroup}/`;
  const file=asset.path.slice(prefix.length);
  if(!asset.path.startsWith(prefix)||!file||file.includes('/')||!file.endsWith('.'+asset.format))throw Error('Fixture must be organised under fixtures/<format>/<scenario-group>/');
  if(!Array.isArray(asset.scenarioIds)||new Set(asset.scenarioIds).size!==asset.scenarioIds.length)throw Error('Invalid fixture scenario links');
 }
}
export async function verify(base=root){
 const manifest=await Bun.file(join(base,'manifest.json')).json();const seen=new Set<string>(),hashes=new Set<string>(),assetIds=new Set<string>(),aliases=new Set<string>();
 validateFixtureLayout(manifest);
 for(const f of manifest.files){
  if(!safe(f.path)||seen.has(f.path)||hashes.has(f.sha256)||assetIds.has(f.id))throw Error('Duplicate asset path, hash or ID');
  seen.add(f.path);hashes.add(f.sha256);assetIds.add(f.id);
  const bytes=await Bun.file(join(base,f.path)).bytes();if(bytes.length!==f.bytes||hash(bytes)!==f.sha256)throw Error('Asset drift: '+f.path);
  if(!f.origins?.length)throw Error('Missing provenance');
  for(const alias of f.aliases){if(aliases.has(alias))throw Error('Duplicate alias');aliases.add(alias);}
 }
 for(const dir of ['fixtures','notices'])for await(const path of new Bun.Glob('**/*').scan({cwd:join(base,dir),onlyFiles:true}))if(!seen.has(dir+'/'+path))throw Error('Unpinned asset '+path);
 for await(const path of new Bun.Glob('**/*').scan({cwd:base,onlyFiles:true,dot:false}))if(!path.startsWith('node_modules/')&&/\.(docx|pptx|xlsx|png|jpg|jpeg|zip)$/i.test(path)&&!path.startsWith('fixtures/'))throw Error('Fixture outside single fixtures root: '+path);
 const fixtures=await Bun.file(join(base,'shared/v2/pack/fixture-manifest.json')).json();
 if(fixtures.schemaVersion!==2||fixtures.pathBase!=='repository-root')throw Error('Invalid fixture path policy');
 for(const f of fixtures.fixtures){const asset=manifest.files.find((a:any)=>a.id===f.assetId);if(!asset||asset.path!==f.path||asset.sha256!==f.sha256)throw Error('Shared fixture must reference canonical asset');}
 const forbidden=/\.(py|pyi|go|cs|java|rs|swift)$/i;
 for await(const path of new Bun.Glob('**/*').scan({cwd:base,onlyFiles:true,dot:false}))if(!path.startsWith('node_modules/')&&forbidden.test(path))throw Error('External implementation source is not a reference asset: '+path);
 const evidence=await Bun.file(join(base,'facts/evidence.json')).json(),eids=new Set(evidence.items.map((e:any)=>e.id));
 const factIds=new Set<string>();for(const group of ['content-types','namespaces','relationships','constants']){const facts=await Bun.file(join(base,'facts',group+'.json')).json();for(const f of facts.values){if(factIds.has(f.id)||!f.value||!['observed','specified','disputed'].includes(f.status)||!f.evidence.length||f.evidence.some((id:string)=>!eids.has(id)))throw Error('Invalid fact '+f.id);factIds.add(f.id);}}
 const ledger=await Bun.file(join(base,'ledgers/workflows.json')).json();const actual=[];
 for(const path of ledger.features){const text=await Bun.file(join(base,path)).text();for(const c of cases(path,text))actual.push({...c,path});}
 const ids=[...new Set(actual.map(c=>c.scenarioId))].sort();if(JSON.stringify(ids)!==JSON.stringify(ledger.workflows.map((w:any)=>w.id).sort()))throw Error('Workflow ledger scenario drift');
 for(const w of ledger.workflows){if(w.expandedCases!==actual.filter(c=>c.scenarioId===w.id).length||!w.expectedOutcomes?.length||w.factIds.some((id:string)=>!factIds.has(id)))throw Error('Incomplete workflow '+w.id);}
 const groups=await Bun.file(join(base,'ledgers/fixture-groups.json')).json(),groupKeys=new Set<string>(),groupedIds=new Set<string>();
 for(const group of groups.groups){
  const key=group.format+'/'+group.scenarioGroup;if(groupKeys.has(key)||!group.fixtureIds?.length)throw Error('Duplicate or empty fixture group');groupKeys.add(key);
  const scenarioLinks=new Set<string>();
  for(const id of group.fixtureIds){const fixture=manifest.files.find((f:any)=>f.id===id&&f.role==='fixture');if(!fixture||groupedIds.has(id)||fixture.format!==group.format||fixture.scenarioGroup!==group.scenarioGroup)throw Error('Invalid fixture group membership');groupedIds.add(id);for(const scenarioId of fixture.scenarioIds){if(!ids.includes(scenarioId))throw Error('Unknown fixture scenario link');scenarioLinks.add(scenarioId);}}
  if(JSON.stringify([...scenarioLinks].sort())!==JSON.stringify([...group.scenarioIds].sort()))throw Error('Fixture group scenario links differ');
 }
 if(groupedIds.size!==manifest.files.filter((f:any)=>f.role==='fixture').length)throw Error('Ungrouped fixture');
 const pack=await Bun.file(join(base,'shared/v2/pack/pack-manifest.json')).json();for(const [path,digest]of Object.entries(pack.files)){if(!safe(path)||hash(await Bun.file(join(base,'shared/v2/pack',path)).bytes())!==digest)throw Error('Pack drift '+path);}
 console.log(`Verified ${seen.size} assets, ${factIds.size} facts, ${ids.length} workflows / ${actual.length} cases`);
 return {assets:seen.size,facts:factIds.size,workflows:ids.length,cases:actual.length};
}
if(import.meta.main)await verify();
