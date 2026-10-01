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

    @profile-bounded-cell-lookup @id-docx-go-table-cell-access
    Scenario: A three-by-three table reports exact cell presence without out-of-range aliasing
      Given a new Word table has three rows and three columns with texts by row A1,B1,C1 then A2,B2,C2 then A3,B3,C3
      When cells are looked up at these zero-based coordinates
        | row | column | present | text |
        | 0   | 0      | true    | A1   |
        | 0   | 1      | true    | B1   |
        | 0   | 2      | true    | C1   |
        | 1   | 0      | true    | A2   |
        | 1   | 1      | true    | B2   |
        | 1   | 2      | true    | C2   |
        | 2   | 0      | true    | A3   |
        | 2   | 1      | true    | B3   |
        | 2   | 2      | true    | C3   |
        | -1  | 0      | false   |      |
        | 0   | -1     | false   |      |
        | 3   | 0      | false   |      |
        | 0   | 3      | false   |      |
        | 3   | 3      | false   |      |
      Then each lookup returns the listed presence and exact text without an exception
      And the table still has three rows and three columns with its original texts and unchanged document XML

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

  Rule: Guarded retained table-target edits with full custody
    Exact direct values are checked after save and reopen; inherited rendering is outside this profile.

    @profile-retained-table-properties @id-docx-table-properties-cell-shading
    Scenario: docx cell shading changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-shading patch JSON {"shading":"A1B2C3"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"shading":"A1B2C3","pattern":"clear","color":"auto"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-cell-inherit-shading
    Scenario: docx cell inherit shading changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-inherit-shading patch JSON {"shading":null}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"absent":["shd"]}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-cell-anchor
    Scenario: docx cell anchor changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-anchor patch JSON {"verticalAlign":"center"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"verticalAlign":"center"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-cell-direction
    Scenario: docx cell direction changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-direction patch JSON {"textDirection":"tbRl"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"textDirection":"tbRl"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-cell-margins
    Scenario: docx cell margins changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-margins patch JSON {"margins":{"top":120,"left":240,"bottom":120,"right":240}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"margins":{"top":120,"left":240,"bottom":120,"right":240,"type":"dxa"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-border-top
    Scenario: docx border top changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies border-top patch JSON {"border":{"side":"top","style":"single","size":8,"color":"334455"}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"border":{"side":"top","style":"single","size":8,"color":"334455"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-border-left
    Scenario: docx border left changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies border-left patch JSON {"border":{"side":"left","style":"single","size":8,"color":"334455"}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"border":{"side":"left","style":"single","size":8,"color":"334455"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-border-bottom
    Scenario: docx border bottom changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies border-bottom patch JSON {"border":{"side":"bottom","style":"single","size":8,"color":"334455"}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"border":{"side":"bottom","style":"single","size":8,"color":"334455"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-border-right
    Scenario: docx border right changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies border-right patch JSON {"border":{"side":"right","style":"single","size":8,"color":"334455"}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"border":{"side":"right","style":"single","size":8,"color":"334455"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-border-remove
    Scenario: docx border remove changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies border-remove patch JSON {"border":{"side":"top","remove":true}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"absentBorder":["top"]}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-cell-no-wrap
    Scenario: docx cell no wrap changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-no-wrap patch JSON {"noWrap":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"noWrap":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-cell-fit-text
    Scenario: docx cell fit text changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-fit-text patch JSON {"tcFitText":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"tcFitText":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-cell-width
    Scenario: docx cell width changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-width patch JSON {"width":2400}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"width":2400,"widthType":"dxa","grid":[2880,2880,2880]}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-row-header
    Scenario: docx row header changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 is uniquely selected with a held identity
      When production retained docx editing applies row-header patch JSON {"tblHeader":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 has exact saved properties JSON {"tblHeader":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-row-cant-split
    Scenario: docx row cant split changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 is uniquely selected with a held identity
      When production retained docx editing applies row-cant-split patch JSON {"cantSplit":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 has exact saved properties JSON {"cantSplit":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-row-height
    Scenario: docx row height changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 is uniquely selected with a held identity
      When production retained docx editing applies row-height patch JSON {"height":480,"heightRule":"exact"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 has exact saved properties JSON {"height":480,"heightRule":"exact"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-table-alignment
    Scenario: docx table alignment changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 is uniquely selected with a held identity
      When production retained docx editing applies table-alignment patch JSON {"alignment":"center"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 has exact saved properties JSON {"alignment":"center"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-table-indent
    Scenario: docx table indent changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 is uniquely selected with a held identity
      When production retained docx editing applies table-indent patch JSON {"indent":720}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 has exact saved properties JSON {"indent":720,"indentType":"dxa"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-cell-hide-mark
    Scenario: docx cell hide mark changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies cell-hide-mark patch JSON {"hideMark":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"hideMark":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-docx-table-properties-refusal
    Scenario: docx refusal changes only its selected direct properties
      Given retained docx input fixture-ea4dfb625197cf2ca259472419933c5c164ca733ccd765c48410d5547e0ab14f has its sealed original property and identity snapshot
      And retained edit target table 0 row 0 cell 0 is uniquely selected with a held identity
      When production retained docx editing applies refusal patch JSON {"shading":"A1B2C3","border":{"side":"top","style":"single","size":97,"color":"334455"}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target table 0 row 0 cell 0 has exact saved properties JSON {"refusal":"invalid-table-properties"}
      And saved direct property children remain in schema order
      And the exact changed original member set is [] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged
      And refusal reason invalid-table-properties preserves session bytes and held target usability before save
