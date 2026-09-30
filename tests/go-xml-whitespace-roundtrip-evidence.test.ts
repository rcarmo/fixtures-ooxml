import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only the shared three-step XML whitespace writer/reparser roundtrip',async()=>{
 const id='@id-xml-escaping-whitespace-roundtrip',feature='workflows/xml/parsing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','709b14a7ad45abe305acc93f94098b433cecf8fb:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Escaped whitespace survives text and attribute parsing');
 const steps=[
  'an XML escaping value encoded as JSON "x\\r\\n\\ty"',
  'the value is escaped separately as text and as an attribute and both are parsed',
  'the decoded text and attribute both equal JSON "x\\r\\n\\ty"',
 ];
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual(steps);
 expect(now.expectedOutcomes).toEqual(steps.slice(-1));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['f6ac9c076187fb3a9d6e82c8000823df3e81fc2b','shared v0.141.0','acceptance/{acceptance,inventory,xml_whitespace_roundtrip}_test.go','reports/batches/288.md','utils.MarshalXMLWithHeader','utils.UnmarshalXML','434 cases/1501 executed steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!==id));
});
