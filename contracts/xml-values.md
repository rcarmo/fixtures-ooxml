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

The `xml-model-safety` profile treats `__proto__` and `constructor` as ordinary
literal XML attribute names. The exact two-key set and values must survive fresh
reads, without changing root name `r`, empty text/children or the original input.
JavaScript consumers must also retain their native prototype-pollution guards;
the shared outcome does not require other languages to emulate prototypes.

Namespace metadata is a read-only view or detached snapshot of qualified
attribute names to namespace URIs. For `<r xmlns:a="urn:a" a:id="outer"/>`,
lookup of `a:id` returns `urn:a` and expanded lookup returns value `outer`.
Attempt replacing that returned mapping with `urn:changed`, then attempt deleting
`a:id`. Each mutation may be rejected or affect only the returned copy. After each
attempt, a fresh metadata read and attribute lookup from the same parsed model
must still return `urn:a`/`outer`. The root remains `r`, its text/children remain
empty, and source bytes/text remain unchanged. A fresh parse is a supplemental
control, not a substitute for checking the original model. JavaScript can freeze
its map; Go can copy a map; Python can expose a detached or read-only mapping.
Bindings must use the production operation's returned metadata, not create a
protective copy in test code to conceal an unsafe native interface.

The `xml-failure-category` profile requires malformed `<a></b>` to return the
machine-readable category `malformed-xml`, no document result and unchanged
source. A documented native structured code or public failure classifier maps
native errors to that category. Exception class names, thrown versus returned
errors and diagnostic wording are not prescribed. The classifier must reject
unrelated errors: `XML_MALFORMED`, a native XML syntax error classifier or a
structured Go parse failure is valid; classifying every exception as malformed
XML or inferring the category from the test input is invalid. A valid `<a/>`
positive control must produce a document, and an unrelated-error negative control
must not produce the malformed category. Public here means a documented callable
production XML operation; an MCP endpoint is not required. The historical IDs
remain unchanged. These stronger semantic checks supersede the former literal
JavaScript-object and `OoxmlError` predicates; consumer bindings need revalidation.

Exact escaping strings remain an API profile: XML permits other spellings with
the same decoded value. The lookup table represents a missing attribute with
JSON `null`; a native absent-value representation needs an explicit binding.

The source mapping covers every declaration in the two Bun XML unit files.
Remaining gaps include exact QName parameter variants, resource-limit values and
assertions inside helper functions. The feature's stronger assertions, where any,
are listed separately in the mapping.
