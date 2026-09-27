import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';

const path='workflows/pptx/notes.feature';
const id='@id-pptx-notes-collection-read';
const fixture='fixture-c54a7b746c0328fc1930525edd91387eedbbca69a6f388f7ec024150187b6bab';
test('two notes input variants share exact aggregate, per-slide, refusal and immutable-source outcomes',async()=>{
 const text=await Bun.file(path).text(),rows=cases(path,text),selected=rows.filter(r=>r.scenarioId===id),m=await Bun.file('manifest.json').json(),l=await Bun.file('ledgers/workflows.json').json();
 expect(selected.map(r=>r.name)).toEqual(['Read three notes and one absent note from a untitled four-slide presentation','Read three notes and one absent note from a titled four-slide presentation']);
 expect(m.files.find((a:any)=>a.id===fixture)?.path).toBe('fixtures/pptx/creation/default-c54a7b746c03.pptx');
 for(const [i,row] of selected.entries()){
  const s=row.steps.map(x=>x.text);expect(s).toContain(`the sealed blank presentation ${fixture} has no slides`);
  expect(s).toContain(`the four slide title placeholders contain ${i===0?'["","","",""]':'["Slide 1","Slide 2","Slide 3","Slide 4"]'}; slide 4 has no notes slide or notes relationship`);
  expect(s).toContain('the all-slide result equals {"file":"notes-collection.pptx","slides_with_notes":3,"total_slides":4,"notes":[{"slide_number":1,"notes":"Notes for slide 1"},{"slide_number":2,"notes":"Notes for slide 2"},{"slide_number":3,"notes":"Notes for slide 3"}]}');
  expect(s).toContain('slide 4 returns {"file":"notes-collection.pptx","slide_number":4,"has_notes":false,"notes":""}');
  expect(s).toContain('slides 0 and 5 return exactly "Slide 0 not found. Presentation has 4 slides." and "Slide 5 not found. Presentation has 4 slides." as errors');
  expect(s).toContain('after every read or refusal the authored source archive SHA-256, bytes, every member payload and relationship equal the recorded values');
  expect(s).toContain('no slide-4 notes part or slide-4 notes relationship has been created');
 }
 const profile=l.workflows.find((w:any)=>w.id===id),ordered=l.workflows.find((w:any)=>w.id==='@id-pptx-order-notes-read');expect(profile.feature).toBe(path);expect(profile.expandedCases).toBe(2);expect(Object.values(profile.consumers).every((v:any)=>v.status==='planned')).toBe(true);expect(ordered.feature).toBe(path);expect(ordered.id).not.toBe(profile.id);
});
