@planned
Feature: Word paragraph style selection

  Rule: Existing paragraph style assignment preserves document custody
    Direct pStyle identifies an existing paragraph style; null removes only the override.
    Style definitions and effective inheritance are not rewritten or evaluated.

    @id-docx-paragraph-style-selection
    Scenario Outline: Perform a <operation> paragraph style change
      Given a native styled paragraph prepared for <operation>
      When the paragraph style is selected for <operation>
      Then saved direct style and change receipt match <operation>
      And paragraph text, other properties and unrelated package parts are preserved

      Examples:
        | operation       |
        | assign          |
        | replace         |
        | remove          |
        | same-style      |
        | absent-removal  |

    @id-docx-paragraph-style-refusal
    Scenario Outline: Refuse paragraph style assignment for <variant>
      Given an unsafe paragraph style input <variant>
      When its paragraph style mutation is attempted
      Then style assignment refuses before changing package bytes

      Examples:
        | variant              |
        | unknown-style        |
        | character-style      |
        | duplicate-style      |
        | duplicate-relationship |
        | external-styles      |
        | wrong-mime           |
        | duplicate-properties |
        | duplicate-pstyle     |
        | misplaced-pstyle     |
        | wrong-namespace      |
        | property-revision    |
        | protected            |
        | stale                |
        | invalid-argument     |

  Rule: Document value API and selected save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Getter names and return conventions are
    API compatibility predicates, not general OOXML validity or rendering rules.

    # Classification here follows the supplied style identifiers, not computed outline inheritance.
    @profile-heading-classification-api @id-docx-go-paragraph-style-getters
    Scenario Outline: A <style_json> paragraph has the requested heading classification in memory
      Given a new Word paragraph
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
