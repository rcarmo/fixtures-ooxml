import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only exact mixed XML entity values with decoded text',async()=>{
 const id='@id-xml-entity-values',feature='workflows/xml/parsing.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','c51b029e452130a803a0ccd4fc935162a77d6993:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Decode predefined entities and decimal and hexadecimal references');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'XML values input encoded as JSON "<r a=\\"&quot;&apos;\\">&#x41;&#65;&amp;&lt;&gt;</r>"',
  'the XML values input is parsed',
  'the root attribute a equals JSON "\\"\'"',
  'the root text equals JSON "AA&<>"',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['a13cef3b5de6e22b4e9651cf59a7a60c2355bdbd','shared v0.129.0','acceptance/{acceptance,feature_roots,inventory,xml_entity_values}_test.go','tag line 44','Scenario/Pickle line 45','421 cases/1450 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-normalise-line-endings','@id-xml-typed-parse-error','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!==id&&w.id!=='@id-docx-comments-inspection')).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!=="@id-xml-stylesheet-processing-instruction"&&w.id!==id&&w.id!=='@id-docx-comments-inspection'));
});
