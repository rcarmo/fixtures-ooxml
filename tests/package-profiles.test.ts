import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';

const hash=(value:Uint8Array)=>new Bun.CryptoHasher('sha256').update(value).digest('hex');
const member=(name:string,payload:Uint8Array)=>({name,payloadSha256:hash(payload),payloadBytes:payload.length});
const utf8=(name:string,payload:string)=>member(name,new TextEncoder().encode(payload));
const utf16=(value:string)=>{const bytes=new Uint8Array(2+value.length*2),view=new DataView(bytes.buffer);view.setUint16(0,0xfeff,true);for(let n=0;n<value.length;n++)view.setUint16(2+n*2,value.charCodeAt(n),true);return bytes;};

/** Reconstruct only declared input bytes, never ZIP execution or consumer credit. */
export function packageCaseInput(c:ReturnType<typeof cases>[number]){
 const first=c.steps[0]!.text;
 if(c.scenarioId==='@id-package-admission-unsafe-members'){
  const prefix='an ordered ZIP_STORED archive has member pairs encoded as JSON ';
  if(!first.startsWith(prefix))throw Error('Unknown unsafe-member input');
  const pairs=JSON.parse(first.slice(prefix.length));
  return {compression:'ZIP_STORED',members:pairs.map(([name,value]:[string,string])=>utf8(name,value))};
 }
 if(c.scenarioId==='@id-package-admission-unsafe-xml-members'){
  const match=first.match(/^a ZIP_STORED archive contains a.xml with (UTF-8|UTF-16 with BOM) text (.*)$/);
  if(!match)throw Error('Unknown XML-member input');
  const [_,encoding,text]=match;
  return {compression:'ZIP_STORED',members:[encoding==='UTF-8'?utf8('a.xml',text!):member('a.xml',utf16(text!))],encoding};
 }
 if(c.scenarioId==='@id-package-admission-resource-limits'){
  if(first!=='a ZIP_DEFLATED archive contains a.xml with UTF-8 XML enclosing exactly 10000 spaces between <a> and </a>')throw Error('Changed resource input');
  const action=c.steps[1]!.text.match(/^the package admission guard checks the archive with only (\w+) set to (\d+)$/);
  if(!action)throw Error('Unknown limit action');
  return {compression:'ZIP_DEFLATED',limits:{[action[1]!]:Number(action[2])},members:[utf8('a.xml','<a>'+' '.repeat(10000)+'</a>')]};
 }
 if(c.scenarioId==='@id-package-admission-unsupported-compression'){
  if(first!=='a ZIP_BZIP2 archive contains a.xml with UTF-8 text <a/>')throw Error('Changed unsupported-compression input');
  return {compression:'ZIP_BZIP2',members:[utf8('a.xml','<a/>')]};
 }
 if(c.scenarioId==='@id-package-diff-equivalent-xml-and-binary-changes'){
  const read=(index:number)=>{
   const rows=c.steps[index]!.argument?.dataTable?.rows.map(r=>r.cells.map(cell=>cell.value));
   if(!rows||JSON.stringify(rows[0])!==JSON.stringify(['member','payload']))throw Error('Invalid diff member table');
   return rows.slice(1).map(row=>utf8(row[0]!,row[1]!));
  };
  return {compression:'ZIP_STORED',original:read(0),modified:read(1)};
 }
 throw Error('Unknown package scenario');
}

test('package scenarios retain all14 source-matched ordered member bytes and limits',async()=>{
 const ledger=await Bun.file('ledgers/consumers/python-package.json').json();
 const expected=ledger.mappings.flatMap((m:any)=>m.variants);
 const actual=[];
 for(const file of ['zip-admission','xml-member-admission','semantic-diff'])actual.push(...cases(`workflows/package/${file}.feature`,await Bun.file(`workflows/package/${file}.feature`).text()));
 expect(expected).toHaveLength(14);expect(actual).toHaveLength(14);
 for(const c of actual){
  const matches=expected.filter((v:any)=>v.scenarioId===c.scenarioId&&v.name===c.name);
  expect(matches).toHaveLength(1);expect(packageCaseInput(c)).toEqual(matches[0].inputs);
  const expectedOutcomes=matches[0].expectedOutcomes;
  if(expectedOutcomes.pythonException){
   expect(expectedOutcomes.pythonException).toBe('PackageAdmissionError');
   expect(c.steps.some(s=>s.text==='package admission is refused')).toBe(true);
   if(expectedOutcomes.messageContains)expect(c.steps.some(s=>s.text==='the admission error contains '+expectedOutcomes.messageContains)).toBe(true);
  }else{
   const result:Record<string,unknown>={};
   for(const step of c.steps){const match=step.text.match(/^the (equivalent_xml|changed|added|removed) member list is (.*)$/);if(match)result[match[1]!]=JSON.parse(match[2]!);}
   expect(result).toEqual(expectedOutcomes);
  }
 }
});

test('UTF-16 policy preserves BOM and refuses unknown test-input wording',()=>{
 const bytes=utf16('<a/>');expect([...bytes.slice(0,2)]).toEqual([255,254]);
 expect(()=>packageCaseInput({scenarioId:'@id-unknown',name:'unknown',steps:[]})).toThrow();
});
