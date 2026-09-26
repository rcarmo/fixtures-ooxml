import {test,expect} from 'bun:test';
import {cases,validateConsumerMappings} from '../scripts/verify.ts';
const path='workflows/xml/values.feature';
const expanded=()=>Bun.file(path).text().then(text=>cases(path,text));
test('XML value scenarios retain exact JSON inputs and escaped output strings',async()=>{
 const rows=await expanded();expect(rows).toHaveLength(11);expect(new Set(rows.map(c=>c.scenarioId)).size).toBe(10);
 const parseArgument=(step:string)=>JSON.parse(step.slice(step.indexOf('JSON ')+5));
 const entities=rows.find(c=>c.scenarioId==='@id-xml-entity-values')!;
 expect(parseArgument(entities.steps[0]!.text)).toBe('<r a="&quot;&apos;">&#x41;&#65;&amp;&lt;&gt;</r>');
 expect(parseArgument(entities.steps[2]!.text)).toBe('"\'');expect(parseArgument(entities.steps[3]!.text)).toBe('AA&<>');
 const escapes=rows.filter(c=>c.scenarioId==='@id-xml-escaping-values');expect(escapes.map(c=>[parseArgument(c.steps[0]!.text),parseArgument(c.steps[2]!.text)])).toEqual([['5 < 7 & 9 > 4','5 &lt; 7 &amp; 9 &gt; 4'],['\'"<&>','&apos;&quot;&lt;&amp;&gt;']]);
 const invalid=rows.find(c=>c.scenarioId==='@id-xml-escaping-invalid-character')!;expect(parseArgument(invalid.steps[0]!.text)).toBe('\u0001');
 const whitespace=rows.find(c=>c.scenarioId==='@id-xml-escaping-whitespace-roundtrip')!;expect(parseArgument(whitespace.steps[0]!.text)).toBe('x\r\n\ty');expect(parseArgument(whitespace.steps[2]!.text)).toBe('x\r\n\ty');
});
test('namespace lookup examples retain missing and unqualified attributes separately',async()=>{
 const row=(await expanded()).find(c=>c.scenarioId==='@id-xml-expanded-attribute-lookup')!;
 const table=row.steps[2]!.argument!.dataTable!.rows.map((r:any)=>r.cells.map((c:any)=>c.value));
 expect(table.slice(1).map((r:any)=>[...r.slice(0,3),JSON.parse(r[3])])).toEqual([
 ['root','id','','plain'],['root','id','urn:default',null],['root','id','urn:a','outer'],['child','id','urn:b','inner'],['child','id','urn:a',null],['other','id','urn:a','sibling'],['child','lang','http://www.w3.org/XML/1998/namespace','en']]);
});
test('Bun XML ledger includes every declared identity in the two reviewed source files',async()=>{
 const mapping=await Bun.file('ledgers/consumers/bun-xml.json').json(),workflows=await Bun.file('ledgers/workflows.json').json();
 expect(mapping.declarationCount).toBe(18);expect(mapping.sourceFiles.map((f:any)=>f.declarations.length)).toEqual([5,13]);
 expect(mapping.mappings.map((m:any)=>m.nativeId).sort()).toEqual(mapping.sourceFiles.flatMap((f:any)=>f.declarations).sort());
 for(const m of mapping.mappings){expect(m.sourceSha256).toBe(mapping.sourceFiles.find((f:any)=>f.path===m.path).sha256);expect(m.assertions.length).toBeGreaterThan(0);expect(m.executionCredit).toBe(false);}
 expect(()=>validateConsumerMappings(mapping,new Set(workflows.workflows.map((w:any)=>w.id)))).not.toThrow();
});

test('registration creates byte seal and concrete outcomes without changing input objects',async()=>{
 const {registerWorkflow}=await import('../scripts/register-workflow.ts'),feature='@planned\nFeature: One\n @id-registration-test\n Scenario: Read result\n  Given input\n  When inspected\n  Then result equals value\n';
 const manifest={files:[]},ledger={features:[],workflows:[]},before=JSON.stringify({manifest,ledger});
 const result=registerWorkflow('workflows/test/one.feature',feature,manifest,ledger);
 expect(JSON.stringify({manifest,ledger})).toBe(before);expect(result.manifest.files).toHaveLength(1);expect(result.manifest.files[0]!.bytes).toBe(new TextEncoder().encode(feature).length);
 expect(result.ledger.workflows[0]!.expectedOutcomes).toEqual(['result equals value']);expect(result.ledger.workflows[0]!.expandedCases).toBe(1);expect(result.ledger.workflows[0]!.consumers.bun.status).toBe('planned');
 expect(()=>registerWorkflow('workflows/test/one.feature',feature,result.manifest,result.ledger)).toThrow('already');expect(()=>registerWorkflow('workflows/test/two.feature',feature,result.manifest,result.ledger)).toThrow('Duplicate');
 expect(()=>registerWorkflow('../one.feature',feature,manifest,ledger)).toThrow('path');
 expect(()=>registerWorkflow('workflows/test/one.feature',feature.replace('  Then result equals value\n',''),manifest,ledger)).toThrow('Then');
});

test('new registrations refuse non-planned or unexpanded scenario definitions',async()=>{
 const {registerWorkflow}=await import('../scripts/register-workflow.ts');
 const feature='@planned\nFeature: One\n @id-registration-test\n Scenario: Read result\n  Given input\n  When inspected\n  Then result equals value\n';
 const register=(text:string)=>registerWorkflow('workflows/test/one.feature',text,{files:[]},{features:[],workflows:[]});
 expect(()=>register(feature.replace('@planned\n',''))).toThrow('planned');
 expect(()=>register(feature+' @id-empty-outline\n Scenario Outline: Empty <value>\n  Then value equals <value>\n  Examples:\n   | value |\n')).toThrow('unexpanded');
});
test('supporting contracts and source mappings receive independent byte seals',async()=>{
 const {registerAsset}=await import('../scripts/register-workflow.ts');
 const manifest={files:[]},text='# XML contract\n';
 const next=registerAsset('contracts/example.md',text,manifest);
 expect(manifest.files).toEqual([]);expect(next.files[0].role).toBe('workflow-contract');
 expect(next.files[0].sha256).toBe(new Bun.CryptoHasher('sha256').update(text).digest('hex'));
 expect(registerAsset('ledgers/consumers/example.json','{}',next).files[1].role).toBe('consumer-mapping');
 expect(()=>registerAsset('contracts/example.md',text,next)).toThrow('already');
 expect(()=>registerAsset('../example.md',text,manifest)).toThrow('path');
});

test('Go lexical editing keeps named refusal variants and a single namespace matrix',async()=>{
 const rows=cases('workflows/xml/go-lexical-editing.feature',await Bun.file('workflows/xml/go-lexical-editing.feature').text());
 expect(rows).toHaveLength(15);expect(new Set(rows.map(c=>c.scenarioId)).size).toBe(10);
 expect(rows.filter(c=>c.scenarioId==='@id-xml-go-element-removal-refusal')).toHaveLength(2);
 expect(rows.filter(c=>c.scenarioId==='@id-xml-go-element-replacement-refusal')).toHaveLength(3);
 const matrix=rows.filter(c=>c.scenarioId==='@id-xml-go-child-namespace-matrix');expect(matrix).toHaveLength(1);
 const table=(s:any)=>s.argument.dataTable.rows.slice(1).map((r:any)=>r.cells.map((c:any)=>c.value));
 expect(table(matrix[0]!.steps[0])).toHaveLength(4);expect(table(matrix[0]!.steps[1])).toHaveLength(5);
 const immutable=rows.find(c=>c.scenarioId==='@id-xml-go-immutable-leaf-seed')!;
 expect(immutable.steps.map(s=>s.text).join('\n')).not.toContain('if the edit succeeds');
 const mapping=await Bun.file('ledgers/consumers/go-lexical-editing.json').json();
 expect(mapping.declarationCount).toBe(7);expect(new Set(mapping.mappings.flatMap((r:any)=>r.scenarioIds)).size).toBe(10);
 for(const r of mapping.mappings){expect(r.coverage).toBe('partial');expect(r.gaps.length).toBeGreaterThan(0);expect(r.executionCredit).toBe(false);}
});
test('Python analysis deduplicates equivalent declarations and records weak native assertions',async()=>{
 const path='workflows/docx/python-template-analysis.feature',rows=cases(path,await Bun.file(path).text());expect(rows).toHaveLength(6);
 const mapping=await Bun.file('ledgers/consumers/python-template-analysis.json').json();expect(mapping.declarationCount).toBe(7);
 const colour=mapping.mappings.filter((r:any)=>r.scenarioIds.includes('@id-python-word-template-analysis-colour-response'));expect(colour).toHaveLength(2);
 const sow=rows.find(c=>c.scenarioId==='@id-python-word-template-analysis-sow-response')!;
 expect(sow.steps.map(s=>s.text)).toContain('its response is a dictionary without an "error" member');
 const sowMap=mapping.mappings.find((r:any)=>r.scenarioIds.includes(sow.scenarioId));expect(sowMap.gaps.join(' ')).toMatch(/stronger|successful/i);
 for(const r of mapping.mappings){expect(r.coverage).toBe('partial');expect(r.gaps.length).toBeGreaterThan(0);expect(r.executionCredit).toBe(false);}
});
test('new family registry records match compiled outcomes, paths and planned consumers',async()=>{
 const {registerWorkflow}=await import('../scripts/register-workflow.ts'),ledger=await Bun.file('ledgers/workflows.json').json();
 for(const path of ['workflows/xml/values.feature','workflows/xml/go-lexical-editing.feature','workflows/docx/python-template-analysis.feature']){
  const generated=registerWorkflow(path,await Bun.file(path).text(),{files:[]},{features:[],workflows:[]});
  for(const row of generated.ledger.workflows)expect(ledger.workflows.find((w:any)=>w.id===row.id)).toEqual(row);
 }
});
