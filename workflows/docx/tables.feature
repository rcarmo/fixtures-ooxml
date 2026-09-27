@planned
Feature: Word tables and cell properties

  Rule: DOCX native rectangular tables
    Native DOCX table authoring and rectangular cell text updates use direct XML,
    preserve unrelated package parts, and refuse unsafe table structures.

    @id-docx-table-create-roundtrip
    Scenario: DOCX table authoring round-trips escaped text, boundary spaces, and normalized newlines
      Given DOCX table source "new-document" is prepared
      When DOCX table 2x2 is appended
      And DOCX table 1 cell (0,0) text is set to "  <Alpha & Beta>  "
      And DOCX table 1 cell (1,1) text is set to "line 1\r\nline 2"
      And DOCX table document is saved and reopened
      Then DOCX table 1 has 2 rows and 2 columns
      And DOCX table 1 cell (0,0) text equals "  <Alpha & Beta>  "
      And DOCX table 1 cell (1,1) text equals "line 1\nline 2"
      And DOCX table 1 is stored before the section properties
      And DOCX table 1 cell (0,0) XML preserves boundary spaces and escapes special characters

    @id-docx-table-opaque-preserve
    Scenario: DOCX table cell updates preserve opaque package parts after save and reopen
      Given DOCX table source "fixture-8192955ef935f09eb61a9fe6805d4996c811efcf54c0c966f52d983e38e0a79c" is prepared
      And DOCX table opaque part "docProps/core.xml" bytes are remembered
      When DOCX table 1 cell (1,0) text is set to "Voltaic battery"
      And DOCX table document is saved and reopened
      Then DOCX table 1 has 4 rows and 3 columns
      And DOCX table 1 cell (1,0) text equals "Voltaic battery"
      And DOCX table opaque part "docProps/core.xml" bytes are unchanged

    @id-docx-table-stale-cell
    Scenario: DOCX table cell handles go stale after any document edit and refuse atomically
      Given DOCX table source "new-document" is prepared
      And DOCX table 1x1 is appended
      And DOCX table 1 cell (0,0) is remembered
      When DOCX table 1x1 is appended
      And DOCX table current saved bytes are remembered
      And DOCX table stale text set to "stale write" is attempted on the remembered cell
      Then DOCX table refusal code equals "docx-stale-table-cell"
      And DOCX table saved bytes equal the remembered bytes

    @id-docx-table-atomic-refusals
    Scenario Outline: DOCX table refuses <case> atomically
      Given DOCX table source "<source>" is prepared
      And DOCX table current saved bytes are remembered
      When DOCX table refusal "<case>" is attempted
      Then DOCX table refusal code equals "<code>"
      And DOCX table saved bytes equal the remembered bytes

      Examples:
        | source                                                                                         | case        | code                         |
        | fixture-8192955ef935f09eb61a9fe6805d4996c811efcf54c0c966f52d983e38e0a79c            | row-oob     | range                        |
        | native-merged-nested  | merged-cell | docx-table-merged-cell       |
        | native-merged-nested  | nested-cell | docx-table-cell-unsupported  |
        | synthetic-grid-before                                                                          | bizarre     | docx-table-unsupported       |

  Rule: Document value API and selected save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Getter names and return conventions are
    API compatibility predicates, not general OOXML validity or rendering rules.

    @profile-document-value-api @id-docx-go-table-dimensions-getters
    Scenario Outline: A newly added <rows> by <cols> table reports its dimensions
      Given a new Word document
      When a table with <rows> rows and <cols> columns is added
      Then RowCount equals <rows> and ColumnCount equals <cols> in memory
      Examples:
        | rows | cols |
        | 1    | 1    |
        | 1    | 5    |
        | 5    | 1    |
        | 2    | 2    |
        | 3    | 3    |
        | 5    | 5    |
        | 10   | 3    |
        | 3    | 10   |

    @profile-nullable-cell-api @id-docx-go-table-cell-access
    Scenario: A three-by-three table returns cells only at in-range coordinates
      Given a new Word table with three rows and three columns
      When its Cell getter is called for all nine coordinates from zero through two
      Then each of those nine calls returns a nonnil cell
      And calls for row or column negative one or three at the tested boundary coordinates return nil

    @profile-document-value-api @id-docx-go-table-cell-text-getters
    Scenario: A two-by-two table reads four assigned texts and its first row
      Given a new Word table with two rows and two columns
      When its cells are set by row to A1, B1, A2 and B2
      Then the four cell text getters equal A1, B1, A2 and B2 in those positions
      And FirstRowText returns exactly A1 and B1

    @profile-document-value-api @id-docx-go-table-row-counts
    Scenario: Adding, inserting and deleting rows changes table count in memory
      Given a new Word table with two rows and three columns
      When one row is appended, one is inserted at index one, and index one is deleted
      Then row counts after each step are three, four and three respectively
      And deletion at index ten returns an error

    @profile-document-value-api @id-docx-go-table-merge-properties
    Scenario: A cell span and two vertical-merge flags read back directly
      Given a new Word table with three rows and four columns
      When cell zero-zero gets GridSpan three and first-column rows one and two get restart and continue
      Then GridSpan at zero-zero equals three
      And VerticalMerge at row one is restart and at row two is continue

    @profile-document-value-api @id-docx-go-table-style-getter
    Scenario: A table style getter changes from empty to TableGrid
      Given a new Word two-by-two table
      When its style is read, then set to TableGrid and read again
      Then the first style is empty and the second style is TableGrid

    @profile-document-value-api @id-docx-go-table-header-getter
    Scenario: A row header getter changes from false to true
      Given the first row of a new Word three-by-two table
      When IsHeader is read, SetHeader true is applied and IsHeader is read again
      Then the first result is false and the second is true

    @profile-document-value-api @id-docx-go-cell-shading-getter
    Scenario: A cell shading getter reads direct colour FFFF00
      Given cell zero-zero of a new Word two-by-two table
      When its shading is set to FFFF00
      Then its shading getter equals FFFF00

    @profile-document-value-api @id-docx-go-cell-properties-getters
    Scenario: A table cell reads selected width, alignment, direction and border presence
      Given cell zero-zero of a new Word one-by-one table
      When width is set to 2400 dxa, vertical alignment center and text direction tbRl
      And a top border with single style, size eight and colour 000000 is assigned
      Then width equals 2400, width type dxa, alignment center and direction tbRl
      And the border collection and top border are nonnil

    @profile-table-text-readback @id-docx-go-roundtrip-table-text
    Scenario: Nine table cell texts survive save and reopen
      Given a new Word table with three rows and three columns
      And its cells contain Header1, Header2, Header3, A1, B1, C1, A2, B2 and C2 in row order
      When the document is saved and reopened
      Then exactly one table is readable
      And all nine cell text getters equal their original row-order values
