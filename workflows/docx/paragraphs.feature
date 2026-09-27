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
