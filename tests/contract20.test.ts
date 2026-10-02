import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {inflateRawSync} from 'node:zlib';
import {cases} from '../scripts/verify.ts';
import {beforeContract20Feature,beforeContract20Case,beforeContract20Ledger} from './contract20-history.ts';
const load=()=>Bun.file('ledgers/contract20.json').json(),sha=(v:string|Uint8Array)=>new Bun.CryptoHasher('sha256').update(v).digest('hex');
function members(bytes:Uint8Array):Map<string,string>{
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let e=bytes.length-22;while(e>=0&&view.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw Error('Missing ZIP end');
 const result=new Map<string,string>();let cursor=view.getUint32(e+16,true);const count=view.getUint16(e+10,true);
 for(let i=0;i<count;i++){if(view.getUint32(cursor,true)!==0x02014b50)throw Error('Missing central entry');const method=view.getUint16(cursor+10,true),size=view.getUint32(cursor+20,true),nameLen=view.getUint16(cursor+28,true),extra=view.getUint16(cursor+30,true),comment=view.getUint16(cursor+32,true),offset=view.getUint32(cursor+42,true),name=new TextDecoder().decode(bytes.slice(cursor+46,cursor+46+nameLen)),start=offset+30+view.getUint16(offset+26,true)+view.getUint16(offset+28,true),data=bytes.slice(start,start+size);if(result.has(name))throw Error('Duplicate member');if(method!==0&&method!==8)throw Error('Unexpected fixture method');result.set(name,new TextDecoder().decode(method===8?inflateRawSync(data):data));cursor+=46+nameLen+extra+comment;}
 return result;
}
test('Contract20 retains 20 IDs/22 cases, strengthens 74 to 223 steps and preserves exact historical predicates and credit',async()=>{
 const m=await load(),ledger=await Bun.file('ledgers/workflows.json').json();expect(m.executionCredit).toBe(false);expect(m.retiredScenarioIds).toEqual([]);expect(m.counts).toEqual({ids:20,cases:22,beforeSteps:74,afterSteps:223});expect(new Set(m.selectedScenarioIds).size).toBe(20);
 let count=0,steps=0;
 for(const f of m.files){const text=await Bun.file(f.path).text(),old=execFileSync('git',['show',m.sourceRevision+':'+f.path],{encoding:'utf8'});expect(old).toBe(f.beforeText);expect(sha(old)).toBe(f.beforeSha256);expect(sha(text)).toBe(f.afterSha256);expect(beforeContract20Feature(f.path,text)).toBe(old);const current=cases(f.path,text);expect(current.map(beforeContract20Case)).toEqual(cases(f.path,old));
  for(const s of f.scenarios){const actual=current.filter(c=>c.scenarioId===s.id);expect(actual).toEqual(s.after);expect(actual).toHaveLength(s.before.length);count+=actual.length;steps+=actual.reduce((n,c)=>n+c.steps.length,0);const row=ledger.workflows.find((r:any)=>r.id===s.id);expect(row.consumers).toEqual({bun:{status:'planned',evidence:[]},go:{status:'planned',evidence:[]},python:{status:'planned',evidence:[]}});}
 }
 expect(count).toBe(22);expect(steps).toBe(223);expect(beforeContract20Ledger(ledger)).toEqual(JSON.parse(execFileSync('git',['show',m.sourceRevision+':ledgers/workflows.json'],{encoding:'utf8'})));
 const history=m.files.flatMap((f:any)=>f.beforeLedgerRows).find((r:any)=>r.id==='@id-xlsx-styled-blank-cell-editable');expect(history.consumers.python.status).toBe('implemented');expect(m.files.flatMap((f:any)=>f.scenarios).find((r:any)=>r.id===history.id).before[0].steps).toHaveLength(4);
});
test('Contract20 historical reversal fails closed on predicate edits, collateral bytes and forged consumer credit',async()=>{
 const m=await load(),f=m.files[0],text=await Bun.file(f.path).text();expect(()=>beforeContract20Feature(f.path,text.replace('numeric 7','numeric 8'))).toThrow('Unreviewed Contract20');expect(()=>beforeContract20Feature(f.path,text+'\n')).toThrow('Unreviewed Contract20');
 const c=structuredClone(f.scenarios[0].after[0]);c.steps.at(-1).text+=' changed';expect(beforeContract20Case(c)).toEqual(c);
 const l=await Bun.file('ledgers/workflows.json').json();l.workflows.find((r:any)=>r.id===m.selectedScenarioIds[0]).consumers.go.status='implemented';expect(()=>beforeContract20Ledger(l)).toThrow('Unreviewed Contract20');
});
test('literal XLSX recipes retain valid styles, independent caches, relationship-linked values and ordered phonetic strings',async()=>{
 const m=await load(),r=await Bun.file(m.recipePath).json(),by=(id:string)=>r.xlsx.find((x:any)=>x.id===id);expect(r.xlsx).toHaveLength(9);expect(r.pptx).toHaveLength(11);expect(r.executionCredit).toBe(false);
 for(const id of ['prefixed-cells','styled-blank']){const x=by(id);expect(x.members['xl/styles.xml'].match(/<cellXfs count="3">/)).not.toBeNull();expect(x.members['xl/styles.xml'].match(/<xf /g)).toHaveLength(4);expect(x.members['xl/_rels/workbook.xml.rels']).toContain('Target="styles.xml"');expect(x.members['[Content_Types].xml']).toContain('/xl/styles.xml');}
 for(const id of ['cross-caches','opaque-caches'])expect(by(id).members['xl/worksheets/sheet2.xml']).toContain('<c r="B1"><f>40+2</f><v>42</v></c>');
 expect(by('rel-values').members['xl/workbook.xml']).toContain('name="Alpha" sheetId="1" r:id="rId2"');expect(by('rel-values').members['xl/_rels/workbook.xml.rels']).toContain('Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"');
 expect(by('phonetic-strings').members['xl/sharedStrings.xml']).toContain('<r><t>Alpha</t></r><r><t xml:space="preserve"> Beta</t></r><rPh');expect(by('phonetic-strings').members['xl/worksheets/sheet1.xml']).toContain('<r><t>Gamma</t></r><r><t xml:space="preserve"> Delta</t></r><rPh');
 expect(by('attributed-formulas').members['xl/worksheets/sheet1.xml']).toContain('<f t="shared" si="0" ref="B2:B3">A2*2</f>');
 for(const kind of ['array','dataTable'])expect(by('input-'+kind).members['xl/worksheets/sheet2.xml']).toContain('<f t="'+kind+'" ref="A1:A2">Model!A1*{1;2}</f>');
});
test('every derived PPTX recipe matches physical sealed inputs; merged/malformed controls and selectors stay distinct',async()=>{
 const m=await load(),r=await Bun.file(m.recipePath).json(),manifest=await Bun.file('manifest.json').json();
 for(const recipe of r.pptx){const fixture=manifest.files.find((f:any)=>f.id===recipe.baseFixtureId);expect(fixture).toBeDefined();const bytes=await Bun.file(fixture.path).bytes();expect(bytes.length).toBe(fixture.bytes);expect(sha(bytes)).toBe(fixture.sha256);const parts=members(bytes);
  for(const op of recipe.operations){if(op.kind==='replace-literal-once'){expect(parts.get(op.part)?.split(op.before)).toHaveLength(2);parts.set(op.part,parts.get(op.part)!.replace(op.before,op.after));}else if(op.kind==='add-literal-member'){expect(parts.has(op.part)).toBe(false);parts.set(op.part,op.value);}else{expect(op.kind).toBe('reorder-sldId-elements');expect(parts.get(op.part)?.match(/<p:sldId\b[^>]*\/>/g)).toHaveLength(5);expect(op.oneBasedOrder).toEqual([5,1,4,2,3]);}}
  if(recipe.id==='merged-table'){const xml=parts.get('ppt/slides/slide1.xml')!,rows=xml.match(/<a:tr\b[^>]*>[\s\S]*?<\/a:tr>/g)!;expect(xml.match(/<a:gridCol w="900"\/>/g)).toHaveLength(2);expect(rows).toHaveLength(2);expect(rows[0].match(/<a:tc\b/g)).toHaveLength(1);expect(rows[0]).toContain('gridSpan="2"');expect(rows[1].match(/<a:tc\b/g)).toHaveLength(2);expect(rows.every(x=>x.startsWith('<a:tr h="450">'))).toBe(true);}
  if(recipe.id==='malformed-table')expect(parts.get('ppt/slides/slide1.xml')).toContain('hMerge="maybe"');
 }
 const refusal=m.files.flatMap((f:any)=>f.scenarios).find((s:any)=>s.id==='@id-pptx-table-atomic-refusals');for(const c of refusal.after){const steps=c.steps.map((s:any)=>s.text);expect(steps[2]).toContain('open and target selection');expect(steps[4]).toContain('only that cell-text edit preflight');}
});
test('creation graph has exact required/optional roles, bounded edges and no runtime filename contract',async()=>{
 const m=await load(),p=await Bun.file(m.creationPolicyPath).json();expect(Object.keys(p.requiredRoles).sort()).toEqual(['presentation','slide','slideLayout','slideMaster','theme']);expect(p.requiredRoles.slideLayout.count).toBe(1);expect(p.requiredRoles.slideLayout.layoutType).toBe('title');expect(Object.values(p.optionalRoles).every((r:any)=>r.maxCount===1)).toBe(true);expect(p.requiredEdges).toHaveLength(7);expect(p.optionalEdges).toHaveLength(6);expect(p.invariants).toContain('Every internal relationship target resolves to its declared role; no external relationships or unknown edges.');expect(p.partNames).toContain('producer allocated');
});
