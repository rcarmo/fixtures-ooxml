const positiveIds = new Set(["@id-zip-read-valid","@id-zip-write-deterministic"]);
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-docx-direct-font-size-half-points',path='workflows/docx/font-size.feature';
const steps=['a new Word document with one body paragraph and one run containing "Size sample"',"that run's direct font size is set to 10.5 points",'the Word document is saved and reopened','the paragraph text is "Size sample"','the run has exactly one direct WordprocessingML w:sz element with w:val "21"',"the reopened run's direct font size is 10.5 points"];
test('Bun executes exact saved half-point direct font size without Go, Python or rendering credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','39f6fd8b7e77273fd310ee56e217b15130a939c2:ledgers/workflows.json']).toString());
 const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 expect(current.feature).toBe(path);expect(current.expandedCases).toBe(1);
 expect(cases(path,await Bun.file(path).text()).filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual([steps]);
 expect(current.expectedOutcomes).toEqual(steps.slice(-3));
 expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
 for(const marker of ['fd658221d642f99b36e707263a5a218521712ab0','shared v0.74.0','exact six-step','saved/reopened','exactly one w:sz','w:val 21','10.5 points','tests/unit/docx-font-size.test.ts','Fresh GitHub recursive make check','732/732'])expect(current.consumers.bun.evidence).toContain(marker);
 expect(old.consumers.go.status).toBe('planned');expect(current.consumers.go.status).toBe('implemented');
 for(const marker of ['3a9c5aafbff9a8864ed7ecfd603d500080c7bbd2','shared v0.75.0','acceptance/direct_font_size_test.go','exactly one namespaced direct w:sz','350 selected cases/1199 steps/0 failures/0 skips','reports/batches/204.md','Fresh post-push GitHub recursive test-batch'])expect(current.consumers.go.evidence).toContain(marker);
 expect(current.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 const laterIds=new Set(['@id-xml-parse-offsets','@id-xml-normalise-line-endings','@id-xml-parse-refusals','@id-xml-parse-bounds','@id-xml-apply-edits','@id-xml-entity-values','@id-xml-stylesheet-processing-instruction','@id-xml-expanded-attribute-lookup','@id-xml-implicit-xml-prefix','@id-xml-prototype-safe-attributes','@id-xml-immutable-namespace-metadata','@id-xml-escaping-values','@id-xml-escaping-invalid-character','@id-xml-escaping-whitespace-roundtrip','@id-xml-typed-parse-error','@id-xml-invalid-qname-components','@id-xml-unicode-qname-components','@id-xml-outside-root-nbsp','@id-xml-comparison-prefix-and-opc-order','@id-xml-comparison-significant-content','@id-xml-comparison-prefix-attribute-binding','@id-xml-comparison-unsafe-input','@id-xml-comparison-processing-instructions-and-comments','@id-package-admission-unsafe-members','@id-package-admission-resource-limits','@id-package-admission-unsupported-compression','@id-package-admission-unsafe-xml-members','@id-package-diff-equivalent-xml-and-binary-changes','@id-zip-crc32-standard-vector','@id-bun-zip32-reader-refusal','@id-bun-zip32-writer-refusal','@id-bun-zip32-configured-bounds']);expect(ledger.workflows.filter((w:any)=>!positiveIds.has(w.id)&&w.id!==id&&!laterIds.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!positiveIds.has(w.id)&&w.id!==id&&!laterIds.has(w.id)));
});
