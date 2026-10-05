import {test,expect} from 'bun:test';
import {mkdtemp,mkdir,writeFile,rm,lstat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {verifySpecifications} from '../scripts/specifications.ts';
const sha=(s:string)=>new Bun.CryptoHasher('sha256').update(s).digest('hex');
async function fixture(run:(root:string,manifest:any,index:any,audit:any)=>Promise<void>){
 const scratch=process.env.OOXML_TEST_SCRATCH;
 const projectRoot=process.env.PROJECT_TMP_ROOT;
 if(!scratch||!projectRoot||resolve(scratch)!==scratch||resolve(projectRoot)!==projectRoot||!projectRoot.endsWith('/fixtures-ooxml')||!scratch.startsWith(projectRoot+'/runs/test/'))throw Error('Tests require owned fixtures-ooxml run scratch');
 const info=await lstat(scratch);
 if(!info.isDirectory()||info.isSymbolicLink()||info.uid!==process.getuid?.())throw Error('Unsafe test scratch');
 const root=await mkdtemp(join(scratch,'ecma-specs-'));try{
  await mkdir(join(root,'specs/ecma-376/part-1'),{recursive:true});
  const path='specs/ecma-376/part-1/spec.pdf',bytes='%PDF-test',hash=sha(bytes),revision='a'.repeat(40);
  const manifest={files:[{id:'asset-'+hash,path,bytes:bytes.length,sha256:hash,role:'specification',origins:[{repository:'https://example.invalid/spec',revision,path:'spec.pdf',sourceSha256:hash}]}]};
  const index={schemaVersion:1,authority:'ECMA-376 specification and its normative references',documents:[{id:'ecma-test',assetId:'asset-'+hash,path,bytes:bytes.length,sha256:hash,kind:'specification',authority:'normative',verbatim:true,part:1,edition:'5',publication:'2016-10',source:{repository:'https://example.invalid/spec',revision,path:'spec.pdf',sha256:hash},publisher:{archive:'https://example.invalid/spec.zip',archiveSha256:sha('archive'),member:'spec.pdf',memberSha256:hash,verifiedAgainst:'official-download'}}],excludedCopies:[]};
  const audit={schemaVersion:1,executionCredit:false,revisions:[{id:'current',revision,nativeTestFiles:1,staticTestDeclarations:1}],files:[{path:'x_test.go',sha256:sha('test'),bytes:4,sourceRevision:revision,originRef:'current',refs:['current'],kind:'native-test-source',tests:[{symbol:'TestA',kind:'test',line:1}],testCount:1}]};
  await writeFile(join(root,path),bytes);
  await writeFile(join(root,'specs/ecma-376/index.json'),JSON.stringify(index));
  await writeFile(join(root,'specs/ecma-376/go-test-index.json'),JSON.stringify(audit));
  await writeFile(join(root,'specs/ecma-376/deprecations.json'),JSON.stringify({schemaVersion:1,entries:[],reviewedDocuments:[],status:'incomplete'}));
  await run(root,manifest,index,audit);
 }finally{await rm(root,{recursive:true,force:true});}
}
test('specification bytes and source identity are required',async()=>fixture(async(root,manifest)=>{
 expect(await verifySpecifications(root,manifest)).toEqual({documents:1,testSourceVariants:1,deprecations:0});
 await writeFile(join(root,manifest.files[0].path),'changed');await expect(verifySpecifications(root,manifest)).rejects.toThrow('bytes');
}));
test('extracts cannot become normative and source hashes cannot drift',async()=>fixture(async(root,manifest,index)=>{
 index.documents[0].kind='extract';await writeFile(join(root,'specs/ecma-376/index.json'),JSON.stringify(index));await expect(verifySpecifications(root,manifest)).rejects.toThrow('authority');
 index.documents[0].kind='specification';index.documents[0].source.sha256=sha('other');await writeFile(join(root,'specs/ecma-376/index.json'),JSON.stringify(index));await expect(verifySpecifications(root,manifest)).rejects.toThrow('source');
}));
test('test source index rejects missing revisions and changed declaration counts',async()=>fixture(async(root,manifest,index,audit)=>{
 audit.files[0].refs=['missing'];await writeFile(join(root,'specs/ecma-376/go-test-index.json'),JSON.stringify(audit));await expect(verifySpecifications(root,manifest)).rejects.toThrow('revision');
 audit.files[0].refs=['current'];audit.files[0].testCount=2;await writeFile(join(root,'specs/ecma-376/go-test-index.json'),JSON.stringify(audit));await expect(verifySpecifications(root,manifest)).rejects.toThrow('count');
}));
test('unindexed specification material is rejected',async()=>fixture(async(root,manifest)=>{
 await writeFile(join(root,'specs/ecma-376/part-1/extra.pdf'),'unindexed');await expect(verifySpecifications(root,manifest)).rejects.toThrow('Unindexed');
}));
test('deprecation claims require a known specification, clause, exact quotation and profile',async()=>fixture(async(root,manifest)=>{
 const path=join(root,'specs/ecma-376/deprecations.json');
 await writeFile(path,JSON.stringify({schemaVersion:1,status:'incomplete',reviewedDocuments:[],entries:[{id:'d1',status:'deprecated',documentId:'ecma-test',clause:'17.1',quotation:'',profile:'unspecified'}]}));await expect(verifySpecifications(root,manifest)).rejects.toThrow('Deprecation');
}));

test('specification index cannot silently omit a manifest document',async()=>fixture(async(root,manifest,index)=>{
 const duplicate=structuredClone(manifest.files[0]);duplicate.id='asset-'+sha('different');duplicate.path='specs/ecma-376/part-1/missing.pdf';duplicate.sha256=sha('different');duplicate.bytes=9;manifest.files.push(duplicate);
 await expect(verifySpecifications(root,manifest)).rejects.toThrow('Unindexed');
}));
test('source revision totals must equal indexed files and declarations',async()=>fixture(async(root,manifest,index,audit)=>{
 audit.revisions[0].staticTestDeclarations=2;await writeFile(join(root,'specs/ecma-376/go-test-index.json'),JSON.stringify(audit));
 await expect(verifySpecifications(root,manifest)).rejects.toThrow('count');
}));
test('recorded deprecation can never use a derived note as its authority',async()=>fixture(async(root,manifest,index)=>{
 index.documents[0].kind='derived-note';index.documents[0].authority='informative';manifest.files[0].role='derived-note';await writeFile(join(root,'specs/ecma-376/index.json'),JSON.stringify(index));
 await writeFile(join(root,'specs/ecma-376/deprecations.json'),JSON.stringify({schemaVersion:1,status:'incomplete',reviewedDocuments:[],entries:[{id:'d1',status:'deprecated',documentId:'ecma-test',clause:'17.1',quotation:'deprecated',profile:'both',pdfPage:1,interpretation:'Use another element'}]}));
 await expect(verifySpecifications(root,manifest)).rejects.toThrow('Deprecation');
}));
test('imported PDFs retain the official publisher hashes',async()=>{
 const manifest=await Bun.file('manifest.json').json(),index=await Bun.file('specs/ecma-376/index.json').json();
 expect(index.documents.find((d:any)=>d.id==='ecma-376-1-2016').sha256).toBe('7cccfd0ad0e2ef89316acece15e44a8a088d0603ce4bba4e7b0361b50d13a37d');
 expect(index.documents.find((d:any)=>d.id==='ecma-376-2-2021').sha256).toBe('18701071fe15f39389761f82512c70d2effbf22bd16dd034f2939797ff5f6147');
 expect((await verifySpecifications(process.cwd(),manifest)).documents).toBe(7);
});

test('test source origin must occur among its referenced snapshots',async()=>fixture(async(root,manifest,index,audit)=>{
 audit.revisions.push({id:'other',revision:'b'.repeat(40),nativeTestFiles:0,staticTestDeclarations:0});audit.files[0].sourceRevision='b'.repeat(40);await writeFile(join(root,'specs/ecma-376/go-test-index.json'),JSON.stringify(audit));
 await expect(verifySpecifications(root,manifest)).rejects.toThrow('origin');
}));
test('an empty review cannot be labelled complete',async()=>fixture(async(root,manifest)=>{
 await writeFile(join(root,'specs/ecma-376/deprecations.json'),JSON.stringify({schemaVersion:1,status:'complete',reviewedDocuments:[],entries:[]}));
 await expect(verifySpecifications(root,manifest)).rejects.toThrow('complete');
}));

test('publisher downloads have URL and archive provenance without invented Git revisions',async()=>fixture(async(root,manifest,index)=>{
 const d=index.documents[0],source={kind:'publisher-download',url:'https://example.invalid/spec.zip',archiveSha256:sha('archive'),member:'spec.pdf',sha256:d.sha256};d.source=source;manifest.files[0].origins=[source];
 await writeFile(join(root,'specs/ecma-376/index.json'),JSON.stringify(index));expect((await verifySpecifications(root,manifest)).documents).toBe(1);
 d.source.member='different.pdf';await writeFile(join(root,'specs/ecma-376/index.json'),JSON.stringify(index));await expect(verifySpecifications(root,manifest)).rejects.toThrow('source');
}));

test('specification-linked font size and VML features compile exact outcomes',async()=>{
 const {cases}=await import('../scripts/verify.ts');
 const fontPath='workflows/docx/font-size.feature',vmlPath='workflows/xlsx/comment-vml-custody.feature';
 const font=cases(fontPath,await Bun.file(fontPath).text()),vml=cases(vmlPath,await Bun.file(vmlPath).text());
 expect(font).toHaveLength(1);expect(font[0]!.scenarioId).toBe('@id-docx-direct-font-size-half-points');expect(font[0]!.steps.some(s=>s.text.includes('w:val "21"'))).toBe(true);
 expect(vml).toHaveLength(6);expect(vml[1]!.steps.some(s=>s.text.includes('A6')&&s.text.includes('tail'))).toBe(true);expect(vml[1]!.steps.some(s=>s.text.includes('complete set of VML part names and payload bytes'))).toBe(true);expect(vml[5]!.scenarioId).toBe('@id-xlsx-comment-vml-limited-editor-refusal');
});

test('all 35 ECMA-named Go declarations have exact source lines and explicit scenario gaps',async()=>{
 const mapping=await Bun.file('specs/ecma-376/go-document-mappings.json').json(),audit=await Bun.file('specs/ecma-376/go-test-index.json').json(),ledger=await Bun.file('ledgers/workflows.json').json();
 const sourceFiles=mapping.sources.map((s:any)=>audit.files.find((f:any)=>f.path===s.path&&f.sha256===s.sha256));expect(sourceFiles.every(Boolean)).toBe(true);
 const declarations=sourceFiles.flatMap((f:any)=>f.tests.map((t:any)=>({path:f.path,symbol:t.symbol,line:t.line})));expect(declarations).toHaveLength(35);expect(mapping.declarations).toHaveLength(35);
 for(const d of declarations){const row=mapping.declarations.find((m:any)=>m.path===d.path&&m.symbol===d.symbol);expect(row?.line).toBe(d.line);expect(row?.executionCredit).toBe(false);expect(row?.observation.length).toBeGreaterThan(0);for(const id of row.scenarioIds)expect(ledger.workflows.some((w:any)=>w.id===id)).toBe(true);}
});

test('new workflow requirements distinguish normative rules from editor policy',async()=>{
 const r=await Bun.file('specs/ecma-376/workflow-requirements.json').json(),index=await Bun.file('specs/ecma-376/index.json').json(),ledger=await Bun.file('ledgers/workflows.json').json();
 expect(r.requirements).toHaveLength(7);expect(r.executionCredit).toBe(false);expect(new Set(r.requirements.map((q:any)=>q.scenarioId)).size).toBe(7);
 for(const q of r.requirements){expect(ledger.workflows.some((w:any)=>w.id===q.scenarioId&&w.feature===q.feature)).toBe(true);for(const s of q.specification){expect(index.documents.some((d:any)=>d.id===s.documentId&&d.kind==='specification')).toBe(true);expect(s.clause.length).toBeGreaterThan(0);expect(s.quotation.length).toBeGreaterThan(0);}}
 expect(r.requirements.filter((q:any)=>q.kind==='format-requirement')).toHaveLength(1);expect(r.requirements.filter((q:any)=>q.kind==='editor-policy')).toHaveLength(5);
});
