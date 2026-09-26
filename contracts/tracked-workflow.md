# Tracked Word workflow dispatch

`workflows/docx/tracked-workflow.feature` refines the existing
`@id-docx-track-changes-option-outcome` obligation and adds a refusal outline.
Seventeen cases distinguish tracked, untracked, no-op, preview and deletion
outcomes from invalid or unsupported requests.

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
untracked editing. No Go or Python workflow binding is assigned by this contract;
all central lifecycle tags remain planned and consumer execution is separate.

The ID is retained from Bun's earlier planned follow-up. Its expanded cases now
make the formerly broad request observable. This profile does not implement
multi-target redlining, general document comparison, author filtering, structural
revisions or independent Office rendering compatibility.
