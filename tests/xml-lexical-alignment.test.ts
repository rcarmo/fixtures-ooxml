import {beforeUniformApi18Feature,beforeUniformApi18Ledger} from './uniform-api18-history.ts';
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';
import {beforeLexicalAlignmentFeature,beforeLexicalAlignmentCase,beforeLexicalAlignmentLedger} from './xml-generalization-helpers.ts';
const equal=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const hash=(s:string)=>new Bun.CryptoHasher('sha256').update(s).digest('hex');
const load=()=>Bun.file('ledgers/xml-lexical-alignment.json').json();
test('twenty-ID XML alignment completes exactly eight contracts and preserves all other predicates and case counts',async()=>{
 const m=await load();expect(m.executionCredit).toBe(false);expect(m.retiredScenarioIds).toEqual([]);expect(m.selectedIds).toHaveLength(20);expect(new Set(m.selectedIds).size).toBe(20);expect(m.expandedCases).toBe(29);
 expect(m.files.flatMap((f:any)=>f.scenarios)).toHaveLength(8);
 let selectedCases=0;
 for(const f of m.files){
  expect(f.beforeText).toBe(execFileSync('git',['show',m.sourceRevision+':'+f.path],{encoding:'utf8'}));
  expect(hash(f.beforeText)).toBe(f.beforeSha256);
  const text=beforeUniformApi18Feature(f.path,await Bun.file(f.path).text());expect(hash(text)).toBe(f.afterSha256);
  const before=cases(f.path,f.beforeText),now=cases(f.path,text);expect(now.map(beforeLexicalAlignmentCase)).toEqual(before);
  expect(beforeLexicalAlignmentFeature(f.path,text)).toBe(f.beforeText);
  selectedCases+=now.filter(c=>m.selectedIds.includes(c.scenarioId)).length;
  for(const s of f.scenarios){expect(now.filter(c=>c.scenarioId===s.id)).toEqual(s.after);expect(before.filter(c=>c.scenarioId===s.id)).toEqual(s.before);expect(s.after).toHaveLength(s.before.length);}
 }
 expect(selectedCases).toBe(29);
 const current=beforeUniformApi18Ledger(await Bun.file('ledgers/workflows.json').json()),prior=JSON.parse(execFileSync('git',['show',m.sourceRevision+':ledgers/workflows.json'],{encoding:'utf8'}));
 expect(beforeLexicalAlignmentLedger(current)).toEqual(prior);
 for(const row of m.files.flatMap((f:any)=>f.afterLedgerRows)){expect(current.workflows.find((w:any)=>w.id===row.id)).toEqual(row);for(const c of ['bun','go','python'])expect(row.consumers[c].status).toBe('planned');}
 const review=await Bun.file('ledgers/feature-reuse.json').json();for(const id of m.files.flatMap((f:any)=>f.scenarios.map((s:any)=>s.id)))expect(review.scenarios.find((r:any)=>r.id===id).category).toBe('generalized');
});
test('source vectors independently distinguish UTF-16 units, decoded line endings and exact edit boundaries',async()=>{
 const text=await Bun.file('workflows/xml/parsing.feature').text(),rows=cases('workflows/xml/parsing.feature',text);
 const offset=rows.find(c=>c.scenarioId==='@id-xml-parse-offsets')!;
 const source=JSON.parse(offset.steps[0].text.slice('the lexical XML input is JSON '.length));
 const data=offset.steps[2].argument!.dataTable!.rows.map(r=>r.cells.map(c=>c.value));
 expect(data[1].slice(5,9)).toEqual(['39','110','150','156']);expect(data[2].slice(5,9)).toEqual(['115','129','129','129']);
 expect(source.slice(115,129)).toBe('<x:c x:b="v"/>');expect(source.slice(39,110)).toBe('<p:r xmlns="urn:default" xmlns:p="urn:p" xmlns:x="urn:x" a="1 &amp; 2">');expect(source.slice(150,156)).toBe('</p:r>');
 expect(Buffer.byteLength(source.slice(0,115),'utf8')).not.toBe(115);expect([...source.slice(0,115)].length).not.toBe(115);
 const line=rows.find(c=>c.scenarioId==='@id-xml-normalise-line-endings')!;const lineSource=JSON.parse(line.steps[0].text.slice('the lexical XML input is JSON '.length));expect(lineSource.slice(65,69)).toBe('<s/>');expect(lineSource).toContain('\r\n');
 const names=cases('workflows/xml/names.feature',await Bun.file('workflows/xml/names.feature').text());const unicode=names.find(c=>c.scenarioId==='@id-xml-unicode-qname-components')!;const u=JSON.parse(unicode.steps[0].text.slice('the lexical XML input is JSON '.length));expect(u.length).toBe(52);expect(u.slice(39,46)).toBe('<π:𐐀/>');expect(unicode.steps[3].text).toContain('[39,46)');
 const edit=cases('workflows/xml/editing.feature',await Bun.file('workflows/xml/editing.feature').text()).find(c=>c.scenarioId==='@id-xml-apply-edits')!;const replacements=edit.steps[1].argument!.dataTable!.rows.slice(1).map(r=>r.cells.map(c=>c.value));expect(replacements).toEqual([['7','10','"<x/>"'],['3','6','"1 &lt; 2"']]);
 let edited='<r>one two</r>';for(const[start,end,value]of replacements)edited=edited.slice(0,Number(start))+JSON.parse(value)+edited.slice(Number(end));expect(edited).toBe('<r>1 &lt; 2 <x/></r>');
});
test('refusal recipes retain fifteen exact faults and budgets have independent near-boundary positives',async()=>{
 const rows=cases('workflows/xml/parsing.feature',await Bun.file('workflows/xml/parsing.feature').text());const refusal=rows.find(c=>c.scenarioId==='@id-xml-parse-refusals')!;const data=refusal.steps[0].argument!.dataTable!.rows.slice(1).map(r=>r.cells.map(c=>c.value));expect(data).toHaveLength(15);expect(new Set(data.map(r=>r[0])).size).toBe(15);for(const r of data)expect(typeof JSON.parse(r[1])).toBe('string');expect(data.map(r=>r[2])).toContain('mismatched-tag');expect(data.map(r=>r[2])).toContain('duplicate-attribute');
 const limits=rows.find(c=>c.scenarioId==='@id-xml-parse-bounds')!;expect(limits.steps[0].text).toContain('maxDepth 4, maxNodes 6 and maxSourceUnits 64');
 expect(('<r>'+'x'.repeat(58)+'</r>').length).toBe(65);expect(('<r>'+'x'.repeat(57)+'</r>').length).toBe(64);expect(('<n>'.repeat(5)+'</n>'.repeat(5)).length).toBeLessThan(64);expect(('<r>'+'<n/>'.repeat(6)+'</r>').length).toBeLessThan(64);
});
test('historical alignment fails closed on unknown predicates or ledger credit and cannot hide weakened cases',async()=>{
 const m=await load(),f=m.files[0],text=await Bun.file(f.path).text();expect(()=>beforeLexicalAlignmentFeature(f.path,text.replace('UTF-16 [65,69)','UTF-16 [65,68)'))).toThrow('Unreviewed');
 const row=structuredClone(f.scenarios[0].after[0]);row.steps.at(-1).text+=' altered';expect(equal(beforeLexicalAlignmentCase(row),row)).toBe(true);
 const ledger=await Bun.file('ledgers/workflows.json').json();ledger.workflows.find((w:any)=>w.id===f.scenarios[0].id).consumers.go.status='implemented';expect(()=>beforeLexicalAlignmentLedger(ledger)).toThrow('Unreviewed');
});
