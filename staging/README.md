# Feature source candidates

These are byte-identical `.feature` copies from Go and Python at the revisions
recorded in [`ledgers/feature-source-consolidation.json`](../ledgers/feature-source-consolidation.json).
The manifest seals each file's bytes and original path. Use them to reconcile
native behaviour against the [canonical workflows](../workflows/README.md).

- `go/features/` retains 55 native executable/planned/external feature sources,
  including original tags and IDs. Go's consumer inventory and runner may load
  these from a pinned reference root after its migration. Execution status is
  still recorded by Go, not by this copy.
- `go/behaviors/` retains 21 catalogue candidate features. Their native mapping
  JSON and source assertion inventory remain in Go until reviewed centrally.
- `python/features/` retains 67 captured candidate features. The Python consumer
  maps 1,022 candidate identities and source evidence separately. The files
  themselves do not participate in Python acceptance execution.

The 143 files compile to 1,541 Go/Python source cases. No source-pair has exactly
the same normalised step sequence across Go and Python. Four Python pairs have
identical captured steps within Python, but distinct declaration/parameter
provenance. The [functional equivalence review](../ledgers/functional-equivalence.json)
classifies one exact weak availability predicate, two weak overlaps with different
inputs and one group with disjoint layout parameters. None is retired or counted
as a canonical case. Native provenance stays available in both source files. Candidate text, matching scenario names or
shared fixtures alone do not prove equivalent inputs, output bytes, refusal and
preservation policy. Only reviewed equivalence may merge canonical IDs.

The eight new format/operation workflows in `workflows/` contain eleven Bun
planned cases moved from three local feature files. Their original compiled
predicates are sealed in the same ledger; one runtime-named calculation actor
was changed to `native calculation oracle` for shared wording. All eleven remain
planned for every consumer. The local source files should be removed once the
consumer pins this release and verifies the migration. No new execution credit
arises from moving a file.
