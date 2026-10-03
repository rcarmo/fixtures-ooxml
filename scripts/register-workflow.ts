/** Register a new canonical feature, its byte seal and scenario outcomes together. */
import {resolve,join} from 'node:path';
import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';
import {IdGenerator} from '@cucumber/messages';
import {cases,validateWorkflowPath} from './verify.ts';
function seal(path:string,text:string,manifest:any,role:string){
 if(manifest.files.some((f:any)=>f.path===path))throw Error('Asset already registered');
 const bytes=new TextEncoder().encode(text),sha256=new Bun.CryptoHasher('sha256').update(bytes).digest('hex');
 if(manifest.files.some((f:any)=>f.sha256===sha256))throw Error('Duplicate asset content');
 return {...manifest,files:[...manifest.files,{id:'asset-'+sha256,path,bytes:bytes.length,sha256,role,origins:[{repository:'https://github.com/rcarmo/fixtures-ooxml',path,basis:'Project-owned behaviour contract or source assertion mapping'}],aliases:[]}]};
}
export function registerAsset(path:string,text:string,manifest:any){
 const role=/^contracts\/[A-Za-z0-9_-]+\.md$/.test(path)?'workflow-contract':/^ledgers\/consumers\/[A-Za-z0-9_-]+\.json$/.test(path)?'consumer-mapping':/^ledgers\/[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(path)?'workflow-recipe':null;
 if(!role)throw Error('Invalid supporting asset path');
 return seal(path,text,manifest,role);
}
export function registerWorkflow(path:string,text:string,manifest:any,ledger:any){
 validateWorkflowPath(path);
 const rows=cases(path,text),ids=[...new Set(rows.map(c=>c.scenarioId))];
 if(ledger.features.includes(path)||manifest.files.some((f:any)=>f.path===path))throw Error('Workflow already registered');
 if(ids.some(id=>ledger.workflows.some((w:any)=>w.id===id)))throw Error('Duplicate canonical scenario');
 const gen=IdGenerator.incrementing(),doc=new Parser(new AstBuilder(gen),new GherkinClassicTokenMatcher()).parse(text),pickles=compile(doc,path,gen);
 if(pickles.some(p=>!p.tags.some(t=>t.name==='@planned')||p.tags.some(t=>['@implemented','@bound'].includes(t.name))))throw Error('New registrations must be planned');
 const inspect=(children:any[])=>{for(const c of children){if(c.rule)inspect(c.rule.children);if(c.scenario&&!ids.includes(c.scenario.tags.find((t:any)=>t.name.startsWith('@id-'))?.name))throw Error('Refuse unexpanded scenario definition');}};
 inspect(doc.feature?.children??[]);
 const workflows=ids.map(id=>{const selected=pickles.filter(p=>p.tags.some(t=>t.name===id)),outcomes=[...new Set(selected.flatMap(p=>p.steps.filter(s=>s.type==='Outcome').map(s=>s.text)))];if(!outcomes.length)throw Error('Missing concrete Then outcome: '+id);return {id,feature:path,expandedCases:selected.length,factIds:[],expectedOutcomes:outcomes,consumers:Object.fromEntries(['bun','go','python'].map(c=>[c,{status:'planned',evidence:'Native execution binding pending'}]))};});
 return {manifest:seal(path,text,manifest,'workflow'),ledger:{...ledger,features:[...ledger.features,path],workflows:[...ledger.workflows,...workflows]}};
}
if(import.meta.main){
 const root=resolve(import.meta.dir,'..');let manifest=await Bun.file(join(root,'manifest.json')).json(),ledger=await Bun.file(join(root,'ledgers/workflows.json')).json();
 const paths=process.argv.slice(2);if(!paths.length)throw Error('Usage: bun scripts/register-workflow.ts workflows/<family>/<name>.feature [contracts/<name>.md ledgers/<recipe>.json ledgers/consumers/<name>.json ...]');
 for(const path of paths){
  if(path.endsWith('.feature')){const result=registerWorkflow(path,await Bun.file(join(root,path)).text(),manifest,ledger);manifest=result.manifest;ledger=result.ledger;}
  else manifest=registerAsset(path,await Bun.file(join(root,path)).text(),manifest);
 }
 await Bun.write(join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');await Bun.write(join(root,'ledgers/workflows.json'),JSON.stringify(ledger,null,2)+'\n');
 console.log(`Registered ${paths.length} assets; ${ledger.workflows.length} scenarios`);
}
