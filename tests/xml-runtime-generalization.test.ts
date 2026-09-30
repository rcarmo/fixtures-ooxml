import {test, expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';
import {parseFeature} from '../scripts/feature-catalogue.ts';
import {beforeXmlGeneralizationCase, historicalXmlFeature, historicalWorkflowLedger, beforeLexicalAlignmentFeature} from './xml-generalization-helpers.ts';

const path = 'workflows/xml/parsing.feature';
test('XML generalization preserves every other scenario and exact operands; only three reviewed contracts change', async () => {
  const m = await Bun.file('ledgers/xml-runtime-generalization.json').json();
  const oldText = execFileSync('git', ['show', m.sourceRevision + ':' + path], {encoding:'utf8'});
  expect(m.beforeText).toBe(oldText);
  const text = beforeLexicalAlignmentFeature(path,await Bun.file(path).text()), old = cases(path,oldText), now = cases(path,text);
  expect(m.retiredScenarioIds).toEqual([]); expect(m.executionCredit).toBe(false);
  expect(m.scenarios.map((s:any)=>s.id)).toEqual(['@id-xml-prototype-safe-attributes','@id-xml-immutable-namespace-metadata','@id-xml-typed-parse-error']);
  expect(now).toHaveLength(15); expect(parseFeature(path,text).scenarios).toHaveLength(14);
  expect(now.map(beforeXmlGeneralizationCase)).toEqual(old);
  for (const s of m.scenarios) {
    const row = now.filter(r=>r.scenarioId===s.id);
    expect(row).toEqual(s.after); expect(s.before).toEqual(old.filter(r=>r.scenarioId===s.id));
    expect(row[0].steps[0]).toEqual(s.before[0].steps[0]);
  }
  expect(m.scenarios.map((s:any)=>s.after[0].steps.length)).toEqual([5,6,4]);
  expect(text).not.toMatch(/null prototype|own attribute|frozen and|OoxmlError instance|@profile-javascript/);
  expect(text).toContain('fresh namespace and attribute reads still return urn:a and outer');
  expect(text).toContain('category malformed-xml and no document result');
  expect(text).toContain('the original XML source is unchanged');
});
test('historical normalization refuses unknown changes and never grants current execution credit', async () => {
  const raw = await Bun.file(path).text(), text = beforeLexicalAlignmentFeature(path,raw), m = await Bun.file('ledgers/xml-runtime-generalization.json').json();
  expect(historicalXmlFeature(path,raw)).toBe(m.beforeText);
  expect(()=>historicalXmlFeature(path,raw.replace('urn:a and outer','urn:wrong and outer'))).toThrow('Unreviewed');
  for (const s of m.scenarios) {
    const bad = structuredClone(s.after[0]); bad.steps.at(-1).text += ' but changed';
    expect(beforeXmlGeneralizationCase(bad)).toEqual(bad);
  }
  const historical = await historicalWorkflowLedger();
  for(const row of m.beforeLedgerRows)expect(historical.workflows.find((w:any)=>w.id===row.id)).toEqual(row);
  const current = await Bun.file('ledgers/workflows.json').json();
  for(const row of m.afterLedgerRows)expect(current.workflows.find((w:any)=>w.id===row.id)).toEqual(row);
});
