import {inflateRawSync,crc32} from 'node:zlib';
import {join} from 'node:path';

const hash=(data:Uint8Array|string)=>new Bun.CryptoHasher('sha256').update(data).digest('hex');
export type Member={name:string;sha256:string;bytes:number;method:number;timestamp:number;externalAttributes:number};

/** Read central ZIP32 entries and hash the uncompressed members, not container metadata. */
export function inspectFixtureArchive(data:Uint8Array):{members:Member[];logicalSha256:string}{
 const view=new DataView(data.buffer,data.byteOffset,data.byteLength);
 const u16=(p:number)=>view.getUint16(p,true),u32=(p:number)=>view.getUint32(p,true);
 let end=-1;
 for(let p=data.length-22;p>=Math.max(0,data.length-65557);p--)if(u32(p)===0x06054b50&&p+22+u16(p+20)===data.length){end=p;break;}
 if(end<0)throw Error('Missing ZIP end of central directory');
 if(u16(end+4)!==0||u16(end+6)!==0||u16(end+8)!==u16(end+10))throw Error('Unsupported multi-disk ZIP');
 const count=u16(end+10),offset=u32(end+16);
 if(count===0xffff||offset===0xffffffff)throw Error('ZIP64 fixture needs a separate member audit');
 const names=new Set<string>(),members:Member[]=[];
 let p=offset;
 for(let i=0;i<count;i++){
  if(p+46>data.length||u32(p)!==0x02014b50)throw Error('Invalid ZIP central entry');
  const method=u16(p+10),crc=u32(p+16),compressed=u32(p+20),size=u32(p+24),length=u16(p+28),extra=u16(p+30),comment=u16(p+32),local=u32(p+42);
  if(compressed===0xffffffff||size===0xffffffff||local===0xffffffff)throw Error('ZIP64 member needs a separate audit');
  if(p+46+length+extra+comment>data.length||local+30>data.length||u32(local)!==0x04034b50)throw Error('Invalid ZIP entry extent');
  const name=new TextDecoder().decode(data.subarray(p+46,p+46+length));
  if(u16(local+6)!==u16(p+8)||u16(local+8)!==method||u16(local+26)!==length||local+30+length>data.length||new TextDecoder().decode(data.subarray(local+30,local+30+length))!==name)throw Error('ZIP local and central metadata disagree: '+name);
  if(names.has(name))throw Error('Duplicate ZIP member name: '+name);
  names.add(name);
  const start=local+30+u16(local+26)+u16(local+28);
  if(start+compressed>data.length)throw Error('ZIP payload extends past archive: '+name);
  const stored=data.subarray(start,start+compressed);
  const payload=method===0?stored:method===8?inflateRawSync(stored):null;
  if(!payload)throw Error('Unsupported fixture compression method: '+method);
  if(payload.length!==size||crc32(payload)!==crc)throw Error('ZIP payload length or CRC mismatch: '+name);
  members.push({name,sha256:hash(payload),bytes:size,method,timestamp:u32(p+12),externalAttributes:u32(p+38)});
  p+=46+length+extra+comment;
 }
 if(p!==offset+u32(end+12))throw Error('ZIP central directory size mismatch');
 const logicalSha256=hash(JSON.stringify(members.map(({name,sha256,bytes})=>[name,bytes,sha256]).sort((a,b)=>String(a[0]).localeCompare(String(b[0])))));
 return {members,logicalSha256};
}

/** Retired byte identities remain traceable, but only retained fixtures are addressable. */
export async function verifyFixtureContents(base:string,manifest:{files:any[]}):Promise<{archives:number;uniqueContents:number;retired:number}>{
 const ledger=await Bun.file(join(base,'ledgers/fixture-content-consolidation.json')).json();
 if(ledger.schemaVersion!==1||ledger.releaseSource.commit!=='a47c51ada71dfe1561f403c8861954bdbf5b9023'||ledger.releaseSource.tag!=='v0.40.0'||ledger.retired.length!==2)throw Error('Invalid fixture content migration ledger');
 const fixtures=manifest.files.filter(f=>f.role==='fixture'),byId=new Map(fixtures.map(f=>[f.id,f]));
 const observed=new Map<string,{id:string;path:string;members:Member[]}>();let archives=0;
 for(const f of fixtures){
  if(!['docx','pptx','xlsx','zip'].includes(f.format))continue;
  const {members,logicalSha256}=inspectFixtureArchive(await Bun.file(join(base,f.path)).bytes());
  if(observed.has(logicalSha256))throw Error('Duplicate fixture ZIP content: '+observed.get(logicalSha256)!.path+' and '+f.path);
  observed.set(logicalSha256,{id:f.id,path:f.path,members});archives++;
 }
 const oldIds=new Set<string>();
 for(const record of ledger.retired){
  if(oldIds.has(record.id)||byId.has(record.id)||record.id!=='fixture-'+record.sha256||!/^fixtures\/docx\/[a-z-]+\/[a-z0-9-]+\.docx$/.test(record.path)||!Number.isInteger(record.bytes)||record.bytes<=0)throw Error('Invalid retired fixture identity');
  oldIds.add(record.id);
  const retained=byId.get(record.retainedId);
  if(!retained||retained.role!=='fixture'||retained.path!==record.retainedPath||retained.sha256!==record.retainedSha256||retained.format!=='docx'||record.sha256===retained.sha256)throw Error('Invalid retained fixture identity');
  const current=observed.get(record.logicalSha256);
  if(!current||current.id!==retained.id||current.path!==retained.path||current.members.length!==record.members.length)throw Error('Retired fixture content differs from retained fixture');
  for(let i=0;i<record.members.length;i++){
   const member=record.members[i],match=current.members.find(m=>m.name===member.name);
   if(!match||match.sha256!==member.sha256||match.bytes!==member.bytes)throw Error('Retired fixture member drift: '+member.name);
  }
  if(!record.reason||!record.origins?.length||!record.historicalUse?.length||record.scenarioIds?.length)throw Error('Missing retired fixture custody or linked scenario');
 }
 return {archives,uniqueContents:observed.size,retired:oldIds.size};
}
