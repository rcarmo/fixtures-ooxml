import {beforePackageAlignmentFeature} from './xml-generalization-helpers.ts';
import {test,expect} from 'bun:test';
import {validateConsumerMappings} from '../scripts/verify.ts';

const sample=()=>({schemaVersion:1,consumer:'bun',source:{repository:'https://github.com/rcarmo/bun-ooxml',revision:'a'.repeat(40)},scope:'selected XML declarations only',declarationCount:1,mappings:[{nativeId:'tests/unit/xml.test.ts::parseXml / reads names',path:'tests/unit/xml.test.ts',sourceSha256:'b'.repeat(64),coverage:'partial',scenarioIds:['@id-xml-parser-preserves-offsets'],verifiedAspects:['Expanded element names'],gaps:['Other assertions not mapped'],executionCredit:false}]});
const scenarioIds=new Set(['@id-xml-parser-preserves-offsets']);
test('mapping records supporting assertions without assigning execution credit',()=>{
 expect(()=>validateConsumerMappings(sample(),scenarioIds)).not.toThrow();
});
test('unknown IDs, omitted gaps, duplicate native identities and implicit credit refuse',()=>{
 for(const mutate of [
  (x:any)=>{x.mappings[0].scenarioIds=['@id-unknown'];},
  (x:any)=>{x.mappings[0].gaps=[];},
  (x:any)=>{x.mappings.push(x.mappings[0]);x.declarationCount=2;},
  (x:any)=>{x.mappings[0].executionCredit=true;},
  (x:any)=>{x.declarationCount=2;},
  (x:any)=>{x.source.revision='floating-main';},
  (x:any)=>{x.mappings[0].path='../outside';},
  (x:any)=>{x.mappings[0].coverage='unmapped';},
  (x:any)=>{x.mappings[0].gaps=[''];},
  (x:any)=>{x.mappings[0].verifiedAspects=[null];},
  (x:any)=>{x.mappings[0].coverage='mapped';},
  (x:any)=>{x.mappings[0].scenarioIds.push(x.mappings[0].scenarioIds[0]);},
 ]){const x=sample();mutate(x);expect(()=>validateConsumerMappings(x,scenarioIds)).toThrow();}
});

test('comparison feature retains exact native XML arguments and Boolean outcomes',async()=>{
 const {cases}=await import('../scripts/verify.ts');
 const ledger=await Bun.file('ledgers/consumers/python-xml.json').json();
 const expanded=cases('workflows/xml/comparison.feature',beforePackageAlignmentFeature('workflows/xml/comparison.feature',await Bun.file('workflows/xml/comparison.feature').text()));
 expect(expanded).toHaveLength(10);
 const expected=ledger.mappings.flatMap((m:any)=>m.variants.map((v:any)=>({scenarioId:m.scenarioIds[0],left:v.leftUtf8,right:v.rightUtf8,result:String(v.expectedBoolean)})));
 const actual=expanded.map(c=>({scenarioId:c.scenarioId,left:c.steps.find(s=>s.text.startsWith('the left XML is '))!.text.slice(16),right:c.steps.find(s=>s.text.startsWith('the right XML is '))!.text.slice(17),result:c.steps.find(s=>s.text.startsWith('the comparison result is '))!.text.slice(25)}));
 expect(actual).toEqual(expected);
});
