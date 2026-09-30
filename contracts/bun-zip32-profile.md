# ZIP32 reader and writer policy

The [ZIP32 profile](../workflows/package/zip32.feature) gives concrete
inputs for the refusal reasons and configurable bounds under
`@profile-zip32-refusal-reasons`. Native error/exception classes, diagnostics and
option spellings vary; the shared reasons are the exact `zip-*` values in each
row. A documented native field or classifier must identify the actual refusal
reason, without deriving it from the test's mutation label or matching arbitrary
message text. The standard CRC32 check has no API profile. It checks
ZIP structure without requiring a complete OPC relationship graph. Successful
reads and deterministic writes use the existing [ZIP32 workflow](../workflows/package/zip32.feature).

Reader examples contain one deliberately invalid field or structure. Most use
raw DEFLATE and UTF-8 names. The unsupported-method sample sets method 12 while
leaving its body uncompressed; it tests method dispatch, not BZIP2 decoding.
The stored-size sample declares 99 bytes for the seven-byte string `payload`.
The DEFLATE-size sample expands to 4096 bytes while declaring only 32.

The raw ZIP reader operates without requiring OPC content types or relationship
parts. Each failed read returns no delivered member/payload list and unchanged
caller archive bytes. Each failed write returns no archive and leaves ordered
caller names and payload bytes unchanged. Valid sibling inputs must return exact
ordered entries/payloads, and reason-specific wrong-code controls must fail.
Encryption, method, multi-disk, local/central metadata, CRC, expanded size and
end-record failures keep their distinct reasons. The two size variants share
`zip-size-mismatch`; they keep distinct declared/inflated input geometries.
The historical message column is diagnostic provenance only, not a predicate.

Named limits are semantic keys mapped explicitly by each binding: `maxArchiveBytes`
is compressed source length, `maxEntries` the file/directory entry count,
`maxEntryBytes` one declared/actual expanded member size, `maxTotalBytes` total
expanded bytes, and `maxCompressionRatio` expanded/compressed payload ratio per
member. Budget inputs are one raw-DEFLATE archive with 4096 A bytes then two b
bytes; only the selected limit differs from documented bounded defaults.
Each exceeded limit returns its exact reason before delivering payloads. Defaults
must permit the valid source. Preflight uses declared geometry and bounds actual
inflation; this profile does not measure peak allocation or execution time.
Writer ASCII case-collision and nonempty-directory rejection are shared policies.
This bounded ZIP32 profile does not require broad ZIP64 writing or certify
ECMA-376 conformance.

The [Bun source mapping](../ledgers/consumers/bun-zip32.json) includes each declaration
in the ZIP32 unit module and the helper assertions used by refusal tests. Its
74-fixture admission loop only checks that reading does not throw; payload
custody and per-fixture outcomes need separate checks.
