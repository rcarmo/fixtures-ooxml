# Retained PowerPoint styling and Word direct formatting

This batch adds 20 PPTX and 20 Word/DOCX production-edit cases across Bun, Go and Python. Every case starts from an immutable retained input and checks saved/reopened direct XML properties, package custody and atomic errors. Previous cases remain unchanged. Consumers are planned with `executionCredit:false` until separately verified; local execution does not advance central declarations or published pins.

## Inputs and targets

The PPTX seed derives from the previous formatting input by replacing only shape ID 4's direct noFill and line noFill with solid sRGB112233/445566. All other selected shape/text properties, slide identities and 19 other payloads remain unchanged. This makes new noFill operations discriminating edits. Targets are original slide2 ordinary ungrouped Body shape ID4, its direct spPr/ln/bodyPr, and paragraph0 direct run0; titles, notes, text and all other runs are protected.

The DOCX seed derives from retained formatted-text-12183fb28e49.docx by replacing only the first direct body paragraph. It has two direct text runs: `Existing ` and `suffix Ω`. Run0 includes paired Arial fonts, b=1/i=0, RGB112233, sz=18 half-points, highlight none, underline single, baseline vertical alignment and language en-US. Run1 has distinct italic, colour445566 and pt-PT metadata. Paragraph0 has keepNext/keepLines=0, pageBreakBefore/widowControl=1, before/after=0, line240/auto, left/right/hanging=0, alignment left and outline9. Paragraph/run ordinals are zero-based direct children. All second-paragraph, section, root/paragraph/run attributes, unrelated metadata and 15 other member payloads are protected.

Derived fixture recipe, parent input SHA/length, selected source fragment and replacement, member inventory and new input SHA are sealed centrally. Consumers never generate fallback fixtures or reconstruct preparation recipes as execution APIs.

## PPTX property contracts

Shape fill selects exactly one existing direct fill choice. Solid colour replaces it with `a:solidFill/a:srgbClr val=<six uppercase hex digits>`; explicit no-fill writes `a:noFill`; null removes direct fill and leaves inheritance unevaluated. Line colour applies the same choice under the existing direct `a:ln`. Line width is integer EMU 0..20116800; preset dash is a bounded declared value (`dash` in this case). Fill precedes prstDash in line schema order. Preserve xfrm, prstGeom, line attributes and unpatched line children literally. Refuse multiple fills/lines, themed/gradient/pattern/blip/group fills, alpha/colour transformations and unsupported topology before replacing a property.

Text body patches edit only real unqualified bodyPr attributes. They do not change noAutofit, paragraph/run XML or shape xfrm. Values: anchor ctr; vert vert; wrap none; anchorCtr/rtlCol typed Boolean encoded1/0; rot5400000 angle units (90 degrees); numCol2; spcCol91440; lIns/rIns91440 and tIns/bIns45720 EMU. Column count accepts1..16; inset/gap policy is integer0..100000000 EMU; rotation policy is integer -21600000..21600000 units. Reject invalid types, nonfinite/fractional/out-of-bound scalars, namespaced lookalikes and ambiguous direct body ownership. Validate all fields before any edit.

New direct run properties: strike sngStrike; cap small; baseline30000 (30 percent, 1000 units per percent); spc100 hundredths of a point (1pt tracking). Baseline editor policy is integer -100000..100000; tracking accepts integer -400000..400000. The new run attributes do not alter text or existing lang/b/i/u/sz, solidFill or Latin children. Unsupported values/topology refuse atomically. Shape-style refusal passes valid lineColor334455 followed by invalid lineWidth=-1; expected reason is `invalid-style` with no changes.

## Word direct property contracts

Run patches select only paragraph0 direct run0, never all paragraph runs. They set strike=true; underline=double; colour=A1B2C3; highlight=yellow; sz=21 half-points (10.5pt); ASCII/high-ANSI font=Aptos; vertAlign=superscript or subscript; caps=true; smallCaps=true; vanish=true. Explicit true uses w:val=1. The inheritance operation removes exactly rFonts,color,sz,highlight,u,vertAlign and retains b,i,lang plus unpatched attributes/children. Super/subscript are mutually exclusive values of one leaf, not independent flags. Do not rewrite szCs, theme or style defaults.

Paragraph patches select only paragraph0 direct pPr. They set jc=both; spacing before240/after120 twips; indentation left720/hanging360 twips while retaining right0; line480/lineRule=auto (double spacing in 240ths of a line, not 480 twips); keepLines/keepNext=true; pageBreakBefore=false with explicit w:val=0; outlineLvl0 (level1). Preserve unpatched spacing attributes literally, including line/lineRule when changing before/after, and before/after when changing line. Direct property order follows CT_RPr/CT_PPr; pPr and rPr remain unique and first.

Bounded Word policy: font size integer half-points1..800; font name nonempty trimmed XML-safe Unicode string at most128 characters, stored equally in ascii/hAnsi without rewriting unselected slots. RGB six uppercase hex digits; highlights and underline/vertical alignment use declared finite enums. Spacing before/after integer0..31680 twips; left/right/hanging integer0..31680 twips, line integer1..31680 with auto/exact/atLeast enum, outline integer0..9; flags typed Boolean. Existing unsupported/theme/script/font decorations or conflicting caps/smallCaps, strike/dstrike, firstLine/hanging choices refuse rather than being silently normalised.

Require unique direct main-body paragraph/run ownership, immutable source/hash or generation-bound targets and stale/foreign refusal. Fields, hyperlinks, tracked/revised properties/content, drawings, lexical barriers and unsupported namespaces/child topology refuse before writing. Retain legacy all-runs paragraph-format APIs and value-model setters with their existing contracts; they cannot stand in for this selected-run source-custody path.

## Independent output and atomicity

Every case independently reads saved member payloads, parses namespace-aware XML and reopens production package/document APIs. Assert exact selected values, presence/removal, child order, unchanged text/run/paragraph counts, actual caller input versus pre-open snapshot and original slide/relationship identity.

Compare the entire original/saved selected XML outside exact edited spans. Within selected spPr/ln/bodyPr/rPr/pPr compare every unpatched lexical attribute and child, using an independent consumed-token scanner that skips whole quoted values including attribute-like text and `>`. Child-order checks are separate from masks that remove selected children. Compare exact member name sets and every unrelated member payload; relationships and content-type graphs remain unchanged. No added/removed ZIP members are allowed.

On refusal the session, actual caller buffer and held target remain unchanged/usable. Save/reopen that unchanged session separately. Native tests cover type/boundary errors, late invalid multifield patches, ambiguous properties/owner topology, missing/self-closing properties, schema order and namespaced/quoted metadata, unsupported transformation/fields/protection, stale/foreign targets, and atomic saves preserving existing and absent destinations.

Temporarily injected production family no-ops/wrong values and unpatched-metadata corruption must make independent assertions fail; restoring exact source must pass. A green wrapper/parse-only test earns no case credit. Source/fixture hashes are provenance seals; generated-output acceptance comes from the exact property and custody contract.

## Provenance and closure

These are project-authored stronger retained-edit contracts. Existing staged getters, all-runs policies, authored-run 10.5pt readback, paragraph style operations and the two earlier PPTX batches retain their original IDs, predicates and scope. No source alias is retired by partial overlap.

Normative references are ECMA-376-1:2016: DrawingML ln §20.1.2.2.24, noFill §20.1.8.44, solidFill §20.1.8.54, bodyPr §21.1.2.1.1, rPr §21.1.2.3.9; Word ind §17.3.1.12, jc §17.3.1.13, keepLines §17.3.1.14, keepNext §17.3.1.15, outlineLvl §17.3.1.20, pageBreakBefore §17.3.1.23, spacing §17.3.1.33 and run-property clauses recorded per selection. Narrow scalar bounds above are editor policy.

Closure requires the same40 IDs and compiled operands/steps in all3 runtime receipts, native/refusal/fault evidence, default/candidate gates, parent-reviewed bounded patches/source hashes and clean local commits. No push/tag/release/publication, default-pin/gitlink changes, central execution credit, renderer claims, charts/themes, tables or slide deletion/import are authorised.
