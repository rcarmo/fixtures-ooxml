import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only the implicit xml prefix on the sealed five-step literal',async()=>{
 const id='@id-xml-implicit-xml-prefix',feature='workflows/xml/parsing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','b52eb66eb61db88cb4288e26085f0929e6077f62:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('The xml prefix is bound without a namespace declaration');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'XML values input encoded as JSON "<r xml:lang=\\"en\\"/>"',
  'the XML values input is parsed',
  'the root namespace URI equals JSON ""',
  'the root attribute xml:lang equals JSON "en"',
  'the implicit xml namespace URI is http://www.w3.org/XML/1998/namespace',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['cb5e9682f32eef23cadf1701816d714709d3ef1b','shared v0.132.0','acceptance/{acceptance,inventory,xml_entity_values,xml_implicit_prefix}_test.go','423 cases/1458 steps','restored behavioural reds','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-typed-parse-error','@id-xml-comparison-prefix-and-opc-order','@id-opc-diff-content-type'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-docx-comments-resolution'&&w.id!=='@id-xml-expanded-attribute-lookup'&&w.id!=='@id-docx-comments-noop'&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies')).toEqual(prior.workflows.filter((w:any)=>w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id&&w.id!=='@id-docx-comments-resolution'&&w.id!=='@id-xml-expanded-attribute-lookup'&&w.id!=='@id-docx-comments-noop'&&w.id!=='@id-opc-package-preserve-unrelated'&&w.id!=='@id-bun-opc-detached-byte-copies'));
});
