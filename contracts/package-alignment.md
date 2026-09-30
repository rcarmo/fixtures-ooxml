# Bounded package and comparison alignment

The second twenty-ID batch selects nineteen package contracts and
`@id-xml-comparison-prefix-and-opc-order`. ZIP64 contracts are outside this batch.
The shared recipes complete eleven underspecified package contracts and make the
XML comparator's relationship operands valid. Stable IDs and case counts remain.
This policy describes bounded package/editor APIs; reopening is not Office rendering
or general schema validation.

## ZIP32 read, refusal, limits and write

Raw ZIP admission does not require an OPC registry. The valid read input has
central-directory order `z.bin`, `dir/`, `a.xml`, `m.bin`, UTF-8 name flags, one disk,
no descriptors and declared comment `kept as declared ZIP comment`. Payloads are
`z-last`, empty, `<a/>`, `middle`; only `a.xml` uses raw DEFLATE. Independently
calculate CRC32 over the exact UTF-8 payloads when building the sample. Reader
results contain files in that order with directory omitted, exact lengths 6/4/6
and payload bytes; caller archive bytes stay unchanged. A standard-library reader
may validate the input, but it cannot replace the runtime's production operation.

The eleven unsafe structures use the first eleven applicable concrete operands in
the existing ZIP32 structured-refusal Examples: duplicate names, ASCII collision,
parent traversal, encryption flag, method 12 with uncompressed body, EOCD disk 1,
counts 65535 without ZIP64 records, local-name mismatch, both CRCs DEADBEEF, STORED
size 99 for `payload`, and an undeclared trailing newline. The separate DEFLATE-size
outline row remains outside this eleven-sample aggregate. Each returns its exact
`zip-*` reason and no partial member result; source bytes stay unchanged. Mutations
change only the named structural field(s), keeping other CRC/size/offset geometry
consistent. Diagnostics do not define failure categories.

The five budget aggregate uses the existing raw-DEFLATE two-member vector:
`a.bin` is 4096 `A` bytes and `b.bin` is two `b` bytes. Limits are compressed source
length minus one, entry count 1, member size 8, total size 8 and ratio 2. Each limit
is applied separately to bounded defaults. A second archive uses the same declared
member order, CRCs and expanded geometry with invalid DEFLATE for `a.bin`: its body
is exactly eight FF bytes and compressed sizes/physical offsets reflect that body.
Every limit must refuse both archives with the same respective structured reason
before member output. Default admission of the valid archive succeeds; default
admission of the invalid sibling must reach a distinct payload/DEFLATE failure.
This proves declared preflight precedence, not a measured allocator ceiling.

Writer entries are `[Content_Types].xml` with `<Types/>`, `custom/data.bin` with all
256 byte values in increasing order, and `word/document.xml` with
`<w:document>` + 2048 `A` characters + `</w:document>`. This selected deterministic
profile emits byte-identical ZIP32 archives twice, both Store and Deflate methods
on this input, UTF-8 flags in local and central records, and exact reopened payloads.
No golden archive hash prescribes DEFLATE implementation/timestamps. Independent
geometry and reopened semantics verify correctness; exact equality between repeated
writes is the deterministic API contract. An ASCII-collision writer sibling refuses
without an archive and without mutating ordered entries/payloads. Legacy writer
options can stay unchanged if a named additive deterministic profile is exposed.

The direct checksum operation calculates ZIP CRC32 over UTF-8 `123456789` and
returns unsigned CBF43926. A binding cannot call stdlib CRC as a substitute for the
consumer's production operation. Independent stdlib calculation is an oracle.

`package-admission-resource-limits` retains its exact four rows: a DEFLATED `a.xml`
contains `<a>` + 10000 spaces + `</a>`; `max_members=0`, `max_member_bytes=2`,
`max_total_bytes=2`, `max_ratio=1` each refuse. Zero member budget admits zero
entries and cannot disable validation. This test is archive/XML admission, not
strict OPC-envelope loading. The size-2 total row can refuse compressed source
preflight in the existing Python guard; it does not prove a downstream allocation
cap. Bindings must expose actual structured resource failures where available and
retain positive/default/source-custody controls. No cross-credit from another
similar budget ID follows.

## XML members and comparison

All `.xml` and `.rels` member payloads receive the actual production XML admission
policy before a package/parts result is returned. Retained unsafe XML rows cover
UTF-8 internal DTD/entity, little-endian BOM UTF-16 DTD and malformed UTF-8 XML.
A valid BOM UTF-16 XML sibling must admit; DTD spelling inside a comment or CDATA
stays ordinary data. No external entity or network fetching is permitted.

The XML comparator's two OPC Relationships operands now carry `Type=urn:test/a`
and `Type=urn:test/b`. They preserve the same IDs/targets/types while reversing
order and prefix spelling; comparison returns true and both source operands stay
unchanged. Types, target or ordinary XML content changes remain significant.
Missing required relationship attributes must not become an equivalence shortcut.
Comparison is conservative, not XML C14N or a signature-verification operation.

Semantic raw-archive comparison keeps the exact separate lists in
`semantic-diff.feature`: `a.xml` is equivalent XML under prefix spelling,
`b.bin` changed, `c.bin` added, none removed. Payload/content-type comparison is
separate and treats registry/effective MIME changes as changes even when XML or
payload bytes are otherwise identical. Returned lists are sorted and contain each
member once; input archives/snapshots remain unchanged.

## Corpus, encoding, rollback and payload custody

Corpus no-op is all 36 Go-origin plus 35 Python-origin testdata fixture IDs from
the committed shared fixture catalogue. Enumerate those exact sets, verify manifest
bytes, open/serialize/reopen each through a production package API and compare each
original archive's exact bytes. Selecting only convenient samples or using a test
ZIP reader is insufficient. A production preserved-archive API can support this
no-op without forcing all historical fixture layouts through the new strict
three-member OPC-envelope policy. Existing envelope refusal rules must remain.

The caller/returned-copy and UTF-16LE cases keep the three-member Alpha envelope
from `preservation.feature`. `get` returns detached bytes. Mutating caller or
returned arrays cannot change fresh payload reads or the original archive produced
by no-op serialization. String replacement changes Alpha to Beta while retaining
FF FE BOM and `encoding="UTF-16"`; unrelated member payloads and caller input stay
unchanged. Encoding detection/editing belongs to production package APIs, not
acceptance-only byte reconstruction.

The other two custody cases use this exact four-member synthetic OPC envelope:

- `[Content_Types].xml`: XML declaration `<?xml version="1.0" encoding="UTF-8"?>`
  then `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
  with defaults `rels` → package relationships MIME, `xml` → `application/xml`,
  `bin` → `application/octet-stream`, in that order, then `</Types>`.
- `_rels/.rels`: same declaration, then package `Relationships` root and one
  `Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="doc/main.xml"`.
- `doc/main.xml`: same declaration, then
  `<main xmlns="urn:acceptance"><value>Original</value></main>`.
- `custom/data.bin`: exact hexadecimal 00FF01FE02FD.

Initial ZIP encoding is deterministic per test builder; each runtime compares its
own input archive custody without prescribing cross-runtime compressed bytes.
The transaction callback changes the `<value>` text to `rolled back` and opaque
bytes to 09080706, then throws/returns an independent `callback-failure` after both
writes. The same failure propagates, no result escapes, and archive/member state
rolls back exactly. A refused first write cannot satisfy this reached-failure test.
The success case changes value to `Updated <value>`, saves/reopens, verifies decoded
value, exact opaque bytes, exact member set and every unrelated member payload.

## Graph and effective content type

Graph operations open manifest-sealed DOCX
`fixture-535910216e3531e4f70959cccf83038f1c51febbf4a149f9f46abfbfa8667d90`.
They add opaque `custom/data.bin` = 070809 with override
`application/octet-stream` and explicit root relationship `rIdData`, type
`urn:test/data`, target `custom/data.bin`. A transaction validates graph before
commit. Part/MIME/edge creation is production functionality, not manually prepared
acceptance state. Exact reopened bytes/type/edge and all original non-registry
members must survive. Unknown added/removed members fail.

Removing that part while the root edge exists refuses `opc-part-referenced`, no
successful edit result and exact current archive/part custody. Explicitly detach
rIdData then remove the part and its override; reopen without all three and verify
retained internal targets and all original non-registry payloads. Foreign/missing
owner/edge targets, duplicate IDs and rollback controls remain independent guards.

The MIME-only diff opens two independent fixture snapshots and changes only
word/document.xml's effective MIME to `application/vnd.test.document+xml` in the
second. Diff `changed` is exactly `["[Content_Types].xml","word/document.xml"]`,
`added=[]`, `removed=[]`. Document payload bytes remain identical, old/new effective
MIME differs, other member payloads stay unchanged and first snapshot/caller archive
retain custody. Default/override resolution belongs to the production diff API.
An edit receipt listing staged hashes cannot substitute for a two-package diff.

## Office relationship namespace controls

Alias and wrong-URI outlines use sealed title/subtitle PPTX
`fixture-2aec94471f93c300d56ca4789106a974411085d1588f3424155362a06dd043f3`
and default-style XLSX
`fixture-38c2ed936696179d3b2359e9107ad2b8d62d71d69296f8f60bdfe1fe8f7f2439`.
Only main-part `xmlns:r` and `r:id` spellings change to `xmlns:link`/`link:id` for
alias variants, preserving officeDocument relationship URI. Actual production
editors change first slide's first text to `Edited title`, or `Sheet!A1` to
`Edited\ncell` with wrap text true. Saved/reopened reads and all internal relationship
targets agree; main-part `link:id` spelling remains and caller archive is unchanged.

Wrong-URI variants change the main-part officeDocument relationship namespace to
package relationships, retaining `r:id` spellings. Actual document readers refuse
with `PPTX_PRESENTATION_INVALID` or `xlsx-workbook-invalid`, no document and unchanged
archive. Native structured document errors may use a documented production
classifier; acceptance cannot derive a refusal from the mutation label, check a
message fragment or merely inspect namespace text without calling the reader.
Unqualified/wrong-URI controls must not be accepted just because IDs match.

Fresh sealed per-case receipts are required after contract changes. Historic
published credit stays in exact migration seals; local success earns no tag, pin,
ledger advancement or broader OOXML/Office claim.
