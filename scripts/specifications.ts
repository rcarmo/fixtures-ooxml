import {join} from 'node:path';
const hex=(s:unknown,n:number)=>typeof s==='string'&&new RegExp(`^[0-9a-f]{${n}}$`).test(s);
const text=(s:unknown)=>typeof s==='string'&&s.trim().length>0;
const safe=(s:unknown):s is string=>typeof s==='string'&&!s.startsWith('/')&&!s.includes('\\')&&s.split('/').every(p=>p&&p!=='.'&&p!=='..');
const hash=(bytes:Uint8Array)=>new Bun.CryptoHasher('sha256').update(bytes).digest('hex');
export async function verifySpecifications(base:string,manifest:any):Promise<{documents:number;testSourceVariants:number;deprecations:number}> {
 const prefix='specs/ecma-376/',index=await Bun.file(join(base,prefix+'index.json')).json();
 if(index.schemaVersion!==1||index.authority!=='ECMA-376 specification and its normative references'||!Array.isArray(index.documents)||!index.documents.length)throw Error('Invalid specification index');
 const ids=new Map<string,any>(),paths=new Set<string>();
 for(const d of index.documents){
  if(!text(d.id)||ids.has(d.id)||!safe(d.path)||!d.path.startsWith(prefix)||paths.has(d.path)||!hex(d.sha256,64)||d.verbatim!==true)throw Error('Invalid specification identity');
  if(!['specification','extract','derived-note'].includes(d.kind)||d.authority!==(d.kind==='specification'?'normative':'informative'))throw Error('Invalid specification authority');
  if(!Number.isInteger(d.part)||d.part<1||d.part>4||d.kind==='specification'&&(!text(d.edition)||!text(d.publication)))throw Error('Missing specification edition/part');
  const asset=manifest.files.find((a:any)=>a.id===d.assetId);
  if(!asset||asset.path!==d.path||asset.sha256!==d.sha256||asset.bytes!==d.bytes||asset.role!==d.kind)throw Error('Specification manifest mismatch');
  const s=d.source;if(!s||s.sha256!==d.sha256)throw Error('Specification source mismatch');
  if(s.kind==='publisher-download'){
   if(!/^https:\/\//.test(s.url)||!hex(s.archiveSha256,64)||!text(s.member)||s.url!==d.publisher?.archive||s.archiveSha256!==d.publisher?.archiveSha256||s.member!==d.publisher?.member||!asset.origins.some((o:any)=>o.kind===s.kind&&o.url===s.url&&o.archiveSha256===s.archiveSha256&&o.member===s.member&&o.sha256===s.sha256))throw Error('Specification publisher source mismatch');
  }else if(!hex(s.revision,40)||!text(s.repository)||!safe(s.path)||!asset.origins.some((o:any)=>o.repository===s.repository&&o.revision===s.revision&&o.path===s.path&&o.sourceSha256===s.sha256))throw Error('Specification source mismatch');
  if(d.kind==='specification'&&(!d.publisher||d.publisher.verifiedAgainst!=='official-download'||!/^https:\/\//.test(d.publisher.archive)||!hex(d.publisher.archiveSha256,64)||!text(d.publisher.member)||d.publisher.memberSha256!==d.sha256))throw Error('Specification publisher mismatch');
  const bytes=await Bun.file(join(base,d.path)).bytes();if(bytes.length!==d.bytes||hash(bytes)!==d.sha256)throw Error('Specification bytes changed: '+d.path);
  ids.set(d.id,d);paths.add(d.path);
 }
 for(const asset of manifest.files)if(['specification','extract','derived-note'].includes(asset.role)&&!paths.has(asset.path))throw Error('Unindexed manifest specification: '+asset.path);
 for await(const file of new Bun.Glob('**/*').scan({cwd:join(base,prefix),onlyFiles:true}))if(/\.(pdf|md)$/i.test(file)&&file!=='README.md'&&!paths.has(prefix+file))throw Error('Unindexed specification material: '+file);
 for(const excluded of index.excludedCopies??[])if(!hex(excluded.sha256,64)||!ids.has(excluded.originalDocument)||[...ids.values()].some(d=>d.sha256===excluded.sha256))throw Error('Altered specification admitted');
 const audit=await Bun.file(join(base,prefix+'go-test-index.json')).json();
 if(audit.schemaVersion!==1||audit.executionCredit!==false||!Array.isArray(audit.revisions)||!Array.isArray(audit.files))throw Error('Invalid specification test index');
 const revisions=new Map<string,any>();for(const r of audit.revisions){if(!text(r.id)||revisions.has(r.id)||!hex(r.revision,40))throw Error('Invalid source revision');revisions.set(r.id,r);}
 const keys=new Set<string>(),perRef=new Map<string,Set<string>>();
 for(const f of audit.files){
  const key=f.path+'|'+f.sha256;
  if(!safe(f.path)||!hex(f.sha256,64)||!Number.isInteger(f.bytes)||f.bytes<0||keys.has(key))throw Error('Invalid source file identity');keys.add(key);
  if(!hex(f.sourceRevision,40)||![...revisions.values()].some(r=>r.revision===f.sourceRevision)||!Array.isArray(f.refs)||!f.refs.length||new Set(f.refs).size!==f.refs.length||f.refs.some((r:string)=>!revisions.has(r)))throw Error('Invalid source revision reference');
  if(!text(f.originRef)||!f.refs.includes(f.originRef)||revisions.get(f.originRef)?.revision!==f.sourceRevision)throw Error('Source origin is absent from referenced snapshots');
  for(const ref of f.refs){const paths=perRef.get(ref)??new Set<string>();if(paths.has(f.path))throw Error('Duplicate source path for revision');paths.add(f.path);perRef.set(ref,paths);}
  if(f.tests!==undefined){if(!Array.isArray(f.tests)||f.testCount!==f.tests.length||new Set(f.tests.map((t:any)=>t.symbol)).size!==f.tests.length||f.tests.some((t:any)=>!text(t.symbol)||!Number.isInteger(t.line)||t.line<1))throw Error('Invalid source test count or symbol');}
  if(f.scenarios!==undefined&&(!Array.isArray(f.scenarios)||f.scenarioCount!==f.scenarios.length||f.scenarios.some((s:any)=>!text(s))))throw Error('Invalid source scenario count');
  if(f.centralDocumentId!=null){const d=ids.get(f.centralDocumentId);if(!d||d.source.path!==f.path||d.sha256!==f.sha256)throw Error('Specification source link mismatch');}
 }
 for(const revision of audit.revisions){
  const files=audit.files.filter((f:any)=>f.refs.includes(revision.id)&&Array.isArray(f.tests));
  if(files.length!==revision.nativeTestFiles||files.reduce((n:number,f:any)=>n+f.tests.length,0)!==revision.staticTestDeclarations)throw Error('Source revision count mismatch: '+revision.id);
 }
 const dep=await Bun.file(join(base,prefix+'deprecations.json')).json();
 if(dep.schemaVersion!==1||!['incomplete','complete'].includes(dep.status)||!Array.isArray(dep.entries)||!Array.isArray(dep.reviewedDocuments))throw Error('Invalid deprecation register');
 if(dep.reviewedDocuments.some((id:string)=>ids.get(id)?.kind!=='specification')||new Set(dep.reviewedDocuments).size!==dep.reviewedDocuments.length)throw Error('Deprecation review references unknown specification');
 if(dep.status==='complete'&&([1,2,3,4].some(part=>![...ids.values()].some(d=>d.kind==='specification'&&d.part===part&&dep.reviewedDocuments.includes(d.id)))||(dep.pending?.length??0)>0))throw Error('Deprecation review cannot be complete with unreviewed parts');
 const depIds=new Set<string>();for(const entry of dep.entries){
  if(!text(entry.id)||depIds.has(entry.id)||!['deprecated','removed','transitional-only'].includes(entry.status)||ids.get(entry.documentId)?.kind!=='specification'||!text(entry.clause)||!text(entry.quotation)||!['strict','transitional','both','not-applicable'].includes(entry.profile)||!Number.isInteger(entry.pdfPage)||entry.pdfPage<1||!text(entry.interpretation))throw Error('Deprecation needs specification, clause, quote, page and profile');depIds.add(entry.id);
 }
 return {documents:ids.size,testSourceVariants:keys.size,deprecations:depIds.size};
}
