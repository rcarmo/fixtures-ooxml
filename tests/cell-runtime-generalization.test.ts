import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';
import {beforeXmlGeneralizationCase,historicalXmlFeature} from './xml-generalization-helpers.ts';
test('bounded cell lookup retains every coordinate and adds text/custody controls with no runtime spelling',async()=>{
 const m=await Bun.file('ledgers/cell-runtime-generalization.json').json(),text=await Bun.file(m.path).text();
 expect(m.beforeText).toBe(execFileSync('git',['show',m.sourceRevision+':'+m.path],{encoding:'utf8'}));
 const rows=cases(m.path,text),old=cases(m.path,m.beforeText),row=rows.find(r=>r.scenarioId==='@id-docx-go-table-cell-access')!;
 expect(rows.map(beforeXmlGeneralizationCase)).toEqual(old);expect(historicalXmlFeature(m.path,text)).toBe(m.beforeText);
 expect(row.steps).toHaveLength(4);expect(row.steps[1].argument?.dataTable?.rows.map(r=>r.cells.map(c=>c.value))).toEqual([
 ['row','column','present','text'],['0','0','true','A1'],['0','1','true','B1'],['0','2','true','C1'],['1','0','true','A2'],['1','1','true','B2'],['1','2','true','C2'],['2','0','true','A3'],['2','1','true','B3'],['2','2','true','C3'],['-1','0','false',''],['0','-1','false',''],['3','0','false',''],['0','3','false',''],['3','3','false','']]);
 expect(text).not.toMatch(/return nil|nonnil cell|@profile-nullable-cell-api/);
 expect(m.executionCredit).toBe(false);expect(m.retiredScenarioIds).toEqual([]);
 for(const w of m.afterLedgerRows)expect(Object.values(w.consumers).every((c:any)=>c.status==='planned')).toBe(true);
 const bad=structuredClone(row);bad.steps[1].argument!.dataTable!.rows[1]!.cells[3]!.value='wrong';expect(beforeXmlGeneralizationCase(bad)).toEqual(bad);
 expect(()=>historicalXmlFeature(m.path,text.replace('A1,B1,C1','wrong,B1,C1'))).toThrow('Unreviewed');
});
