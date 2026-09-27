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

  Rule: Go document API getter and bounded save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Values name this API profile, not OOXML validity.

    @profile-go-document-api @id-docx-go-paragraph-style-getters
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
