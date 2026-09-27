# Lexical XML editing

The [editing profile](../workflows/xml/editing.feature) operates on a parsed XML
snapshot. `@profile-lexical-snapshot-api` describes exact lexical output and
snapshot ownership without selecting a runtime. Attribute edits, child insertion, removal and subtree replacement return new bytes. An empty edit returns the original bytes; edits do not consume the parsed snapshot. The [Go source mapping](../ledgers/consumers/go-lexical-editing.json) records the source predicates and limits for each operation.

## Attribute edits

An edit selects an element and an expanded attribute name. Replacing an existing value preserves unrelated source bytes, including the original quote style and adjacent elements, in the specified examples. Adding an attribute keeps the surrounding XML. Replacement text is escaped for attribute syntax. Two edits to the same attribute in one batch refuse.

The exact quote and escape spelling in the examples is a lexical API output predicate, not a general XML serialization rule. Unbound namespaces, reserved names, invalid characters and malformed local names require separate refusal cases.

## Structured children

An insertion targets an element in the parsed snapshot. Authored child elements retain their expanded names under the surviving namespace scope; an unqualified descendant remains unqualified. Unedited siblings retain their source bytes. Overlapping ancestor and descendant insertions refuse. The bounded namespace operation uses four root documents, five child-name namespace URIs and five attribute-name namespace URIs. Each resulting document is reparsed to check names, attribute values and descendant text.

An empty insertion returns the original XML. The selected insertion example checks expanded element names and surviving sibling bytes; it does not read back its authored attribute or descendant text. The namespace operation supplies those separate value checks.

## Removal and replacement

Removing two disjoint children leaves the original comment, namespace declaration and gap bytes intact in the specified example. Removing the root or both an ancestor and its descendant refuses. An empty removal preserves the original bytes.

Subtree replacement renders authored nodes in the surviving parent's namespace scope. The specified output retains untouched comment and tail bytes, uses the parent's bound prefix for one new element, and clears the default namespace on an unqualified sibling. Root, duplicate-target and overlapping replacements refuse without returning edited bytes. An empty replacement preserves the original bytes.

These refusals concern XML snapshots. They do not establish package rollback, changed-part budgets, schema validity or Office rendering. The [parsing](../workflows/xml/parsing.feature), [editing](../workflows/xml/editing.feature), [name](../workflows/xml/names.feature) and separately filed XML value contracts define other operations; a successful byte-level edit does not establish their UTF-16 offset or value predicates.
