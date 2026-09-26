import {test,expect} from 'bun:test';
import {cases,verify} from '../scripts/verify.ts';
test('all pinned references and contract links verify',async()=>{const r=await verify();expect(r.assets).toBe(165);expect(r.facts).toBeGreaterThan(130);expect(r.workflows).toBeGreaterThanOrEqual(39);});
test('official Gherkin compilation expands shared cases',async()=>{const p='shared/v2/pack/features/mutation-safety.feature';const result=cases(p,await Bun.file(p).text());expect(result).toHaveLength(19);expect(new Set(result.map(r=>r.scenarioId)).size).toBe(8);});
test('workflow identity is required',()=>{expect(()=>cases('bad.feature','Feature: Bad\n Scenario: unnamed\n  Given input\n')).toThrow();});
