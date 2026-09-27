# Word tracking preference

ECMA-376 Part 1 §17.15.1.89 defines `w:trackRevisions`. Its absence means
tracking is disabled. The `CT_Settings` sequence determines element order.
The [tracking-settings scenarios](../workflows/docx/tracking-settings.feature)
check a bounded preserving editor with session-only author metadata.

A generated source document contains the paragraph `Retained text` and an opaque
part `customXml/opaque.bin` with bytes `00 ff 2a`. The persistence cases enable
tracking with `Session reviewer`, then disable it for the false case. The editor
saves to a different path. Reopening reads the preference from the settings part
and starts with an empty session author. Both cases require one internal settings
relationship and content type
`application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml`.
The source archive, paragraph text and opaque payload stay unchanged.

Existing-settings cases use `word/options/custom.xml`. Its root binds `q` to
WordprocessingML and `w` to `urn:foreign`. The settings contain `q:zoom` at 90
percent, `q:revisionView` with markup 0 and `q:doNotTrackMoves`, in that order.
The writer inserts the tracking flag after `revisionView`. Cases retain UTF-8,
UTF-16LE with its BOM, and UTF-8 with its BOM. Removing the inserted element from
the decoded output must reproduce the exact source XML. Other package members
and the saved source archive are byte-identical.

Same-state cases use absent settings or a `trackRevisions` element with the stated
`w:val` spelling. Requests preserve the complete archive, even when the session
author changes. Protection refuses both enable and disable requests before
no-op handling. The protected case has `documentProtection` with enforcement 1;
ambiguous cases use an external link, two settings links, an unlinked settings
part, an `application/xml` content type, duplicate tracking flags, a tracking flag
after `compat`, or another incoming relationship owning the settings part.

Fault tests inject synchronous errors after writing the new settings part, after
writing the relationship part, or during serialization. They require rollback
of the entire archive and prior session author. Invalid authors are whitespace,
U+0000, or numeric 1. These are editor admission and transaction policies, not
additional OOXML schema rules.

The ordinary-edit case enables the saved preference and explicitly performs a
plain text edit. It must not create revisions. Consumers that automatically track
ordinary edits need a separate explicit plain-edit operation to bind this profile.
Office UI behaviour, automatic redline generation and rendering are untested here.
The historical getter-only `@id-docx-go-track-author-toggle` remains unchanged;
its execution does not establish any of these stronger outcomes.
