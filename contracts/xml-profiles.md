# XML operation profiles

The XML catalogue separates lexical parsing/editing from conservative semantic
comparison. A successful comparison is not a parser conformance result, a saved
serialization, a canonical XML byte stream or a signature-verification result.

| Canonical feature | Operation | Current native mapping |
|---|---|---|
| `workflows/xml/parsing.feature` | Strict parse and offset-based edits | Bun UTF-16 spans; Go overlaps verify byte preservation through edits |
| `workflows/xml/names.feature` | QName components and literal root-boundary whitespace | Bun assertions; bounded Go overlaps |
| `workflows/xml/comparison.feature` | Boolean comparison for package preservation | Five Python declarations, ten exact input/result variants |

The parsing scenarios retain their existing IDs and step text. Their UTF-16
profile is explicit. The reviewed Go tests support namespace and whitespace
assertions and check original-byte preservation through edits; they do not assert
numeric span offsets or the UTF-16 result. The Go text-leaf
and structured-edit APIs also have different target/refusal rules from the Bun
raw source-offset API; those behaviours need separate cases.

The comparison profile treats selected OPC collection order and namespace prefix
spelling as insignificant, while preserving tested text whitespace, ordinary
child order, attribute values, prefix-valued attribute bindings, processing
instruction targets and prolog comments. Malformed or DTD-bearing input compares
false even against identical bytes. This profile does not establish arbitrary
namespace canonicalisation, network-fetch isolation or measured memory limits.

`ledgers/consumers/*-xml.json` pins native test paths, declaration IDs and source
hashes. Each row records the exact supported assertions and outstanding gaps.
`mapped` means the selected declaration's tested assertions are represented; it
does not award execution credit or cover an entire source module. `partial` and
`unmapped` rows must list their gaps. All rows retain `executionCredit: false`;
current consumer runs record execution separately.

The snapshot covers 18 Bun declarations, four Go declarations and five Python
comparison declarations. One of the four Go declarations is unmapped because its
reference/CDATA boundary inputs differ from the canonical NBSP examples. Other
XML editing, fuzz, resource and package-admission
behaviours remain outside this bounded mapping. The complete cross-repository
catalogue is unfinished. No other source module receives credit from these rows.
