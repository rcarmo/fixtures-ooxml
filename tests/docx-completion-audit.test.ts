import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';
const path='workflows/docx/completion-audit.feature',fixture='fixture-b051c0c2ff43f2ab9213e19a52ccbc51217537cf3b336d54a68a91beb6670f9a';
test('two complete-input variants keep observed READY/95 and empty Document Start, not fictitious perfection',async()=>{
 const rows=cases(path,await Bun.file(path).text()),m=await Bun.file('manifest.json').json(),l=await Bun.file('ledgers/workflows.json').json();
 expect(m.files.find((a:any)=>a.id===fixture)?.path).toBe('fixtures/docx/creation/default-b051c0c2ff43.docx');
 const complete=rows.filter(r=>r.scenarioId==='@id-docx-audit-completion-read');expect(complete).toHaveLength(2);
 for(const [name,heading,body] of [['deep','Complete Project','All content is filled in properly.'],['workflow','Document','Complete content without placeholders']]){
  const row=complete.find(r=>r.name===`Audit a ${name} completed document with its observed empty-start issue`);expect(row).toBeDefined();
  const s=row!.steps.map(x=>x.text);expect(s).toContain(`a separate temporary copy contains Heading 1 "${heading}" and a Normal paragraph "${body}"`);
  expect(s).toContain('its status is READY, score is 95, recommendation is "Document appears complete and ready for review."');
  expect(s).toContain('its summary equals {"placeholders_found":0,"empty_sections":1,"empty_table_cells":0,"instruction_remnants":0,"pending_changes":false}');
  expect(s).toContain('its issues equal {"placeholders":[],"empty_sections":["Document Start"],"empty_table_cells":[],"instruction_remnants":[],"pending_track_changes":false}');
  expect(s).toContain('the authored archive SHA-256, full bytes, every member payload and relationships remain unchanged');
 }
 const control=rows.find(r=>r.scenarioId==='@id-docx-audit-completion-placeholders')!;expect(control.steps.map(x=>x.text)).toContain('its file equals the exact authored input path, success is true, status is NEEDS_REVIEW and score is 85');expect(control.steps.map(x=>x.text)).toContain('its ordered placeholder issues are <Name> in Heading 1 context "Project: <Name>" and [TBD] in paragraph context "Customer: [TBD]", both located in "Project: <Name>"');
 const refusal=rows.find(r=>r.scenarioId==='@id-docx-audit-completion-missing-file')!;expect(refusal.steps.map(x=>x.text)).toContain('the result equals {"error":"File not found: <exact absent path>"}');
 for(const [id,count] of [['@id-docx-audit-completion-read',2],['@id-docx-audit-completion-placeholders',1],['@id-docx-audit-completion-missing-file',1]] as const){const entry=l.workflows.find((w:any)=>w.id===id);expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(count);expect(Object.values(entry.consumers).every((v:any)=>v.status==='planned')).toBe(true);}
});
