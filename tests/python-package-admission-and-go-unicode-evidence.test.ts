import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const previous='32d2a4f5d89f5832f01242bee7a5c8268387e7dd';
const python=[
 ['@id-package-admission-unsafe-members','workflows/package/zip-admission.feature',5,15,'duplicate','Default valid'],
 ['@id-package-admission-resource-limits','workflows/package/zip-admission.feature',4,12,'max_total_bytes=2','threshold 144'],
 ['@id-package-admission-unsupported-compression','workflows/package/zip-admission.feature',1,4,'ZIP_BZIP2','ZIP_DEFLATED'],
 ['@id-package-admission-unsafe-xml-members','workflows/package/xml-member-admission.feature',3,9,'UTF-16LE BOM','DTD'],
 ['@id-package-diff-equivalent-xml-and-binary-changes','workflows/package/semantic-diff.feature',1,7,'counterexample','removed'],
] as const;

test('Python package lane credits only five exact canonical IDs after native controls and three clean gates',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show',`${previous}:ledgers/workflows.json`]).toString());
 for(const[id,feature,count,steps,...markers]of python){
  const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  const rows=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
  expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(count);
  expect(rows).toHaveLength(count);expect(rows.reduce((n:number,c:any)=>n+c.steps.length,0)).toBe(steps);
  expect(old.consumers.python.status).toBe('planned');expect(now.consumers.python.status).toBe('implemented');
  for(const marker of ['b4b3e238b87d2668f68be571799bff0018530fc7','shared v0.113.0','tests/package_admission/{cases,conftest,test_profiles}.py','1,359 tests','14 cases/47 steps','Python CI 36561579079',...markers])expect(now.consumers.python.evidence).toContain(marker);
  expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.go).toEqual(old.consumers.go);
  const unchanged=structuredClone(now);unchanged.consumers.python=old.consumers.python;expect(unchanged).toEqual(old);
 }
 const ids=new Set(python.map(([id])=>id));expect(ledger.workflows.filter((w:any)=>w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-xml-go-element-removal-custody"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-xml-go-attribute-batch-refusal"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xml-go-attribute-splice-custody"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&!ids.has(w.id)&&w.id!=='@id-xml-unicode-qname-components')).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-docx-comments-inspection"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xlsx-styled-blank-cell-editable"&&w.id!=="@id-xml-go-element-replacement-refusal"&&w.id!=="@id-opc-package-transaction-rollback"&&w.id!=="@id-xml-go-element-replacement-custody"&&w.id!=="@id-xml-go-child-namespace-matrix"&&w.id!=="@id-xml-escaping-whitespace-roundtrip"&&w.id!=="@id-xml-go-child-insertion-refusal"&&w.id!=="@id-xml-go-child-insertion-custody"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-element-removal-refusal"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-xml-go-element-removal-custody"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!=="@id-xml-go-attribute-batch-refusal"&&w.id!=="@id-xml-entity-values"&&w.id!=="@id-xml-go-attribute-splice-custody"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&!ids.has(w.id)&&w.id!=='@id-xml-unicode-qname-components'));
});

test('Go Unicode QName credit requires four exact steps and independent UTF-8 source ranges',async()=>{
 const id='@id-xml-unicode-qname-components',feature='workflows/xml/names.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json(),prior=JSON.parse(execFileSync('git',['show',`${previous}:ledgers/workflows.json`]).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const rows=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(rows).toHaveLength(1);expect(rows[0].steps.map((s:any)=>s.text)).toEqual([
  'XML with valid Unicode prefix and local name components','the namespace-name fixture is parsed',
  'expanded element and attribute names retain their Unicode identity','source offsets still address the original Unicode element',
 ]);
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['00fb946349332218bb5ef0935fd705ee34f780d9','shared v0.113.0','acceptance/unicode_qname_test.go','SourceRange()','[23,47)','[47,71)','405 cases/1391 steps','NOT a behavioural red test','No Go GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 const positive=ledger.workflows.find((w:any)=>w.id==='@id-xml-comparison-prefix-and-opc-order');expect(positive).toEqual(prior.workflows.find((w:any)=>w.id===positive.id));expect(positive.consumers.go.status).toBe('planned');
});
