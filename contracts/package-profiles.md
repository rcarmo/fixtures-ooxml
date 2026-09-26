# Package operations

| Feature | Operation |
|---|---|
| `workflows/package/zip-admission.feature` | Reject unsafe member names, exceeded limits and BZIP2 compression |
| `workflows/package/xml-member-admission.feature` | Reject DTD-bearing and malformed XML inside ZIP members |
| `workflows/package/semantic-diff.feature` | Compare XML meaning and binary member changes |
| `workflows/native/opc-graph.feature` | Edit parts, relationships and content types atomically |
| `workflows/native/opc-zip64.feature` | Read and rewrite bounded ZIP64 archives |

## Admission

Admission checks ZIP members without requiring a complete OPC relationship graph.
The inputs specify member order, duplicate names, payload bytes, compression
method and caller limits. The resource-limit input contains exactly 10,000 spaces
inside `<a>...</a>`; limits are `max_members=0`, `max_member_bytes=2`,
`max_total_bytes=2` and `max_ratio=1`.

The XML-member examples include UTF-8 DTD and malformed inputs plus a UTF-16
little-endian DTD input with a BOM. These checks establish rejection. They do not
measure allocations or require decompression to begin before a size rejection.
Archive repair is outside this operation.

## Comparison and editing

Semantic comparison classifies the tested namespace-prefix change as equivalent
XML and reports changed, added and removed binary members separately. A payload
and content-type comparison instead reports changed bytes, even if the XML is
equivalent. Keep these two operations distinct.

Graph editing changes parts, relationships or content types. Its mutation receipt
describes that operation, not the comparison of two arbitrary packages. Successful
edits must preserve unrelated members; failed transactions must leave the original
package intact. Reopening an archive checks package integrity, not Office rendering.
