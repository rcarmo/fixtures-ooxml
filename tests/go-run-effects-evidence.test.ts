import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const id='@id-docx-go-run-effects-getters',path='workflows/docx/run-formatting.feature';
test('Go runs only the eight in-memory run-effect getter predicates',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json(),previous=JSON.parse(execFileSync('git',['show','12d878a6f3500f4c53b5792da7f8b1f390181ad5:ledgers/workflows.json']).toString());
 const entry=registry.workflows.find((w:any)=>w.id===id),prior=previous.workflows.find((w:any)=>w.id===id);
 expect(entry.feature).toBe(path);expect(entry.expandedCases).toBe(1);
 const rows=cases(path,await Bun.file(path).text()).filter(row=>row.scenarioId===id);
 expect(rows).toHaveLength(1);
 expect(rows[0]!.steps.map(step=>step.text)).toEqual([
  'a new Word run',
  'DoubleStrike, Caps, SmallCaps, Outline, Shadow, Emboss, Imprint and Vanish are set true',
  'all eight corresponding getters return true in memory',
 ]);
 expect(prior.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
 expect(entry.consumers.bun.status).toBe('planned');expect(entry.consumers.python.status).toBe('planned');
 for(const marker of ['7ebe1c4d81d9e9278e6df8055729240870af16a6','all three exact shared steps','eight per-getter clearing negative controls','295 selected cases/1016 steps/0 failures','reports/batches/177.md','no saved OOXML or rendering claim'])expect(entry.consumers.go.evidence).toContain(marker);
 const unchanged=structuredClone(entry);unchanged.consumers.go=prior.consumers.go;expect(unchanged).toEqual(prior);
 const newRunIds=new Set(['@id-docx-go-run-underline-style','@id-docx-go-run-font-name','@id-docx-go-run-color-getter','@id-docx-go-run-highlight','@id-docx-go-run-vertical-align','@id-docx-go-roundtrip-selected-formatting']);
 expect(registry.workflows.filter((w:any)=>w.id!==id&&!newRunIds.has(w.id))).toEqual(previous.workflows.filter((w:any)=>w.id!==id&&!newRunIds.has(w.id)));
});
