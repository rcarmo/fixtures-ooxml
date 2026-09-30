import {beforeXmlGeneralizationCase, beforeXmlGeneralizationTags} from './xml-generalization-helpers.ts';
import portable from '../ledgers/runtime-wording-migration.json';
import packages from '../ledgers/package-wording-migration.json';
import word from '../ledgers/word-wording-migration.json';
import xmlFormula from '../ledgers/xml-formula-wording-migration.json';
import commentTemplate from '../ledgers/comment-template-wording-migration.json';
const files=[...portable.files,...packages.files,...word.files,...xmlFormula.files,...commentTemplate.files];
/** Undo only the reviewed exact wording substitutions for historical fingerprints.
 * This is test-only provenance comparison, never a consumer binding fallback. */
export function beforeWordingCase<T extends {scenarioId:string;steps:{text:string;argument:unknown}[]}>(row:T):T{
 const historical = beforeXmlGeneralizationCase(row);
 const edits=files.flatMap(f=>f.stepRenames).filter(e=>e.id===historical.scenarioId);
 return {...historical,steps:historical.steps.map(s=>({...s,text:edits.find(e=>e.to===s.text)?.from??s.text}))};
}
export function beforeWordingTags(id:string,tags:string[]):string[]{
 tags = beforeXmlGeneralizationTags(id, tags);
 const record=files.flatMap(f=>f.scenarios).find(r=>r.id===id);
 if(!record)return tags;
 const index=record.afterTags.findIndex(t=>JSON.stringify(t)===JSON.stringify(tags));
 return index<0?tags:record.beforeTags[index]!;
}
