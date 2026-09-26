import {cases} from '../scripts/verify.ts';
/** Select scenarios using the original file's migration record, without hiding other cases. */
export async function sourceCases(path:string,source:string){
 const migration=await Bun.file('ledgers/feature-consolidation.json').json();
 const record=migration.groups.find((g:any)=>g.target===path)?.sources.find((s:any)=>s.path===source);
 if(!record)throw Error('Missing consolidation source: '+source);
 const ids=new Set(record.cases.map((c:any)=>c.scenarioId));
 return cases(path,await Bun.file(path).text()).filter(c=>ids.has(c.scenarioId));
}
