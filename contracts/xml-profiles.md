# XML operations

| Feature | Operation |
|---|---|
| `workflows/xml/parsing.feature` | Namespace-aware parsing and source-offset edits |
| `workflows/xml/names.feature` | QName components and whitespace outside the root |
| `workflows/xml/comparison.feature` | Conservative XML comparison for package preservation |

The parsing contract uses UTF-16 offsets. Byte offsets and decoded text positions
are different quantities. Edits must preserve XML outside their specified ranges
and reject malformed results.

The comparison contract ignores selected OPC collection order and namespace
prefix spelling. It preserves text whitespace, ordinary child order, attribute
values, prefix-valued attribute bindings, processing-instruction targets and
prolog comments. Malformed or DTD-bearing inputs compare false, even when their
bytes are identical.

This comparison does not produce canonical XML and must not be used for signature
verification. XML-member checks inside ZIP archives are described in
[package operations](package-profiles.md).
