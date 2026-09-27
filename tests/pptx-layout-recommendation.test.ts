import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';

const feature='workflows/pptx/layout-recommendation.feature';
const fixture='fixture-c54a7b746c0328fc1930525edd91387eedbbca69a6f388f7ec024150187b6bab';
const rankings={
 title:['[0,"Title Slide","title_slide",2]','[[2,"Section Header","section_header",1],[1,"Title and Content","title_and_content",0],[3,"Two Content","two_content",0]]'],
 bullets:['[1,"Title and Content","title_and_content",2]','[[9,"Title and Vertical Text","title_and_vertical_text",1],[10,"Vertical Title and Text","title_and_vertical_text",1],[0,"Title Slide","title_slide",0]]'],
 table:['[1,"Title and Content","title_and_content",3]','[[5,"Title Only","title_only",2],[6,"Blank","blank",1],[0,"Title Slide","title_slide",0]]'],
 comparison:['[4,"Comparison","comparison",2]','[[3,"Two Content","two_content",1],[0,"Title Slide","title_slide",0],[1,"Title and Content","title_and_content",0]]'],
 blank:['[6,"Blank","blank",2]','[[5,"Title Only","title_only",1],[0,"Title Slide","title_slide",0],[1,"Title and Content","title_and_content",0]]'],
};
test('five disjoint layout inputs retain literal ranking, alternatives and source custody',async()=>{
 const text=await Bun.file(feature).text(),rows=cases(feature,text),m=await Bun.file('manifest.json').json(),registry=await Bun.file('ledgers/workflows.json').json();
 const source=m.files.find((f:any)=>f.id===fixture);expect(source.path).toBe('fixtures/pptx/creation/default-c54a7b746c03.pptx');expect(source.sha256).toBe(fixture.slice('fixture-'.length));
 const ranked=rows.filter(r=>r.scenarioId==='@id-pptx-layout-recommendation-ranked');expect(ranked).toHaveLength(5);
 for(const [type,[recommendation,alternatives]] of Object.entries(rankings)){
  const row=ranked.find(r=>r.name===`Recommend an existing layout for ${type} with exact ranking`);expect(row).toBeDefined();
  const steps=row!.steps.map(s=>s.text);expect(steps).toContain(`fixture ${fixture} is an unchanged PPTX with eleven layouts in presentation order`);
  expect(steps).toContain(`the result's content_type equals "${type}"`);
  expect(steps).toContain(`its recommended index, name, classification and score equal ${recommendation}`);
  expect(steps).toContain(`its first three alternatives equal ${alternatives} in order, including zero-score ties`);
  expect(steps).toContain('its next_tools list equals ["pptx_add_slide"]');
  expect(steps).toContain('the source archive bytes and every member payload still equal the sealed input');
 }
 const refusal=rows.filter(r=>r.scenarioId==='@id-pptx-layout-recommendation-missing-file');expect(refusal).toHaveLength(1);
 expect(refusal[0]!.steps.map(s=>s.text)).toContain('the result reports File not found with the exact absent path');
 expect(refusal[0]!.steps.map(s=>s.text)).toContain("no output archive is created and the sealed presentation's archive bytes remain unchanged");
 for(const id of ['@id-pptx-layout-recommendation-ranked','@id-pptx-layout-recommendation-missing-file']){
  const entry=registry.workflows.find((w:any)=>w.id===id);expect(entry.feature).toBe(feature);
  expect(Object.values(entry.consumers).every((v:any)=>v.status==='planned')).toBe(true);
 }
});
