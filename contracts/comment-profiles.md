# Existing comment inspection and resolution

[`workflows/docx/comments.feature`](../workflows/docx/comments.feature) reads an
existing comment graph and changes one existing `commentsExtended` resolved flag.
Comment bodies, anchors, parent links and unrelated package members stay unchanged.
A request for the current state preserves the original archive bytes.

The selected entry must have an existing final-paragraph association. Missing
extension metadata, duplicate IDs or paragraph keys, missing parents, cycles,
invalid Boolean flags, wrong content types, external links, protection,
unsupported revision bodies and orphan extension entries are rejected.

Resolving a whole thread is a different operation. So are choosing an entry by
its first paragraph, falling back through `commentsIds`, or creating missing IDs
and extension metadata. Those behaviors must not be substituted for this
single-entry update.

Comment creation/deletion, body rewriting, anchor repair and modern identity
metadata authoring are outside this contract. The commentsExtended format is a
Microsoft extension; its published format and content-type references accompany
the corresponding entries in `facts/`.
