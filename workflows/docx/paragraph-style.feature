@planned
Feature: Existing paragraph style assignment preserves document custody
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
