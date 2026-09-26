# ECMA-376

The complete ECMA PDFs are the authority for OOXML requirements. The files below
include unchanged copies of the original Go reference material and publisher
downloads. All four PDFs match the official ECMA distribution archives byte for
byte.

| Document | Edition | File |
|---|---|---|
| Part 1: Fundamentals and Markup Language Reference | October 2016, fifth edition | [PDF](part-1/ECMA-376-Part1-Fundamentals.pdf) |
| Part 2: Open Packaging Conventions | December 2021, fifth edition | [PDF](part-2/ECMA-376-Part2-OpenPackagingConventions.pdf) |
| Part 3: Markup Compatibility and Extensibility | December 2015, fifth edition | [PDF](part-3/ECMA-376-Part3-MarkupCompatibility.pdf) |
| Part 4: Transitional Migration Features | October 2016, fifth edition | [PDF](part-4/ECMA-376-Part4-TransitionalMigration.pdf) |

The [official ECMA-376 page](https://ecma-international.org/publications-and-standards/standards/ecma-376/)
provides the complete distributions, including schemas. The schema archives are
not included here yet.

## Reading aids

These files are preserved verbatim but do not replace the complete specification:

* [Part 2 extract](extracts/ECMA-376-Part2-OPC.md): selected OPC text.
* [WordprocessingML extract](extracts/ECMA-376-WML-Phase3.md): selected text on
  styles, revisions, comments, headers and footers.
* [WordprocessingML notes](notes/ECMA-376-Phase3-Reference.md): project-authored
  examples and explanations, not normative text.

Extract headings and page labels may be imprecise. Verify clause references in
the full PDF. Do not correct an extract in place; put corrections in this index
or in a separate note.

## Tests and deprecations

[`go-test-index.json`](go-test-index.json) records source files, declarations,
clause mentions and hashes from the Go repositories. Each entry identifies its
origin snapshot; identical bytes can belong to several revisions. The file is
hash-pinned in the manifest. Its counts describe the imported source index, not
specification coverage. Checking each assertion against its cited clause remains
unfinished.

[`deprecations.json`](deprecations.json) tracks explicit deprecated, removed and
Transitional-only constructs separately. Entries require an edition-specific
source document, clause, PDF page and quotation. Citation fields are checked for
completeness; matching each quotation and interpretation to the PDF is a review
step. The register stays incomplete while any specification part is unreviewed.

## Integrity and attribution

[`index.json`](index.json) records source revisions, byte hashes, official
archive locations and the distinction between specifications, extracts and notes.
The root [manifest](../../manifest.json) checks each imported file's exact bytes.

The source audit found altered copies of Part 1 and the WordprocessingML extract
in a later Go checkout. A text replacement had changed `Paper` to `extended`,
including inside the PDF. Those copies are not specification sources. Their
hashes are retained in `index.json`; the files here use the original bytes.

ECMA specification material is © Ecma International and retains its original
notices and terms. It is not covered by this repository's MIT licence. See the
[asset notices](../../NOTICES.md).
