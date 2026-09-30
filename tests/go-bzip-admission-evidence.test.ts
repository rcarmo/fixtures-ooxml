import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only one four-step BZIP2 package admission refusal', async () => {
 const id='@id-package-admission-unsupported-compression';
 const feature='workflows/package/zip-admission.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','9ab305c15a740a0422b226b41d1fecc328fa8408:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('ZIP admission refuses BZIP2 member compression');
 const steps=[
  'a ZIP_BZIP2 archive contains a.xml with UTF-8 text <a/>',
  'the package admission guard checks the archive with default limits',
  'package admission is refused',
  'the admission error contains compression',
 ];
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual(steps);
 expect(now.expectedOutcomes).toEqual(steps.slice(-2));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['7e65f6ec3964dbd08dddae068de3e5dff79fcd12','shared v0.139.0','acceptance/{acceptance,inventory,bzip_admission}_test.go','reports/batches/286.md','ZIP_BZIP2 method-12 a.xml payload <a/>','428 cases/1483 executed steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!==id));
});
