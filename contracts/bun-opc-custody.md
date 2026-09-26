# Bun package custody and save paths

The [package API examples](../workflows/package/preservation.feature) use a
three-member OPC envelope. Its document payload is a small XML sample, not a
schema-valid Word document. The examples check package operations without a
Word reader or renderer.

Opening an archive detaches its bytes from the caller. `get` returns a copy;
modifying either array does not change the package. String replacement preserves
the sample's UTF-16LE BOM and declaration when the archive is serialized.

Transactions accept synchronous callbacks. An async callback is refused before
its body runs. A synchronous callback may return a thenable as an ordinary value;
the transaction does not invoke its `then` method.

Saving validates relationships before replacing an existing destination. A
missing internal target leaves that file unchanged. A symlink destination is
refused and its regular target keeps its bytes. These samples do not test
concurrent path changes or temporary-file cleanup.

The profile also records Bun's conservative rejection of percent-encoded part
names and internal targets, conflicting content-type defaults and duplicate
relationship IDs. Those API refusals do not define every valid OPC URI.
[Source mappings](../ledgers/consumers/bun-opc-custody.json) separate helper
assertions and partial corpus coverage from the [shared preservation workflows](../workflows/package/preservation.feature).
