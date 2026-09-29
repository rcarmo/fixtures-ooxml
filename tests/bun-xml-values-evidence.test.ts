import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/xml/parsing.feature';
const specs=[
 {id:'@id-xml-entity-values',inputs:['<r a="&quot;&apos;">&#x41;&#65;&amp;&lt;&gt;</r>'],outcomes:['the root attribute a equals JSON "\\\"\u0027"','the root text equals JSON "AA&<>"'],type:'parse'},
 {id:'@id-xml-stylesheet-processing-instruction',inputs:['<?xml-stylesheet href="style.xsl"?><r/>'],outcomes:['the root qualified name equals r'],type:'parse'},
 {id:'@id-xml-expanded-attribute-lookup',inputs:['<r xmlns="urn:default" xmlns:a="urn:a" xmlns:r="urn:a" id="plain" a:id="outer"><child xmlns:r="urn:b" r:id="inner" xml:lang="en"/><other r:id="sibling"/></r>'],outcomes:['expanded attribute lookups return these JSON values'],type:'parse'},
 {id:'@id-xml-implicit-xml-prefix',inputs:['<r xml:lang="en"/>'],outcomes:['the root namespace URI equals JSON ""','the root attribute xml:lang equals JSON "en"','the implicit xml namespace URI is http://www.w3.org/XML/1998/namespace'],type:'parse'},
 {id:'@id-xml-prototype-safe-attributes',inputs:['<r __proto__="polluted" constructor="safe"/>'],outcomes:["the root attribute map has a null prototype","__proto__ is an own attribute with value polluted","constructor is an own attribute with value safe"],type:'parse'},
 {id:'@id-xml-immutable-namespace-metadata',inputs:['<r xmlns:a="urn:a" a:id="outer"/>'],outcomes:['the namespace recorded for a:id is urn:a','the attribute namespace map is frozen and has a null prototype'],type:'parse'},
 {id:'@id-xml-escaping-values',inputs:['5 < 7 & 9 > 4',`'"<&>`],outcomes:['the escaped string equals JSON "5 &lt; 7 &amp; 9 &gt; 4"','the escaped string equals JSON "&apos;&quot;&lt;&amp;&gt;"'],type:'escape'},
 {id:'@id-xml-escaping-invalid-character',inputs:['\u0001'],outcomes:['escaping refuses the invalid XML character'],type:'escape'},
 {id:'@id-xml-escaping-whitespace-roundtrip',inputs:['x\r\n\ty'],outcomes:['the decoded text and attribute both equal JSON "x\\r\\n\\ty"'],type:'escape'},
 {id:'@id-xml-typed-parse-error',inputs:['<a></b>'],outcomes:['parsing throws an OoxmlError instance'],type:'parse'},
];
test('Bun executes eleven exact XML value cases with bounded type, namespace and escaping evidence',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','2b536be951104422513d819e54ada017d93bbed9:ledgers/workflows.json']).toString());
 const rows=cases(path,await Bun.file(path).text());
 for(const {id,inputs,outcomes,type} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(inputs.length);expect(current.expectedOutcomes).toEqual(outcomes);
  const selected=rows.filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text));
  expect(selected.map((steps:string[])=>steps[0])).toEqual(inputs.map(input=>type==='parse'?`XML values input encoded as JSON ${JSON.stringify(input)}`:`an XML escaping value encoded as JSON ${JSON.stringify(input)}`));
  expect(selected.flatMap((steps:string[])=>steps.slice(type==='parse'?2:2))).toEqual(outcomes);
  expect(selected.every((steps:string[])=>steps[1]=== (type==='parse'?'the XML values input is parsed':id==='@id-xml-escaping-whitespace-roundtrip'?'the value is escaped separately as text and as an attribute and both are parsed':id==='@id-xml-escaping-values'&&steps[0].includes('5 < 7')?'the value is escaped for XML text content':id==='@id-xml-escaping-values'?'the value is escaped for XML attribute content':'the value is escaped for XML text content'))).toBe(true);
  expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
  for(const marker of ['2635a5ff62eab79cc8d12ad1cb013bab9536d38e','shared v0.77.0','tests/acceptance/xml-values.ts','tests/unit/xml-values-bindings.test.ts','Fresh GitHub recursive make check','732/732','No Go/Python'])expect(current.consumers.bun.evidence).toContain(marker);
  expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),...["@id-xml-invalid-qname-components","@id-xml-unicode-qname-components","@id-xml-outside-root-nbsp","@id-xml-comparison-prefix-and-opc-order","@id-xml-comparison-significant-content","@id-xml-comparison-prefix-attribute-binding","@id-xml-comparison-unsafe-input","@id-xml-comparison-processing-instructions-and-comments"]]);expect(ledger.workflows.filter((w:any)=>!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!ids.has(w.id)));
});
