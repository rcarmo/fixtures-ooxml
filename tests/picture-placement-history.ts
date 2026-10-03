import {beforePictureCropLedger,beforePictureCropFeature} from './picture-crop-history.ts';
import {registerWorkflow} from '../scripts/register-workflow.ts';
import recipe from '../ledgers/pptx-picture-placement.json';
import manifest from '../manifest.json';
const feature=recipe.feature,text=await Bun.file(new URL('../'+feature,import.meta.url)).text();
const asset=manifest.files.find(f=>f.path===feature);
if(!asset||new Bun.CryptoHasher('sha256').update(text).digest('hex')!==asset.sha256)throw Error('Unreviewed picture placement feature');
const added=registerWorkflow(feature,text,{files:[]},{features:[],workflows:[]}).ledger.workflows;
/** Remove this exact planned additive layer only for historical ledger comparisons. */
export function beforePicturePlacementLedger(ledger:any){
 const copy=beforePictureCropLedger(ledger),rows=copy.workflows.filter((r:any)=>added.some(a=>a.id===r.id));
 if(!rows.length&&!copy.features.includes(feature))return copy;
 if(copy.features.filter((p:string)=>p===feature).length!==1||JSON.stringify(rows)!==JSON.stringify(added))throw Error('Unreviewed picture placement ledger');
 copy.features=copy.features.filter((p:string)=>p!==feature);copy.workflows=copy.workflows.filter((r:any)=>!added.some(a=>a.id===r.id));return copy;
}
export function beforePicturePlacementFeature(path:string,value:string):string{
 value=beforePictureCropFeature(path,value);
 if(path!==feature)return value;
 if(value!==text)throw Error('Unreviewed picture placement feature');return '';
}
