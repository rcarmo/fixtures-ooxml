# Package operation profiles

Package admission, graph editing and package comparison expose different
operations. Their scenarios keep those boundaries explicit.

| Feature | Operation and tested scope |
|---|---|
| `workflows/package/zip-admission.feature` | Refuse five unsafe member layouts, four caller-limit settings and BZIP2 compression |
| `workflows/package/xml-member-admission.feature` | Refuse internal DTD, UTF-16-with-BOM DTD and malformed XML inside a ZIP member |
| `workflows/package/semantic-diff.feature` | Classify equivalent XML, changed/added binary members and an empty removed list |
| `workflows/native/opc-graph.feature` | Direct part/relationship edits, rollback, content-type removal and type-only diff |
| `workflows/native/opc-zip64.feature` | Bun bounded ZIP64 read/rewrite, count preflight, safe-integer refusal and caller entry limits |

The package-admission inputs come from four Python native declarations with 14
parameterised cases. Member order, duplicate names, payload bytes, compression
method and limit values are specified. The resource input contains exactly
10,000 spaces inside `<a>...</a>`; the four settings are `max_members=0`,
`max_member_bytes=2`, `max_total_bytes=2` and `max_ratio=1`. These tests observe
refusal, not allocations or network activity. The total-byte limit can refuse at
the compressed-size precheck; the test does not establish that inflation began.
The UTF-16 payload reproduces the
source test's little-endian BOM bytes; other UTF-16 variants are untested here.

The Python package guard reads XML from ZIP members, without requiring a complete
OPC relationship/content-type graph. Its XML-member checks therefore differ from
standalone lexical parsing and from opening a valid Office document. ZIP writers,
archive repair and Office rendering are outside this profile.

Python semantic diff reports `a.xml` as equivalent for the tested namespace-prefix
change and reports binary member deltas separately. Bun's `diffPackages` compares
payload bytes and content types; its type-only scenario has no equivalent-XML
assertion. Go's graph receipts track planned mutation deltas rather than comparing
two arbitrary packages. These behaviours need distinct profiles and bindings.

Go uses snapshot-bound graph plans and checks retained compressed streams and
metadata. Bun's direct graph operations use synchronous transactions and compare
untouched payloads. Similar refusal or preservation wording does not establish
the same operation, input geometry, error taxonomy or assertion. The released
ZIP64 feature explicitly names Bun and its safe-integer/error-code profile.

`ledgers/consumers/*-package.json` records 30 Bun declarations (six partial,
24 unmapped), 12 Go declarations (four partial, eight unmapped) and four Python
declarations (mapped to these 14 cases). Source revisions and gaps are recorded;
the Go revision is local and unpublished. Mapping rows never award execution credit.
The central tests verify Gherkin expansion and exact source-matched member
hashes, lengths and outcomes; consumers must execute their own bindings. Large
allocation bounds, network-fetch isolation and general comparison/custody parity
are untested by this batch.
