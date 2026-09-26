@planned
Feature: Author bounded paragraph styles without computing inheritance
  A new paragraph style has a name, optional existing paragraph base and optional
  direct bold/italic flags. Existing definitions and document XML are preserved.
  This does not calculate inherited formatting, rewrite styles or create defaults.

  @id-docx-paragraph-style-authoring
  Scenario Outline: Create and select a new paragraph style with <registry> and <options>
    Given a native style authoring document with <registry>
    When a named paragraph style is authored with <options>
    Then its saved definition and relationship are correct for <options>
    And pre-existing style definitions and unrelated package bytes are preserved
    And the authored style can be selected and reopened
    Examples:
      | registry | options |
      | absent | plain |
      | existing | based |
      | existing | flags |
      | empty | flags |
      | aliased | based |
      | default-namespace | based |
      | collision | plain |

  @id-docx-paragraph-style-authoring-refusal
  Scenario Outline: Refuse unsafe style authoring atomically for <kind>
    Given an unsafe native style authoring input <kind>
    When its paragraph style creation is attempted
    Then style authoring refuses without changing archive bytes or handle state
    Examples:
      | kind |
      | duplicate-id |
      | character-id |
      | missing-base |
      | character-base |
      | duplicate-base |
      | cyclic-base |
      | broken-base-chain |
      | malformed-base |
      | duplicate-relationship |
      | external-styles |
      | wrong-mime |
      | wrong-root |
      | wrong-id-namespace |
      | protected |
      | invalid-argument |
      | stale-document |
      | styles-with-effects |
