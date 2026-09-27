import {cases} from '../scripts/verify.ts';
/** Resolve a historical source through scenario IDs, even after a feature is split. */
export async function sourceCases(path:string,source:string=path){
 const old=await Bun.file('ledgers/feature-consolidation.json').json(),layout=await Bun.file('ledgers/workflow-layout-migration.json').json();
 const record=old.groups.flatMap((g:any)=>g.sources).find((s:any)=>s.path===source);
 const ids:string[]=record?[...new Set<string>(record.cases.map((c:any)=>c.scenarioId))]:layout.scenarios.filter((s:any)=>s.from===source).map((s:any)=>s.id);
 if(!ids.length)throw Error('Missing migration source: '+source);
 const rows=[];
 for(const id of ids){const current=layout.scenarios.find((s:any)=>s.id===id);if(!current)throw Error('Missing migrated identity: '+id);rows.push(...cases(current.to,await Bun.file(current.to).text()).filter(c=>c.scenarioId===id));}
 return rows;
}
