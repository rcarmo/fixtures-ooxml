# Python Word anchor discovery

The [anchor-discovery scenarios](../workflows/docx/python-anchor-discovery.feature)
read a saved Word document and expose headings and likely insertion paragraphs.
A text query filters returned anchor text without regard to case. The document
map reports counts for sections, tables, placeholders and anchors. Section
listing includes `word_list_anchors` and `word_document_map` in its next-tool
hints; that response does not itself inspect section guidance.

Discovery and insertion have different effects. The first three scenarios
check returned metadata. The insertion scenario uses a discovered heading to
insert one paragraph after it and reads the saved DOCX to verify adjacency.
The section-listing scenario checks only hint membership. No scenario asserts
complete anchor enumeration, exact filtered counts, the absence of unrelated
changes, or full OOXML conformance.

The [Python source mapping](../ledgers/consumers/python-anchor-discovery.json)
records each test assertion and its unverified limits. The anchor, map and
hint scenarios are API observations, not evidence for renderer output or
ECMA-376 element validity.
