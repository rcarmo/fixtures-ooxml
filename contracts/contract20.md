# Contract20 package reads, creation and retained edits

This batch strengthens 20 existing IDs into 22 cases. The current feature draft compiles to 223 steps, including successful table intake before edit refusal. Recipe data supplies nine literal XLSX member maps and eleven transformations of sealed PPTX fixtures. No runtime execution credit is assigned during review.

## Public profile

Inputs are Unicode values, native bytes or paths, and owned targets. Success returns the requested value or edited result. Refusal has an exact typed category and no edited or partial result. Runtime API spelling may differ. An additive facade may map known native error types or codes to common categories. Unexpected library, programming and I/O exceptions propagate; diagnostic text cannot determine categories.

XLSX reads expose semantic records `{kind,value,formula?,cached?,styleIndex?}`. A facade may combine separate production formula and cache reads from the same immutable input. Formula bodies omit a display-only leading equals sign. Blanks and absent formula caches normalise to null. Numbers, Booleans and strings retain their types. Formula evaluation is outside this profile.

PPTX text and notes reads normalise DrawingML breaks to LF, retain intentional interior blank paragraphs and return visible field text without evaluating fields. Missing notes return `{hasNotes:false,text:""}` and create no part. Legacy read APIs remain unchanged.

Text and table handles belong to their session, owning slide part and snapshot generation. An edit to that part consumes or stales its old handles. Appending a different slide preserves a held anchor when its owning part and relationships are unchanged. Adding a second table on the same slide stales held table-cell handles. Foreign or forged handles refuse. Failed operations must leave unaffected targets usable.

## Independent inputs and custody

`contract20-recipes.json` specifies input data. XLSX maps enumerate member payloads, relationships, content types and valid style definitions. ZIP packing may choose compression and metadata independently. It must not use workbook APIs to construct acceptance inputs.

A PPTX recipe verifies its physical base fixture against the manifest, copies its member payloads in memory, then applies only the listed unique transformations. Physical fixture bytes remain unchanged. Recipe transformations do not enlarge output mutation allowances.

Reads change no input or member. Before an edit, record source bytes, caller archive, operands, members, graph identities and relevant held targets. Save to a distinct path. Independently inspect ZIP members, XML and graph values, then separately reopen through production APIs. Successful generated archives are judged by values and custody, without whole-ZIP equality.

Refusal or save failure preserves an existing destination, or leaves a previously absent destination absent. It publishes no partial output. Exact unselected member payloads and lexical spans are retained where the profile promises retained editing. Masks cover selected nodes or ranges; they cannot cover an entire worksheet, slide or property container to hide collateral changes.

## XLSX boundaries

The prefixed profile permits replacement of the complete original A1 and B1 cell spans because those cells are self-closing. Preserve their original `r`/`s` attributes and the literal `x` prefix. Only the original C1 `x:v` span may be removed, and exactly one qualified `x:calcPr` may be inserted. All intervening worksheet/workbook spans, styles and other members remain literal.

Changed ordinary inputs clear every ordinary formula cache in the enrolled worksheets, including independent `Summary!B1`, formula `40+2`, original cache 42. Preserve formula bodies. The workbook has one qualified `calcPr` with `calcMode="auto"`, `fullCalcOnLoad="1"`, `forceFullCalc="1"`. Setting original numeric `Model!A1=1` is a no-op and preserves caches and flags.

Direct shared/array anchor overwrites at Calc B2/D2 have distinct typed refusals. An ordinary input edit with an array or dataTable result range refuses at topology preflight, before parsing deliberately gated formula text `Model!A1*{1;2}`.

Opaque retention requires explicit opt-in and the exact recipe root edges: `cache1`/`urn:contract20:opaque/chart`/`xl/charts/cache-boundary.xml`, and `cache2`/`urn:contract20:opaque/external`/`xl/externalLinks/cache-boundary.xml`. Their typed content overrides are fixed. Semantic workbook/worksheet chart or external-owner edges must be absent. Caller labels cannot admit unknown, extra or outgoing semantic dependencies. Reject them before mutation. Retain both opaque cache payloads, including numeric 1, literally; chart refresh and external-link consistency are outside this profile.

## PPTX retained edits and refusal phase

Cross-run replacement consumes UTF-16 `[2,7)` (`anken`) from `Fran` bold + `ken` italic + `stein` underline. The output is exactly `Fr` bold + `iend` bold + `stein` underline, text `Friendstein`. The mask permits the consumed text/run slots and required replacement-run structure. Retain paragraph properties, untouched run properties, siblings and other members.

Styled table editing changes only the existing selected text leaf content. Retain every `bodyPr`, `tcPr`, `pPr`, `rPr` and `endParaRPr` attribute and child, including wrap, margin, fill, alignment, bold, size and language.

Both merged and malformed table packages must open successfully, and frame ID 4/cell 0,0 must be selectable without mutation. Only the subsequent cell-text edit preflight returns the expected refusal. Intake rejection earns no cell-edit coverage. A valid merged input has two grid columns of 900, a first row containing one `gridSpan="2"` cell, and a second row containing two ordinary cells; both row heights are 450. It returns `PPTX_TABLE_MERGE_UNSUPPORTED`. The distinct malformed input has `hMerge="maybe"` and returns `PPTX_TABLE_STRUCTURE_UNSUPPORTED`. An independently constructed unmerged same-shape control permits the identical text `x` edit.

## Creation support graph

Creation supplies no input package. `contract20-creation-policy.json` defines the complete role, content-type and edge allowlist. Minimal creation has exactly two slides, one presentation, one master, one title layout and one owned theme. Table geometry creation has one requested slide and the same support roles. Names and relationship IDs may be producer allocated.

Optional presentation properties, view properties, table-style definitions, core properties and application properties each have at most one part. Each requires its corresponding permitted owner edge. No other roles or unknown edges are admitted. OPC container members are `[Content_Types].xml`, root relationships and relationship members belonging to owners with allowed edges; no orphan or empty relationship members.

The root officeDocument edge resolves to the presentation. Ordered slide and master lists resolve to their edges. Each slide owns one layout edge. The layout and master link to each other, and the master owns the theme. One additional presentation-to-theme edge is permitted. Internal targets and content-type overrides resolve; IDs and declarations are unique in their scopes. Slides contain exactly requested title/subtitle text and no other visible text. Unrequested notes, media, charts, external links, macros and extra slides/layouts/masters are absent.

Unspecified page geometry and inert support defaults may differ by producer. Requested table geometry is exact: x/y/width/height `120/240/1001/1003`, grid widths `[333,333,335]`, row heights `[501,502]`; final segments receive remainders. No producer output supplies an acceptance golden.

Existing-deck append adds exactly one slide and its relationship member containing one layout edge. It changes only the original presentation list, presentation relationships and content types, followed by the selected first-slide text edit. Original identities, layout/notes edges and unselected payloads retain custody. The old first-slide anchor must survive the append.

## Categories and evidence

Selected XLSX categories are `xlsx-shared-formula-edit-unsupported`, `xlsx-array-formula-edit-unsupported` and `xlsx-cache-topology-unsupported`. Selected PPTX categories are `PPTX_UNSUPPORTED_TEXT_TOPOLOGY`, `PPTX_STALE_ANCHOR`, `PPTX_ARGUMENT_INVALID`, `PPTX_LAYOUT_UNSAFE`, `PPTX_STALE_TABLE_HANDLE`, `PPTX_TABLE_MERGE_UNSUPPORTED` and `PPTX_TABLE_STRUCTURE_UNSUPPORTED`. Native foreign-target, invalid-field and resource controls require exact known types/codes at runtime freeze. Title `bad\u0000` supplies the invalid operand representable in all three runtimes; JavaScript number-as-title controls remain native-only.

No ID is retired. Related closed API18, PPTX20, TABLE40 and cache/notes cases have different full operands or outcomes. Historical Python `Styled!A1`/B1 `guard` evidence remains its original one-case/four-step receipt. The new valid-styles `StyledBlank`/B1 numeric 5 input needs fresh execution of all strengthened predicates.

Parent owns shared contracts, Bun and final independent review. Go/Python owners implement their runtime only after the reviewed seal and bounded handoff. Scoped source freeze, independent review and assertion-failing fault controls precede full gates and local commits. Default v0.152.0/`28e492f50979aaec6ab8d8d001cd9c37790e7fc6` stays fixed. No pushes, tags, releases, gitlink advancement or central execution credit are authorised here.
