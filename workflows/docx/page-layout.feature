@planned
Feature: Word section and page properties

  Rule: Edit the final body section page geometry
    Only the existing final body sectPr page size and margins are selected.
    Earlier paragraph sections, text, headers and unrelated parts are preserved.
    Values are direct twip geometry, not computed printer or mirrored-page layout.

    @id-docx-final-section-layout
    Scenario Outline: Set final page geometry for <kind>
      Given a native document prepared for page-layout <kind>
      When the final section page layout is selected for <kind>
      Then saved and reopened page geometry matches <kind>
      And other section properties, earlier sections and package payloads are unchanged
      Examples:
        | kind |
        | portrait |
        | landscape |
        | margins |
        | same |
        | aliased |
        | default-namespace |
        | earlier-section |
        | header-reference |

    @id-docx-final-section-layout-refusal
    Scenario Outline: Refuse unsafe final page geometry for <kind>
      Given an unsafe final-section layout input <kind>
      When its page-layout change is attempted
      Then page-layout selection refuses without changing archive bytes or handles
      Examples:
        | kind |
        | missing-section |
        | duplicate-section |
        | misplaced-section |
        | duplicate-size |
        | missing-margins |
        | wrong-namespace |
        | section-revision |
        | lexical-barrier |
        | invalid-width |
        | negative-margin |
        | no-content-area |
        | invalid-orientation |
        | protected |
        | stale-document |

  Rule: Document value API and selected save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Getter names and return conventions are
    API compatibility predicates, not general OOXML validity or rendering rules.

    @profile-document-value-api @id-docx-go-section-title-background-getters
    Scenario: First-section title page and document background read back in memory
      Given a new Word document with a first section
      When TitlePage is set true on that section and BackgroundColor to EEEEEE
      Then the section TitlePage getter is true and the document BackgroundColor getter equals EEEEEE
