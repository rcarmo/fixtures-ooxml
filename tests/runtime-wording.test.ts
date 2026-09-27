import {test,expect} from 'bun:test';
import {cases} from '../scripts/verify.ts';
import {beforeWordingCase} from './runtime-wording-helpers.ts';
import {Parser,AstBuilder,GherkinClassicTokenMatcher,compile} from '@cucumber/gherkin';import {IdGenerator} from '@cucumber/messages';
const paths=['workflows/pptx/notes.feature','workflows/pptx/preservation.feature','workflows/package/zip64.feature','workflows/package/relationship-namespaces.feature'];
test('portable notes archive namespace and ZIP64 steps do not name an implementation',async()=>{
 for(const path of paths){const text=await Bun.file(path).text();for(const row of cases(path,text))for(const step of row.steps)expect(step.text).not.toMatch(/\b(?:Bun|Go|Python)\b/);expect(text).not.toMatch(/@profile-(?:bun|go|python)-/);}
});
test('wording comparison cannot conceal changed values arguments or unrelated predicates',async()=>{
 const text=await Bun.file('workflows/pptx/notes.feature').text(),row=cases('workflows/pptx/notes.feature',text).find(c=>c.scenarioId==='@id-pptx-go-notes-refusal-and-noop-custody')!;
 const baseline=beforeWordingCase(row),changed=structuredClone(row);changed.steps[0]!.text+=' changed';expect(beforeWordingCase(changed)).not.toEqual(baseline);
 const input=structuredClone(row);input.steps[3]!.text=input.steps[3]!.text.replace('FF','FE');expect(beforeWordingCase(input)).not.toEqual(baseline);
 const argument=structuredClone(row);argument.steps[0]!.argument={docString:{content:'changed'}} as any;expect(beforeWordingCase(argument)).not.toEqual(baseline);
 const wrongId={...row,scenarioId:'@id-unrelated'};expect(beforeWordingCase(wrongId).steps).toEqual(row.steps);
});
test('runtime wording migration explicitly preserves source IDs inputs and observable predicates',async()=>{
 const source=await Bun.file('ledgers/runtime-wording-migration.json').text(),migration=JSON.parse(source);
 // Fixed reviewed substitutions; changing this allowlist requires another review.
 expect(new Bun.CryptoHasher('sha256').update(source).digest('hex')).toBe('edc624056f3366e2b661bc521d0402591954f6560ae30241c0f50233f61fd564');
 expect(migration.sourceRevision).toBe('048dac539886751c414d3ab075aa1fc37e2e051d');expect(migration.files.map((f:any)=>f.path)).toEqual(paths);
 expect(migration.retiredScenarioIds).toEqual([]);expect(migration.executionCredit).toBe(false);
 expect(migration.files.flatMap((f:any)=>f.scenarios)).toHaveLength(16);
 for(const file of migration.files){const text=await Bun.file(file.path).text();expect(new Bun.CryptoHasher('sha256').update(text).digest('hex')).toBe(file.afterSha256);
  const gen=IdGenerator.incrementing(),doc=new Parser(new AstBuilder(gen),new GherkinClassicTokenMatcher()).parse(text),pickles=compile(doc,file.path,gen);
  const actual=cases(file.path,text);for(const record of file.scenarios){const rows=actual.filter(c=>c.scenarioId===record.id);expect(rows.map(c=>new Bun.CryptoHasher('sha256').update(JSON.stringify(c)).digest('hex'))).toEqual(record.afterCaseSha256);
   expect(rows.map(c=>new Bun.CryptoHasher('sha256').update(JSON.stringify(beforeWordingCase(c))).digest('hex'))).toEqual(record.beforeCaseSha256);
   expect(pickles.filter(p=>p.tags.some(t=>t.name===record.id)).map(p=>p.tags.map(t=>t.name).sort())).toEqual(record.afterTags);
  }
  for(const edit of file.stepRenames)expect(actual.filter(c=>c.scenarioId===edit.id).some(c=>c.steps.some(s=>s.text===edit.to))).toBe(true);
 }
});
