import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const source='380ba5ae65674a0a544fa283bf5683e8a979495e';
const id='@id-xlsx-cross-sheet-cache-invalidation';
const path='workflows/xlsx/formula-cache.feature';

test('published Go cross-sheet case replaces one native selection without changing any other workflow',async()=>{
 const registry=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show',`${source}:ledgers/workflows.json`]).toString());
 const entry=registry.workflows.find((w:any)=>w.id===id),former=prior.workflows.find((w:any)=>w.id===id);
 expect(entry?.feature).toBe(path);expect(entry?.expandedCases).toBe(1);
 expect(cases(path,await Bun.file(path).text()).filter(c=>c.scenarioId===id)).toHaveLength(1);
 expect(former.consumers.go.status).toBe('planned');expect(entry.consumers.go.status).toBe('implemented');
 for(const marker of ['d929fc78b52b2ab28c3695eec486761414c7aede','@CACHE-001','14-step','294 selected cases/1013 steps/0 other','go-cache-github-published-gate.log','0fa74dad775f9458ce9212ed8c8dac84ce18cadea9fcc511c5c02557cb573e5a'])expect(entry.consumers.go.evidence).toContain(marker);
 const unchanged=structuredClone(entry);unchanged.consumers.go=former.consumers.go;
 expect(unchanged).toEqual(former);
 const visibility='workflows/pptx/slide-visibility.feature';
 expect(registry.features.filter((p:string)=>p!==visibility)).toEqual(prior.features);
 const exceptions=new Set([id,'@id-xlsx-owned-calculation-chain-invalidation','@id-zip-physical-member-overlap-refusal','@id-office-xlsx-independent-style-reader','@id-docx-go-run-effects-getters','@id-docx-go-run-underline-style','@id-docx-go-run-font-name','@id-docx-go-run-color-getter','@id-docx-go-run-highlight','@id-docx-go-run-vertical-align','@id-docx-go-roundtrip-selected-formatting','@id-docx-go-table-merge-properties','@id-docx-go-table-style-getter','@id-docx-go-table-header-getter','@id-docx-go-cell-shading-getter','@id-docx-go-cell-properties-getters','@id-docx-go-table-dimensions-getters','@id-docx-go-table-cell-access','@id-docx-go-table-cell-text-getters','@id-docx-go-table-row-counts']);
 expect(registry.workflows.filter((w:any)=>!exceptions.has(w.id)&&w.feature!==visibility)).toEqual(prior.workflows.filter((w:any)=>!exceptions.has(w.id)));
});
