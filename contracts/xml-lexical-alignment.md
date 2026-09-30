# Bounded lexical XML alignment

Twenty existing IDs in [parsing](../workflows/xml/parsing.feature),
[names](../workflows/xml/names.feature) and [editing](../workflows/xml/editing.feature)
share concrete inputs and lexical policy across Bun, Go and Python. Eight previously
underspecified contracts gain explicit operands and outcomes. The ten
`lexical-snapshot-api` IDs and two escaping IDs retain their existing predicates.
The runtime-origin IDs remain stable.

## Source coordinates and model

Offsets address the unmodified decoded XML source in UTF-16 code units. All ranges
are half-open. A supplementary Unicode scalar occupies two units; CRLF occupies
two units even though XML value decoding normalises it. UTF-8 byte coordinates and
Unicode code-point indexes are different quantities. A byte-based parser can map
validated source boundaries into UTF-16 coordinates. Returned offsets must come
from the production model; acceptance code must not fabricate a model or find a
known fixture substring to infer offsets.

`start` includes `<`; `open_end` follows the opening `>` or `/>`; `close_start`
starts the closing tag; `end` follows its `>`. For self-closing elements,
`open_end = close_start = end`. Parent and root links identify elements within the
same snapshot, not fresh reparses. Direct children retain source order. Text is
that element's direct text and CDATA, excluding child-element text. The offset
fixture contains a supplementary scalar both before the root and before its child.
Namespace declarations stay available as lexical attributes when that API exposes
qualified attributes; expanded ordinary attributes use namespace URI/local name.
Source text and caller bytes remain unchanged.

The line-ending fixture distinguishes literal CRLF, literal CR, attribute tabs,
character references and CDATA. XML 1.0 fifth edition sections 2.11 and 3.3.3 govern
decoded values. Namespaces in XML 1.0 third edition sections 3 and 6 govern QName
components and expanded names. Concrete invalid-name and NBSP operands are JSON
strings in the shared features. Numeric-leading prefix/local components refuse;
Unicode names retain the specified expanded identities.

## Failure categories and budgets

Production typed errors or documented native classifiers expose these categories:
`malformed-xml`, `dtd-forbidden`, `entity-forbidden`, `duplicate-attribute`,
`unbound-prefix`, `mismatched-tag`, `invalid-character`, `depth-limit`, `node-limit`
and `input-too-large`. The refusal table supplies fifteen independent inputs in
one scenario. Each must produce its listed category, no document and unchanged
source. Exception spelling, returned versus thrown errors and diagnostics are
runtime bindings. Classification from message text or fixture operands is invalid.
An unrelated application error must stay unclassified. A valid `<r/>` control must
parse after every refusal group.

DTD refusal is a security policy. Recognising `<!DOCTYPE` inside a comment or CDATA
as a declaration would over-refuse valid XML; controls must distinguish contexts.
Duplicate expanded attributes, including aliases bound to the same URI, refuse.
QName and reserved namespace validation must happen in the production operation,
even if a standard parser is permissive about prefix bindings.

The configurable budget API has finite positive integral `maxDepth`, `maxNodes`
and `maxSourceUnits`; bindings use their native field names. Source units are
UTF-16 units. Root depth and node count are one; only elements count as nodes.
Defaults are depth 256, nodes 100000 and source units 8388608. Omitted fields use
defaults; zero, negative, fractional or nonfinite limits refuse with a documented
invalid-limit category. Limit refusal returns no partial document. Source length
is preflighted; depth/node limits are checked during scanning before materialising
an unlimited tree. This is a bounded admission contract, not an allocator benchmark.

The shared scenario sets depth 4, nodes 6 and source units 64. Recipes are exact:

- Five nested `n` elements: `<n>` repeated five times followed by `</n>` repeated
  five times; depth-limit refusal, independent of the other budgets.
- `<r>` followed by six `<n/>` children then `</r>`: seven nodes; node-limit refusal.
- `<r>` followed by 58 `x` characters then `</r>`: 65 units; input-too-large refusal.

Independent positive controls are four nested `n` elements (28 units), root `r`
with five `<n/>` children (six nodes), and root `r` with 57 `x` characters (64 units).
Each uses the same three configured limits. Supplementary-scalar controls must
separate code-point and UTF-16 counts.

## Escaping and editing

The two escaping rows require exact named entity spellings. XML permits equivalent
spellings, so this remains a deliberate portable API policy. Invalid U+0001 refuses;
accepting an invalid character or letting a test helper reject it is insufficient.

`apply-edits` uses UTF-16 source ranges, accepts disjoint replacements in unsorted
order and validates the full resulting document before returning changed text.
Its exact successful input/output and independent overlap, malformed-output and
DTD-output batches are in the feature. Every refused batch returns no output and
preserves the source and caller replacement list. Empty edits return exact source.
A separate supplementary-scalar control detects byte/code-point offset substitution.

The ten snapshot scenarios retain quote/escape spellings, parent-scope namespace
selection, no-op source equality and refusal predicates already in the shared
feature. Their profiles are explicit adoption contracts for every runtime:

- Snapshot handles belong to one immutable parse. Foreign/stale targets refuse.
  Returned metadata or source copies cannot mutate fresh reads from that snapshot.
- Attribute splices retain surrounding whitespace and quotes; new attributes use
  the specified double-quoted insertion. Existing apostrophe escaping remains
  numeric `&#39;` for the exact single-quoted custody row.
- Removal and replacement reject root, repeated and nested overlapping targets;
  insertion rejects overlapping ancestor/descendant targets. Validation precedes
  output, so refusal cannot expose a partial splice.
- Structured names retain namespace URI/local meaning, including default-namespace
  resets and implicit `xml`. Namespace allocation avoids existing prefix collisions.
  The matrix executes all 4×5×5 choices with exact decoded attribute/text values.
- Untouched comments, gaps, sibling bytes and original source survive. Generic
  reserialisation cannot satisfy lexical-custody predicates.

Bun/Go/Python bindings call their production APIs. Shared wording does not supply
runtime results. New predicates require fresh sealed candidate receipts; old
published evidence stays in the migration ledger. Default v0.152.0 lanes and pins
remain usable until publication is separately authorised.
