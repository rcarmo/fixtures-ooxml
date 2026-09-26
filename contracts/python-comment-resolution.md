# Python Word comment threads

The [Python comment scenarios](../workflows/docx/comments.feature)
create comments on saved DOCX files, read their metadata, and resolve or reopen
threads. A fresh comment read after each edit checks the reported `done` state.
A reply resolution selects its root thread, and an auto-resolving reply reports
resolution while a fresh filtered read includes the root as done.

Python can obtain a comment paragraph ID from `word/commentsIds.xml` when the
comment's first paragraph lacks `w14:paraId`. The fixed `0F0E0D0C` case uses
a newly authored comment without that attribute; the native test maps either
its original paragraph ID or this fallback value and checks equality, without
asserting the literal value independently. Resolving an authored comment
without `word/commentsExtended.xml` creates that part and a `commentEx` entry
with `w15:done="1"` for the returned paragraph ID. The tests inspect this
entry on disk. They do not check its package relationship/content type, whether
unrelated members are preserved, or a generated ID's exact value.

The filtering scenario requires nonempty open, resolved and mine-filtered
results with the expected predicates. Its native test checks predicates using
`all()`, which also accepts empty lists; it does not establish that nonempty
condition. Two native resolve/reopen tests share one scenario: one checks the
reopen response's `done` field, while the other checks only a non-target-specific
intermediate resolved count and the final open-filter state. The threaded case
requires at least one thread, the expected first root ID and a reply ID in that
thread. It does not require exactly one thread or a specific reply state.

The [existing-comment profile](comment-profiles.md) selects a comment in a pinned
package and changes only an **existing** `commentsExtended` done flag. It refuses
missing extension metadata and preserves unrelated package members. Python's
creation, fallback, and root-thread policy here has different inputs and limits;
the two operations are not interchangeable. The [Python source
mapping](../ledgers/consumers/python-comment-resolution.json) pins native
assertions and records gaps. Office rendering and general OOXML conformance
require separate evidence.
