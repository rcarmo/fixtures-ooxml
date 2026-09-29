import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/tables.feature',fixture='fixture-8192955ef935f09eb61a9fe6805d4996c811efcf54c0c966f52d983e38e0a79c';
const specs=[
 {id:'@id-docx-table-create-roundtrip',steps:[['DOCX table source "new-document" is prepared','DOCX table 2x2 is appended','DOCX table 1 cell (0,0) text is set to "  <Alpha & Beta>  "','DOCX table 1 cell (1,1) text is set to "line 1\\r\\nline 2"','DOCX table document is saved and reopened','DOCX table 1 has 2 rows and 2 columns','DOCX table 1 cell (0,0) text equals "  <Alpha & Beta>  "','DOCX table 1 cell (1,1) text equals "line 1\\nline 2"','DOCX table 1 is stored before the section properties','DOCX table 1 cell (0,0) XML preserves boundary spaces and escapes special characters']],outcomes:5,markers:['all ten exact','normalized newline','saved and reopened']},
 {id:'@id-docx-table-opaque-preserve',steps:[[ `DOCX table source "${fixture}" is prepared`,'DOCX table opaque part "docProps/core.xml" bytes are remembered','DOCX table 1 cell (1,0) text is set to "Voltaic battery"','DOCX table document is saved and reopened','DOCX table 1 has 4 rows and 3 columns','DOCX table 1 cell (1,0) text equals "Voltaic battery"','DOCX table opaque part "docProps/core.xml" bytes are unchanged']],outcomes:3,markers:['all seven exact','docProps/core.xml','save/reopen']},
 {id:'@id-docx-table-stale-cell',steps:[['DOCX table source "new-document" is prepared','DOCX table 1x1 is appended','DOCX table 1 cell (0,0) is remembered','DOCX table 1x1 is appended','DOCX table current saved bytes are remembered','DOCX table stale text set to "stale write" is attempted on the remembered cell','DOCX table refusal code equals "docx-stale-table-cell"','DOCX table saved bytes equal the remembered bytes']],outcomes:2,markers:['all eight exact','docx-stale-table-cell','baseline']},
 {id:'@id-docx-table-atomic-refusals',steps:[`${fixture}|row-oob|range`,'native-merged-nested|merged-cell|docx-table-merged-cell','native-merged-nested|nested-cell|docx-table-cell-unsupported','synthetic-grid-before|bizarre|docx-table-unsupported'].map(line=>{const [source,name,code]=line.split('|');return [`DOCX table source "${source}" is prepared`,'DOCX table current saved bytes are remembered',`DOCX table refusal "${name}" is attempted`,`DOCX table refusal code equals "${code}"`,'DOCX table saved bytes equal the remembered bytes']}),outcomes:0,markers:['four exact five-step','RangeError','baseline bytes']},
];
test('Bun executes seven exact DOCX table authoring cases without Go or Python credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','a3d7f069e7ecf44e7ad856140419ab762a525629:ledgers/workflows.json']).toString());
 const rows=cases(path,await Bun.file(path).text());
 for(const {id,steps,outcomes,markers} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(steps.length);
  expect(rows.filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual(steps);
  if(outcomes)expect(current.expectedOutcomes).toEqual(steps[0]!.slice(-outcomes));
  else expect(current.expectedOutcomes).toEqual([...new Set(steps.flatMap(row=>row.slice(-2)))]);
  expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
  expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
  for(const marker of [...markers,'7d5f43dc8ed1edf8109294f5ba6ca8d59c23990e','Fresh GitHub recursive make check','732/732','canonical table'])expect(current.consumers.bun.evidence).toContain(marker);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-direct-font-size-half-points']);expect(ledger.workflows.filter((w:any)=>!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.has(w.id)));
});
