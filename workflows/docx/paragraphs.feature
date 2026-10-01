@planned
Feature: Word paragraph text, properties and body order

  Rule: Document value API and selected save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Getter names and return conventions are
    API compatibility predicates, not general OOXML validity or rendering rules.

    @profile-document-value-api @id-docx-go-paragraph-text-getter
    Scenario Outline: A paragraph reads back <variant> text in memory
      Given a new Word paragraph
      When its text is set to JSON <text_json>
      Then the paragraph text getter equals JSON <text_json>
      Examples:
        | variant      | text_json                 |
        | empty        | ""                        |
        | simple       | "Hello World"             |
        | spaced       | "  spaces  "              |
        | Japanese     | "日本語テキスト"            |
        | punctuation  | "a < b > c & d"           |

    @profile-document-value-api @id-docx-go-paragraph-alignment-getter
    Scenario Outline: A <requested> alignment reads back <value> in memory
      Given a new Word paragraph
      When its alignment is set to <value>
      Then its alignment getter equals <value>
      Examples:
        | requested | value  |
        | left      | left   |
        | center    | center |
        | right     | right  |
        | justify   | both   |

    @profile-document-value-api @id-docx-go-paragraph-spacing-getters
    Scenario Outline: A <variant> paragraph reads back spacing in twips
      Given a new Word paragraph
      When spacing before is set to <before> and after to <after>
      Then its before and after getters equal <before> and <after>
      Examples:
        | variant    | before | after |
        | zero       | 0      | 0     |
        | six-point  | 120    | 120   |
        | twelve     | 240    | 240   |
        | asymmetric | 240    | 120   |

    @profile-document-value-api @id-docx-go-paragraph-advanced-toggles
    Scenario: Three paragraph flags read true after being enabled
      Given a new Word paragraph
      When KeepLines, PageBreakBefore and WidowControl are set true
      Then all three getters are true in memory

    @profile-document-value-api @id-docx-go-paragraph-multiple-runs
    Scenario: Three added runs concatenate in paragraph text
      Given a new Word paragraph
      When runs containing Hello-space, World and exclamation are appended in order
      Then the paragraph has three runs and its text equals Hello World!

    @profile-document-value-api @id-docx-go-body-insert-order
    Scenario: Insert a body paragraph between two existing paragraphs
      Given a new Word body with no elements
      When First and Third paragraphs are appended, then Second is inserted at index one
      Then element counts after each operation are one, two and three
      And paragraph texts in order equal First, Second and Third

  Rule: Guarded retained single-target edits with full custody
    Exact direct values are checked after save and reopen; inherited rendering is outside this profile.

    @profile-retained-style-word @id-docx-retained-paragraph-justify
    Scenario: docx paragraph justify changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 is uniquely selected with a held identity
      When production retained docx editing applies paragraph-justify patch JSON {"jc":"both"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 has exact saved properties JSON {"jc":"both"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-paragraph-spacing
    Scenario: docx paragraph spacing changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 is uniquely selected with a held identity
      When production retained docx editing applies paragraph-spacing patch JSON {"before":240,"after":120}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 has exact saved properties JSON {"before":240,"after":120}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-paragraph-indent
    Scenario: docx paragraph indent changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 is uniquely selected with a held identity
      When production retained docx editing applies paragraph-indent patch JSON {"left":720,"hanging":360}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 has exact saved properties JSON {"left":720,"hanging":360}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-paragraph-line
    Scenario: docx paragraph line changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 is uniquely selected with a held identity
      When production retained docx editing applies paragraph-line patch JSON {"line":480,"lineRule":"auto"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 has exact saved properties JSON {"line":480,"lineRule":"auto"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-paragraph-keep-lines
    Scenario: docx paragraph keep lines changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 is uniquely selected with a held identity
      When production retained docx editing applies paragraph-keep-lines patch JSON {"keepLines":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 has exact saved properties JSON {"keepLines":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-paragraph-keep-next
    Scenario: docx paragraph keep next changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 is uniquely selected with a held identity
      When production retained docx editing applies paragraph-keep-next patch JSON {"keepNext":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 has exact saved properties JSON {"keepNext":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-paragraph-page-break
    Scenario: docx paragraph page break changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 is uniquely selected with a held identity
      When production retained docx editing applies paragraph-page-break patch JSON {"pageBreakBefore":false}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 has exact saved properties JSON {"pageBreakBefore":false}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-paragraph-outline
    Scenario: docx paragraph outline changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 is uniquely selected with a held identity
      When production retained docx editing applies paragraph-outline patch JSON {"outlineLvl":0}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 has exact saved properties JSON {"outlineLvl":0}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged
