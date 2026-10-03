import {beforeOpacityLedger,beforeOpacityFeature} from './opacity-history.ts';
import {registerWorkflow} from '../scripts/register-workflow.ts';
import recipe from '../ledgers/pptx-gradients.json';
import manifest from '../manifest.json';
const feature=recipe.feature,text=await Bun.file(new URL('../'+feature,import.meta.url)).text();
const asset=manifest.files.find(f=>f.path===feature);
if(!asset||new Bun.CryptoHasher('sha256').update(text).digest('hex')!==asset.sha256)throw Error('Unreviewed gradients feature');
const added=registerWorkflow(feature,text,{files:[]},{features:[],workflows:[]}).ledger.workflows;
/** Remove this exact planned additive layer only for historical ledger comparisons. */
export function beforeGradientsLedger(ledger:any){
 const copy=beforeOpacityLedger(ledger),rows=copy.workflows.filter((r:any)=>added.some(a=>a.id===r.id));
 if(!rows.length&&!copy.features.includes(feature))return copy;
 if(copy.features.filter((p:string)=>p===feature).length!==1||JSON.stringify(rows)!==JSON.stringify(added))throw Error('Unreviewed gradients ledger');
 copy.features=copy.features.filter((p:string)=>p!==feature);copy.workflows=copy.workflows.filter((r:any)=>!added.some(a=>a.id===r.id));return copy;
}
export function beforeGradientsFeature(path:string,value:string):string{
 value=beforeOpacityFeature(path,value);
 if(path!==feature)return value;
 if(value!==text)throw Error('Unreviewed gradients feature');return '';
}
