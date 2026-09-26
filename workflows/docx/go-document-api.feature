@planned @profile-go-document-api
Feature: Go document API getter and bounded save-reopen predicates
  The in-memory operations below check selected getters. Only scenarios that say
  save and reopen assert disk readback. Values name this API profile, not OOXML validity.

  @id-docx-go-new-empty-body
  Scenario: A new document has a body and no paragraphs or tables
    Given a new Go Word document
    When its body paragraphs and tables are enumerated
    Then the body is present with zero paragraphs and zero tables

  @id-docx-go-core-properties-getters
  Scenario: Core properties read back three selected fields in memory
    Given a new Go Word document
    When its core properties are set to title Doc Title, creator Doc Author and subject Doc Subject
    And description Doc Description, keywords one;two, category Category and language en-US are supplied
    And content status Draft, identifier urn:example:doc, last modifier Reviewer, revision 2 and version 1.0 are supplied
    And created, modified and last-printed W3CDTF timestamps are supplied for 2026-02-03T00:00:00Z, 2026-02-03T01:00:00Z and 2026-02-03T02:00:00Z
    Then the setter and getter return no error
    And only the in-memory title creator and subject are compared to Doc Title, Doc Author and Doc Subject

  @id-docx-go-paragraph-text-getter
  Scenario Outline: A paragraph reads back <variant> text in memory
    Given a new Go Word paragraph
    When its text is set to JSON <text_json>
    Then the paragraph text getter equals JSON <text_json>
    Examples:
      | variant      | text_json                 |
      | empty        | ""                        |
      | simple       | "Hello World"             |
      | spaced       | "  spaces  "              |
      | Japanese     | "日本語テキスト"            |
      | punctuation  | "a < b > c & d"           |

  @id-docx-go-paragraph-style-getters
  Scenario Outline: A <style_json> paragraph has the requested heading classification in memory
    Given a new Go Word paragraph
    When style JSON <style_json> is set on that paragraph
    Then its direct style getter equals JSON <style_json>
    And IsHeading equals <heading> and HeadingLevel equals <level>
    Examples:
      | style_json | heading | level |
      | "Heading1" | true    | 1     |
      | "Heading9" | true    | 9     |
      | "Normal"   | false   | 0     |
      | "Title"    | false   | 0     |
      | ""         | false   | 0     |

  @id-docx-go-paragraph-alignment-getter
  Scenario Outline: A <requested> alignment reads back <value> in memory
    Given a new Go Word paragraph
    When its alignment is set to <value>
    Then its alignment getter equals <value>
    Examples:
      | requested | value  |
      | left      | left   |
      | center    | center |
      | right     | right  |
      | justify   | both   |

  @id-docx-go-paragraph-spacing-getters
  Scenario Outline: A <variant> paragraph reads back spacing in twips
    Given a new Go Word paragraph
    When spacing before is set to <before> and after to <after>
    Then its before and after getters equal <before> and <after>
    Examples:
      | variant    | before | after |
      | zero       | 0      | 0     |
      | six-point  | 120    | 120   |
      | twelve     | 240    | 240   |
      | asymmetric | 240    | 120   |

  @id-docx-go-paragraph-advanced-toggles
  Scenario: Three paragraph flags read true after being enabled
    Given a new Go Word paragraph
    When KeepLines, PageBreakBefore and WidowControl are set true
    Then all three getters are true in memory

  @id-docx-go-paragraph-multiple-runs
  Scenario: Three added runs concatenate in paragraph text
    Given a new Go Word paragraph
    When runs containing Hello-space, World and exclamation are appended in order
    Then the paragraph has three runs and its text equals Hello World!

  @id-docx-go-run-color-getter
  Scenario Outline: A <variant> run colour is normalised by its getter
    Given a new Go Word run
    When its colour is set to <input>
    Then its in-memory colour getter equals <want>
    Examples:
      | variant   | input   | want   |
      | red       | FF0000  | FF0000 |
      | hash-red  | #FF0000 | FF0000 |
      | lowercase | ff0000  | ff0000 |

  @id-docx-go-run-boolean-formatting
  Scenario Outline: A <variant> run reads the three requested direct flags
    Given a new Go Word run containing Test
    When bold is set to <bold>, italic to <italic> and strike to <strike>
    Then Bold, Italic and Strike getters equal <bold>, <italic> and <strike>
    Examples:
      | variant     | bold  | italic | strike |
      | none        | false | false  | false  |
      | bold        | true  | false  | false  |
      | italic      | false | true   | false  |
      | strike      | false | false  | true   |
      | all         | true  | true   | true   |

  @id-docx-go-run-effects-getters
  Scenario: Eight direct run effects read true after setting them
    Given a new Go Word run
    When DoubleStrike, Caps, SmallCaps, Outline, Shadow, Emboss, Imprint and Vanish are set true
    Then all eight corresponding getters return true in memory

  @id-docx-go-run-underline-style
  Scenario Outline: A <style> underline is reflected by direct getters
    Given a new Go Word run
    When its underline style is set to <style>
    Then Underline is true and UnderlineStyle equals <style>
    Examples:
      | style  |
      | single |
      | double |
      | thick  |
      | dotted |
      | dash   |
      | wave   |

  @id-docx-go-run-font-name
  Scenario Outline: A run retains direct font name <font> in memory
    Given a new Go Word run
    When its font name is set to <font>
    Then its font-name getter equals <font>
    Examples:
      | font            |
      | Arial           |
      | Times New Roman |
      | Calibri         |
      | Courier New     |
      | Georgia         |
      | Verdana         |

  @id-docx-go-run-highlight
  Scenario Outline: A run retains highlight name <colour> in memory
    Given a new Go Word run
    When highlight is set to <colour>
    Then the Highlight getter equals <colour>
    Examples:
      | colour      |
      | yellow      |
      | cyan        |
      | darkBlue    |
      | lightGray   |
      | black       |

  @id-docx-go-run-vertical-align
  Scenario: Separate superscript and subscript runs have opposite flags
    Given two new Go Word runs
    When Superscript is enabled on the first and Subscript on the second
    Then the first reports superscript true and subscript false
    And the second reports subscript true and superscript false

  @id-docx-go-table-dimensions-getters
  Scenario Outline: A newly added <rows> by <cols> table reports its dimensions
    Given a new Go Word document
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

  @id-docx-go-table-cell-access
  Scenario: A three-by-three table returns cells only at in-range coordinates
    Given a new Go Word table with three rows and three columns
    When its Cell getter is called for all nine coordinates from zero through two
    Then each of those nine calls returns a nonnil cell
    And calls for row or column negative one or three at the tested boundary coordinates return nil

  @id-docx-go-table-cell-text-getters
  Scenario: A two-by-two table reads four assigned texts and its first row
    Given a new Go Word table with two rows and two columns
    When its cells are set by row to A1, B1, A2 and B2
    Then the four cell text getters equal A1, B1, A2 and B2 in those positions
    And FirstRowText returns exactly A1 and B1

  @id-docx-go-table-row-counts
  Scenario: Adding, inserting and deleting rows changes table count in memory
    Given a new Go Word table with two rows and three columns
    When one row is appended, one is inserted at index one, and index one is deleted
    Then row counts after each step are three, four and three respectively
    And deletion at index ten returns an error

  @id-docx-go-table-merge-properties
  Scenario: A cell span and two vertical-merge flags read back directly
    Given a new Go Word table with three rows and four columns
    When cell zero-zero gets GridSpan three and first-column rows one and two get restart and continue
    Then GridSpan at zero-zero equals three
    And VerticalMerge at row one is restart and at row two is continue

  @id-docx-go-table-style-getter
  Scenario: A table style getter changes from empty to TableGrid
    Given a new Go Word two-by-two table
    When its style is read, then set to TableGrid and read again
    Then the first style is empty and the second style is TableGrid

  @id-docx-go-table-header-getter
  Scenario: A row header getter changes from false to true
    Given the first row of a new Go Word three-by-two table
    When IsHeader is read, SetHeader true is applied and IsHeader is read again
    Then the first result is false and the second is true

  @id-docx-go-cell-shading-getter
  Scenario: A cell shading getter reads direct colour FFFF00
    Given cell zero-zero of a new Go Word two-by-two table
    When its shading is set to FFFF00
    Then its shading getter equals FFFF00

  @id-docx-go-cell-properties-getters
  Scenario: A table cell reads selected width, alignment, direction and border presence
    Given cell zero-zero of a new Go Word one-by-one table
    When width is set to 2400 dxa, vertical alignment center and text direction tbRl
    And a top border with single style, size eight and colour 000000 is assigned
    Then width equals 2400, width type dxa, alignment center and direction tbRl
    And the border collection and top border are nonnil

  @id-docx-go-roundtrip-selected-formatting
  Scenario: Selected direct run formatting survives save and reopen
    Given a new Go Word paragraph with three runs Bold-space, Italic-space and Colored
    And the first run is bold, the second italic, and the third has colour FF0000, font size 14 and font Arial
    When the document is saved and reopened
    Then at least one paragraph and three runs are readable
    And the first run is bold and the second italic
    And the third run reports colour FF0000, font size 14 and font Arial

  @id-docx-go-roundtrip-table-text
  Scenario: Nine table cell texts survive save and reopen
    Given a new Go Word table with three rows and three columns
    And its cells contain Header1, Header2, Header3, A1, B1, C1, A2, B2 and C2 in row order
    When the document is saved and reopened
    Then exactly one table is readable
    And all nine cell text getters equal their original row-order values

  @id-docx-go-section-title-background-getters
  Scenario: First-section title page and document background read back in memory
    Given a new Go Word document with a first section
    When TitlePage is set true on that section and BackgroundColor to EEEEEE
    Then the section TitlePage getter is true and the document BackgroundColor getter equals EEEEEE

  @id-docx-go-track-author-toggle
  Scenario: Track Changes author and enabled flag follow a direct toggle sequence
    Given a new Go Word document with tracking disabled
    When tracking is enabled with Test Author and its author is changed to New Author
    Then tracking is enabled and TrackAuthor equals New Author
    And disabling tracking makes TrackChangesEnabled false

  @id-docx-go-body-insert-order
  Scenario: Insert a body paragraph between two existing paragraphs
    Given a new Go Word body with no elements
    When First and Third paragraphs are appended, then Second is inserted at index one
    Then element counts after each operation are one, two and three
    And paragraph texts in order equal First, Second and Third
