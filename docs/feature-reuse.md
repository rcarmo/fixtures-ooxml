# Feature reuse review

Generated from `ledgers/feature-reuse.json` and the official Gherkin compiler.
Review baseline: `28e492f50979aaec6ab8d8d001cd9c37790e7fc6`. Only this repository was inspected.
Feature and local evidence hashes require re-review when their source bytes change.

## Classification criteria

| Tag | Meaning | Fully generalized? |
|---|---|---|
| generalized | Concrete language-neutral inputs and outcomes reusable within the stated bounded operation. Ordinary native adapters are still needed. | yes |
| profile-specific | Portable in principle, but tied to a selected API vocabulary, response shape, coordinate convention or compatibility policy. Requires deliberate profile adoption. | no |
| runtime-specific | Literal JavaScript object/callback semantics, the Bun-origin `OoxmlError` class, or Go-style nil API returns without a defined neutral mapping. A similarly named foreign exception does not satisfy the literal contract without a documented mapping. | no |
| incomplete | Missing shared recipes, expected values, fixtures/oracles, or only weak shape/status checks. Neutral wording alone does not make this fully reusable. | no |
| staged-unreviewed | Source-runtime candidate, not yet reconciled into the canonical catalogue. Its origin is recorded; portability is not adjudicated. | no |

Classification concerns the current contract, not implementation coverage, universal
OOXML validity or feature completeness. A bounded refusal or read-only scenario can
be generalized without implementing a whole format. UTF-16 and UTF-8 coordinates
are portable conventions, not inherently JavaScript/Go runtime requirements.
Error codes and JSON keys alone are API profiles; literal class identity and
prototype/thenable assertions are runtime-specific. Generic immutability does not
imply JavaScript `Object.freeze`. The literal Go `nil` cell API needs an explicit
foreign-runtime absence mapping before it can be a portable profile. Missing case recipes take precedence over a
portable API profile; the scenario reason records the gap.

## Organisation findings

- All canonical feature paths use the six allowed format/common-operation folders,
  with one owning file per stable scenario ID. No contract moves or step/tag changes
  were needed; published bindings and historical seals remain untouched.
- The old manual index had appended package entries out of order and inconsistent
  per-file planned labels. This index is generated in fixed family/path order.
- Same-format operation families intentionally contain multiple profiles: comments
  keep existing-entry, authored-root and complete-thread policies separate; table
  getters and physical merges remain different operations. Cross-format relationship
  namespaces belong under package; full-coverage obligations belong under office.
- Staging keeps its source-runtime layout to preserve captured provenance. The table
  below separates all staged files from canonical operation contracts; no staged
  file is silently promoted, renamed or duplicated into a new catalogue.
- The inherited `@planned` tag is not a per-consumer result. Consult
  `ledgers/workflows.json` for implementation credit; this review changes none.

## Canonical totals

| Group | Features | IDs | Cases | generalized | profile-specific | runtime-specific | incomplete |
|---|---:|---:|---:|---:|---:|---:|---:|
| DOCX | 24 | 198 | 522 | 109 | 56 | 0 | 33 |
| PPTX | 18 | 113 | 162 | 85 | 11 | 0 | 17 |
| XLSX | 12 | 43 | 109 | 12 | 14 | 0 | 17 |
| PACKAGE | 10 | 36 | 68 | 29 | 6 | 0 | 1 |
| XML | 4 | 33 | 47 | 22 | 11 | 0 | 0 |
| OFFICE | 1 | 1 | 3 | 0 | 0 | 0 | 1 |
| ALL | 69 | 424 | 911 | 257 | 98 | 0 | 69 |

23 of 69 canonical feature files are fully generalized throughout.
The remaining files contain profile-specific, runtime-specific or incomplete
scenarios; 27 files mix categories and require ID-level selection.
The four category columns count scenario IDs, not expanded example cases.
A complete [feature-level table](../workflows/README.md) and downloadable
[212-file CSV](feature-reuse.csv) accompany the [scenario CSV](scenario-reuse.csv).

## Scenario decisions

### docx/anchor-discovery.feature

Word anchor discovery and anchored insertion — **profile-specific**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-python-word-anchor-headings-paragraphs](../workflows/docx/anchor-discovery.feature#L11) | 1 | profile-specific | @profile-anchor-response-api | Exact response fields, minimum counts and type names select an anchor tool API, not complete traversal. [python-anchor-discovery.md](../contracts/python-anchor-discovery.md) |
| [@id-python-word-anchor-text-filter](../workflows/docx/anchor-discovery.feature#L19) | 1 | profile-specific | @profile-anchor-response-api | Exact response fields, minimum counts and type names select an anchor tool API, not complete traversal. [python-anchor-discovery.md](../contracts/python-anchor-discovery.md) |
| [@id-python-word-anchor-document-map](../workflows/docx/anchor-discovery.feature#L26) | 1 | profile-specific | @profile-anchor-response-api | Exact response fields, minimum counts and type names select an anchor tool API, not complete traversal. [python-anchor-discovery.md](../contracts/python-anchor-discovery.md) |
| [@id-python-word-anchor-discover-insert](../workflows/docx/anchor-discovery.feature#L34) | 1 | profile-specific | @profile-anchor-response-api | Exact response fields, minimum counts and type names select an anchor tool API, not complete traversal. [python-anchor-discovery.md](../contracts/python-anchor-discovery.md) |
| [@id-python-word-anchor-section-discovery-hints](../workflows/docx/anchor-discovery.feature#L43) | 1 | profile-specific | @profile-tool-discovery-hints | Exact word_list_anchors/word_document_map hints select a tool catalogue; equivalent document behaviour alone does not satisfy it. [python-anchor-discovery.md](../contracts/python-anchor-discovery.md) |

### docx/comment-content-type.feature

DOCX comment content type obligations — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-commentsextended-content-type](../workflows/docx/comment-content-type.feature#L6) | 1 | incomplete | — | An adjudication obligation: no resolved content type, concrete fixture or independent Office receipt is selected here. [comment-profiles.md](../contracts/comment-profiles.md) |

### docx/comments.feature

Word comment inspection, resolution and thread policies — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-comments-inspection](../workflows/docx/comments.feature#L7) | 1 | generalized | @profile-existing-comments-extended | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-comments-resolution](../workflows/docx/comments.feature#L14) | 1 | generalized | @profile-existing-comments-extended | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-comments-noop](../workflows/docx/comments.feature#L23) | 1 | generalized | @profile-existing-comments-extended | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-comments-refusal](../workflows/docx/comments.feature#L29) | 11 | generalized | @profile-existing-comments-extended | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-mixed-done](../workflows/docx/comments.feature#L54) | 1 | profile-specific | @profile-authored-comment-response-api | Saved authored comments are portable; exact success/done/filter response fields require this tool API profile. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-resolved-filter](../workflows/docx/comments.feature#L63) | 1 | profile-specific | @profile-authored-comment-response-api | Saved authored comments are portable; exact success/done/filter response fields require this tool API profile. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-reopen-filter](../workflows/docx/comments.feature#L71) | 1 | profile-specific | @profile-authored-comment-response-api | Saved authored comments are portable; exact success/done/filter response fields require this tool API profile. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-reply-root-resolution](../workflows/docx/comments.feature#L82) | 1 | profile-specific | @profile-comment-thread-root-resolution | Resolving through a reply selects its root and reports tool-specific fields; this differs from complete-thread resolution. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-ids-fallback](../workflows/docx/comments.feature#L92) | 1 | profile-specific | @profile-comment-id-fallback | commentsIds fallback and para_id response vocabulary are an explicit inspection policy. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-create-extension](../workflows/docx/comments.feature#L100) | 1 | profile-specific | @profile-comment-extension-authoring | Creation of missing extension metadata and returned para_id/success fields are a selected authoring/API policy, not existing-part resolution. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-filter-predicates](../workflows/docx/comments.feature#L109) | 1 | profile-specific | @profile-authored-comment-response-api | Saved authored comments are portable; exact success/done/filter response fields require this tool API profile. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-threaded-reply](../workflows/docx/comments.feature#L120) | 1 | profile-specific | @profile-comment-threaded-response-api | Exact threads/thread_count/root/replies response structure requires this tool API profile. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-python-comments-reply-auto-resolve](../workflows/docx/comments.feature#L130) | 1 | profile-specific | @profile-comment-thread-root-resolution | Resolving through a reply selects its root and reports tool-specific fields; this differs from complete-thread resolution. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-existing-thread-inspection](../workflows/docx/comments.feature#L141) | 3 | generalized | @profile-existing-complete-thread | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-existing-thread-resolution](../workflows/docx/comments.feature#L154) | 3 | generalized | @profile-existing-complete-thread | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-existing-thread-noop](../workflows/docx/comments.feature#L169) | 1 | generalized | @profile-existing-complete-thread | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-existing-thread-refusal](../workflows/docx/comments.feature#L176) | 9 | generalized | @profile-existing-complete-thread | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-existing-thread-rollback](../workflows/docx/comments.feature#L194) | 2 | generalized | @profile-existing-complete-thread | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-existing-thread-encoding](../workflows/docx/comments.feature#L206) | 3 | generalized | @profile-existing-complete-thread | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-existing-thread-unsupported](../workflows/docx/comments.feature#L218) | 1 | generalized | @profile-existing-complete-thread | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |
| [@id-docx-existing-thread-limit](../workflows/docx/comments.feature#L227) | 1 | generalized | @profile-existing-complete-thread | Existing-comment inputs and flag/readback/custody outcomes are shared; single-entry and complete-thread policies remain distinct. [comment-profiles.md](../contracts/comment-profiles.md) [comment-threads.md](../contracts/comment-threads.md) |

### docx/completion-audit.feature

Read a Word document's completion audit without modifying it — **profile-specific**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-audit-completion-read](../workflows/docx/completion-audit.feature#L10) | 2 | profile-specific | @profile-completion-audit | Exact score, issues, response shape and next-tool hints are an audit-tool compatibility contract. [functional-equivalence.json](../ledgers/functional-equivalence.json) |
| [@id-docx-audit-completion-placeholders](../workflows/docx/completion-audit.feature#L29) | 1 | profile-specific | @profile-completion-audit | Exact score, issues, response shape and next-tool hints are an audit-tool compatibility contract. [functional-equivalence.json](../ledgers/functional-equivalence.json) |
| [@id-docx-audit-completion-missing-file](../workflows/docx/completion-audit.feature#L42) | 1 | profile-specific | @profile-completion-audit | Exact score, issues, response shape and next-tool hints are an audit-tool compatibility contract. [functional-equivalence.json](../ledgers/functional-equivalence.json) |

### docx/creation.feature

Word document creation — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-create-minimal-package](../workflows/docx/creation.feature#L9) | 1 | generalized | — | Named fixture or explicit minimal package, literal text and saved/member outcomes are reusable for bounded creation. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-create-style-validation](../workflows/docx/creation.feature#L20) | 1 | generalized | — | Named fixture or explicit minimal package, literal text and saved/member outcomes are reusable for bounded creation. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-create-stale-opaque](../workflows/docx/creation.feature#L28) | 1 | profile-specific | — | Sealed input and exact custody are concrete, but append invalidates previously held span handles under a particular session policy. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-create-atomic-refusals](../workflows/docx/creation.feature#L40) | 5 | profile-specific | — | Wrong-type options and exact refusal codes are a dynamic/API admission profile; typed consumers need a defined boundary adapter. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-go-new-empty-body](../workflows/docx/creation.feature#L61) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |

### docx/effective-formatting.feature

Inspect effective bold and italic for plain body paragraph runs — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-effective-run-formatting](../workflows/docx/effective-formatting.feature#L10) | 9 | incomplete | — | The common cascade is documented, but the kind labels do not supply complete style/run inputs and exact per-kind expected contributions in this repo. [effective-formatting.md](../contracts/effective-formatting.md) |
| [@id-docx-effective-run-formatting-refusal](../workflows/docx/effective-formatting.feature#L28) | 16 | incomplete | — | The common cascade is documented, but the kind labels do not supply complete style/run inputs and exact per-kind expected contributions in this repo. [effective-formatting.md](../contracts/effective-formatting.md) |

### docx/font-size.feature

Write a direct Word run font size in half-points — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-direct-font-size-half-points](../workflows/docx/font-size.feature#L8) | 1 | generalized | — | Exact direct 10.5-point saved/readback value and w:sz=21 are independent of runtime. [go-document-api.md](../contracts/go-document-api.md) |

### docx/mutation-safety.feature

Word batch preview, target counts and atomic refusal — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-dry-run-no-mutation](../workflows/docx/mutation-safety.feature#L9) | 3 | generalized | — | Shared mutation fixture contract supplies inputs, destinations and exact byte-preservation/change outcomes. [mutation-safety.json](../contracts/mutation-safety.json) |
| [@id-docx-strict-batch-per-target-results](../workflows/docx/mutation-safety.feature#L26) | 3 | generalized | — | Shared mutation fixture contract supplies inputs, destinations and exact byte-preservation/change outcomes. [mutation-safety.json](../contracts/mutation-safety.json) |
| [@id-office-docx-exact-match-counts](../workflows/docx/mutation-safety.feature#L50) | 1 | generalized | — | Shared mutation fixture contract supplies inputs, destinations and exact byte-preservation/change outcomes. [mutation-safety.json](../contracts/mutation-safety.json) |

### docx/page-layout.feature

Word section and page properties — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-final-section-layout](../workflows/docx/page-layout.feature#L10) | 8 | incomplete | — | Portrait/landscape/margins and defect labels lack concrete per-row geometry/source recipes here; the prose gives constraints rather than those test vectors. [page-layout.md](../contracts/page-layout.md) |
| [@id-docx-final-section-layout-refusal](../workflows/docx/page-layout.feature#L27) | 14 | incomplete | — | Portrait/landscape/margins and defect labels lack concrete per-row geometry/source recipes here; the prose gives constraints rather than those test vectors. [page-layout.md](../contracts/page-layout.md) |
| [@id-docx-go-section-title-background-getters](../workflows/docx/page-layout.feature#L54) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [page-layout.md](../contracts/page-layout.md) [go-document-api.md](../contracts/go-document-api.md) |

### docx/paragraph-style.feature

Word paragraph style selection — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-paragraph-style-selection](../workflows/docx/paragraph-style.feature#L9) | 5 | incomplete | — | Operation/defect labels lack exact per-row source style registries, selected IDs and expected receipts here. [paragraph-style.md](../contracts/paragraph-style.md) |
| [@id-docx-paragraph-style-refusal](../workflows/docx/paragraph-style.feature#L24) | 14 | incomplete | — | Operation/defect labels lack exact per-row source style registries, selected IDs and expected receipts here. [paragraph-style.md](../contracts/paragraph-style.md) |
| [@id-docx-go-paragraph-style-getters](../workflows/docx/paragraph-style.feature#L53) | 5 | profile-specific | @profile-heading-classification-api | Heading classification follows style-ID names and exact flags/levels rather than computed outline inheritance. [paragraph-style.md](../contracts/paragraph-style.md) [go-document-api.md](../contracts/go-document-api.md) |

### docx/paragraphs.feature

Word paragraph text, properties and body order — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-go-paragraph-text-getter](../workflows/docx/paragraphs.feature#L10) | 5 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-paragraph-alignment-getter](../workflows/docx/paragraphs.feature#L23) | 4 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-paragraph-spacing-getters](../workflows/docx/paragraphs.feature#L35) | 4 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-paragraph-advanced-toggles](../workflows/docx/paragraphs.feature#L47) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-paragraph-multiple-runs](../workflows/docx/paragraphs.feature#L53) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-body-insert-order](../workflows/docx/paragraphs.feature#L59) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-retained-paragraph-justify](../workflows/docx/paragraphs.feature#L69) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-paragraph-spacing](../workflows/docx/paragraphs.feature#L82) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-paragraph-indent](../workflows/docx/paragraphs.feature#L95) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-paragraph-line](../workflows/docx/paragraphs.feature#L108) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-paragraph-keep-lines](../workflows/docx/paragraphs.feature#L121) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-paragraph-keep-next](../workflows/docx/paragraphs.feature#L134) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-paragraph-page-break](../workflows/docx/paragraphs.feature#L147) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-paragraph-outline](../workflows/docx/paragraphs.feature#L160) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |

### docx/properties.feature

Word document core properties — **profile-specific**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-go-core-properties-getters](../workflows/docx/properties.feature#L10) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [go-document-api.md](../contracts/go-document-api.md) |

### docx/review-integration.feature

DOCX review integration obligations — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-review-multistory-resolution](../workflows/docx/review-integration.feature#L6) | 1 | incomplete | — | Broad review/compare obligation has no enumerated input corpus, selected operations or exact expected revised/original documents. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-parity-docx-review](../workflows/docx/review-integration.feature#L14) | 1 | incomplete | — | Broad review/compare obligation has no enumerated input corpus, selected operations or exact expected revised/original documents. [native-profiles.md](../contracts/native-profiles.md) |

### docx/revisions.feature

Word revision inspection, resolution and tracked replacement — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-revisions-all-stories](../workflows/docx/revisions.feature#L7) | 1 | incomplete | — | Named synthetic source or payment phrase is not fully specified locally; exact shared construction and expected bytes are needed before independent reuse. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-revisions-rollback](../workflows/docx/revisions.feature#L50) | 1 | incomplete | — | Named synthetic source or payment phrase is not fully specified locally; exact shared construction and expected bytes are needed before independent reuse. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-revisions-empty-deletion](../workflows/docx/revisions.feature#L76) | 1 | incomplete | — | Named synthetic source or payment phrase is not fully specified locally; exact shared construction and expected bytes are needed before independent reuse. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-revisions-protected](../workflows/docx/revisions.feature#L86) | 1 | incomplete | — | Named synthetic source or payment phrase is not fully specified locally; exact shared construction and expected bytes are needed before independent reuse. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-tracked-replace-roundtrip](../workflows/docx/revisions.feature#L99) | 1 | incomplete | — | Named synthetic source or payment phrase is not fully specified locally; exact shared construction and expected bytes are needed before independent reuse. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-tracked-replace-refusal](../workflows/docx/revisions.feature#L107) | 5 | incomplete | — | Named synthetic source or payment phrase is not fully specified locally; exact shared construction and expected bytes are needed before independent reuse. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-run-property-revisions-roundtrip](../workflows/docx/revisions.feature#L124) | 2 | generalized | @profile-text-and-run-properties | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-run-property-revisions-scope](../workflows/docx/revisions.feature#L140) | 2 | generalized | @profile-text-and-run-properties | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-run-property-revisions-default](../workflows/docx/revisions.feature#L152) | 1 | generalized | @profile-text-and-run-properties | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-run-property-revisions-refusal](../workflows/docx/revisions.feature#L159) | 16 | generalized | @profile-text-and-run-properties | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-run-property-revisions-encoding](../workflows/docx/revisions.feature#L184) | 3 | generalized | @profile-text-and-run-properties | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-run-property-revisions-rollback](../workflows/docx/revisions.feature#L196) | 3 | generalized | @profile-text-and-run-properties | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-run-property-revisions-empty](../workflows/docx/revisions.feature#L209) | 2 | generalized | @profile-text-and-run-properties | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-run-property-revisions-guards](../workflows/docx/revisions.feature#L220) | 4 | generalized | @profile-text-and-run-properties | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-roundtrip](../workflows/docx/revisions.feature#L237) | 2 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-scope](../workflows/docx/revisions.feature#L253) | 2 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-defaults](../workflows/docx/revisions.feature#L265) | 2 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-refusal](../workflows/docx/revisions.feature#L276) | 18 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-encoding](../workflows/docx/revisions.feature#L303) | 6 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-rollback](../workflows/docx/revisions.feature#L318) | 3 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-guards](../workflows/docx/revisions.feature#L331) | 3 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-dates](../workflows/docx/revisions.feature#L343) | 8 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |
| [@id-docx-paired-move-ordering](../workflows/docx/revisions.feature#L360) | 1 | generalized | @profile-text-properties-and-moves | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [run-property-revisions.md](../contracts/run-property-revisions.md) [run-move-revisions.md](../contracts/run-move-revisions.md) |

### docx/run-formatting.feature

Word direct run formatting — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-direct-run-formatting](../workflows/docx/run-formatting.feature#L9) | 4 | incomplete | — | The initial formatting cases use operation/defect labels without concrete run properties and expected per-row results here. [run-formatting.md](../contracts/run-formatting.md) |
| [@id-docx-direct-formatting-refusal](../workflows/docx/run-formatting.feature#L23) | 11 | incomplete | — | The initial formatting cases use operation/defect labels without concrete run properties and expected per-row results here. [run-formatting.md](../contracts/run-formatting.md) |
| [@id-docx-go-run-color-getter](../workflows/docx/run-formatting.feature#L48) | 3 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [run-formatting.md](../contracts/run-formatting.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-run-boolean-formatting](../workflows/docx/run-formatting.feature#L59) | 5 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [run-formatting.md](../contracts/run-formatting.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-run-effects-getters](../workflows/docx/run-formatting.feature#L73) | 1 | profile-specific | @profile-in-memory-effects-api | All eight getters may be true simultaneously; this compatibility predicate is not a valid saved-format recipe. [run-formatting.md](../contracts/run-formatting.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-run-underline-style](../workflows/docx/run-formatting.feature#L79) | 6 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [run-formatting.md](../contracts/run-formatting.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-run-font-name](../workflows/docx/run-formatting.feature#L93) | 6 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [run-formatting.md](../contracts/run-formatting.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-run-highlight](../workflows/docx/run-formatting.feature#L107) | 5 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [run-formatting.md](../contracts/run-formatting.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-run-vertical-align](../workflows/docx/run-formatting.feature#L120) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [run-formatting.md](../contracts/run-formatting.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-roundtrip-selected-formatting](../workflows/docx/run-formatting.feature#L127) | 1 | profile-specific | @profile-selected-formatting-readback | Only named positions/properties are checked after reopen; text and complete preservation are outside this selected API profile. [run-formatting.md](../contracts/run-formatting.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-retained-run-strike](../workflows/docx/run-formatting.feature#L139) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-underline](../workflows/docx/run-formatting.feature#L152) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-color](../workflows/docx/run-formatting.feature#L165) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-highlight](../workflows/docx/run-formatting.feature#L178) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-size](../workflows/docx/run-formatting.feature#L191) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-font](../workflows/docx/run-formatting.feature#L204) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-superscript](../workflows/docx/run-formatting.feature#L217) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-subscript](../workflows/docx/run-formatting.feature#L230) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-caps](../workflows/docx/run-formatting.feature#L243) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-small-caps](../workflows/docx/run-formatting.feature#L256) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-hidden](../workflows/docx/run-formatting.feature#L269) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-docx-retained-run-inherit](../workflows/docx/run-formatting.feature#L282) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |

### docx/stories.feature

Word story traversal and review views — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-story-parts](../workflows/docx/stories.feature#L7) | 1 | incomplete | — | Exact expected lists are present, but synthetic-revisions/synthetic-blind package recipes and relationship inputs are not defined locally. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-story-views](../workflows/docx/stories.feature#L21) | 1 | incomplete | — | Exact expected lists are present, but synthetic-revisions/synthetic-blind package recipes and relationship inputs are not defined locally. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-story-blind](../workflows/docx/stories.feature#L65) | 1 | incomplete | — | Exact expected lists are present, but synthetic-revisions/synthetic-blind package recipes and relationship inputs are not defined locally. [native-profiles.md](../contracts/native-profiles.md) |

### docx/style-authoring.feature

Author bounded paragraph styles without computing inheritance — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-paragraph-style-authoring](../workflows/docx/style-authoring.feature#L8) | 7 | incomplete | — | Authored/refusal kind labels omit exact source style registries, requested definitions and per-row expected outputs. [style-authoring.md](../contracts/style-authoring.md) |
| [@id-docx-paragraph-style-authoring-refusal](../workflows/docx/style-authoring.feature#L25) | 17 | incomplete | — | Authored/refusal kind labels omit exact source style registries, requested definitions and per-row expected outputs. [style-authoring.md](../contracts/style-authoring.md) |

### docx/table-merging.feature

Physical horizontal Word table merges with retained content — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-horizontal-merge-roundtrip](../workflows/docx/table-merging.feature#L9) | 3 | generalized | @profile-preserving-horizontal-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-horizontal-merge-content-refusal](../workflows/docx/table-merging.feature#L23) | 6 | generalized | @profile-preserving-horizontal-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-horizontal-merge-structure-refusal](../workflows/docx/table-merging.feature#L37) | 6 | generalized | @profile-preserving-horizontal-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-horizontal-merge-coordinate-refusal](../workflows/docx/table-merging.feature#L51) | 4 | generalized | @profile-preserving-horizontal-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-horizontal-merge-rollback](../workflows/docx/table-merging.feature#L63) | 2 | generalized | @profile-preserving-horizontal-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-horizontal-merge-encoding](../workflows/docx/table-merging.feature#L73) | 3 | generalized | @profile-preserving-horizontal-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-horizontal-merge-stale](../workflows/docx/table-merging.feature#L86) | 2 | generalized | @profile-preserving-horizontal-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-vertical-merge-roundtrip](../workflows/docx/table-merging.feature#L101) | 3 | generalized | @profile-preserving-vertical-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-vertical-merge-content-refusal](../workflows/docx/table-merging.feature#L115) | 6 | generalized | @profile-preserving-vertical-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-vertical-merge-structure-refusal](../workflows/docx/table-merging.feature#L129) | 6 | generalized | @profile-preserving-vertical-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-vertical-merge-coordinate-refusal](../workflows/docx/table-merging.feature#L143) | 4 | generalized | @profile-preserving-vertical-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-vertical-merge-rollback](../workflows/docx/table-merging.feature#L155) | 2 | generalized | @profile-preserving-vertical-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-vertical-merge-encoding](../workflows/docx/table-merging.feature#L165) | 3 | generalized | @profile-preserving-vertical-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |
| [@id-docx-vertical-merge-stale](../workflows/docx/table-merging.feature#L179) | 2 | generalized | @profile-preserving-vertical-merge | The local contract specifies source table geometry, content, every defect, encoding and exact preservation/rollback boundaries. [table-merging.md](../contracts/table-merging.md) |

### docx/tables.feature

Word tables and cell properties — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-table-create-roundtrip](../workflows/docx/tables.feature#L9) | 1 | generalized | — | Explicit table or sealed fixture inputs, literal values and bounded saved outcomes can be implemented independently. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-table-opaque-preserve](../workflows/docx/tables.feature#L22) | 1 | generalized | — | Explicit table or sealed fixture inputs, literal values and bounded saved outcomes can be implemented independently. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-table-stale-cell](../workflows/docx/tables.feature#L32) | 1 | profile-specific | — | Every document edit invalidates held cell handles and requires docx-stale-table-cell; this is a session API policy. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-table-atomic-refusals](../workflows/docx/tables.feature#L43) | 4 | incomplete | — | Two synthetic merged/nested/grid-before sources and their precise mutations are not defined in the shared feature or contract. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-go-table-dimensions-getters](../workflows/docx/tables.feature#L63) | 8 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-table-cell-access](../workflows/docx/tables.feature#L79) | 1 | generalized | @profile-bounded-cell-lookup | Explicit fourteen-coordinate presence/absence and nine distinct texts prevent out-of-range aliasing; native absence spelling is mapped without changing the result or document XML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-table-cell-text-getters](../workflows/docx/tables.feature#L101) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-table-row-counts](../workflows/docx/tables.feature#L108) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-table-merge-properties](../workflows/docx/tables.feature#L115) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-table-style-getter](../workflows/docx/tables.feature#L122) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-table-header-getter](../workflows/docx/tables.feature#L128) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-cell-shading-getter](../workflows/docx/tables.feature#L134) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-cell-properties-getters](../workflows/docx/tables.feature#L140) | 1 | incomplete | @profile-document-value-api | The border assertion only checks nonnil collection/top border; supplied style/size/colour are not verified. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-go-roundtrip-table-text](../workflows/docx/tables.feature#L148) | 1 | profile-specific | @profile-table-text-readback | Nine exact cell-text getters after reopening are portable but scoped to the selected table-value API. [native-profiles.md](../contracts/native-profiles.md) [go-document-api.md](../contracts/go-document-api.md) |
| [@id-docx-table-properties-cell-shading](../workflows/docx/tables.feature#L159) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-cell-inherit-shading](../workflows/docx/tables.feature#L172) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-cell-anchor](../workflows/docx/tables.feature#L185) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-cell-direction](../workflows/docx/tables.feature#L198) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-cell-margins](../workflows/docx/tables.feature#L211) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-border-top](../workflows/docx/tables.feature#L224) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-border-left](../workflows/docx/tables.feature#L237) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-border-bottom](../workflows/docx/tables.feature#L250) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-border-right](../workflows/docx/tables.feature#L263) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-border-remove](../workflows/docx/tables.feature#L276) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-cell-no-wrap](../workflows/docx/tables.feature#L289) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-cell-fit-text](../workflows/docx/tables.feature#L302) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-cell-width](../workflows/docx/tables.feature#L315) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-row-header](../workflows/docx/tables.feature#L328) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-row-cant-split](../workflows/docx/tables.feature#L341) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-row-height](../workflows/docx/tables.feature#L354) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-table-alignment](../workflows/docx/tables.feature#L367) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-table-indent](../workflows/docx/tables.feature#L380) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-cell-hide-mark](../workflows/docx/tables.feature#L393) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-docx-table-properties-refusal](../workflows/docx/tables.feature#L406) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |

### docx/template-analysis.feature

Word template analysis — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-python-word-template-analysis-sow-response](../workflows/docx/template-analysis.feature#L11) | 1 | incomplete | @profile-template-response-status-api | Dictionary-without-error validates status only; actual sections, placeholders, guidance and table results are unasserted. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-python-word-template-analysis-placeholder-response](../workflows/docx/template-analysis.feature#L17) | 1 | incomplete | @profile-template-response-shape-api | Any dictionary, including an error dictionary, passes; placeholder values and useful analysis are unasserted. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-python-word-template-analysis-colour-response](../workflows/docx/template-analysis.feature#L23) | 1 | incomplete | @profile-template-response-shape-api | Any dictionary, including an error dictionary, passes; guidance/colour classification is unasserted. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-python-word-template-analysis-plain-response](../workflows/docx/template-analysis.feature#L29) | 1 | incomplete | @profile-template-response-shape-api | Any dictionary, including an error dictionary, passes; no useful plain-document analysis is required. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-python-office-template-analysis-response](../workflows/docx/template-analysis.feature#L35) | 1 | incomplete | @profile-template-response-status-api | Absence of an error member alone does not specify useful template-analysis fields or correctness. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-python-office-template-analysis-cache](../workflows/docx/template-analysis.feature#L41) | 1 | profile-specific | @profile-template-metadata-response-api | Stored/hit status and staffing table-purpose classification require the selected metadata API; they are not literal inventory. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-docx-template-inventory-values](../workflows/docx/template-analysis.feature#L54) | 1 | generalized | @profile-concrete-template-inventory | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-docx-template-inventory-empty](../workflows/docx/template-analysis.feature#L62) | 2 | generalized | @profile-concrete-template-inventory | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-docx-template-inventory-placeholders](../workflows/docx/template-analysis.feature#L73) | 1 | generalized | @profile-concrete-template-inventory | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-docx-template-inventory-refusal](../workflows/docx/template-analysis.feature#L81) | 10 | generalized | @profile-concrete-template-inventory | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-docx-template-inventory-bounds](../workflows/docx/template-analysis.feature#L100) | 3 | generalized | @profile-concrete-template-inventory | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-docx-template-inventory-encoding](../workflows/docx/template-analysis.feature#L112) | 2 | generalized | @profile-concrete-template-inventory | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-docx-template-inventory-snapshot](../workflows/docx/template-analysis.feature#L123) | 1 | generalized | @profile-concrete-template-inventory | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |
| [@id-docx-template-inventory-scope](../workflows/docx/template-analysis.feature#L131) | 2 | generalized | @profile-concrete-template-inventory | The shared local contract gives concrete source recipes, expected values, refusal variants, encoding and custody boundaries without language-specific types. [python-template-analysis.md](../contracts/python-template-analysis.md) [template-inventory.md](../contracts/template-inventory.md) |

### docx/template-cache.feature

Word template metadata cache — **profile-specific**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-python-template-cache-key-stable](../workflows/docx/template-cache.feature#L11) | 1 | profile-specific | @profile-template-cache-api | Cache key/source-metadata/schema conventions and exact stored/hit/stale/corrupt reasons require the cache API profile. [python-template-cache.md](../contracts/python-template-cache.md) |
| [@id-python-template-cache-roundtrip](../workflows/docx/template-cache.feature#L17) | 1 | profile-specific | @profile-template-cache-api | Cache key/source-metadata/schema conventions and exact stored/hit/stale/corrupt reasons require the cache API profile. [python-template-cache.md](../contracts/python-template-cache.md) |
| [@id-python-template-cache-source-change](../workflows/docx/template-cache.feature#L25) | 1 | profile-specific | @profile-template-cache-api | Cache key/source-metadata/schema conventions and exact stored/hit/stale/corrupt reasons require the cache API profile. [python-template-cache.md](../contracts/python-template-cache.md) |
| [@id-python-template-cache-corrupt](../workflows/docx/template-cache.feature#L34) | 1 | profile-specific | @profile-template-cache-api | Cache key/source-metadata/schema conventions and exact stored/hit/stale/corrupt reasons require the cache API profile. [python-template-cache.md](../contracts/python-template-cache.md) |
| [@id-python-template-cache-schema-mismatch](../workflows/docx/template-cache.feature#L42) | 1 | profile-specific | @profile-template-cache-api | Cache key/source-metadata/schema conventions and exact stored/hit/stale/corrupt reasons require the cache API profile. [python-template-cache.md](../contracts/python-template-cache.md) |
| [@id-python-template-cache-sow-reuse](../workflows/docx/template-cache.feature#L50) | 1 | profile-specific | @profile-template-cache-api | Cache key/source-metadata/schema conventions and exact stored/hit/stale/corrupt reasons require the cache API profile. [python-template-cache.md](../contracts/python-template-cache.md) |
| [@id-python-template-cache-sow-regenerate](../workflows/docx/template-cache.feature#L60) | 1 | profile-specific | @profile-template-cache-api | Cache key/source-metadata/schema conventions and exact stored/hit/stale/corrupt reasons require the cache API profile. [python-template-cache.md](../contracts/python-template-cache.md) |

### docx/text.feature

DOCX slice paragraph text search and run-safe replacement — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-format-preserve](../workflows/docx/text.feature#L8) | 1 | generalized | — | Sealed source documents, selected positions, literal changes and refusal/custody predicates are independent of implementation language. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-xml-space](../workflows/docx/text.feature#L16) | 1 | incomplete | — | The synthetic-whitespace source lacks its exact run split/text-node recipe here. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-table-paragraph](../workflows/docx/text.feature#L24) | 1 | generalized | — | Sealed source documents, selected positions, literal changes and refusal/custody predicates are independent of implementation language. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-stale-span](../workflows/docx/text.feature#L34) | 1 | profile-specific | — | Pinned inputs and byte custody are concrete; stale-span lifetime and exact error code select a session API. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-docx-refuse-topology](../workflows/docx/text.feature#L44) | 3 | incomplete | — | The synthetic-field example lacks exact source XML; pinned SDT rows cannot supply that missing row. [native-profiles.md](../contracts/native-profiles.md) |

### docx/tracked-workflow.feature

Word tracked editing and author settings — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-track-changes-option-outcome](../workflows/docx/tracked-workflow.feature#L9) | 5 | incomplete | — | Dispatch kind/refusal labels and abstract source package lack a complete shared per-row input recipe, despite exact revision counts. [tracked-workflow.md](../contracts/tracked-workflow.md) |
| [@id-docx-workflow-tracked-refusal](../workflows/docx/tracked-workflow.feature#L24) | 12 | incomplete | — | Dispatch kind/refusal labels and abstract source package lack a complete shared per-row input recipe, despite exact revision counts. [tracked-workflow.md](../contracts/tracked-workflow.md) |
| [@id-docx-go-track-author-toggle](../workflows/docx/tracked-workflow.feature#L50) | 1 | profile-specific | @profile-document-value-api | Named in-memory getters and return conventions require deliberate document-value API adoption; they do not assert saved OOXML. [tracked-workflow.md](../contracts/tracked-workflow.md) [go-document-api.md](../contracts/go-document-api.md) |

### docx/tracking-settings.feature

Word tracking preference persistence and preservation — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-docx-tracking-settings-persistence](../workflows/docx/tracking-settings.feature#L10) | 2 | generalized | @profile-preserving-settings-editor | Local settings contract defines literal source, ownership/refusal variants, encodings, saved results and synchronous fault stages. [tracking-settings.md](../contracts/tracking-settings.md) |
| [@id-docx-tracking-settings-custody](../workflows/docx/tracking-settings.feature#L22) | 3 | generalized | @profile-preserving-settings-editor | Local settings contract defines literal source, ownership/refusal variants, encodings, saved results and synchronous fault stages. [tracking-settings.md](../contracts/tracking-settings.md) |
| [@id-docx-tracking-settings-no-op](../workflows/docx/tracking-settings.feature#L35) | 4 | generalized | @profile-preserving-settings-editor | Local settings contract defines literal source, ownership/refusal variants, encodings, saved results and synchronous fault stages. [tracking-settings.md](../contracts/tracking-settings.md) |
| [@id-docx-tracking-settings-refusal](../workflows/docx/tracking-settings.feature#L48) | 8 | generalized | @profile-preserving-settings-editor | Local settings contract defines literal source, ownership/refusal variants, encodings, saved results and synchronous fault stages. [tracking-settings.md](../contracts/tracking-settings.md) |
| [@id-docx-tracking-settings-rollback](../workflows/docx/tracking-settings.feature#L65) | 3 | generalized | @profile-preserving-settings-editor | Local settings contract defines literal source, ownership/refusal variants, encodings, saved results and synchronous fault stages. [tracking-settings.md](../contracts/tracking-settings.md) |
| [@id-docx-tracking-settings-plain-edit](../workflows/docx/tracking-settings.feature#L77) | 1 | generalized | @profile-preserving-settings-editor | Local settings contract defines literal source, ownership/refusal variants, encodings, saved results and synchronous fault stages. [tracking-settings.md](../contracts/tracking-settings.md) |
| [@id-docx-tracking-settings-author-refusal](../workflows/docx/tracking-settings.feature#L84) | 3 | generalized | @profile-preserving-settings-editor | Local settings contract defines literal source, ownership/refusal variants, encodings, saved results and synchronous fault stages. [tracking-settings.md](../contracts/tracking-settings.md) |

### pptx/bullets.feature

PPTX bullets — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-manipulation-bullet-default](../workflows/pptx/bullets.feature#L5) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-bullet-sequence](../workflows/pptx/bullets.feature#L17) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-bullet-level](../workflows/pptx/bullets.feature#L29) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-bullet-bold-label](../workflows/pptx/bullets.feature#L41) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-clear-bullets](../workflows/pptx/bullets.feature#L53) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |

### pptx/creation.feature

PPTX native title-slide authoring — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-create-new-minimal](../workflows/pptx/creation.feature#L8) | 1 | incomplete | — | Minimal deck and refusal-kind names lack exact slide text/layout recipes and per-case expected graph values in this repo. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-create-anchor-preservation](../workflows/pptx/creation.feature#L14) | 1 | incomplete | — | Minimal deck and refusal-kind names lack exact slide text/layout recipes and per-case expected graph values in this repo. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-create-refusals](../workflows/pptx/creation.feature#L20) | 1 | incomplete | — | Minimal deck and refusal-kind names lack exact slide text/layout recipes and per-case expected graph values in this repo. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-manipulation-insert-start](../workflows/pptx/creation.feature#L26) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-insert-middle](../workflows/pptx/creation.feature#L38) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |

### pptx/layout-recommendation.feature

Inspect presentation slide layouts for content placement — **profile-specific**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-layout-recommendation-ranked](../workflows/pptx/layout-recommendation.feature#L10) | 5 | profile-specific | @profile-layout-ranking | Pinned ranking, score/tie order and next-tool hints require the recommendation API. [functional-equivalence.json](../ledgers/functional-equivalence.json) |
| [@id-pptx-layout-recommendation-missing-file](../workflows/pptx/layout-recommendation.feature#L28) | 1 | profile-specific | @profile-layout-ranking | Pinned ranking, score/tie order and next-tool hints require the recommendation API. [functional-equivalence.json](../ledgers/functional-equivalence.json) |

### pptx/mutation-safety.feature

Presentation batch preview and committed results — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-dry-run-no-mutation](../workflows/pptx/mutation-safety.feature#L9) | 3 | generalized | — | Manifest-backed source and mutation contract fix destination policy, exact changed members and atomicity. [mutation-safety.json](../contracts/mutation-safety.json) |
| [@id-pptx-batch-output-accumulates](../workflows/pptx/mutation-safety.feature#L26) | 2 | generalized | — | Manifest-backed source and mutation contract fix destination policy, exact changed members and atomicity. [mutation-safety.json](../contracts/mutation-safety.json) |
| [@id-office-preview-details](../workflows/pptx/mutation-safety.feature#L50) | 1 | generalized | — | Manifest-backed source and mutation contract fix destination policy, exact changed members and atomicity. [mutation-safety.json](../contracts/mutation-safety.json) |

### pptx/notes.feature

Presentation notes inspection and editing — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-order-notes-read](../workflows/pptx/notes.feature#L9) | 1 | incomplete | — | The ordered-notes fixture label lacks an explicit local permutation/input recipe; do not infer it from an implementation binding. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-notes-collection-read](../workflows/pptx/notes.feature#L19) | 2 | profile-specific | @profile-notes-collection | One-based numbering, file/notes JSON keys and literal not-found messages require the notes-collection response API. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-go-notes-exact-splice](../workflows/pptx/notes.feature#L44) | 1 | profile-specific | @profile-existing-notes | Existing-part target ownership, stale-target policy, input restrictions and template fragments require this bounded notes editor profile. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-go-notes-refusal-and-noop-custody](../workflows/pptx/notes.feature#L54) | 1 | profile-specific | @profile-existing-notes | Existing-part target ownership, stale-target policy, input restrictions and template fragments require this bounded notes editor profile. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-go-notes-clear-stale-refill](../workflows/pptx/notes.feature#L64) | 1 | profile-specific | @profile-existing-notes | Existing-part target ownership, stale-target policy, input restrictions and template fragments require this bounded notes editor profile. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-go-notes-part-fingerprint-refusal](../workflows/pptx/notes.feature#L73) | 1 | profile-specific | @profile-existing-notes | Existing-part target ownership, stale-target policy, input restrictions and template fragments require this bounded notes editor profile. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-go-notes-self-closing-fill](../workflows/pptx/notes.feature#L80) | 1 | profile-specific | @profile-existing-notes | Existing-part target ownership, stale-target policy, input restrictions and template fragments require this bounded notes editor profile. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-go-notes-edge-space-preserve](../workflows/pptx/notes.feature#L86) | 1 | profile-specific | @profile-existing-notes | Existing-part target ownership, stale-target policy, input restrictions and template fragments require this bounded notes editor profile. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-go-notes-multiline-template](../workflows/pptx/notes.feature#L93) | 1 | profile-specific | @profile-existing-notes | Existing-part target ownership, stale-target policy, input restrictions and template fragments require this bounded notes editor profile. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-go-notes-template-fragments](../workflows/pptx/notes.feature#L102) | 1 | profile-specific | @profile-existing-notes | Existing-part target ownership, stale-target policy, input restrictions and template fragments require this bounded notes editor profile. [go-notes-editing.md](../contracts/go-notes-editing.md) |
| [@id-pptx-manipulation-set-notes](../workflows/pptx/notes.feature#L108) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-notes-readback](../workflows/pptx/notes.feature#L120) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |

### pptx/paragraph-formatting.feature

Retained PPTX paragraph formatting editing — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-formatting-paragraph-align](../workflows/pptx/paragraph-formatting.feature#L5) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-paragraph-indent](../workflows/pptx/paragraph-formatting.feature#L17) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-paragraph-spacing](../workflows/pptx/paragraph-formatting.feature#L29) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-paragraph-line](../workflows/pptx/paragraph-formatting.feature#L41) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |

### pptx/preservation.feature

Presentation archive preservation — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-bun-open-save-noop](../workflows/pptx/preservation.feature#L8) | 1 | generalized | @profile-archive-noop | Pinned presentation and exact path/byte-input no-edit archive custody can be checked in any runtime. [bun-pptx.md](../contracts/bun-pptx.md) |

### pptx/shape-geometry.feature

Retained PPTX shape geometry editing — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-formatting-move](../workflows/pptx/shape-geometry.feature#L5) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-resize](../workflows/pptx/shape-geometry.feature#L17) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-transform](../workflows/pptx/shape-geometry.feature#L29) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-geometry-refusal](../workflows/pptx/shape-geometry.feature#L41) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |

### pptx/shape-style.feature

Retained PowerPoint shape style editing — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-retained-shape-solid-fill](../workflows/pptx/shape-style.feature#L8) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-shape-no-fill](../workflows/pptx/shape-style.feature#L21) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-shape-inherit-fill](../workflows/pptx/shape-style.feature#L34) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-line-color](../workflows/pptx/shape-style.feature#L47) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-line-width](../workflows/pptx/shape-style.feature#L60) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-line-dash](../workflows/pptx/shape-style.feature#L73) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-line-no-fill](../workflows/pptx/shape-style.feature#L86) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-style-refusal](../workflows/pptx/shape-style.feature#L99) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |

### pptx/slide-import.feature

PPTX slide import obligations — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-parity-pptx-composition](../workflows/pptx/slide-import.feature#L6) | 1 | incomplete | — | The reconciliation policy and input presentations are not selected; no complete graph/appearance oracle is specified. [native-profiles.md](../contracts/native-profiles.md) |

### pptx/slide-order.feature

Reorder existing slides by an exact permutation — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-slide-permutation](../workflows/pptx/slide-order.feature#L8) | 7 | incomplete | — | Reverse/rotate/notes and refusal labels lack complete source decks, permutation vectors and exact receipts here. [slide-order.md](../contracts/slide-order.md) |
| [@id-pptx-slide-permutation-refusal](../workflows/pptx/slide-order.feature#L24) | 14 | incomplete | — | Reverse/rotate/notes and refusal labels lack complete source decks, permutation vectors and exact receipts here. [slide-order.md](../contracts/slide-order.md) |
| [@id-pptx-manipulation-reorder](../workflows/pptx/slide-order.feature#L46) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-reorder-refusal](../workflows/pptx/slide-order.feature#L58) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |

### pptx/slide-visibility.feature

PowerPoint slide visibility by slide identity — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-slide-visibility-retained-inputs](../workflows/pptx/slide-visibility.feature#L9) | 1 | generalized | — | Sealed source/control identities and explicit namespace-qualified/unqualified visibility predicates are independently reusable. [pptx-slide-visibility.md](../contracts/pptx-slide-visibility.md) |
| [@id-pptx-office-hidden-slide-positive](../workflows/pptx/slide-visibility.feature#L21) | 1 | incomplete | — | Requires a not-yet-acquired untouched PowerPoint positive and version/platform reopen evidence; it is application-dependent, not language-runtime-specific. [pptx-slide-visibility.md](../contracts/pptx-slide-visibility.md) |
| [@id-pptx-formatting-hide](../workflows/pptx/slide-visibility.feature#L34) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-unhide](../workflows/pptx/slide-visibility.feature#L46) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-visibility-order](../workflows/pptx/slide-visibility.feature#L58) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-visibility-refusal](../workflows/pptx/slide-visibility.feature#L70) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |

### pptx/tables.feature

PPTX native rectangular tables — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-table-roundtrip-geometry](../workflows/pptx/tables.feature#L7) | 1 | incomplete | — | Synthetic table and stale/geometry case labels lack the complete local slide/table recipes and numeric expected results. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-table-formatting](../workflows/pptx/tables.feature#L13) | 1 | incomplete | — | Synthetic table and stale/geometry case labels lack the complete local slide/table recipes and numeric expected results. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-table-stale-handle](../workflows/pptx/tables.feature#L19) | 1 | incomplete | — | Synthetic table and stale/geometry case labels lack the complete local slide/table recipes and numeric expected results. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-table-atomic-refusals](../workflows/pptx/tables.feature#L25) | 2 | incomplete | — | Synthetic table and stale/geometry case labels lack the complete local slide/table recipes and numeric expected results. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-manipulation-table-values](../workflows/pptx/tables.feature#L36) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-table-geometry](../workflows/pptx/tables.feature#L48) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-table-properties-cell-fill](../workflows/pptx/tables.feature#L63) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-cell-no-fill](../workflows/pptx/tables.feature#L76) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-cell-inherit-fill](../workflows/pptx/tables.feature#L89) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-border-left](../workflows/pptx/tables.feature#L102) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-border-right](../workflows/pptx/tables.feature#L115) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-border-top](../workflows/pptx/tables.feature#L128) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-border-bottom](../workflows/pptx/tables.feature#L141) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-border-no-fill](../workflows/pptx/tables.feature#L154) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-border-remove](../workflows/pptx/tables.feature#L167) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-cell-margins](../workflows/pptx/tables.feature#L180) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-cell-anchor](../workflows/pptx/tables.feature#L193) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-cell-direction](../workflows/pptx/tables.feature#L206) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-cell-anchor-center](../workflows/pptx/tables.feature#L219) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-column-width](../workflows/pptx/tables.feature#L232) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-row-height](../workflows/pptx/tables.feature#L245) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-first-row-off](../workflows/pptx/tables.feature#L258) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-band-row-off](../workflows/pptx/tables.feature#L271) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-frame-position](../workflows/pptx/tables.feature#L284) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-cell-unbold](../workflows/pptx/tables.feature#L297) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |
| [@id-pptx-table-properties-refusal](../workflows/pptx/tables.feature#L310) | 1 | generalized | @profile-retained-table-properties | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-table-properties.md](../contracts/retained-table-properties.md) |

### pptx/text-autofit.feature

PPTX text autofit — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-manipulation-autofit-shrink](../workflows/pptx/text-autofit.feature#L5) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-autofit-none](../workflows/pptx/text-autofit.feature#L17) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-autofit-resize](../workflows/pptx/text-autofit.feature#L29) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |

### pptx/text-box.feature

Positioned text-box authoring on existing slides — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-text-box-authoring](../workflows/pptx/text-box.feature#L8) | 8 | incomplete | — | Plain/multiline/geometry/defect labels lack per-row source decks, actual EMU coordinates, literal text and expected identities. [text-box.md](../contracts/text-box.md) |
| [@id-pptx-text-box-refusal](../workflows/pptx/text-box.feature#L25) | 15 | incomplete | — | Plain/multiline/geometry/defect labels lack per-row source decks, actual EMU coordinates, literal text and expected identities. [text-box.md](../contracts/text-box.md) |

### pptx/text-formatting.feature

Retained PPTX text formatting editing — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-formatting-run-bold](../workflows/pptx/text-formatting.feature#L5) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-run-unbold](../workflows/pptx/text-formatting.feature#L17) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-run-italic](../workflows/pptx/text-formatting.feature#L29) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-run-underline](../workflows/pptx/text-formatting.feature#L41) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-run-size](../workflows/pptx/text-formatting.feature#L53) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-run-font](../workflows/pptx/text-formatting.feature#L65) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-run-color](../workflows/pptx/text-formatting.feature#L77) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-formatting-run-inherit](../workflows/pptx/text-formatting.feature#L89) | 1 | generalized | @profile-retained-formatting | Exactretainedinput/directpropertyvalues/lexicalcustody/refusal independent savedchecks; allruntimesplanned. [pptx-formatting.md](../contracts/pptx-formatting.md) |
| [@id-pptx-retained-run-strike](../workflows/pptx/text-formatting.feature#L104) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-run-caps](../workflows/pptx/text-formatting.feature#L117) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-run-baseline](../workflows/pptx/text-formatting.feature#L130) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-run-tracking](../workflows/pptx/text-formatting.feature#L143) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |

### pptx/text-frame-properties.feature

Retained PowerPoint text frame properties editing — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-retained-body-anchor](../workflows/pptx/text-frame-properties.feature#L8) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-body-direction](../workflows/pptx/text-frame-properties.feature#L21) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-body-wrap](../workflows/pptx/text-frame-properties.feature#L34) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-body-insets](../workflows/pptx/text-frame-properties.feature#L47) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-body-anchor-center](../workflows/pptx/text-frame-properties.feature#L60) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-body-rotation](../workflows/pptx/text-frame-properties.feature#L73) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-body-columns](../workflows/pptx/text-frame-properties.feature#L86) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |
| [@id-pptx-retained-body-rtl-columns](../workflows/pptx/text-frame-properties.feature#L99) | 1 | generalized | @profile-retained-style-word | Project-authoredretainededitcontract;exacttargetdirectvalues/save-reopen/source-bytecustodyandatomicerrors,allconsumersplanned. [retained-style-word.md](../contracts/retained-style-word.md) |

### pptx/text.feature

Presentation anchored text editing — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-pptx-readable-unsupported-topology](../workflows/pptx/text.feature#L9) | 1 | incomplete | — | Synthetic slide, text-anchor and unsupported topology labels need explicit source XML and expected strings before independent reuse. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-cross-run-replace](../workflows/pptx/text.feature#L15) | 1 | incomplete | — | Synthetic slide, text-anchor and unsupported topology labels need explicit source XML and expected strings before independent reuse. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-stale-anchor-refusal](../workflows/pptx/text.feature#L21) | 1 | incomplete | — | Synthetic slide, text-anchor and unsupported topology labels need explicit source XML and expected strings before independent reuse. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-pptx-manipulation-patch-title](../workflows/pptx/text.feature#L30) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-patch-body](../workflows/pptx/text.feature#L42) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-patch-subtitle](../workflows/pptx/text.feature#L54) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |
| [@id-pptx-manipulation-append-title](../workflows/pptx/text.feature#L66) | 1 | generalized | @profile-retained-manipulation | Concrete immutable input, literal operation/values, independent saved XML readback and exact unrelated-payload custody; implementation planned in every runtime. [pptx-manipulation.md](../contracts/pptx-manipulation.md) |

### xlsx/cache-completeness.feature

XLSX cache completeness obligations — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-derived-cache-completeness](../workflows/xlsx/cache-completeness.feature#L6) | 1 | incomplete | — | Broad freshness obligation leaves supported dependencies, input package and exact invalidated/recalculated results unspecified. [native-profiles.md](../contracts/native-profiles.md) |

### xlsx/calculation-chain-lifecycle.feature

Owned XLSX calculation-chain removal during dependent-cache invalidation — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-owned-calculation-chain-invalidation](../workflows/xlsx/calculation-chain-lifecycle.feature#L7) | 1 | generalized | — | Two-sheet literal formulas/caches, owned chain path and exact removal/dependency/custody outcomes define a portable constructed test. [package-profiles.md](../contracts/package-profiles.md) |

### xlsx/calculation-engine.feature

XLSX calculation engine obligations — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-parity-native-oracle](../workflows/xlsx/calculation-engine.feature#L6) | 1 | incomplete | — | The frozen workbook, supported calculation contract, expected values/errors and exclusion corpus are not supplied by this scenario. [native-profiles.md](../contracts/native-profiles.md) |

### xlsx/cell-style.feature

Spreadsheet cell style selection and dependency closure — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-style-dependency-closure](../workflows/xlsx/cell-style.feature#L9) | 1 | generalized | — | Mutation fixture contract supplies the exact source, multiline value, style bounds, graph closure and custody assertions. [cell-style.md](../contracts/cell-style.md) |
| [@id-xlsx-cell-style-selection](../workflows/xlsx/cell-style.feature#L30) | 9 | incomplete | — | Style-selection kind labels lack exact source cellXfs and selected indexes/expected per-row receipts here. [cell-style.md](../contracts/cell-style.md) |
| [@id-xlsx-cell-style-refusal](../workflows/xlsx/cell-style.feature#L48) | 18 | incomplete | — | Style-selection kind labels lack exact source cellXfs and selected indexes/expected per-row receipts here. [cell-style.md](../contracts/cell-style.md) |

### xlsx/cells.feature

Spreadsheet cell reading and editing — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-read-rel-linked-shared-strings](../workflows/xlsx/cells.feature#L9) | 1 | incomplete | — | Synthetic workbook labels omit exact worksheet/relationship/formula inputs and expected values; some fixture-based rows are classified separately. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-preserve-styled-cell-edit](../workflows/xlsx/cells.feature#L16) | 1 | generalized | — | The shared formatting fixture, literal A2 replacement and reopened style/unrelated-member custody define a bounded portable edit. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-prefixed-namespace-safe-edits](../workflows/xlsx/cells.feature#L23) | 1 | incomplete | — | Synthetic workbook labels omit exact worksheet/relationship/formula inputs and expected values; some fixture-based rows are classified separately. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-phonetic-guides-excluded](../workflows/xlsx/cells.feature#L29) | 1 | incomplete | — | Synthetic workbook labels omit exact worksheet/relationship/formula inputs and expected values; some fixture-based rows are classified separately. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-styled-blank-cell-editable](../workflows/xlsx/cells.feature#L35) | 1 | incomplete | — | Synthetic workbook labels omit exact worksheet/relationship/formula inputs and expected values; some fixture-based rows are classified separately. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-refuse-shared-formula-overwrite](../workflows/xlsx/cells.feature#L42) | 1 | incomplete | — | Synthetic workbook labels omit exact worksheet/relationship/formula inputs and expected values; some fixture-based rows are classified separately. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-refuse-array-formula-overwrite](../workflows/xlsx/cells.feature#L49) | 1 | incomplete | — | Synthetic workbook labels omit exact worksheet/relationship/formula inputs and expected values; some fixture-based rows are classified separately. [native-profiles.md](../contracts/native-profiles.md) |

### xlsx/comment-vml-custody.feature

XLSX comment and VML relationship custody by operation and editor profile — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-comment-vml-existing-graph](../workflows/xlsx/comment-vml-custody.feature#L9) | 1 | generalized | — | Pinned fixture, exact part paths, relationship types and comment text define runtime-neutral graph observations. [python-xlsx-dependencies.md](../contracts/python-xlsx-dependencies.md) |
| [@id-xlsx-comment-vml-disjoint-row-shift](../workflows/xlsx/comment-vml-custody.feature#L19) | 1 | profile-specific | @profile-preservation-row-editor | Concrete relationship/VML observations are portable, but preservation-row and limited-number editors deliberately require different admission policies. These are bounded predicates: the control/unknown-shape refusals do not assert full byte custody. [python-xlsx-dependencies.md](../contracts/python-xlsx-dependencies.md) |
| [@id-xlsx-comment-vml-affected-row-refusal](../workflows/xlsx/comment-vml-custody.feature#L27) | 1 | profile-specific | @profile-preservation-row-editor | Concrete relationship/VML observations are portable, but preservation-row and limited-number editors deliberately require different admission policies. These are bounded predicates: the control/unknown-shape refusals do not assert full byte custody. [python-xlsx-dependencies.md](../contracts/python-xlsx-dependencies.md) |
| [@id-xlsx-comment-vml-control-shape-refusal](../workflows/xlsx/comment-vml-custody.feature#L35) | 1 | profile-specific | @profile-preservation-row-editor | Concrete relationship/VML observations are portable, but preservation-row and limited-number editors deliberately require different admission policies. These are bounded predicates: the control/unknown-shape refusals do not assert full byte custody. [python-xlsx-dependencies.md](../contracts/python-xlsx-dependencies.md) |
| [@id-xlsx-comment-vml-unknown-shape-refusal](../workflows/xlsx/comment-vml-custody.feature#L42) | 1 | profile-specific | @profile-preservation-row-editor | Concrete relationship/VML observations are portable, but preservation-row and limited-number editors deliberately require different admission policies. These are bounded predicates: the control/unknown-shape refusals do not assert full byte custody. [python-xlsx-dependencies.md](../contracts/python-xlsx-dependencies.md) |
| [@id-xlsx-comment-vml-limited-editor-refusal](../workflows/xlsx/comment-vml-custody.feature#L49) | 1 | profile-specific | @profile-limited-number-editor | Concrete relationship/VML observations are portable, but preservation-row and limited-number editors deliberately require different admission policies. These are bounded predicates: the control/unknown-shape refusals do not assert full byte custody. [python-xlsx-dependencies.md](../contracts/python-xlsx-dependencies.md) |

### xlsx/creation.feature

Native XLSX workbook creation and missing-cell authoring — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-create-native-default](../workflows/xlsx/creation.feature#L7) | 1 | generalized | — | Literal worksheet/cell operations and saved package/value predicates can be reused within the stated minimal authoring scope. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-create-add-worksheet](../workflows/xlsx/creation.feature#L15) | 1 | generalized | — | Literal worksheet/cell operations and saved package/value predicates can be reused within the stated minimal authoring scope. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-create-prefixed-missing-cell](../workflows/xlsx/creation.feature#L22) | 1 | incomplete | — | The prefixed source is synthetic and lacks exact workbook/worksheet namespace XML in this repository. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-create-coordinate-boundary](../workflows/xlsx/creation.feature#L29) | 1 | generalized | — | Literal worksheet/cell operations and saved package/value predicates can be reused within the stated minimal authoring scope. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-create-row-ordering](../workflows/xlsx/creation.feature#L36) | 1 | generalized | — | Literal worksheet/cell operations and saved package/value predicates can be reused within the stated minimal authoring scope. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-create-invalid-params-atomic](../workflows/xlsx/creation.feature#L43) | 1 | incomplete | — | Invalid coordinates and names are not enumerated, so independent bindings could test different refusal sets. [native-profiles.md](../contracts/native-profiles.md) |
| [@id-xlsx-create-existing-fixture-append](../workflows/xlsx/creation.feature#L50) | 1 | generalized | — | Literal worksheet/cell operations and saved package/value predicates can be reused within the stated minimal authoring scope. [native-profiles.md](../contracts/native-profiles.md) |

### xlsx/formula-cache.feature

Spreadsheet formula cache invalidation and boundaries — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-cross-sheet-cache-invalidation](../workflows/xlsx/formula-cache.feature#L9) | 1 | generalized | — | Manifest-backed source plus literal input/formula/cached values and destination policy define portable stale-cache invalidation. [mutation-safety.json](../contracts/mutation-safety.json) |
| [@id-xlsx-clear-cross-sheet-caches](../workflows/xlsx/formula-cache.feature#L32) | 1 | incomplete | — | Most synthetic topology/cache labels lack local construction and per-member expected outcomes; the manifest-backed mutation row is separate. [mutation-safety.json](../contracts/mutation-safety.json) |
| [@id-xlsx-array-input-refusal](../workflows/xlsx/formula-cache.feature#L43) | 2 | incomplete | — | Most synthetic topology/cache labels lack local construction and per-member expected outcomes; the manifest-backed mutation row is separate. [mutation-safety.json](../contracts/mutation-safety.json) |
| [@id-xlsx-cache-scope-opaque-parts](../workflows/xlsx/formula-cache.feature#L54) | 1 | incomplete | — | Most synthetic topology/cache labels lack local construction and per-member expected outcomes; the manifest-backed mutation row is separate. [mutation-safety.json](../contracts/mutation-safety.json) |

### xlsx/formula-references.feature

Static formula references and insertion remaps — **profile-specific**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-go-formula-analysis-counts](../workflows/xlsx/formula-references.feature#L10) | 6 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xlsx-go-formula-quoted-sheet-flags](../workflows/xlsx/formula-references.feature#L27) | 1 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xlsx-go-formula-analysis-refusal](../workflows/xlsx/formula-references.feature#L37) | 7 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xlsx-go-formula-literal-punctuation](../workflows/xlsx/formula-references.feature#L53) | 5 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xlsx-go-direct-range-parsing](../workflows/xlsx/formula-references.feature#L68) | 6 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xlsx-go-direct-range-refusal](../workflows/xlsx/formula-references.feature#L85) | 7 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xlsx-go-static-remap-exact](../workflows/xlsx/formula-references.feature#L101) | 5 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xlsx-go-static-remap-refusal](../workflows/xlsx/formula-references.feature#L115) | 7 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xlsx-go-static-reference-properties](../workflows/xlsx/formula-references.feature#L131) | 1 | profile-specific | @profile-static-reference-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-formula-references.md](../contracts/go-formula-references.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |

### xlsx/mutation-safety.feature

Spreadsheet batch preview and atomic refusal — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xlsx-dry-run-no-mutation](../workflows/xlsx/mutation-safety.feature#L9) | 3 | generalized | — | Manifest-backed source and mutation contract fix exact changed members and destination/refusal custody. [mutation-safety.json](../contracts/mutation-safety.json) |
| [@id-xlsx-strict-batch-atomicity](../workflows/xlsx/mutation-safety.feature#L26) | 3 | generalized | — | Manifest-backed source and mutation contract fix exact changed members and destination/refusal custody. [mutation-safety.json](../contracts/mutation-safety.json) |

### xlsx/structural-edits.feature

XLSX structural edits obligations — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-parity-xlsx-structure](../workflows/xlsx/structural-edits.feature#L6) | 1 | incomplete | — | Structural operation, range coordinates, input formula/name/chart corpus and exact remapped outputs are not enumerated. [native-profiles.md](../contracts/native-profiles.md) |

### xlsx/style-readback.feature

XLSX style readback obligations — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-office-xlsx-independent-style-reader](../workflows/xlsx/style-readback.feature#L6) | 1 | incomplete | — | Independent-reader obligation lacks a particular saved workbook/style recipe and exact edited-cell expected value. [native-profiles.md](../contracts/native-profiles.md) |

### package/admission-limit-configuration.feature

Package admission validates caller resource budgets — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-package-admission-negative-budget](../workflows/package/admission-limit-configuration.feature#L11) | 2 | generalized | — | Negative caller budgets, zero control and pre-intake/caller-byte custody define a portable configuration refusal. [package-profiles.md](../contracts/package-profiles.md) |

### package/data-descriptor-integrity.feature

ZIP data-descriptor integrity with ambiguous signature bytes — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-zip-unsigned-descriptor-signature-collision](../workflows/package/data-descriptor-integrity.feature#L9) | 1 | generalized | — | Exact descriptor geometry and CRC collision with valid/corrupt controls define a reusable ZIP integrity check. [package-profiles.md](../contracts/package-profiles.md) |

### package/graph.feature

Package relationship graph editing and payload differences — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-opc-add-related-part](../workflows/package/graph.feature#L8) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-opc-graph-rollback](../workflows/package/graph.feature#L15) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-opc-remove-related-part](../workflows/package/graph.feature#L22) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-opc-diff-content-type](../workflows/package/graph.feature#L29) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |

### package/preservation.feature

OPC package custody, transactions and save destinations — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-opc-package-corpus-noop](../workflows/package/preservation.feature#L8) | 1 | generalized | — | Package-level no-op/rollback/custody outcomes do not depend on source-corpus runtime names. [bun-opc-custody.md](../contracts/bun-opc-custody.md) |
| [@id-opc-package-transaction-rollback](../workflows/package/preservation.feature#L15) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-opc-package-preserve-unrelated](../workflows/package/preservation.feature#L22) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-bun-opc-open-refusal](../workflows/package/preservation.feature#L47) | 5 | generalized | @profile-package-refusal-reasons | Concrete archive/envelope mutations, structured reason-specific refusals and exact caller/destination custody replace exception identity and diagnostic wording; native semantic limit mappings are explicit. [bun-opc-custody.md](../contracts/bun-opc-custody.md) |
| [@id-bun-opc-detached-byte-copies](../workflows/package/preservation.feature#L61) | 1 | generalized | @profile-opc-byte-custody | Package-level no-op/rollback/custody outcomes do not depend on source-corpus runtime names. [bun-opc-custody.md](../contracts/bun-opc-custody.md) |
| [@id-bun-opc-preserve-utf16le-edit](../workflows/package/preservation.feature#L69) | 1 | generalized | @profile-opc-byte-custody | Package-level no-op/rollback/custody outcomes do not depend on source-corpus runtime names. [bun-opc-custody.md](../contracts/bun-opc-custody.md) |
| [@id-bun-opc-async-transaction-refusal](../workflows/package/preservation.feature#L77) | 1 | generalized | @profile-portable-transactions | Explicit deferred-mode pre-body refusal, immediate opaque-token identity/non-evaluation, and archive/readback custody are native-language-neutral; runtime async protocols remain supplemental safeguards. [bun-opc-custody.md](../contracts/bun-opc-custody.md) |
| [@id-bun-opc-thenable-transaction-result](../workflows/package/preservation.feature#L85) | 1 | generalized | @profile-portable-transactions | Explicit deferred-mode pre-body refusal, immediate opaque-token identity/non-evaluation, and archive/readback custody are native-language-neutral; runtime async protocols remain supplemental safeguards. [bun-opc-custody.md](../contracts/bun-opc-custody.md) |
| [@id-bun-opc-save-invalid-target-custody](../workflows/package/preservation.feature#L93) | 1 | generalized | @profile-package-refusal-reasons | Concrete archive/envelope mutations, structured reason-specific refusals and exact caller/destination custody replace exception identity and diagnostic wording; native semantic limit mappings are explicit. [bun-opc-custody.md](../contracts/bun-opc-custody.md) |
| [@id-bun-opc-symlink-destination-refusal](../workflows/package/preservation.feature#L102) | 1 | generalized | @profile-package-refusal-reasons | Concrete archive/envelope mutations, structured reason-specific refusals and exact caller/destination custody replace exception identity and diagnostic wording; native semantic limit mappings are explicit. [bun-opc-custody.md](../contracts/bun-opc-custody.md) |

### package/relationship-namespaces.feature

Office relationship attributes use expanded XML names — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-office-relationship-prefix-alias](../workflows/package/relationship-namespaces.feature#L7) | 2 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-office-relationship-wrong-uri](../workflows/package/relationship-namespaces.feature#L18) | 2 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |

### package/semantic-diff.feature

Package diff separates equivalent XML from changed binary members — **profile-specific**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-package-diff-equivalent-xml-and-binary-changes](../workflows/package/semantic-diff.feature#L7) | 1 | profile-specific | — | Concrete ZIP operands are reusable, but equivalent_xml/changed/added/removed response lists and comparison policy form a particular diff API. [package-profiles.md](../contracts/package-profiles.md) |

### package/xml-member-admission.feature

Package admission refuses DTD-bearing or malformed XML members — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-package-admission-unsafe-xml-members](../workflows/package/xml-member-admission.feature#L7) | 3 | generalized | — | Literal UTF-8/UTF-16LE DTD/entity operands and required admission refusal are reusable security-policy tests. [package-profiles.md](../contracts/package-profiles.md) |

### package/zip-admission.feature

Bounded ZIP admission rejects unsafe members and unsupported storage — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-package-admission-unsafe-members](../workflows/package/zip-admission.feature#L7) | 5 | generalized | — | Explicit member pairs, compression methods and physical-overlap fixture make admission predicates reusable. [package-profiles.md](../contracts/package-profiles.md) |
| [@id-package-admission-resource-limits](../workflows/package/zip-admission.feature#L21) | 4 | profile-specific | — | Concrete compressed operand uses exact max_members/max_member_bytes/max_total_bytes/max_ratio keys and zero-means-zero policy; native API mappings must preserve those semantics. [package-profiles.md](../contracts/package-profiles.md) |
| [@id-package-admission-unsupported-compression](../workflows/package/zip-admission.feature#L34) | 1 | generalized | — | Explicit member pairs, compression methods and physical-overlap fixture make admission predicates reusable. [package-profiles.md](../contracts/package-profiles.md) |
| [@id-zip-physical-member-overlap-refusal](../workflows/package/zip-admission.feature#L41) | 1 | generalized | @profile-physical-member-extents | Explicit member pairs, compression methods and physical-overlap fixture make admission predicates reusable. [package-profiles.md](../contracts/package-profiles.md) |

### package/zip32.feature

ZIP32 reading, writing and bounded admission — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-zip-read-valid](../workflows/package/zip32.feature#L8) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-zip-refuse-unsafe](../workflows/package/zip32.feature#L22) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-zip-bounds](../workflows/package/zip32.feature#L34) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-zip-write-deterministic](../workflows/package/zip32.feature#L43) | 1 | profile-specific | — | Explicit ordered entries and mixed Store/Deflate deterministic ZIP32 policy; byte-equality is the repeated-write API predicate, not a generated golden hash. Requires deliberate native profile adoption. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-zip-crc32-standard-vector](../workflows/package/zip32.feature#L60) | 1 | generalized | — | ZIP format operations, deterministic output, CRC and custody predicates are language-independent; missing vectors are separately flagged. [bun-zip32-profile.md](../contracts/bun-zip32-profile.md) |
| [@id-bun-zip32-reader-refusal](../workflows/package/zip32.feature#L66) | 12 | generalized | @profile-zip32-refusal-reasons | Concrete archive/envelope mutations, structured reason-specific refusals and exact caller/destination custody replace exception identity and diagnostic wording; native semantic limit mappings are explicit. [bun-zip32-profile.md](../contracts/bun-zip32-profile.md) |
| [@id-bun-zip32-writer-refusal](../workflows/package/zip32.feature#L88) | 2 | generalized | @profile-zip32-refusal-reasons | Concrete archive/envelope mutations, structured reason-specific refusals and exact caller/destination custody replace exception identity and diagnostic wording; native semantic limit mappings are explicit. [bun-zip32-profile.md](../contracts/bun-zip32-profile.md) |
| [@id-bun-zip32-configured-bounds](../workflows/package/zip32.feature#L99) | 5 | generalized | @profile-zip32-refusal-reasons | Concrete archive/envelope mutations, structured reason-specific refusals and exact caller/destination custody replace exception identity and diagnostic wording; native semantic limit mappings are explicit. [bun-zip32-profile.md](../contracts/bun-zip32-profile.md) |

### package/zip64.feature

ZIP64 admission and writing — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-parity-zip64](../workflows/package/zip64.feature#L10) | 1 | incomplete | — | Forced-ZIP64 operation lacks concrete member names/content and changed payload; no independent source recipe is selected. [package-profiles.md](../contracts/package-profiles.md) |
| [@id-zip64-preflight-count](../workflows/package/zip64.feature#L17) | 1 | profile-specific | @profile-zip64-error-codes | Exact zip-* codes and selected safe-integer/resource policies require explicit ZIP64 compatibility adoption. [package-profiles.md](../contracts/package-profiles.md) |
| [@id-zip64-unsafe-offset](../workflows/package/zip64.feature#L23) | 1 | profile-specific | @profile-zip64-error-codes | Safe integer range is a JavaScript-derived compatibility cap, not a ZIP64 limit; another runtime can adopt it only as a declared profile. [package-profiles.md](../contracts/package-profiles.md) |
| [@id-zip64-resource-limit](../workflows/package/zip64.feature#L29) | 1 | profile-specific | @profile-zip64-error-codes | Exact zip-* codes and selected safe-integer/resource policies require explicit ZIP64 compatibility adoption. [package-profiles.md](../contracts/package-profiles.md) |

### xml/comparison.feature

Conservative XML comparison for package preservation — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xml-comparison-prefix-and-opc-order](../workflows/xml/comparison.feature#L8) | 1 | generalized | — | Concrete fixture/recipe or valid Type-bearing comparison operands; exact payload/order/MIME/relationship/refusal and source-custody predicates are reusable, with fresh native production evidence required. [package-alignment.md](../contracts/package-alignment.md) |
| [@id-xml-comparison-significant-content](../workflows/xml/comparison.feature#L15) | 3 | generalized | — | Literal XML pairs with exact Boolean outcomes define portable bounded comparison, not C14N. [xml-profiles.md](../contracts/xml-profiles.md) |
| [@id-xml-comparison-prefix-attribute-binding](../workflows/xml/comparison.feature#L28) | 1 | generalized | — | Literal XML pairs with exact Boolean outcomes define portable bounded comparison, not C14N. [xml-profiles.md](../contracts/xml-profiles.md) |
| [@id-xml-comparison-unsafe-input](../workflows/xml/comparison.feature#L35) | 2 | generalized | — | Literal XML pairs with exact Boolean outcomes define portable bounded comparison, not C14N. [xml-profiles.md](../contracts/xml-profiles.md) |
| [@id-xml-comparison-processing-instructions-and-comments](../workflows/xml/comparison.feature#L47) | 3 | generalized | — | Literal XML pairs with exact Boolean outcomes define portable bounded comparison, not C14N. [xml-profiles.md](../contracts/xml-profiles.md) |

### xml/editing.feature

XML lexical editing and byte custody — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xml-apply-edits](../workflows/xml/editing.feature#L9) | 1 | generalized | — | Concrete JSON inputs, independent expected UTF-16 coordinates/decoded values or structured refusal/resource/edit recipes; exact source custody and no partial result. All runtimes require fresh production bindings. [xml-lexical-alignment.md](../contracts/xml-lexical-alignment.md) |
| [@id-xml-go-attribute-splice-custody](../workflows/xml/editing.feature#L30) | 3 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xml-go-attribute-batch-refusal](../workflows/xml/editing.feature#L42) | 1 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xml-go-child-insertion-custody](../workflows/xml/editing.feature#L49) | 1 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xml-go-child-insertion-refusal](../workflows/xml/editing.feature#L58) | 1 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xml-go-child-namespace-matrix](../workflows/xml/editing.feature#L66) | 1 | profile-specific | @profile-lexical-snapshot-api | Parsed-snapshot ownership and exact source-splice/escape conventions require the lexical editing API. [go-lexical-editing.md](../contracts/go-lexical-editing.md) |
| [@id-xml-go-element-removal-custody](../workflows/xml/editing.feature#L86) | 1 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xml-go-element-removal-refusal](../workflows/xml/editing.feature#L94) | 2 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xml-go-element-replacement-custody](../workflows/xml/editing.feature#L105) | 1 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xml-go-element-replacement-refusal](../workflows/xml/editing.feature#L112) | 3 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |
| [@id-xml-go-immutable-leaf-seed](../workflows/xml/editing.feature#L125) | 1 | profile-specific | @profile-lexical-snapshot-api | Uniform project-authored lexical/static-reference API profile with independently sealed full result vectors, refusal categories and immutable caller/snapshot custody; no package/schema/rendering or formula evaluation credit. [go-lexical-editing.md](../contracts/go-lexical-editing.md) [uniform-api18.md](../contracts/uniform-api18.md) [uniform-api18.json](../ledgers/uniform-api18.json) |

### xml/names.feature

XML namespace names require valid prefix and local components — **generalized**; fully generalized: **yes**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xml-invalid-qname-components](../workflows/xml/names.feature#L6) | 3 | generalized | — | Concrete JSON inputs, independent expected UTF-16 coordinates/decoded values or structured refusal/resource/edit recipes; exact source custody and no partial result. All runtimes require fresh production bindings. [xml-lexical-alignment.md](../contracts/xml-lexical-alignment.md) |
| [@id-xml-unicode-qname-components](../workflows/xml/names.feature#L17) | 1 | generalized | — | Concrete JSON inputs, independent expected UTF-16 coordinates/decoded values or structured refusal/resource/edit recipes; exact source custody and no partial result. All runtimes require fresh production bindings. [xml-lexical-alignment.md](../contracts/xml-lexical-alignment.md) |
| [@id-xml-outside-root-nbsp](../workflows/xml/names.feature#L25) | 2 | generalized | — | Concrete JSON inputs, independent expected UTF-16 coordinates/decoded values or structured refusal/resource/edit recipes; exact source custody and no partial result. All runtimes require fresh production bindings. [xml-lexical-alignment.md](../contracts/xml-lexical-alignment.md) |

### xml/parsing.feature

XML parsing and value inspection — **mixed**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-xml-parse-offsets](../workflows/xml/parsing.feature#L9) | 1 | generalized | — | Concrete JSON inputs, independent expected UTF-16 coordinates/decoded values or structured refusal/resource/edit recipes; exact source custody and no partial result. All runtimes require fresh production bindings. [xml-lexical-alignment.md](../contracts/xml-lexical-alignment.md) |
| [@id-xml-normalise-line-endings](../workflows/xml/parsing.feature#L21) | 1 | generalized | — | Concrete JSON inputs, independent expected UTF-16 coordinates/decoded values or structured refusal/resource/edit recipes; exact source custody and no partial result. All runtimes require fresh production bindings. [xml-lexical-alignment.md](../contracts/xml-lexical-alignment.md) |
| [@id-xml-parse-refusals](../workflows/xml/parsing.feature#L30) | 1 | generalized | — | Concrete JSON inputs, independent expected UTF-16 coordinates/decoded values or structured refusal/resource/edit recipes; exact source custody and no partial result. All runtimes require fresh production bindings. [xml-lexical-alignment.md](../contracts/xml-lexical-alignment.md) |
| [@id-xml-parse-bounds](../workflows/xml/parsing.feature#L53) | 1 | generalized | — | Concrete JSON inputs, independent expected UTF-16 coordinates/decoded values or structured refusal/resource/edit recipes; exact source custody and no partial result. All runtimes require fresh production bindings. [xml-lexical-alignment.md](../contracts/xml-lexical-alignment.md) |
| [@id-xml-entity-values](../workflows/xml/parsing.feature#L72) | 1 | generalized | — | Literal XML/JSON operands and exact decoded values or roundtrip/refusal outcomes are portable XML contracts. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-stylesheet-processing-instruction](../workflows/xml/parsing.feature#L79) | 1 | generalized | — | Literal XML/JSON operands and exact decoded values or roundtrip/refusal outcomes are portable XML contracts. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-expanded-attribute-lookup](../workflows/xml/parsing.feature#L85) | 1 | generalized | — | Literal XML/JSON operands and exact decoded values or roundtrip/refusal outcomes are portable XML contracts. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-implicit-xml-prefix](../workflows/xml/parsing.feature#L99) | 1 | generalized | — | Literal XML/JSON operands and exact decoded values or roundtrip/refusal outcomes are portable XML contracts. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-prototype-safe-attributes](../workflows/xml/parsing.feature#L107) | 1 | generalized | @profile-xml-model-safety | Exact literal attribute set/values and unchanged root/source replace language-specific prototype checks; native guards remain required. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-immutable-namespace-metadata](../workflows/xml/parsing.feature#L115) | 1 | generalized | @profile-xml-model-safety | Mutating returned namespace metadata cannot affect fresh reads from the same model; read-only or detached native snapshots implement this portable isolation contract. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-escaping-values](../workflows/xml/parsing.feature#L124) | 2 | profile-specific | @profile-xml-escaping-api | Exact named entity spelling is a compatibility profile; other XML-valid spellings preserve the same values. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-escaping-invalid-character](../workflows/xml/parsing.feature#L134) | 1 | generalized | — | Literal XML/JSON operands and exact decoded values or roundtrip/refusal outcomes are portable XML contracts. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-escaping-whitespace-roundtrip](../workflows/xml/parsing.feature#L140) | 1 | generalized | — | Literal XML/JSON operands and exact decoded values or roundtrip/refusal outcomes are portable XML contracts. [xml-values.md](../contracts/xml-values.md) |
| [@id-xml-typed-parse-error](../workflows/xml/parsing.feature#L146) | 1 | generalized | @profile-xml-failure-category | Documented native syntax-failure category, no partial result and source custody replace literal exception-class identity. [xml-values.md](../contracts/xml-values.md) |

### office/full-coverage.feature

OFFICE full coverage obligations — **incomplete**; fully generalized: **no**.

| ID / source | Cases | Tag | Profiles | Reason / local evidence |
|---|---:|---|---|---|
| [@id-parity-inherited](../workflows/office/full-coverage.feature#L6) | 3 | incomplete | — | Catalogue-wide completion gate is a meta-obligation, not a concrete document operation or self-contained executable input. [workflow-receipts.md](../contracts/workflow-receipts.md) |

## Staged source candidates — separate inventory

All rows are **staged-unreviewed** for portability and grant no execution credit.
Reconciliation status is copied from the source-consolidation ledger. File and
case totals describe the current captured candidates, not additional canonical
behaviours; overlap and source-specific helpers may remain.

| Source runtime | Feature file | Captured feature | Cases | Reconciliation |
|---|---|---|---:|---|
| go | [staging/go/behaviors/archive-candidates.feature](../staging/go/behaviors/archive-candidates.feature) | Bounded ZIP intake and retained archive delivery | 9 | stronger-canonical-profile-planned |
| go | [staging/go/behaviors/delivery-candidates.feature](../staging/go/behaviors/delivery-candidates.feature) | Retained payload custody and failure-safe delivery | 7 | pending-functional-review |
| go | [staging/go/behaviors/formula-candidates.feature](../staging/go/behaviors/formula-candidates.feature) | Static formula references and insertion remapping | 8 | pending-functional-review |
| go | [staging/go/behaviors/graph-candidates.feature](../staging/go/behaviors/graph-candidates.feature) | Planned OPC graph mutation and lifecycle custody | 10 | pending-functional-review |
| go | [staging/go/behaviors/ooxml-model-candidates.feature](../staging/go/behaviors/ooxml-model-candidates.feature) | Native OOXML model serialization assertions | 14 | pending-functional-review |
| go | [staging/go/behaviors/package-model-candidates.feature](../staging/go/behaviors/package-model-candidates.feature) | Mutable OPC package parts and registries | 11 | pending-functional-review |
| go | [staging/go/behaviors/presentation-api-candidates.feature](../staging/go/behaviors/presentation-api-candidates.feature) | Native mutable presentation API test predicates | 21 | pending-functional-review |
| go | [staging/go/behaviors/presentation-fixtures-candidates.feature](../staging/go/behaviors/presentation-fixtures-candidates.feature) | Native mutable presentation fixture readback predicates | 11 | pending-functional-review |
| go | [staging/go/behaviors/presentation-fuzz-candidates.feature](../staging/go/behaviors/presentation-fuzz-candidates.feature) | Native presentation fuzz seed predicates | 3 | pending-functional-review |
| go | [staging/go/behaviors/presentation-measurement-candidates.feature](../staging/go/behaviors/presentation-measurement-candidates.feature) | Native presentation measurement-entrypoint predicates | 5 | pending-functional-review |
| go | [staging/go/behaviors/presentation-notes-candidates.feature](../staging/go/behaviors/presentation-notes-candidates.feature) | Native presentation notes preservation and template predicates | 7 | pending-functional-review |
| go | [staging/go/behaviors/presentation-parameters-candidates.feature](../staging/go/behaviors/presentation-parameters-candidates.feature) | Native parameterised presentation predicates | 8 | pending-functional-review |
| go | [staging/go/behaviors/spreadsheet-cache-candidates.feature](../staging/go/behaviors/spreadsheet-cache-candidates.feature) | Native static cache invalidation lifecycle assertions | 10 | pending-functional-review |
| go | [staging/go/behaviors/spreadsheet-fuzz-candidates.feature](../staging/go/behaviors/spreadsheet-fuzz-candidates.feature) | Native spreadsheet fuzz seed predicates | 5 | pending-functional-review |
| go | [staging/go/behaviors/spreadsheet-measurement-candidates.feature](../staging/go/behaviors/spreadsheet-measurement-candidates.feature) | Native spreadsheet measurement-entrypoint predicates | 5 | pending-functional-review |
| go | [staging/go/behaviors/spreadsheet-parameters-candidates.feature](../staging/go/behaviors/spreadsheet-parameters-candidates.feature) | Native parameterised spreadsheet predicates | 12 | pending-functional-review |
| go | [staging/go/behaviors/spreadsheet-targets-candidates.feature](../staging/go/behaviors/spreadsheet-targets-candidates.feature) | Native spreadsheet style admission and image target predicates | 5 | pending-functional-review |
| go | [staging/go/behaviors/test-custody-candidates.feature](../staging/go/behaviors/test-custody-candidates.feature) | Native test-input identity and reference custody | 11 | pending-functional-review |
| go | [staging/go/behaviors/utilities-candidates.feature](../staging/go/behaviors/utilities-candidates.feature) | Native coordinate colour unit and XML utilities | 11 | pending-functional-review |
| go | [staging/go/behaviors/wml-model-candidates.feature](../staging/go/behaviors/wml-model-candidates.feature) | Native WordprocessingML model predicates | 24 | pending-functional-review |
| go | [staging/go/behaviors/xml-candidates.feature](../staging/go/behaviors/xml-candidates.feature) | Lossless namespace-aware XML inspection and bounded edits | 9 | pending-functional-review |
| go | [staging/go/features/external/oracle.feature](../staging/go/features/external/oracle.feature) | Optional spreadsheet calculation checks | 1 | pending-functional-review |
| go | [staging/go/features/implemented/document/bounded-edit.feature](../staging/go/features/implemented/document/bounded-edit.feature) | Bounded preservation-safe Word text correction | 6 | pending-functional-review |
| go | [staging/go/features/implemented/document/comment-mime-preservation.feature](../staging/go/features/implemented/document/comment-mime-preservation.feature) | Unrelated edits preserve differing extended-comment content types | 2 | pending-functional-review |
| go | [staging/go/features/implemented/document/replace-all.feature](../staging/go/features/implemented/document/replace-all.feature) | Word replace-all reports independent refusals | 3 | pending-functional-review |
| go | [staging/go/features/implemented/document/run-boundary.feature](../staging/go/features/implemented/document/run-boundary.feature) | Word insertion at run boundaries | 4 | pending-functional-review |
| go | [staging/go/features/implemented/document/search-boundaries.feature](../staging/go/features/implemented/document/search-boundaries.feature) | Word normalised and paragraph-boundary edge cases | 2 | pending-functional-review |
| go | [staging/go/features/implemented/document/search-policy.feature](../staging/go/features/implemented/document/search-policy.feature) | Explicit Word search policy and context ranking | 4 | pending-functional-review |
| go | [staging/go/features/implemented/document/search-scope.feature](../staging/go/features/implemented/document/search-scope.feature) | Word search story and view scope | 3 | pending-functional-review |
| go | [staging/go/features/implemented/document/span-batch.feature](../staging/go/features/implemented/document/span-batch.feature) | Atomic selected Word span batches | 3 | pending-functional-review |
| go | [staging/go/features/implemented/document/span-guards.feature](../staging/go/features/implemented/document/span-guards.feature) | Hidden run content cannot be crossed by Word text edits | 2 | pending-functional-review |
| go | [staging/go/features/implemented/document/span-replace.feature](../staging/go/features/implemented/document/span-replace.feature) | Word span replacement with exact affix alignment | 5 | pending-functional-review |
| go | [staging/go/features/implemented/document/spans.feature](../staging/go/features/implemented/document/spans.feature) | Exact Word spans across run fragmentation | 5 | pending-functional-review |
| go | [staging/go/features/implemented/document/stories.feature](../staging/go/features/implemented/document/stories.feature) | Read-only Word story projections | 4 | pending-functional-review |
| go | [staging/go/features/implemented/document/whitespace.feature](../staging/go/features/implemented/document/whitespace.feature) | Word whitespace preservation on successful edits | 2 | pending-functional-review |
| go | [staging/go/features/implemented/package/attributes.feature](../staging/go/features/implemented/package/attributes.feature) | Lossless XML attribute edits | 2 | pending-functional-review |
| go | [staging/go/features/implemented/package/baseline.feature](../staging/go/features/implemented/package/baseline.feature) | Existing Office fixture intake | 7 | pending-functional-review |
| go | [staging/go/features/implemented/package/graph-delete.feature](../staging/go/features/implemented/package/graph-delete.feature) | Explicit graph deletion is atomic with payload edits | 7 | pending-functional-review |
| go | [staging/go/features/implemented/package/graph-edit.feature](../staging/go/features/implemented/package/graph-edit.feature) | Planned part addition and relationship retargeting | 8 | pending-functional-review |
| go | [staging/go/features/implemented/package/graph-target-form.feature](../staging/go/features/implemented/package/graph-target-form.feature) | Retargeting preserves the package-relative or absolute target form | 2 | pending-functional-review |
| go | [staging/go/features/implemented/package/graph.feature](../staging/go/features/implemented/package/graph.feature) | Read-only relationship ownership inspection | 6 | pending-functional-review |
| go | [staging/go/features/implemented/package/io-safety.feature](../staging/go/features/implemented/package/io-safety.feature) | Archive intake and failure-safe package delivery | 7 | pending-functional-review |
| go | [staging/go/features/implemented/package/limits.feature](../staging/go/features/implemented/package/limits.feature) | Caller-defined package intake budgets | 5 | pending-functional-review |
| go | [staging/go/features/implemented/package/office-link-namespaces.feature](../staging/go/features/implemented/package/office-link-namespaces.feature) | Office relationship identity follows expanded names and exact type URIs | 12 | pending-functional-review |
| go | [staging/go/features/implemented/package/preservation.feature](../staging/go/features/implemented/package/preservation.feature) | Retained-source package editing | 3 | pending-functional-review |
| go | [staging/go/features/implemented/package/receipts.feature](../staging/go/features/implemented/package/receipts.feature) | Retained-source delivery receipts | 2 | pending-functional-review |
| go | [staging/go/features/implemented/package/structure.feature](../staging/go/features/implemented/package/structure.feature) | Local and central ZIP structures agree | 4 | stronger-canonical-profile-planned |
| go | [staging/go/features/implemented/package/xml-boundary.feature](../staging/go/features/implemented/package/xml-boundary.feature) | Document boundary whitespace must be literal XML whitespace | 4 | pending-functional-review |
| go | [staging/go/features/implemented/package/xml-conformance.feature](../staging/go/features/implemented/package/xml-conformance.feature) | Namespace names and document boundaries obey XML rules | 5 | pending-functional-review |
| go | [staging/go/features/implemented/package/xml-insert.feature](../staging/go/features/implemented/package/xml-insert.feature) | Structured XML insertion preserves namespace meaning | 4 | pending-functional-review |
| go | [staging/go/features/implemented/package/xml-normalization.feature](../staging/go/features/implemented/package/xml-normalization.feature) | XML line endings and attribute values retain original edit offsets | 3 | pending-functional-review |
| go | [staging/go/features/implemented/package/xml-subtree.feature](../staging/go/features/implemented/package/xml-subtree.feature) | Structured subtree replacements preserve surrounding source bytes | 2 | pending-functional-review |
| go | [staging/go/features/implemented/package/xml.feature](../staging/go/features/implemented/package/xml.feature) | Lossless namespace-aware XML leaf edits | 7 | pending-functional-review |
| go | [staging/go/features/implemented/package/zip64.feature](../staging/go/features/implemented/package/zip64.feature) | Bounded ZIP64 declarations agree with physical archive ranges | 14 | pending-functional-review |
| go | [staging/go/features/implemented/presentation/bounded-edit.feature](../staging/go/features/implemented/presentation/bounded-edit.feature) | Bounded presentation text correction | 5 | pending-functional-review |
| go | [staging/go/features/implemented/presentation/notes-edit.feature](../staging/go/features/implemented/presentation/notes-edit.feature) | Guarded edits to an existing notes body | 12 | pending-functional-review |
| go | [staging/go/features/implemented/presentation/notes-multiline.feature](../staging/go/features/implemented/presentation/notes-multiline.feature) | Multiline notes preserve the first paragraph and run formatting template | 9 | pending-functional-review |
| go | [staging/go/features/implemented/presentation/notes-template-choices.feature](../staging/go/features/implemented/presentation/notes-template-choices.feature) | Notes templates must have unambiguous formatting choices | 8 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/allowed-values.feature](../staging/go/features/implemented/spreadsheet/allowed-values.feature) | Deterministic list validation inspection | 19 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/bounded-edit.feature](../staging/go/features/implemented/spreadsheet/bounded-edit.feature) | Bounded formula-free numeric cell correction | 9 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/cache-invalidation.feature](../staging/go/features/implemented/spreadsheet/cache-invalidation.feature) | Static dependency cache invalidation without calculation | 9 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/calc-chain.feature](../staging/go/features/implemented/spreadsheet/calc-chain.feature) | Remove an obsolete calculation chain with dependent-cache invalidation | 7 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/dependency-structure.feature](../staging/go/features/implemented/spreadsheet/dependency-structure.feature) | Dependency analysis validates worksheet structure | 3 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/formula-analysis.feature](../staging/go/features/implemented/spreadsheet/formula-analysis.feature) | Static formula dependency analysis | 12 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/formula-remap.feature](../staging/go/features/implemented/spreadsheet/formula-remap.feature) | Structural reference remapping uses parsed formula tokens | 5 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/formula-tokens.feature](../staging/go/features/implemented/spreadsheet/formula-tokens.feature) | Formula punctuation is distinct from quoted string content | 2 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/image-replace.feature](../staging/go/features/implemented/spreadsheet/image-replace.feature) | Replace one loaded worksheet picture without rewriting drawing XML | 7 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/style-index.feature](../staging/go/features/implemented/spreadsheet/style-index.feature) | Numeric edits require resolvable cell styles | 7 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/validation-axis-ranges.feature](../staging/go/features/implemented/spreadsheet/validation-axis-ranges.feature) | Whole-axis validation sources use stored worksheet extents | 9 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/validation-lexical-limits.feature](../staging/go/features/implemented/spreadsheet/validation-lexical-limits.feature) | Validation vocabularies reject unknown types and non-decimal scalars | 10 | pending-functional-review |
| go | [staging/go/features/implemented/spreadsheet/validation-strings.feature](../staging/go/features/implemented/spreadsheet/validation-strings.feature) | Validation string sources preserve original shared-string identities | 8 | pending-functional-review |
| go | [staging/go/features/planned/document.feature](../staging/go/features/planned/document.feature) | Guarded Word review and editing | 4 | pending-functional-review |
| go | [staging/go/features/planned/oracle-contract.feature](../staging/go/features/planned/oracle-contract.feature) | Calculation adapter failure contracts | 1 | pending-functional-review |
| go | [staging/go/features/planned/package.feature](../staging/go/features/planned/package.feature) | Preservation-safe Office package edits | 6 | pending-functional-review |
| go | [staging/go/features/planned/presentation.feature](../staging/go/features/planned/presentation.feature) | Relationship-safe presentation edits | 4 | pending-functional-review |
| go | [staging/go/features/planned/spreadsheet.feature](../staging/go/features/planned/spreadsheet.feature) | Reference-aware spreadsheet edits | 5 | pending-functional-review |
| python | [staging/python/features/test_acceptance_ledger.feature](../staging/python/features/test_acceptance_ledger.feature) | acceptance ledger native behavior capture | 8 | pending-functional-review |
| python | [staging/python/features/test_advanced_edge_cases.feature](../staging/python/features/test_advanced_edge_cases.feature) | advanced edge cases native behavior capture | 12 | pending-functional-review |
| python | [staging/python/features/test_aioumcp_validation.feature](../staging/python/features/test_aioumcp_validation.feature) | aioumcp validation native behavior capture | 12 | pending-functional-review |
| python | [staging/python/features/test_azure_pricing_tools.feature](../staging/python/features/test_azure_pricing_tools.feature) | azure pricing tools native behavior capture | 3 | pending-functional-review |
| python | [staging/python/features/test_bugfix_round2.feature](../staging/python/features/test_bugfix_round2.feature) | bugfix round2 native behavior capture | 31 | pending-functional-review |
| python | [staging/python/features/test_comment_tools_e2e.feature](../staging/python/features/test_comment_tools_e2e.feature) | Python direct and unified comment operation observations across formats | 6 | pending-functional-review |
| python | [staging/python/features/test_comprehensive_paths.feature](../staging/python/features/test_comprehensive_paths.feature) | comprehensive paths native behavior capture | 20 | pending-functional-review |
| python | [staging/python/features/test_coverage_boost.feature](../staging/python/features/test_coverage_boost.feature) | coverage boost native behavior capture | 21 | pending-functional-review |
| python | [staging/python/features/test_edge_cases.feature](../staging/python/features/test_edge_cases.feature) | edge cases native behavior capture | 14 | pending-functional-review |
| python | [staging/python/features/test_eighty_percent.feature](../staging/python/features/test_eighty_percent.feature) | eighty percent native behavior capture | 17 | pending-functional-review |
| python | [staging/python/features/test_error_paths.feature](../staging/python/features/test_error_paths.feature) | error paths native behavior capture | 20 | pending-functional-review |
| python | [staging/python/features/test_excel_advanced_tools.feature](../staging/python/features/test_excel_advanced_tools.feature) | excel advanced tools native behavior capture | 89 | pending-functional-review |
| python | [staging/python/features/test_excel_charts.feature](../staging/python/features/test_excel_charts.feature) | excel charts native behavior capture | 1 | pending-functional-review |
| python | [staging/python/features/test_excel_tools.feature](../staging/python/features/test_excel_tools.feature) | excel tools native behavior capture | 14 | pending-functional-review |
| python | [staging/python/features/test_extended_ops.feature](../staging/python/features/test_extended_ops.feature) | extended ops native behavior capture | 22 | pending-functional-review |
| python | [staging/python/features/test_final_coverage.feature](../staging/python/features/test_final_coverage.feature) | final coverage native behavior capture | 19 | pending-functional-review |
| python | [staging/python/features/test_final_push.feature](../staging/python/features/test_final_push.feature) | final push native behavior capture | 22 | pending-functional-review |
| python | [staging/python/features/test_fixture_asset_resolution.feature](../staging/python/features/test_fixture_asset_resolution.feature) | fixture asset resolution native behavior capture | 6 | pending-functional-review |
| python | [staging/python/features/test_fixture_files_not_encrypted.feature](../staging/python/features/test_fixture_files_not_encrypted.feature) | fixture files not encrypted native behavior capture | 2 | pending-functional-review |
| python | [staging/python/features/test_fixture_source_integrity.feature](../staging/python/features/test_fixture_source_integrity.feature) | fixture source integrity native behavior capture | 7 | pending-functional-review |
| python | [staging/python/features/test_high_volume.feature](../staging/python/features/test_high_volume.feature) | high volume native behavior capture | 27 | stronger-canonical-profile-planned |
| python | [staging/python/features/test_image_insertion.feature](../staging/python/features/test_image_insertion.feature) | image insertion native behavior capture | 34 | pending-functional-review |
| python | [staging/python/features/test_libreoffice_oracle.feature](../staging/python/features/test_libreoffice_oracle.feature) | libreoffice oracle native behavior capture | 2 | pending-functional-review |
| python | [staging/python/features/test_metadata_cache.feature](../staging/python/features/test_metadata_cache.feature) | metadata cache native behavior capture | 8 | pending-functional-review |
| python | [staging/python/features/test_more_coverage.feature](../staging/python/features/test_more_coverage.feature) | more coverage native behavior capture | 21 | pending-functional-review |
| python | [staging/python/features/test_mutation_contract_policy.feature](../staging/python/features/test_mutation_contract_policy.feature) | mutation contract policy native behavior capture | 3 | pending-functional-review |
| python | [staging/python/features/test_mutation_diagnostics.feature](../staging/python/features/test_mutation_diagnostics.feature) | Native Python mutation diagnostic response observations | 5 | pending-functional-review |
| python | [staging/python/features/test_mutation_faults.feature](../staging/python/features/test_mutation_faults.feature) | mutation faults native behavior capture | 6 | pending-functional-review |
| python | [staging/python/features/test_mutation_modes.feature](../staging/python/features/test_mutation_modes.feature) | Native Python mutation mode responses and bounded saved-file observations | 6 | pending-functional-review |
| python | [staging/python/features/test_office_help.feature](../staging/python/features/test_office_help.feature) | office help native behavior capture | 7 | pending-functional-review |
| python | [staging/python/features/test_office_http.feature](../staging/python/features/test_office_http.feature) | office http native behavior capture | 9 | pending-functional-review |
| python | [staging/python/features/test_office_unified_tools.feature](../staging/python/features/test_office_unified_tools.feature) | office unified tools native behavior capture | 74 | pending-functional-review |
| python | [staging/python/features/test_package_guard.feature](../staging/python/features/test_package_guard.feature) | package guard native behavior capture | 4 | pending-functional-review |
| python | [staging/python/features/test_package_preservation.feature](../staging/python/features/test_package_preservation.feature) | package preservation native behavior capture | 5 | pending-functional-review |
| python | [staging/python/features/test_patch_transactions.feature](../staging/python/features/test_patch_transactions.feature) | Native Python patch transactions and saved-document observations | 7 | pending-functional-review |
| python | [staging/python/features/test_path_variations.feature](../staging/python/features/test_path_variations.feature) | path variations native behavior capture | 20 | pending-functional-review |
| python | [staging/python/features/test_pptx_advanced_tools_extended.feature](../staging/python/features/test_pptx_advanced_tools_extended.feature) | pptx advanced tools extended native behavior capture | 23 | pending-functional-review |
| python | [staging/python/features/test_pptx_advanced_tools.feature](../staging/python/features/test_pptx_advanced_tools.feature) | pptx advanced tools native behavior capture | 40 | pending-functional-review |
| python | [staging/python/features/test_pptx_coverage.feature](../staging/python/features/test_pptx_coverage.feature) | pptx coverage native behavior capture | 27 | pending-functional-review |
| python | [staging/python/features/test_pptx_slide_transfer_tools.feature](../staging/python/features/test_pptx_slide_transfer_tools.feature) | Native Python slide transfer responses and saved-deck observations | 5 | pending-functional-review |
| python | [staging/python/features/test_pptx_tools.feature](../staging/python/features/test_pptx_tools.feature) | pptx tools native behavior capture | 24 | pending-functional-review |
| python | [staging/python/features/test_preserving_text_and_clone.feature](../staging/python/features/test_preserving_text_and_clone.feature) | Native Python saved text, revision and slide-clone observations | 5 | pending-functional-review |
| python | [staging/python/features/test_shared_contract_inventory.feature](../staging/python/features/test_shared_contract_inventory.feature) | shared contract inventory native behavior capture | 8 | pending-functional-review |
| python | [staging/python/features/test_stdio_mutation_workflows.feature](../staging/python/features/test_stdio_mutation_workflows.feature) | stdio mutation workflows native behavior capture | 2 | pending-functional-review |
| python | [staging/python/features/test_strategic_coverage.feature](../staging/python/features/test_strategic_coverage.feature) | strategic coverage native behavior capture | 23 | pending-functional-review |
| python | [staging/python/features/test_targeted_coverage.feature](../staging/python/features/test_targeted_coverage.feature) | targeted coverage native behavior capture | 17 | pending-functional-review |
| python | [staging/python/features/test_tools_extended.feature](../staging/python/features/test_tools_extended.feature) | tools extended native behavior capture | 7 | pending-functional-review |
| python | [staging/python/features/test_track_change_reading.feature](../staging/python/features/test_track_change_reading.feature) | track change reading native behavior capture | 13 | pending-functional-review |
| python | [staging/python/features/test_track_changes_manual.feature](../staging/python/features/test_track_changes_manual.feature) | track changes manual native behavior capture | 4 | pending-functional-review |
| python | [staging/python/features/test_track_changes.feature](../staging/python/features/test_track_changes.feature) | track changes native behavior capture | 16 | pending-functional-review |
| python | [staging/python/features/test_transport_dependency.feature](../staging/python/features/test_transport_dependency.feature) | transport dependency native behavior capture | 4 | pending-functional-review |
| python | [staging/python/features/test_umcp_office_features.feature](../staging/python/features/test_umcp_office_features.feature) | umcp office features native behavior capture | 7 | pending-functional-review |
| python | [staging/python/features/test_web_tools.feature](../staging/python/features/test_web_tools.feature) | web tools native behavior capture | 12 | pending-functional-review |
| python | [staging/python/features/test_word_advanced_tools_extended.feature](../staging/python/features/test_word_advanced_tools_extended.feature) | word advanced tools extended native behavior capture | 16 | pending-functional-review |
| python | [staging/python/features/test_word_advanced_tools.feature](../staging/python/features/test_word_advanced_tools.feature) | word advanced tools native behavior capture | 36 | pending-functional-review |
| python | [staging/python/features/test_word_anchor_discovery.feature](../staging/python/features/test_word_anchor_discovery.feature) | word anchor discovery native behavior capture | 5 | pending-functional-review |
| python | [staging/python/features/test_word_comment_replies.feature](../staging/python/features/test_word_comment_replies.feature) | Python comment replies and their observed identifiers | 7 | pending-functional-review |
| python | [staging/python/features/test_word_comment_resolution.feature](../staging/python/features/test_word_comment_resolution.feature) | Python comment resolution, metadata and threaded readback | 10 | pending-functional-review |
| python | [staging/python/features/test_word_comment_roundtrip_fixture.feature](../staging/python/features/test_word_comment_roundtrip_fixture.feature) | Python direct and unified comment roundtrip observations | 3 | pending-functional-review |
| python | [staging/python/features/test_word_coverage.feature](../staging/python/features/test_word_coverage.feature) | word coverage native behavior capture | 16 | pending-functional-review |
| python | [staging/python/features/test_word_deep_coverage.feature](../staging/python/features/test_word_deep_coverage.feature) | word deep coverage native behavior capture | 24 | stronger-canonical-profile-planned |
| python | [staging/python/features/test_word_pptx_advanced_ops.feature](../staging/python/features/test_word_pptx_advanced_ops.feature) | word pptx advanced ops native behavior capture | 17 | stronger-canonical-profile-planned |
| python | [staging/python/features/test_word_tools.feature](../staging/python/features/test_word_tools.feature) | word tools native behavior capture | 17 | pending-functional-review |
| python | [staging/python/features/test_workflow_coverage.feature](../staging/python/features/test_workflow_coverage.feature) | workflow coverage native behavior capture | 18 | stronger-canonical-profile-planned |
| python | [staging/python/features/test_workflows.feature](../staging/python/features/test_workflows.feature) | workflows native behavior capture | 16 | exact-predicate-alias-retired |
| python | [staging/python/features/test_writer_enrolment.feature](../staging/python/features/test_writer_enrolment.feature) | writer enrolment native behavior capture | 4 | pending-functional-review |
| python | [staging/python/features/test_xlsx_dependency_preservation.feature](../staging/python/features/test_xlsx_dependency_preservation.feature) | Native Python XLSX value-edit dependencies and calculation metadata | 5 | pending-functional-review |

143 staged files; 1532 compiled source cases.
