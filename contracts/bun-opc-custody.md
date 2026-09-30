# Package custody and save paths

The [package API examples](../workflows/package/preservation.feature) use a
three-member OPC envelope. Its document payload is a small XML sample, not a
schema-valid Word document. The examples check package operations without a
Word reader or renderer.

Opening an archive detaches its bytes from the caller. `get` returns a copy;
modifying either array does not change the package. String replacement preserves
the sample's UTF-16LE BOM and declaration when the archive is serialized.

`@profile-javascript-sync-transactions` describes JavaScript callback semantics.
Transactions accept synchronous callbacks. An async callback is refused before
its body runs. A synchronous callback may return a thenable as an ordinary value;
the transaction does not invoke its `then` method. Other runtimes need not expose
thenables to implement the portable package operations.

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
and is not an execution requirement. Runtime-specific async/thenable scenarios
keep their separate profiles until their own migration. Stable IDs retain their origin names.
[Bun source mappings](../ledgers/consumers/bun-opc-custody.json) separate helper
assertions and partial corpus coverage from the [shared preservation workflows](../workflows/package/preservation.feature).
