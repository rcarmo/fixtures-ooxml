# Retained PowerPoint and Word table properties

This batch adds20 PPTX and20 Word/DOCX retained-table edits across Bun, Go and Python, followed by an evidence-backed report of remaining runtime alignment gaps. Earlier manipulation, formatting and style batches retain their original cases and receipts. Shared consumer status is planned with `executionCredit:false`; local test execution does not change the published default pin or grant central credit.

## Input custody and target identity

The PPTX input derives from retained tables-3465194945a0.pptx, preserving38 original member names. Only slide1 table frame ID3 cell0,0 properties are prepared: four explicit single solid borders width12700/rgb112233/preset solid; margins0; direction horz; anchor t; anchorCtr0; existing solid fill4472C4; selected cell paragraph0/run0 rPr b1. All other cell/run/table/slide XML and37 unrelated member payloads are unchanged. The table has6 rows×3 columns, grid widths2743200 each, row heights609600 each, frame offset457200/1371600 and extent8229600/3657600. Frame ownership is direct `p:graphicFrame/p:xfrm`, not ordinary-shape spPr.

The Word input derives from simple-table-8192955ef935.docx, preserving16 original member names. Only table0/cell0,0 tcPr, row0 trPr and table0 jc/tblInd preparation spans change. tcPr has preferred width2880 dxa, four single borders size4/rgb112233, clear shading4472C4/foreground auto, explicit false noWrap/tcFitText/hideMark, zero dxa margins, textDirection lrTb and vAlign top. trPr has cantSplit0, trHeight240/atLeast, tblHeader0. tblPr has jc left and tblInd0 dxa, retaining TableGrid style, original auto table width and table look. All other cells/text/paragraph/run/row/table/document XML and15 unrelated payloads remain unchanged. Table has4 rows×3 columns and grid widths2880 each.

Exact source SHA/length/origin, byte-offset recipes, replacement fragments, derived SHA/length and member inventory are sealed centrally. Consumers resolve immutable fixture IDs without preparing fallback data. Table/row/cell ordinals are zero-based physical direct children. Select PPTX slide1 original part and unique frame cNvPr ID3; select Word unique direct main-body table0. Guard target ownership, generation/hash and stale/foreign reuse. Reject grouped/nested/merged/spanned/revised/ambiguous targets rather than flattening them.

## PPTX operations

Cell fill modifies only one direct tcPr fill choice: solid A1B2C3; explicit noFill; or removal of direct fill to restore inheritance without evaluating appearance. Cell border operations select exactly one lnL/lnR/lnT/lnB: set colour334455 and width25400 EMU independently on each side, preserve preset solid; top border noFill retains width12700 and preset solid; left-border removal removes only lnL. Border widths accept integer0..20116800; colours require six uppercase hex digits. Supported direct border/fill profile has no gradients/themes/alpha/custom dash/arrows/effects or duplicate choices.

Cell margins modify only unqualified tcPr marL/marR91440 and marT/marB45720 EMU. Cell anchor=ctr, vert=vert and anchorCtr=true (literal1) modify only real unqualified tcPr attributes. Margins accept integer0..100000000; alignment/direction are bounded enum values. Validate complete patch and existing source values before writing. tcPr child order is lnL,lnR,lnT,lnB, then fill; every other original attribute/child and txBody/text run remains literal.

Column0 width3657600 changes only its gridCol w and frame extent cx9144000 (+914400). Row0 height914400 changes only its tr h and frame extent cy3962400 (+304800). The unchanged dimension, offsets, other widths/heights, cells and content remain protected. Verify original frame extents equal exact grid/row sums before mutation. Require positive integer dimensions1..100000000, total extents at most100000000, and no partial update if any bound/topology fails. This is a two-span atomic operation.

Table firstRow and bandRow are each set explicit false (literal0), keeping original tableStyleId bytes. Frame position changes only direct p:xfrm/a:off x914400/y1828800 EMU; extents/grid/row dimensions remain unchanged. Coordinates accept integer0..100000000 and position+extent must remain in policy bounds. Selected cell0,0 paragraph0 run0 bold becomes explicit b0, leaving all other run properties/text and17 neighboring cells unchanged.

The refusal supplies valid fill A1B2C3 plus top-border negative width-1. Expected reason `invalid-table-properties`, no changed members, unchanged session/caller and still-usable held target.

## Word operations

Cell shading changes only shd fill=A1B2C3, retaining clear pattern and auto foreground; inheritance removes only shd. vAlign=center and textDirection=tbRl affect only selected direct leaves. Margins use top/bottom120 and left/right240 integer twips, explicit dxa, under tcMar. Border sides top/left/bottom/right are separate cases setting val single, sz8 eighth-points and colour334455; top-border removal keeps other borders and parent attributes literal. Supported border size is integer2..96, width/margins integer0..31680 twips, colour six uppercase hex digits.

Cell noWrap, tcFitText and hideMark become explicit true w:val1. Preferred tcW width2400 dxa changes only selected w:w; all physical tblGrid columns remain2880. Preferred width is not a physical-grid resize or layout guarantee. Row0 tblHeader and cantSplit each become explicit true w:val1; row0 trHeight val480 twips/hRule exact changes only the selected height leaf. Table0 jc=center changes only direct table alignment; table0 tblInd w:w720/type dxa modifies only the indentation value. Row height accepts integer1..31680; indentation0..31680. Flags require typed Booleans; explicit false differs from absence. Preserve child order and all unpatched attributes/children within tcPr/tcBorders/tcMar/trPr/tblPr.

The refusal supplies valid shading A1B2C3 plus top-border size97. Expected reason `invalid-table-properties`, zero changed members and unchanged caller/session/held identity. Validate all patch fields and existing source topology before mutation.

## Preservation, refusal and independent evidence

Both formats keep exact member name sets and every unrelated ZIP payload, content types and relationships. Only the selected original slide or Word main document part may change. All table text leaves, unselected cells/rows/grid columns, metadata and external XML spans retain literal bytes. Within selected property containers compare every unpatched attribute and child byte. Multi-span dimension operations mask only exact requested grid/row/frame attributes, never an entire frame/table. Use an independent quote-consuming scanner that does not match property-looking tokens or `>` inside quoted values. Check saved child order separately from masks that remove edited children.

Parse saved member payloads independently and reopen production package/document APIs. Assert exact values/presence/removal, dimensions, owner identities, child order, graph/member custody and actual caller input against a snapshot taken before opening. Refusal tests save/reopen unchanged sessions separately and prove held targets remain usable through a benign same-value operation.

Native controls cover type/enum/bounds, late invalid multifield patches, duplicate properties/IDs, missing/self-closing property handling or documented atomic refusal, wrong namespaces/prefixes, quoted tokens, protection/fields/hyperlinks/revisions, grid/row sum mismatch, nested/grouped/merged cells and unsupported fill/border profiles. Real serialization/verification/rename faults preserve existing and absent destinations, no temporary files and session recovery. Temporary production family no-op/wrong-value and nonselected-property corruption must fail independent acceptance, then pass after restoring exact source.

Retain legacy table authors/getters and plain-text paths with unchanged semantics. A legacy full-model save cannot establish lexical custody. New output hashes do not gate acceptance; hashes seal source, fixture and evidence provenance.

## Specification and overlap

Normative sources are ECMA-376-1:2016: DrawingML line properties §20.1.2.2.24; table gridCol §21.1.3.2, tblPr §21.1.3.15, tcPr §21.1.3.17 and tr §21.1.3.18; Word table/row/cell property clauses17.4, including hideMark§17.4.21, tblInd§17.4.50 and tcMar§17.4.68. Narrow scalar/profile bounds above are editor policy.

These are project-authored stronger retained-table contracts. Existing rectangular-table authoring, styled-text preservation, merge operations and in-memory cell/style/header getters retain their IDs and original scope. Partial overlap does not retire aliases or transfer execution credit.

## Completion and alignment audit

Completion requires the same40 IDs and compiled step texts/operands in all3 receipts, discriminating saved-value/custody/schema assertions, native refusal/save controls, fault-red/restored evidence, default/candidate gates and parent-reviewed clean local commits. Previous activation lanes and cumulative attribution remain explicit.

After the batch, audit the whole shared catalogue against final runtime activation IDs, per-case predicate strength and actual clean-commit receipts. Report verified three-runtime behaviour; weaker/partial implementation; missing consumer paths; intentionally runtime-specific profiles; staged/unexecuted/Office-positive obligations; and candidate-only completion versus published-default scope. Give scenario IDs, evidence paths, responsible runtime gaps and prioritised next slices in Markdown plus machine-readable matrix/CSV. Central planned metadata is not equivalent to missing local implementation, nor does common wording/getter availability prove alignment.

No push/tag/release/publication, default-pin/gitlink changes, central execution credit, Office renderer claims, charts/themes or table creation/deletion/merge/import are authorised by this batch.
