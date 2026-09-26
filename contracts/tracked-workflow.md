# Tracked Word workflow dispatch

The [shared feature](../workflows/docx/tracked-workflow.feature) defines tracked,
untracked, no-op, preview and deletion outcomes, together with refusals for invalid
or unsupported requests.

The bounded operation accepts one unique plain-text replacement in the main Word
story, with explicit author and UTC date. It stages native insertion/deletion
revisions and verifies their identities after reopening. Existing revisions,
unsupported text topology, protection and external or invalid settings refuse.
Multiple-target tracked batches refuse before writing; broader tracked batching
is not implemented by this profile.

Receipts distinguish operations from revision nodes: a changed replacement
commits one operation and normally two revision IDs; deletion creates one revision
ID. No-op requests commit neither. Preview counts describe staged revisions but
report zero committed revisions and no committed revision IDs. A refusal at any
stage clears provisional revision metadata and preserves source/destination files.

The source, unrelated package payloads and accept/reject text are checked
independently of receipt fields. Explicit false dispatch retains ordinary
untracked editing.

Multi-target redlining, general document comparison, author filtering, structural
revisions and independent Office rendering compatibility are outside this contract.
