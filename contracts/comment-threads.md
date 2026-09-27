# Existing complete comment threads

The [existing-complete-thread rule](../workflows/docx/comments.feature) reads and
updates an existing comments/commentsExtended graph. Complete-thread resolution
sets every descendant and root to the requested state; the older single-comment
and authored root-only resolution profiles retain their different policies.
No comment, anchor, relationship or extension part is created by these operations.

## Pinned input and variants

Use fixture `fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62`.
Its source order is IDs 0,1,2. Root 0 (`103008CD`) says `This is a great opening`;
root 1 (`3395B541`) says `Classical hubris`; reply 2 (`0E00AF3F`) has parent 1 and
says `(this is a threaded reply)`. All start open. The pinned author is Rui Carmo.
Resolve parts through relationships. Variants are written to a temporary source
path and reopened before testing; the pinned input and saved source stay untouched.

The nested variant clones comment 2 into ID 3 with paragraph ID `12345678`, body
`Nested reply`, and parent 2 in an existing new commentEx entry. This is test input
construction, not runtime comment authoring. Reordered input places comment bodies
in order 3,2,0,1 without changing links. Root groups follow source order of roots
(0,1); replies are flat descendants in source order ([3,2] for reordered input),
not traversal order. Direct parent IDs remain 1 for reply2 and 2 for reply3.

Thread reports retain exact IDs, parent IDs, bodies and states, plus explicit
unsupported findings. Returned records, arrays and findings are immutable detached
snapshots. Later single-comment mutation must not change the earlier report.
Only source-ordered member IDs of the chosen thread appear in the receipt. No
extension metadata may be synthesised, even for a same-state request.

## Mutation, custody and rollback

Selecting ID 1, 2 or 3 resolves the chain to root1; leading-zero decimal ID 02
selects comment2. Only selected done flags change, and the changed count counts
actual state differences. Inspection after path save/reopen requires all selected
members resolved, root0 still open, and unchanged authors, bodies and direct
parents. Expected extension XML is the original text with only selected done
attribute values replaced (or missing values inserted); every unrelated member
and the full saved source archive are byte-identical. Reopening an originally
open thread restores original member payloads, though ZIP container metadata is
not required to match a prior mutated archive.

The mixed-state case first invokes the single-comment operation for ID1, confirming
reply2 stays open. A complete-thread request changes only reply2, then a repeated
request changes zero flags and preserves the current archive exactly.

Refusal variants remove root1's commentEx entry; unlink the whole extension;
duplicate ID1 as 00; make root1 parent reply2; use done `maybe`; enforce document
protection; link external settings; wrap root0's run in an insertion revision;
or actually select unknown ID99. All request false and must refuse even when
other selected members already have that state. Unsupported inspection reports
two root groups and at least one finding; no silent supported-content claim is
allowed. Mutation refuses globally if any unsupported content is present.

Fault cases first append a `Prior` paragraph to the main document, then inject a
synchronous exception immediately after writing commentsExtended or during
serialization. Both hooks must be reached; exact bytes, including the prior edit,
are restored and no receipt is returned. The separately saved source is unchanged.

## Encodings and bound

Encoding variants use nested input. Rename the extension's w15 prefix to q,
replace the first root0 done spelling with `q:done = 'false'`, and retain that
spelling while other flags change. UTF-8 BOM, UTF-16LE BOM and UTF-16BE BOM must
survive save/reopen along with namespace meaning and exact unrelated XML.

The limit source has 10,001 unique decimal comments with one empty paragraph,
no para IDs and no extension part/relationship. Both inspection and resolution
must throw `docx-comments-limit`, returning no result or partial groups and
leaving every byte unchanged. The 10,000 bound is an API admission policy, not
an OOXML schema maximum. Word UI/rendering and modern comment authoring metadata
are outside these cases; catalogue presence confers no consumer execution credit.
