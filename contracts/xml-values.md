# XML values and parser APIs

[parsing](../workflows/xml/parsing.feature), [editing](../workflows/xml/editing.feature) specifies entity decoding,
processing-instruction admission, expanded attribute lookup and escaping. JSON
arguments retain exact quotes, tabs and line endings.

[XML 1.0, fifth edition](https://www.w3.org/TR/2008/REC-xml-20081126/) defines
the value rules in sections 2.6 (processing instructions), 2.11 (line endings),
3.3.3 (attribute values) and 4.6 (predefined entities).
[Namespaces in XML 1.0, third edition](https://www.w3.org/TR/2009/REC-xml-names-20091208/)
defines namespace scoping in section 6.1, unqualified attributes in section 6.2
and the implicit `xml` binding in section 3. Default namespaces do not apply to
unqualified attributes; prefix rebinding applies only within its scope.

The JavaScript model profile separately requires prototype-safe attribute maps
and immutable namespace metadata. The Bun error profile names its public error
class. Exact escaping strings belong to the Bun escaping profile: XML permits
other spellings with the same decoded value. These API requirements are not XML
conformance rules. The lookup table represents a missing attribute with JSON
`null`; the Bun API returns `undefined`.

The source mapping covers every declaration in the two Bun XML unit files.
Remaining gaps include exact QName parameter variants, resource-limit values and
assertions inside helper functions. The feature's stronger assertions, where any,
are listed separately in the mapping.
