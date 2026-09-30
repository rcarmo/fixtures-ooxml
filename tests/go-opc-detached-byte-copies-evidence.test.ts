import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits one detached OPC byte-custody case, not background cases',async()=>{
 const id='@id-bun-opc-detached-byte-copies',feature='workflows/package/preservation.feature';
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','1eee21095f53ce30d76db6f04fc3f850b2c68290:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Caller and returned byte arrays cannot modify an opened package');
 const authored=[
  'the package editor opens the base archive bytes',
  "every byte in the caller's original archive array is overwritten with zero",
  'every byte in the array returned by get for word/document.xml is overwritten with zero',
  'a fresh get of word/document.xml contains the UTF-8 text Alpha',
  'serializing the package returns the exact original archive bytes',
 ];
 expect(selected[0].steps.slice(-5).map((s:any)=>s.text)).toEqual(authored);
 expect(selected[0].steps).toHaveLength(10);
 expect(now.expectedOutcomes).toEqual(authored.slice(-2));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['a7f7fa095f7641535eec2e326ff773e7cd4764f8','shared v0.137.0','acceptance/{acceptance,inventory,opc_detached_bytes}_test.go','reports/batches/283.md','three-member OPC ZIP','426 cases/1475 executed steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-bun-opc-open-refusal','@id-bun-opc-preserve-utf16le-edit','@id-opc-package-transaction-rollback','@id-opc-package-preserve-unrelated'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!==id));
});
