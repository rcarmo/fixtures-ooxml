import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-xml-go-attribute-splice-custody';
const feature='workflows/xml/editing.feature';
const source=`<r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r>`;
const specs=[
 ['a',`x'y&z`,`<r xmlns:p="urn:p"><t a = 'x&#39;y&amp;z' p:n="old"/><t>text</t></r>`],
 ['p:n','new',`<r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="new"/><t>text</t></r>`],
 ['fresh','value',`<r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old" fresh="value"/><t>text</t></r>`],
] as const;

test('Go credits exactly three lexical attribute splices with complete output bytes',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','1e5a644ffaf82b010a5598ae3fdefa96c4331fcd:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(3);expect(selected).toHaveLength(3);
 expect(selected.map((c:any)=>c.steps.map((s:any)=>s.text))).toEqual(specs.map(([name,value,output])=>[
  `the XML source is ${source}`,`a lexical edit sets the attribute ${name} of the first t element to ${value}`,
  `the complete output bytes equal ${output}`,
 ]));
 expect(now.expectedOutcomes).toEqual(specs.map(([, ,output])=>`the complete output bytes equal ${output}`));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['7d9fee551547fa7a761b9797fed91f34b2ba4f3a','shared v0.116.0','acceptance/{acceptance,inventory,attribute_splice}_test.go','three exact Examples rows/nine steps','row lines 27–29','duplicate-a batch','409 cases/1404 steps','Go has no GitHub Actions workflow'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-go-attribute-batch-refusal','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-xml-entity-values"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-xml-entity-values"&&w.id!==id));
});
