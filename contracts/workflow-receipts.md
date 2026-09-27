# Preview details and match counts

[Presentation previews](../workflows/pptx/mutation-safety.feature) and
[Word match counts](../workflows/docx/mutation-safety.feature) describe requested
operations before any file is committed. These are API requirements; ECMA-376 does
not define batch receipts or a dry-run transport.

The presentation case requests a title change from `Original title` to
`Changed by dry run`. Its preview identifies the title target and requested
replacement, and reports zero committed changes. The Word case resolves
`<Present>` and `<Missing>` separately and reports counts of one and zero.
Resolving one placeholder must not supply the count for another.

The eight scenarios selected by the [mutation contract](mutation-safety.json) check
file custody, batch refusal and saved outputs across five format-local features. They do not compare the preview's
requested target/value fields or both Word match counts. The receipt scenarios
add those predicates without changing the mutation-safety cases. Native tests may
also verify unchanged source/destination bytes and strict-batch refusal. The two
receipt scenarios alone do not establish filesystem custody or MCP transport.

Adapters can use the shared `title-and-subtitle.pptx` and
`present-placeholder.docx` assets identified in
[the mutation contract](mutation-safety.json). Copy them to temporary paths before
running an editor; never modify the shared fixtures.

The scenario IDs, names and steps were retained verbatim from
`rcarmo/bun-ooxml` at `15d08ae19fd439985ed7e2202ab09c7bb2fe0574`,
`features/planned/office-mutation-additions.feature`. The independent spreadsheet
style-reader requirement in that file is separate and remains unimplemented in
this receipt profile. Registering these contracts does not execute a consumer.
