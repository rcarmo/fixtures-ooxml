# Retained PPTX manipulation

These 20 concrete cases use one immutable three-slide package. Each runtime must execute every selected case through its production editing APIs and independently parse and reopen its saved output. All consumer statuses are planned. Bun commit 69c8169a2241cf09dc769c71023dd2b7d5006354 supplies local predecessor evidence only.

## Input and identity

Fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 (8464 bytes) contains ordered titles Alpha, Beta, Gamma. Every slide has title shape ID 2 and subtitle shape ID 3 (Subtitle). Slide 2 also has Body shape ID 4 with text Existing. Slide 1 relates to notesSlide1.xml with notes body ID 2 and text Original notes. The 20 member payload seals are in ledgers/pptx-manipulation.json. Source inputs remain byte-for-byte unchanged. Indices are zero-based for permutations/insertion and one-based for slide labels.

## Text and custody

Text replacement resets the selected text frame to literal paragraphs split on LF. Append creates new paragraphs; retain leading/trailing spaces and empty paragraphs. Bold-label bullets contain exactly two runs, Key Point: with a trailing space and bold true, then the description with bold false. Autofit has exactly one of normAutofit, noAutofit, spAutoFit under DrawingML bodyPr; retain bodyPr attributes and lstStyle. Clear leaves one empty paragraph without bullet properties. Tables have exact positive EMU grid/row sums and exact literal cell values. Notes edit only the existing ordinary notes body.

Every operation has an explicit changed-original-member allowlist. Outside the selected text frame/table insertion/order list/notes body, lexical spans retain their original bytes, including namespace declarations and unrelated placeholders. Insert adds exactly one slide XML and one slide layout relationship part, changes only presentation/order relationships/content-types among existing members, and preserves every original slide/member/link identity. Its added shape IDs are unique; title and subtitle read back exactly; the new slide resolves an existing layout. Reordering changes only the slide list without renumbering paths. Invalid permutations refuse before mutation with reason invalid-permutation; native typed codes may differ but bindings record their mapping. Verify unchanged session, held identities, source archive, member payloads and delivered graph. An independently parsed XML check must not rely solely on the editing API's own reader.

## Source reconciliation

The ledger retains original staged source IDs, exact source blocks/hashes, paths/lines and Bun local predecessor IDs. Staged captures stay unchanged and receive no canonical execution credit. These retained-input profiles strengthen weak source predicates and use different concrete inputs from older anchored-text/new-deck/notes-splice profiles. Older canonical scenarios and stronger predicates remain intact. No source ID is retired or credited as an exact alias. The ledger records each overlap decision.

## Evidence requirements

Each runtime needs an exact case/step receipt with no undefined, skipped or ambiguous selected steps; native ownership/stale/invalid-input/whitespace/empty-paragraph and insertion rollback controls; discriminating production faults red then restored green; and default/candidate gates. Record selected-only versus cumulative execution honestly. No ZIP64, Office rendering, publication, pin advancement or central execution credit is authorised.
