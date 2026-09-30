# Package custody and save paths

The [package API examples](../workflows/package/preservation.feature) use a
three-member OPC envelope. Its document payload is a small XML sample, not a
schema-valid Word document. The examples check package operations without a
Word reader or renderer.

Opening an archive detaches its bytes from the caller. `get` returns a copy;
modifying either array does not change the package. String replacement preserves
the sample's UTF-16LE BOM and declaration when the archive is serialized.

`@profile-portable-transactions` selects explicit `immediate` or `deferred`
execution. The production API rejects a deferred transaction with structured
reason `opc-deferred-transaction` before invoking its edit callback: no result,
false callback flag, unchanged Alpha text, complete current archive and caller
source bytes. A native deferred-mode parameter is required; an acceptance helper
that refuses without calling the native transaction does not satisfy it.

An immediate callback replaces existing document text Alpha with Beta and returns
an opaque object/token. The returned native reference must be identical to the
callback's token. The transaction never invokes its evaluation, resolution or
await hook, whose counter remains zero. Save to a fresh path and reopen through
the native editor; Beta must be readable and the exact set/bytes of every
unrelated member must match the original envelope. Source bytes stay unchanged.
JavaScript uses a thenable/evaluate hook, Go a pointer with an Evaluate method,
and Python an object with an evaluation method; no common language protocol is
required beyond this observable non-invocation/identity guarantee.

Production transactions isolate staged parts, invoke the immediate callback
once, validate the resulting envelope before commit and roll back callback or
validation failures. These are supplemental safety controls; a thenable is never
awaited as part of validation. Bun retains its direct async-function refusal and
prototype tests independently. Callbacks that schedule later work are outside
this bounded synchronous operation; this profile does not introduce async editing.

Saving validates relationships before replacing an existing destination. A
missing internal target leaves that file unchanged. A symlink destination is
refused and its regular target keeps its bytes. These samples do not test
concurrent path changes or temporary-file cleanup.

`@profile-opc-byte-custody` covers detached bytes and preserved UTF-16LE encoding.
`@profile-package-refusal-reasons` requires machine-readable reasons without
prescribing an exception class or diagnostic wording. Reasons remain the exact
`opc-*` values in the examples. A documented native error field or classifier
must return those values from the operation's validation failure, not infer them
from the requested mutation or search an arbitrary diagnostic string. Each open
refusal returns no editor/package result and preserves caller bytes. The three
members are an OPC envelope, not a Word-schema validation test. Rejection of
percent-encoded part names/targets, conflicting defaults and duplicate IDs is
this conservative shared profile, not universal OPC format validity.

Save-time missing-target validation runs before replacing an existing destination
and produces no successful save receipt. A symlink path is inspected without
resolving it into its target: refusal must leave both the link and regular target
unchanged. No concurrent filesystem-race claim follows from these bounded cases.
For each failure row, a valid three-member envelope must open/save successfully
through the same native API as a positive control. A different refusal reason
must not satisfy the selected row; unrelated I/O/runtime failures remain distinct.
The former message example column records historical diagnostic provenance only
and is not an execution requirement. Historical async/thenable predicates remain in the migration ledger and native
Bun tests; the stable IDs now select the explicit portable transaction outcomes. Stable IDs retain their origin names.
[Bun source mappings](../ledgers/consumers/bun-opc-custody.json) separate helper
assertions and partial corpus coverage from the [shared preservation workflows](../workflows/package/preservation.feature).
