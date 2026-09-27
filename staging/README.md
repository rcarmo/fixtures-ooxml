# Feature source candidates

These `.feature` candidates derive from Go and Python at the revisions
recorded in [`ledgers/feature-source-consolidation.json`](../ledgers/feature-source-consolidation.json).
Most remain byte-identical. The ledger seals original source bytes and records
any reviewed merge separately from the manifest's current file hash. Use them to reconcile
native behaviour against the [canonical workflows](../workflows/README.md).

- `go/features/` retains 55 native executable/planned/external feature sources,
  including original tags and IDs. Go's consumer inventory and runner may load
  these from a pinned reference root after its migration. Execution status is
  still recorded by Go, not by this copy.
- `go/behaviors/` retains 21 catalogue candidate features. Their native mapping
  JSON and source assertion inventory remain in Go until reviewed centrally.
- `python/features/` retains 67 captured candidate features. The Python consumer
  retains 1,022 native declaration mappings and source evidence separately;
  one exact weak alias now shares a representative scenario. The files do not
  participate in Python acceptance execution.

The historical comparison compiled 1,552 expanded cases: 1,541 Go/Python
candidates plus eleven former Bun planned cases. The 143 current candidate
files compile 1,540 cases after merging one exact weak availability predicate;
1,551 includes the eleven Bun cases. Both native declarations remain tracked. No source pair
has the same normalised steps across Go and Python. The
[functional equivalence review](../ledgers/functional-equivalence.json) records
three other Python pairs with different inputs or parameter variants, so their
cases remain distinct. The retired ID maps to one representative in the same
operation family without canonical execution credit. Matching names, text or
fixtures alone cannot prove equivalent outcomes, refusals or preservation. The same
[functional review](../ledgers/functional-equivalence.json) lists twelve Go
ZIP64/graph/preservation lookalikes whose inputs or outcomes differ from the
canonical cases. They retain separate source identities and no Go execution
credit; two canonical ZIP64/content-type outcomes have no reviewed Go match.

The eight new format/operation workflows in `workflows/` contain eleven Bun
planned cases moved from three local feature files. Their original compiled
predicates are sealed in the same ledger; one runtime-named calculation actor
was changed to `native calculation oracle` for shared wording. All eleven remain
planned for every consumer. The consumer removed its local source copies at v0.35. No new execution credit
arises from moving a file.
