# ZIP32 reader and writer policy

The [ZIP32 profile](../workflows/package/zip32.feature) gives concrete
inputs for the refusal codes and configurable bounds under
`@profile-zip32-error-api`. Runtime names are absent from the actions; exact
`OoxmlError`, code/message strings and option keys retain the original API's
compatibility requirements. The standard CRC32 check has no API profile. It checks
ZIP structure without requiring a complete OPC relationship graph. Successful
reads and deterministic writes use the existing [ZIP32 workflow](../workflows/package/zip32.feature).

Reader examples contain one deliberately invalid field or structure. Most use
raw DEFLATE and UTF-8 names. The unsupported-method sample sets method 12 while
leaving its body uncompressed; it tests method dispatch, not BZIP2 decoding.
The stored-size sample declares 99 bytes for the seven-byte string `payload`.
The DEFLATE-size sample expands to 4096 bytes while declaring only 32.

The reader and writer throw `OoxmlError` with the profile's code and message
fragment. These names, ASCII case-collision rules and configurable thresholds
are API policy. They do not establish ECMA-376 conformance. Tests for configured
bounds check refusals, without measuring allocation or execution time.

The [Bun source mapping](../ledgers/consumers/bun-zip32.json) includes each declaration
in the ZIP32 unit module and the helper assertions used by refusal tests. Its
74-fixture admission loop only checks that reading does not throw; payload
custody and per-fixture outcomes need separate checks.
