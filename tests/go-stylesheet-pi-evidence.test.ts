import {historicalWorkflowLedger} from './xml-generalization-helpers.ts';
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

test('Go credits only acceptance of literal pre-root stylesheet PI and root r',async()=>{
 const id='@id-xml-stylesheet-processing-instruction',feature='workflows/xml/parsing.feature';
 const ledger=await historicalWorkflowLedger();
 const prior=JSON.parse(execFileSync('git',['show','c43193aa0904c888bf4e6798a8f5692201dd31fd:ledgers/workflows.json']).toString());
 const now=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
 const selected=cases(feature,await Bun.file(feature).text()).filter((c:any)=>c.scenarioId===id);
 expect(now.feature).toBe(feature);expect(now.expandedCases).toBe(1);expect(selected).toHaveLength(1);
 expect(selected[0].name).toBe('Accept a stylesheet processing instruction before the root');
 expect(selected[0].steps.map((s:any)=>s.text)).toEqual([
  'XML values input encoded as JSON "<?xml-stylesheet href=\\"style.xsl\\"?><r/>"',
  'the XML values input is parsed',
  'the root qualified name equals r',
 ]);
 expect(now.expectedOutcomes).toEqual(selected[0].steps.slice(2).map((s:any)=>s.text));
 expect(old.consumers.go.status).toBe('planned');expect(now.consumers.go.status).toBe('implemented');
 for(const marker of ['2222319800b3f8403b73de1cd90f7c3ec8c349db','shared v0.130.0','acceptance/{acceptance,feature_roots,inventory,xml_stylesheet_pi,xml_entity_values}_test.go','tag line 51','Scenario and Pickle line 52','422 cases/1453 steps','Go has no GitHub Actions CI'])expect(now.consumers.go.evidence).toContain(marker);
 expect(now.consumers.bun).toEqual(old.consumers.bun);expect(now.consumers.python).toEqual(old.consumers.python);
 const unchanged=structuredClone(now);unchanged.consumers.go=old.consumers.go;expect(unchanged).toEqual(old);
 for(const sibling of ['@id-xml-entity-values','@id-xml-normalise-line-endings','@id-xml-typed-parse-error','@id-xml-comparison-prefix-and-opc-order'])expect(ledger.workflows.find((w:any)=>w.id===sibling)).toEqual(prior.workflows.find((w:any)=>w.id===sibling));
 expect(ledger.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!==id)).toEqual(prior.workflows.filter((w:any)=>w.id!=="@id-python-word-anchor-headings-paragraphs"&&w.id!=="@id-python-comments-reply-auto-resolve"&&w.id!=="@id-python-comments-threaded-reply"&&w.id!=="@id-python-comments-filter-predicates"&&w.id!=="@id-python-comments-create-extension"&&w.id!=="@id-python-comments-ids-fallback"&&w.id!=="@id-python-comments-reply-root-resolution"&&w.id!=="@id-python-comments-reopen-filter"&&w.id!=="@id-python-comments-resolved-filter"&&w.id!=="@id-python-comments-mixed-done"&&w.id!=='@id-xml-escaping-whitespace-roundtrip'&&w.id!=='@id-package-admission-unsafe-members'&&w.id!=='@id-package-admission-unsupported-compression'&&w.id!=='@id-opc-package-corpus-noop'&&w.id!=="@id-bun-opc-detached-byte-copies"&&w.id!=="@id-opc-package-preserve-unrelated"&&w.id!=="@id-docx-comments-noop"&&w.id!=="@id-xml-expanded-attribute-lookup"&&w.id!=="@id-docx-comments-resolution"&&w.id!=="@id-xml-implicit-xml-prefix"&&w.id!=="@id-xml-go-immutable-leaf-seed"&&w.id!==id));
});
