# Existing comment inspection and resolution

`workflows/docx/comments.feature` preserves the four scenarios and 14 expanded
cases implemented in Bun. It reads an existing threaded-comments package and
changes only an existing commentsExtended `done` flag. The fixture, comment bodies,
anchors and reply-parent links remain unchanged.

The scenario IDs and step text come from Bun `13ead38`; only lifecycle tags change
in the shared file. An individual flag update does not imply thread-wide
resolution. Same-state requests preserve original archive bytes. Refusal cases
include missing extension metadata, duplicate IDs/paragraph keys, missing parents,
cycles, invalid Boolean flags, MIME mismatch, external links, protection,
unsupported revision bodies and orphan extension entries.

`ledgers/consumers/bun-comments.json` records 19 source-pinned native declarations,
all partial. Native tests also cover attribute spelling, namespaces, missing flags,
settings variants, encoding/BOM custody, disk save/reopen, detached inspection and
serialization rollback. Those assertions exceed the 14 shared cases and remain
explicit gaps in the shared scenario mapping. Local native execution is recorded
by the consumer; the mapping itself awards no execution credit.

No Go/Python binding is assigned by this import. Go's reviewed legacy comment
objects expose live getters/setters, concatenate direct text nodes, and associate
extension metadata positionally. A `Done *bool` model field and a reply roundtrip
do not exercise this detached graph-inspection/transactional resolution contract.
Python's `tests/test_word_comment_resolution.py` covers a different operation:
resolving a reply updates its root thread, and missing paragraph IDs can use a
commentsIds fallback. Bun changes only the selected entry and requires its
existing final-paragraph association. The reply and fallback cases must not be
mapped to Bun's per-entry/non-creating behaviour. A comments XML roundtrip,
comment-creation API or body-rewriting helper is also a different operation.
Comment authoring/deletion, body rewriting, anchor validation/repair, modern
identity metadata authoring and independent Office reopening are outside this
profile. Required vendor-backed MIME facts and qualified provenance remain in the
shared registry; the disputed alias is not silently accepted.
