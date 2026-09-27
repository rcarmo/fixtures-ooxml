import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';

const path='workflows/package/data-descriptor-integrity.feature';
const id='@id-zip-unsigned-descriptor-signature-collision';

test('unsigned descriptor/signature ambiguity keeps geometry, CRC refusal and byte custody separate from generic ZIP cases',async()=>{
 const m=await Bun.file('manifest.json').json(),w=await Bun.file('ledgers/workflows.json').json(),text=await Bun.file(path).text(),rows=cases(path,text),asset=m.files.find((a:any)=>a.path===path);
 expect(rows).toHaveLength(1);expect(rows[0]!.scenarioId).toBe(id);
 expect(asset.role).toBe('workflow');expect(asset.sha256).toBe(new Bun.CryptoHasher('sha256').update(await Bun.file(path).bytes()).digest('hex'));
 const steps=rows[0]!.steps.map(s=>s.text);
 for(const predicate of [
  'a single-disk ZIP32 archive has one DEFLATED data.bin member with declared size 7 and stored payload "payload"',
  'its unsigned twelve-byte data descriptor and central directory both declare CRC32 08074B50, equal to the optional descriptor signature value',
  'independent CRC32 of the decompressed payload differs from 08074B50',
  'the unsigned descriptor is recognised as twelve bytes without borrowing a four-byte signature or central-directory bytes',
  'complete admission refuses the corrupt payload as a CRC or invalid-package failure, not as an ambiguous descriptor-shape failure',
  'no package or member payloads are delivered',
  "the caller's original archive bytes remain unchanged",
 ])expect(steps).toContain(predicate);
 const owner=w.workflows.find((x:any)=>x.id===id);expect(owner.feature).toBe(path);expect(owner.expandedCases).toBe(1);expect(Object.keys(owner.consumers).sort()).toEqual(['bun','go','python']);expect(Object.values(owner.consumers).every((c:any)=>c.status==='planned')).toBe(true);
});

test('Go source candidate and native observation retain their distinct inputs without borrowed execution',async()=>{
 const l=await Bun.file('ledgers/functional-equivalence.json').json(),r=l.goDescriptorAmbiguityParity,s=await Bun.file('ledgers/feature-source-consolidation.json').json();
 expect(r.canonicalId).toBe(id);expect(r.sourceId).toBe('@candidate-go-archive-004');expect(r.sourceStatus).toBe('partial-overlap-source-retained');expect(r.executionCredit).toBe(false);
 expect(r.sourceSha256).toBe(s.candidates.find((x:any)=>x.path===r.sourcePath).historicalSourceSha256??s.candidates.find((x:any)=>x.path===r.sourcePath).sha256);
 expect((await Bun.file(r.sourcePath).text())).toContain('@candidate-go-archive-004');
 expect(r.nativeObservation.declaration).toBe('TestZIPDescriptorAndPrefixBatch/unsigned descriptor whose CRC equals signature');
 expect(Object.keys(r.consumerGaps).sort()).toEqual(['bun','go','python']);
});
