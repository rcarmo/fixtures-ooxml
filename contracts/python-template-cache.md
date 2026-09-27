# Python Word template metadata cache

The [template analysis](../workflows/docx/template-analysis.feature), [template cache](../workflows/docx/template-cache.feature) describe
Python API behaviour for a Word SOW template. The metadata cache lives outside
the source DOCX. A cache key identifies the resolved file path, document type
`word` and analysis type `template_metadata`. Cached metadata is valid while
the source path, modification time and size match the stored fingerprint.

Storing metadata and loading it for the same source returns the stored value and
a hit. A changed source returns no cached metadata with reason `stale`. Invalid
JSON returns `corrupt`; a different schema version returns `schema_mismatch`.
The SOW parser stores metadata on its first call and reuses it on an unchanged
second call. Editing the template causes it to store new metadata; the added
paragraph appears in the subsequent anchors.

These are cache API policies, not ECMA-376 format requirements. The
[Python source mapping](../ledgers/consumers/python-template-cache.json) records
seven single-case test declarations and their limits. Key stability is asserted
only for one unchanged file and one type pair. A source-change test verifies
`stale` without inspecting `hit`, and the corrupt/schema tests verify a missing
value and reason without inspecting `hit` or cache-file custody. The SOW tests
check selected metadata, not all returned fields or cross-process persistence.
The separate unified `office_template(operation="analyze")` cache test belongs
to [template analysis](../workflows/docx/template-analysis.feature), [template cache](../workflows/docx/template-cache.feature).
