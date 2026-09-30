import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits one exact seven-row expanded attribute lookup case',async()=>{
 const id='@id-xml-expanded-attribute-lookup',feature='workflows/xml/parsing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','93436c63ff0c587021b0f7bc8a7278cc6b37ae84:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Attribute lookup respects local prefix rebinding and unqualified names');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'XML values input encoded as JSON "<r xmlns=\\"urn:default\\" xmlns:a=\\"urn:a\\" xmlns:r=\\"urn:a\\" id=\\"plain\\" a:id=\\"outer\\"><child xmlns:r=\\"urn:b\\" r:id=\\"inner\\" xml:lang=\\"en\\"/><other r:id=\\"sibling\\"/></r>"',
  'the XML values input is parsed',
  'expanded attribute lookups return these JSON values',
 ]);
 const rows=selected[0].steps[2].argument?.dataTable?.rows?.map((r:any)=>r.cells.map((c:any)=>c.value));
 expect(rows).toEqual([
  ['element','local','namespace','value_json'],
  ['root','id','','"plain"'],['root','id','urn:default','null'],['root','id','urn:a','"outer"'],
  ['child','id','urn:b','"inner"'],['child','id','urn:a','null'],['other','id','urn:a','"sibling"'],
  ['child','lang','http://www.w3.org/XML/1998/namespace','"en"'],
 ]);
 expect(now.expectedOutcomes).toEqual([selected[0].steps[2].text]);
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['00d155e69c25eddd6347b1d5fa9d0c3102e1cab3','shared v0.134.0','acceptance/{acceptance,feature_roots,inventory,xml_entity_values,xml_expanded_attribute}_test.go','reports/batches/278.md','424 cases/1461 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-implicit-xml-prefix','@id-xml-typed-parse-error','@id-xml-comparison-prefix-and-opc-order','@id-opc-diff-content-type'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-docx-comments-noop'&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies')).toEqual(prior.workflows.filter((w:any)=>w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-docx-comments-noop'&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies'));
});
