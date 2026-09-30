import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';
import {IdGenerator} from '@cucumber/messages';
import {join,resolve} from 'node:path';
import {verifySpecifications} from './specifications.ts';
import {verifyFixtureContents} from './fixture-content.ts';
import {verifyObservedGeneratedRetirement} from './observed-generated-retirement.ts';
import {verifyFeatureCatalogue} from './feature-catalogue.ts';
export const root=resolve(import.meta.dir,'..');
const hash=(b:Uint8Array)=>new Bun.CryptoHasher('sha256').update(b).digest('hex');
const safe=(p:string)=>!!p&&!/[\\:\u0000-\u001f]/.test(p)&&p.split('/').every(s=>s&&s!=='.'&&s!=='..');
export function cases(path:string,text:string){
 const id=IdGenerator.incrementing(),doc=new Parser(new AstBuilder(id),new GherkinClassicTokenMatcher()).parse(text);
 const scenarioIds=new Set<string>();
 const inspect=(children:any[])=>{for(const child of children){
  if(child.rule)inspect(child.rule.children);
  if(!child.scenario)continue;
  const ids=child.scenario.tags.map((t:any)=>t.name).filter((name:string)=>/^@id-/.test(name));
  if(ids.length!==1)throw Error('Expected unique scenario ID: '+path);
  if(scenarioIds.has(ids[0]))throw Error('Duplicate scenario ID: '+ids[0]);scenarioIds.add(ids[0]);
 }};
 inspect(doc.feature?.children??[]);
 const pickles=compile(doc,path,id);
 if(!scenarioIds.size||!pickles.length)throw Error('Feature must compile at least one scenario: '+path);
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
  if(!['docx','pptx','xlsx','png','zip'].includes(asset.format)||!/^\w[\w-]*$/.test(asset.scenarioGroup??''))throw Error('Invalid fixture format or scenario group');
  const prefix=`fixtures/${asset.format}/${asset.scenarioGroup}/`;
  const file=asset.path.slice(prefix.length);
  if(!asset.path.startsWith(prefix)||!file||file.includes('/')||!file.endsWith('.'+asset.format))throw Error('Fixture must be organised under fixtures/<format>/<scenario-group>/');
  if(!Array.isArray(asset.scenarioIds)||new Set(asset.scenarioIds).size!==asset.scenarioIds.length)throw Error('Invalid fixture scenario links');
 }
}
export function validateWorkflowPath(path:string){
 const match=/^workflows\/(docx|pptx|xlsx|package|xml|office)\/([a-z0-9]+(?:-[a-z0-9]+)*)\.feature$/.exec(path);
 if(!match||/^(?:bun|go|python|native|docx|pptx|xlsx)-/.test(match[2]!))throw Error('Invalid workflow path: use format or common package/XML operation family');
}
export function validateWorkflowOwnership(ledger:any,actual:{scenarioId:string;path:string}[],contract:any){
 for(const w of ledger.workflows)if(!actual.some(c=>c.scenarioId===w.id)||actual.some(c=>c.scenarioId===w.id&&c.path!==w.feature))throw Error('Workflow feature ownership drift: '+w.id);
 for(const id of contract.scenarioIds)if(!contract.features.includes(ledger.workflows.find((w:any)=>w.id===id)?.feature))throw Error('Mutation feature ownership drift: '+id);
}
export function validateMutationContract(contract:any,manifest:any){
 if(contract.schemaVersion!==2||'feature' in contract||!Array.isArray(contract.features)||!contract.features.length||new Set(contract.features).size!==contract.features.length||contract.fixturePolicy?.membership!=='exact'||contract.fixturePolicy?.preserve!=='all-except-allowed')throw Error('Invalid mutation contract policy');
 for(const path of contract.features){validateWorkflowPath(path);if(!manifest.files.some((f:any)=>f.path===path&&f.role==='workflow'))throw Error('Unsealed mutation feature');}
 if(!Array.isArray(contract.scenarioIds)||new Set(contract.scenarioIds).size!==contract.scenarioIds.length||!Array.isArray(contract.fixtures)||!contract.fixtures.length)throw Error('Invalid mutation contract inventory');
 const ids=new Set<string>();
 for(const f of contract.fixtures){
  if(ids.has(f.id)||!f.id)throw Error('Duplicate workflow fixture');ids.add(f.id);
  const asset=manifest.files.find((a:any)=>a.id===f.assetId&&a.role==='fixture');if(!asset)throw Error('Unknown canonical fixture');
  for(const key of ['path','bytes','sha256','origin','origins','mustPreservePayloads'])if(key in f)throw Error('Redundant workflow fixture metadata');
  if(!f.memberSha256||!Object.keys(f.memberSha256).length||!Array.isArray(f.allowedChangedPartsForSuccess)||new Set(f.allowedChangedPartsForSuccess).size!==f.allowedChangedPartsForSuccess.length)throw Error('Invalid member policy');
  for(const [path,digest]of Object.entries(f.memberSha256))if(!safe(path)||typeof digest!=='string'||!/^[a-f0-9]{64}$/.test(digest))throw Error('Invalid member hash');
  for(const name of f.allowedChangedPartsForSuccess)if(!Object.hasOwn(f.memberSha256,name))throw Error('Unknown allowed member');
 }
}
export function validateConsumerMappings(ledger:any,scenarioIds:Set<string>){
 const textList=(values:any)=>Array.isArray(values)&&values.every((value:any)=>typeof value==='string'&&value.trim().length>0);
 if(ledger.schemaVersion!==1||!['bun','go','python'].includes(ledger.consumer)||!ledger.scope||!/^https:\/\/github\.com\/rcarmo\//.test(ledger.source?.repository??'')||!/^[a-f0-9]{40}$/.test(ledger.source?.revision??'')||!Array.isArray(ledger.mappings)||ledger.declarationCount!==ledger.mappings.length)throw Error('Invalid consumer mapping snapshot');
 const nativeIds=new Set<string>();
 for(const row of ledger.mappings){
  if(typeof row.nativeId!=='string'||!row.nativeId||nativeIds.has(row.nativeId)||!safe(row.path)||!/^\w/.test(row.path)||!/^[a-f0-9]{64}$/.test(row.sourceSha256??''))throw Error('Invalid or duplicate native test identity');
  nativeIds.add(row.nativeId);
  if(!['partial','mapped','unmapped'].includes(row.coverage)||row.executionCredit!==false||!Array.isArray(row.scenarioIds)||new Set(row.scenarioIds).size!==row.scenarioIds.length||row.scenarioIds.some((id:string)=>!scenarioIds.has(id))||!textList(row.verifiedAspects)||!textList(row.gaps))throw Error('Invalid mapping state or scenario');
  if(row.coverage==='unmapped'&&(row.scenarioIds.length||row.verifiedAspects.length)||row.coverage!=='unmapped'&&(!row.scenarioIds.length||!row.verifiedAspects.length)||row.coverage!=='mapped'&&!row.gaps.length||row.coverage==='mapped'&&row.gaps.length)throw Error('Mapping scope must record gaps without implicit credit');
 }
}
export function validateConsumerMappingSets(ledgers:any[],scenarioIds:Set<string>){
 const nativeIds=new Set<string>(),sourceHashes=new Map<string,string>();
 for(const ledger of ledgers){
  validateConsumerMappings(ledger,scenarioIds);
  for(const row of ledger.mappings){
   const nativeKey=JSON.stringify([ledger.consumer,row.nativeId]);
   if(nativeIds.has(nativeKey))throw Error('Overlapping native declaration: '+row.nativeId);nativeIds.add(nativeKey);
   const sourceKey=JSON.stringify([ledger.source.repository,ledger.source.revision,row.path]);
   if(sourceHashes.has(sourceKey)&&sourceHashes.get(sourceKey)!==row.sourceSha256)throw Error('Conflicting source hash: '+row.path);
   sourceHashes.set(sourceKey,row.sourceSha256);
  }
 }
}
export function validateWorkflowRegistration(paths:string[],ledger:{features:string[]},manifest:{files:Array<{path:string;role:string}>}){
 const actual=new Set(paths),registered=new Set(ledger.features),assets=manifest.files.filter(f=>f.role==='workflow');
 if(actual.size!==paths.length||registered.size!==ledger.features.length||new Set(assets.map(f=>f.path)).size!==assets.length)throw Error('Duplicate workflow registration');
 for(const path of actual){if(!registered.has(path))throw Error('Unregistered workflow: '+path);if(!assets.some(f=>f.path===path))throw Error('Unsealed workflow: '+path);}
 for(const path of registered)if(!actual.has(path))throw Error('Missing workflow: '+path);
 for(const asset of assets)if(!actual.has(asset.path))throw Error('Missing workflow asset: '+asset.path);
}
export async function verify(base=root){
 const manifest=await Bun.file(join(base,'manifest.json')).json();const seen=new Set<string>(),hashes=new Set<string>(),assetIds=new Set<string>(),aliases=new Set<string>();
 validateFixtureLayout(manifest);
 for(const f of manifest.files){
  if(!safe(f.path)||seen.has(f.path)||hashes.has(f.sha256)||assetIds.has(f.id))throw Error('Duplicate asset path, hash or ID');
  seen.add(f.path);hashes.add(f.sha256);assetIds.add(f.id);
  const bytes=await Bun.file(join(base,f.path)).bytes();if(bytes.length!==f.bytes||hash(bytes)!==f.sha256)throw Error('Asset drift: '+f.path);
  if(!f.origins?.length)throw Error('Missing provenance');
  for(const origin of f.origins){
   if(origin.kind!=='derived-from')continue;
   const source=manifest.files.find((a:any)=>a.id===origin.assetId);
   if(!source||source.sha256!==origin.sha256||!origin.transformation||!source.origins.some((o:any)=>o.repository===origin.repository&&o.revision===origin.revision&&o.path===origin.path))throw Error('Derived fixture source provenance drift');
  }
  for(const alias of f.aliases){if(aliases.has(alias))throw Error('Duplicate alias');aliases.add(alias);}
 }
 for(const dir of ['fixtures','notices'])for await(const path of new Bun.Glob('**/*').scan({cwd:join(base,dir),onlyFiles:true}))if(!seen.has(dir+'/'+path))throw Error('Unpinned asset '+path);
 for await(const path of new Bun.Glob('**/*').scan({cwd:base,onlyFiles:true,dot:false}))if(!path.startsWith('node_modules/')&&/\.(docx|pptx|xlsx|png|jpg|jpeg|zip)$/i.test(path)&&!path.startsWith('fixtures/'))throw Error('Fixture outside single fixtures root: '+path);
 const contract=await Bun.file(join(base,'contracts/mutation-safety.json')).json();
 validateMutationContract(contract,manifest);
 const mutationCases=(await Promise.all(contract.features.map(async(path:string)=>{
  const selected=cases(path,await Bun.file(join(base,path)).text()).filter(c=>contract.scenarioIds.includes(c.scenarioId));
  if(!selected.length)throw Error('Mutation feature has no selected scenarios');return selected;
 }))).flat();
 if(mutationCases.length!==contract.expandedCaseCount||JSON.stringify([...new Set(mutationCases.map(c=>c.scenarioId))].sort())!==JSON.stringify([...contract.scenarioIds].sort()))throw Error('Mutation scenario identity/count drift');
 for(const c of mutationCases){
  const fixture=c.steps.find(s=>/^fixture "/.test(s.text))?.text.match(/^fixture "([^"]+)" verified against the fixture manifest$/)?.[1];
  if(!contract.fixtures.some((f:any)=>f.id===fixture))throw Error('Unknown workflow fixture');
  for(const step of c.steps){const rows=step.argument?.dataTable?.rows;if(!rows)continue;
   if(JSON.stringify(rows[0]?.cells.map((cell:any)=>cell.value))!==JSON.stringify(['target','value_json']))throw Error('Invalid mutation table');
   for(const row of rows.slice(1)){if(row.cells.length!==2||!row.cells[0]?.value)throw Error('Invalid mutation row');const value=JSON.parse(row.cells[1]!.value);if(!(value===null||typeof value==='string'||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value)))throw Error('Invalid typed mutation value');}
  }
 }
 const forbidden=/\.(py|pyi|go|cs|java|rs|swift)$/i;
 for await(const path of new Bun.Glob('**/*').scan({cwd:base,onlyFiles:true,dot:false}))if(!path.startsWith('node_modules/')&&forbidden.test(path))throw Error('External implementation source is not a reference asset: '+path);
 const evidence=await Bun.file(join(base,'facts/evidence.json')).json(),eids=new Set(evidence.items.map((e:any)=>e.id));
 const factIds=new Set<string>();for(const group of ['content-types','namespaces','relationships','constants']){const facts=await Bun.file(join(base,'facts',group+'.json')).json();for(const f of facts.values){if(factIds.has(f.id)||!f.value||!['observed','specified','disputed'].includes(f.status)||!f.evidence.length||f.evidence.some((id:string)=>!eids.has(id)))throw Error('Invalid fact '+f.id);factIds.add(f.id);}}
 const ledger=await Bun.file(join(base,'ledgers/workflows.json')).json();const actual=[];const definitions=new Set<string>();
 const workflowPaths=await Array.fromAsync(new Bun.Glob('workflows/**/*.feature').scan({cwd:base,onlyFiles:true}));
 validateWorkflowRegistration(workflowPaths,ledger,manifest);
 if(new Set(ledger.features).size!==ledger.features.length)throw Error('Duplicate feature path');
 for(const path of ledger.features){
  if(!safe(path))throw Error('Unsafe feature path');
  validateWorkflowPath(path);
  const text=await Bun.file(join(base,path)).text(),compiled=cases(path,text);
  for(const id of new Set(compiled.map(c=>c.scenarioId))){if(definitions.has(id))throw Error('Scenario defined in multiple features');definitions.add(id);}
  for(const c of compiled)actual.push({...c,path});
 }
 const ids=[...new Set(actual.map(c=>c.scenarioId))].sort();if(JSON.stringify(ids)!==JSON.stringify(ledger.workflows.map((w:any)=>w.id).sort()))throw Error('Workflow ledger scenario drift');
 for(const w of ledger.workflows){if(w.expandedCases!==actual.filter(c=>c.scenarioId===w.id).length||!w.expectedOutcomes?.length||w.factIds.some((id:string)=>!factIds.has(id)))throw Error('Incomplete workflow '+w.id);}
 validateWorkflowOwnership(ledger,actual,contract);
 const consumerLedgers=[];
 for await(const path of new Bun.Glob('ledgers/consumers/*.json').scan({cwd:base,onlyFiles:true}))consumerLedgers.push(await Bun.file(join(base,path)).json());
 validateConsumerMappingSets(consumerLedgers,new Set(ids));
 const groups=await Bun.file(join(base,'ledgers/fixture-groups.json')).json(),groupKeys=new Set<string>(),groupedIds=new Set<string>();
 for(const group of groups.groups){
  const key=group.format+'/'+group.scenarioGroup;if(groupKeys.has(key)||!group.fixtureIds?.length)throw Error('Duplicate or empty fixture group');groupKeys.add(key);
  const scenarioLinks=new Set<string>();
  for(const id of group.fixtureIds){const fixture=manifest.files.find((f:any)=>f.id===id&&f.role==='fixture');if(!fixture||groupedIds.has(id)||fixture.format!==group.format||fixture.scenarioGroup!==group.scenarioGroup)throw Error('Invalid fixture group membership');groupedIds.add(id);for(const scenarioId of fixture.scenarioIds){if(!ids.includes(scenarioId))throw Error('Unknown fixture scenario link');scenarioLinks.add(scenarioId);}}
  if(JSON.stringify([...scenarioLinks].sort())!==JSON.stringify([...group.scenarioIds].sort()))throw Error('Fixture group scenario links differ');
 }
 if(groupedIds.size!==manifest.files.filter((f:any)=>f.role==='fixture').length)throw Error('Ungrouped fixture');
 await verifyFixtureContents(base,manifest);
 await verifyObservedGeneratedRetirement(base,manifest);
 const specifications=await verifySpecifications(base,manifest);
 await verifyFeatureCatalogue(base);
 console.log(`Verified ${specifications.documents} specification documents and ${specifications.testSourceVariants} test-source variants`);
 console.log(`Verified ${seen.size} assets, ${factIds.size} facts, ${ids.length} workflows / ${actual.length} cases`);
 return {assets:seen.size,facts:factIds.size,workflows:ids.length,cases:actual.length};
}
if(import.meta.main)await verify();
