# Go edits to existing presentation notes

The [planned feature](../workflows/native/pptx-text.feature) exercises a Go editor that targets an **existing** notes part through its related slide. The [consumer mapping](../ledgers/consumers/go-notes-editing.json) pins both source test declarations at Go revision `e2c5891212beef16f7412c794d3bea6c01e9da35` and records their assertion limits. The read-only [ordered notes workflow](../workflows/native/pptx-text.feature) has different fixture and order preconditions; its `@id-pptx-order-notes-read` ID is not reused as edit evidence.

## Fixture and exact replacement

The source helper reads fixture `fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc` and verifies its SHA-256 before opening a Go edit session. It selects `ppt/slides/slide1.xml` and the existing `ppt/notesSlides/notesSlide1.xml` part. One text replacement changes `Remember to emphasize the Gothic elements` to `Updated speaker notes` by an exact payload splice. The save receipt reports just the notes part. A saved copy is reopened and read back. Every other part in the **original graph** has an identical delivered payload; this check does not prove the complete ZIP member set or visual rendering.

A foreign target, NUL, invalid UTF-8 and tab input refuse as nonnil errors. After those attempts, replacing text with the identical value succeeds and serialising the session yields the exact original archive bytes. A separate clear/refill sequence checks that another held target goes stale and a fresh target reads empty before refilling. It does not save or reopen the refilled result. A direct low-level part change invalidates the old target by fingerprint; that branch checks only the error.

## Synthetic paragraph variants

The second source test alters the loaded fixture's first notes paragraph **in memory** before each case. Its helper uses a fingerprinted low-level part replacement; these synthetic inputs are not additional fixture assets. A self-closing text node is filled and read back. A one-leaf value with edge spaces is reparsed and requires `xml:space="preserve"` in the XML namespace. A multirun no-op leaves notes-part bytes intact, while a subsequent text with boundary newlines, `A&B` and `雪` reads back as four paragraphs. The test checks that the complete part contains no literal `b="1"`; it does not compare all run properties structurally.

A two-line replacement in a paragraph with bullet, colour, font and language template properties checks four **literal fragment counts** in the notes XML: each selected colour, escaped font, language and bullet fragment occurs twice. It does not inspect placement, default run size, layout, rendering or schema validity. None of these four synthetic subtests saves and reopens a package.

## Scope

The complete target has two declarations with three and four named subtests respectively in `pkg/presentation/notes_edit_test.go` and `notes_lines_test.go`. Three invalid text attempts are an inner loop, not three extra named subtests. All eight feature scenarios are planned and source-derived. Existing-part selection, text policy and refusal rules describe the Go editing profile; no ECMA requirement is inferred from their implementation. The complete ECMA PDFs are indexed [separately](../specs/ecma-376/README.md) for edition- and clause-specific requirements. There is no Go binding or new execution credit from this filing.
