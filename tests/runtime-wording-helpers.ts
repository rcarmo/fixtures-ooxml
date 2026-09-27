import migration from '../ledgers/runtime-wording-migration.json';
/** Undo only the reviewed exact wording substitutions for historical fingerprints.
 * This is test-only provenance comparison, never a consumer binding fallback. */
export function beforeWordingCase<T extends {scenarioId:string;steps:{text:string;argument:unknown}[]}>(row:T):T{
 const edits=migration.files.flatMap(f=>f.stepRenames).filter(e=>e.id===row.scenarioId);
 return {...row,steps:row.steps.map(s=>({...s,text:edits.find(e=>e.to===s.text)?.from??s.text}))};
}
export function beforeWordingTags(id:string,tags:string[]):string[]{
 const record=migration.files.flatMap(f=>f.scenarios).find(r=>r.id===id);
 if(!record)return tags;
 const index=record.afterTags.findIndex(t=>JSON.stringify(t)===JSON.stringify(tags));
 return index<0?tags:record.beforeTags[index]!;
}
