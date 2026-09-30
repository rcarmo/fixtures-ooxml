import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits five exact unsafe ZIP member refusal rows',async()=>{
 const id='@id-package-admission-unsafe-members',feature='workflows/package/zip-admission.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','fbbfb1964d8181f56b11093c4d83514e072121b5:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(5);expect(selected).toHaveLength(5);
 const rows:[string,string][]= [
  ['duplicate member names','[["a.xml","<a/>"],["a.xml","<b/>"]]'],
  ['parent traversal name','[["../a.xml","<a/>"]]'],
  ['absolute member name','[["/a.xml","<a/>"]]'],
  ['backslash member name',JSON.stringify([['x\\a.xml','<a/>']])],
  ['directory entry with bytes','[["a/","payload"]]'],
 ];
 for(let i=0;i<rows.length;i++){
  const [label,json]=rows[i]!,row=selected[i]!;
  expect(row.name).toBe(`ZIP admission refuses ${label}`);
  expect(row.steps.map((s:any)=>s.text)).toEqual([
   `an ordered ZIP_STORED archive has member pairs encoded as JSON ${json}`,
   'the package admission guard checks the archive with default limits',
   'package admission is refused',
  ]);
 }
 expect(now.expectedOutcomes).toEqual(['package admission is refused']);
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['e28ecd210437edf2d6ffcbf889740ee2de397ffa','shared v0.140.0','acceptance/{acceptance,bzip_admission,inventory,unsafe_members}_test.go','reports/batches/287.md','pkg/packaging/package.go','433 cases/1498 executed steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 expect(ledger.workflows.filter((w:any)=>w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!==id));
});
