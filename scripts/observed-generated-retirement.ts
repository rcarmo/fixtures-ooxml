import {join} from 'node:path';

const sourceCommit='5f07417b26d199e7b6c033fcb90773ae4208e1e3';
const sourceManifestSha256='e970c290ce768fb9ada8f40fd83d79e68265d82c0d2131648b3cfcc0217bcfb3';
const retiredRecordsSha256='5242c7fcc7e49387dca3c58a14fe2742024267a2f565e2527cb27ad3cf879342';
const sha=(data:string)=>new Bun.CryptoHasher('sha256').update(data).digest('hex');

/** Check the separate v0.43 retirement custody without treating removed IDs as aliases. */
export async function verifyObservedGeneratedRetirement(base:string,manifest:{files:any[]}):Promise<number>{
 const ledger=await Bun.file(join(base,'ledgers/observed-generated-retirement.json')).json();
 if(ledger.schemaVersion!==1||ledger.releaseSource.repository!=='https://github.com/rcarmo/fixtures-ooxml'||ledger.releaseSource.commit!==sourceCommit||ledger.releaseSource.tag!=='v0.43.0'||ledger.releaseSource.manifestSha256!==sourceManifestSha256||ledger.retired?.length!==35||sha(JSON.stringify(ledger.retired))!==retiredRecordsSha256)throw Error('Invalid observed-generated retirement source');
 const active=new Set(manifest.files.map(f=>f.id)),paths=new Set(manifest.files.map(f=>f.path));
 const ids=new Set<string>(),retiredPaths=new Set<string>();
 const formats=new Map<string,number>();
 for(const r of ledger.retired){
  if(ids.has(r.id)||retiredPaths.has(r.path)||active.has(r.id)||paths.has(r.path)||await Bun.file(join(base,r.path)).exists()||r.id!=='fixture-'+r.sha256||!/^fixtures\/(docx|pptx|xlsx)\/[a-z-]+\/[a-z0-9-]+-[a-f0-9]{12}\.(docx|pptx|xlsx)$/.test(r.path)||r.path.split('/')[1]!==r.format||!Number.isInteger(r.bytes)||r.bytes<=0)throw Error('Invalid retired observed-generated identity: '+r.path);
  if(r.role!=='fixture'||r.scenarioIds?.length||!r.origins?.length||!r.origins.every((o:any)=>o.kind==='observed-generated'&&o.repository==='https://github.com/rcarmo/go-ooxml'&&o.manifestRevision&&o.manifestPath&&o.manifestSha256&&o.path&&o.qualification)||!r.reason)throw Error('Missing observed-generated custody: '+r.path);
  ids.add(r.id);retiredPaths.add(r.path);formats.set(r.format,(formats.get(r.format)||0)+1);
 }
 if(formats.get('docx')!==12||formats.get('pptx')!==12||formats.get('xlsx')!==11||sha([...ids].sort().join('\n'))!=='10b341796c7823b93f683f73cca1e62331d91e83e6586f6d11bf5bcc947fe2ae')throw Error('Observed-generated retirement set differs from v0.43');
 return ids.size;
}
