const goFormulaAnalysisIds = new Set(['@id-xlsx-go-formula-analysis-counts','@id-xlsx-go-formula-quoted-sheet-flags','@id-xlsx-go-formula-analysis-refusal']);
const pageLayoutIds = new Set(['@id-docx-final-section-layout','@id-docx-final-section-layout-refusal']);
const effectiveIds = new Set(['@id-docx-effective-run-formatting','@id-docx-effective-run-formatting-refusal']);
const trackingIds = new Set(['persistence','custody','no-op','refusal','rollback','plain-edit','author-refusal'].map(name => '@id-docx-tracking-settings-'+name));
const goDirectRangeIds = new Set(['@id-xlsx-go-direct-range-parsing','@id-xlsx-go-direct-range-refusal']);
const formulaIds = new Set(["@id-xlsx-go-formula-analysis-counts","@id-xlsx-go-formula-quoted-sheet-flags","@id-xlsx-go-formula-analysis-refusal","@id-xlsx-go-formula-literal-punctuation","@id-xlsx-go-direct-range-parsing","@id-xlsx-go-direct-range-refusal","@id-xlsx-go-static-remap-exact","@id-xlsx-go-static-remap-refusal","@id-xlsx-go-static-reference-properties"]);
const commentVmlId = '@id-xlsx-comment-vml-existing-graph';
const cellStyleIds = new Set(["@id-xlsx-cell-style-selection","@id-xlsx-cell-style-refusal"]);
const xlsxCreateIds = new Set(["@id-xlsx-create-native-default","@id-xlsx-create-add-worksheet","@id-xlsx-create-prefixed-missing-cell","@id-xlsx-create-coordinate-boundary","@id-xlsx-create-row-ordering","@id-xlsx-create-invalid-params-atomic","@id-xlsx-create-existing-fixture-append"]);
const slideOrderIds = new Set(["@id-pptx-slide-permutation","@id-pptx-slide-permutation-refusal"]);
const textBoxIds = new Set(["@id-pptx-text-box-authoring","@id-pptx-text-box-refusal"]);
const pptxTableIds = new Set(["@id-pptx-table-roundtrip-geometry","@id-pptx-table-formatting","@id-pptx-table-stale-handle","@id-pptx-table-atomic-refusals"]);
const pptxNoopId = new Set(['@id-pptx-bun-open-save-noop']);
const threadIds = new Set(["@id-docx-existing-thread-inspection","@id-docx-existing-thread-resolution","@id-docx-existing-thread-noop","@id-docx-existing-thread-refusal","@id-docx-existing-thread-rollback","@id-docx-existing-thread-encoding","@id-docx-existing-thread-unsupported","@id-docx-existing-thread-limit"]);
const commentIds = new Set(["@id-docx-comments-inspection","@id-docx-comments-resolution","@id-docx-comments-noop","@id-docx-comments-refusal"]);
const relationshipIds = new Set(["@id-office-relationship-prefix-alias","@id-office-relationship-wrong-uri"]);
const custodyIds = new Set(["@id-bun-opc-open-refusal","@id-bun-opc-detached-byte-copies","@id-bun-opc-preserve-utf16le-edit","@id-bun-opc-async-transaction-refusal","@id-bun-opc-thenable-transaction-result","@id-bun-opc-save-invalid-target-custody","@id-bun-opc-symlink-destination-refusal"]);
const coreOpcIds = new Set(["@id-opc-package-corpus-noop","@id-opc-package-transaction-rollback","@id-opc-package-preserve-unrelated"]);
const budgetId = new Set(['@id-package-admission-negative-budget']);
const descriptorId = new Set(['@id-zip-unsigned-descriptor-signature-collision']);
const boundId = new Set(['@id-zip-bounds']);
const unsafeId = new Set(['@id-zip-refuse-unsafe']);
const positiveIds = new Set(["@id-zip-read-valid","@id-zip-write-deterministic"]);
import {test,expect} from 'bun:test';
import {execFileSync} from 'node:child_process';
import {cases} from '../scripts/verify.ts';

const path='workflows/docx/tables.feature',fixture='fixture-8192955ef935f09eb61a9fe6805d4996c811efcf54c0c966f52d983e38e0a79c';
const specs=[
 {id:'@id-docx-table-create-roundtrip',steps:[['DOCX table source "new-document" is prepared','DOCX table 2x2 is appended','DOCX table 1 cell (0,0) text is set to "  <Alpha & Beta>  "','DOCX table 1 cell (1,1) text is set to "line 1\\r\\nline 2"','DOCX table document is saved and reopened','DOCX table 1 has 2 rows and 2 columns','DOCX table 1 cell (0,0) text equals "  <Alpha & Beta>  "','DOCX table 1 cell (1,1) text equals "line 1\\nline 2"','DOCX table 1 is stored before the section properties','DOCX table 1 cell (0,0) XML preserves boundary spaces and escapes special characters']],outcomes:5,markers:['all ten exact','normalized newline','saved and reopened']},
 {id:'@id-docx-table-opaque-preserve',steps:[[ `DOCX table source "${fixture}" is prepared`,'DOCX table opaque part "docProps/core.xml" bytes are remembered','DOCX table 1 cell (1,0) text is set to "Voltaic battery"','DOCX table document is saved and reopened','DOCX table 1 has 4 rows and 3 columns','DOCX table 1 cell (1,0) text equals "Voltaic battery"','DOCX table opaque part "docProps/core.xml" bytes are unchanged']],outcomes:3,markers:['all seven exact','docProps/core.xml','save/reopen']},
 {id:'@id-docx-table-stale-cell',steps:[['DOCX table source "new-document" is prepared','DOCX table 1x1 is appended','DOCX table 1 cell (0,0) is remembered','DOCX table 1x1 is appended','DOCX table current saved bytes are remembered','DOCX table stale text set to "stale write" is attempted on the remembered cell','DOCX table refusal code equals "docx-stale-table-cell"','DOCX table saved bytes equal the remembered bytes']],outcomes:2,markers:['all eight exact','docx-stale-table-cell','baseline']},
 {id:'@id-docx-table-atomic-refusals',steps:[`${fixture}|row-oob|range`,'native-merged-nested|merged-cell|docx-table-merged-cell','native-merged-nested|nested-cell|docx-table-cell-unsupported','synthetic-grid-before|bizarre|docx-table-unsupported'].map(line=>{const [source,name,code]=line.split('|');return [`DOCX table source "${source}" is prepared`,'DOCX table current saved bytes are remembered',`DOCX table refusal "${name}" is attempted`,`DOCX table refusal code equals "${code}"`,'DOCX table saved bytes equal the remembered bytes']}),outcomes:0,markers:['four exact five-step','RangeError','baseline bytes']},
];
test('Bun executes seven exact DOCX table authoring cases without Go or Python credit',async()=>{
 const ledger=await Bun.file('ledgers/workflows.json').json();
 const prior=JSON.parse(execFileSync('git',['show','a3d7f069e7ecf44e7ad856140419ab762a525629:ledgers/workflows.json']).toString());
 const rows=cases(path,await Bun.file(path).text());
 for(const {id,steps,outcomes,markers} of specs){
  const current=ledger.workflows.find((w:any)=>w.id===id),old=prior.workflows.find((w:any)=>w.id===id);
  expect(current.feature).toBe(path);expect(current.expandedCases).toBe(steps.length);
  expect(rows.filter((r:any)=>r.scenarioId===id).map((r:any)=>r.steps.map((s:any)=>s.text))).toEqual(steps);
  if(outcomes)expect(current.expectedOutcomes).toEqual(steps[0]!.slice(-outcomes));
  else expect(current.expectedOutcomes).toEqual([...new Set(steps.flatMap(row=>row.slice(-2)))]);
  expect(old.consumers.bun.status).toBe('planned');expect(current.consumers.bun.status).toBe('implemented');
  expect(current.consumers.go).toEqual(old.consumers.go);expect(current.consumers.python).toEqual(old.consumers.python);
  for(const marker of [...markers,'7d5f43dc8ed1edf8109294f5ba6ca8d59c23990e','Fresh GitHub recursive make check','732/732','canonical table'])expect(current.consumers.bun.evidence).toContain(marker);
  const unchanged=structuredClone(current);unchanged.consumers.bun=old.consumers.bun;expect(unchanged).toEqual(old);
 }
 const ids=new Set([...specs.map(s=>s.id),'@id-docx-direct-font-size-half-points','@id-xml-parse-offsets','@id-xml-normalise-line-endings','@id-xml-parse-refusals','@id-xml-parse-bounds', '@id-xml-apply-edits', '@id-xml-entity-values', '@id-xml-stylesheet-processing-instruction', '@id-xml-expanded-attribute-lookup', '@id-xml-implicit-xml-prefix', '@id-xml-prototype-safe-attributes', '@id-xml-immutable-namespace-metadata', '@id-xml-escaping-values', '@id-xml-escaping-invalid-character', '@id-xml-escaping-whitespace-roundtrip', '@id-xml-typed-parse-error', '@id-xml-invalid-qname-components', '@id-xml-unicode-qname-components', '@id-xml-outside-root-nbsp', '@id-xml-comparison-prefix-and-opc-order', '@id-xml-comparison-significant-content', '@id-xml-comparison-prefix-attribute-binding', '@id-xml-comparison-unsafe-input', '@id-xml-comparison-processing-instructions-and-comments', '@id-package-admission-unsafe-members', '@id-package-admission-resource-limits', '@id-package-admission-unsupported-compression', '@id-package-admission-unsafe-xml-members', '@id-package-diff-equivalent-xml-and-binary-changes', '@id-zip-crc32-standard-vector', '@id-bun-zip32-reader-refusal', '@id-bun-zip32-writer-refusal', '@id-bun-zip32-configured-bounds']);expect(ledger.workflows.filter((w:any)=>!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id))).toEqual(prior.workflows.filter((w:any)=>!goFormulaAnalysisIds.has(w.id)&&!pageLayoutIds.has(w.id)&&!effectiveIds.has(w.id)&&!trackingIds.has(w.id)&&!goDirectRangeIds.has(w.id)&&!formulaIds.has(w.id)&&w.id!==commentVmlId&&!cellStyleIds.has(w.id)&&!xlsxCreateIds.has(w.id)&&!slideOrderIds.has(w.id)&&!textBoxIds.has(w.id)&&!pptxTableIds.has(w.id)&&!pptxNoopId.has(w.id)&&!threadIds.has(w.id)&&!commentIds.has(w.id)&&!relationshipIds.has(w.id)&&!custodyIds.has(w.id)&&!coreOpcIds.has(w.id)&&!budgetId.has(w.id)&&!descriptorId.has(w.id)&&!boundId.has(w.id)&&!unsafeId.has(w.id)&&!positiveIds.has(w.id)&&!ids.has(w.id)));
});
