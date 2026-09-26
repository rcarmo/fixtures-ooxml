@planned
Feature: Inspect effective bold and italic for plain body paragraph runs
  Inspection supports bounded Latin text and resolves document defaults,
  the selected paragraph style ancestry,
  and direct run properties. Style true toggles inherited state, style false
  leaves it unchanged, and direct formatting sets the result absolutely.
  Provenance identifies every contributing layer. Unsupported contexts refuse.

  @id-docx-effective-run-formatting
  Scenario Outline: Resolve effective run flags for <kind>
    Given a document prepared for effective formatting <kind>
    When its plain paragraph run formatting is inspected
    Then effective flags and provenance match <kind> after reopening
    And formatting inspection preserves all bytes and existing handles
    Examples:
      | kind |
      | implicit |
      | defaults |
      | default-style |
      | inherited |
      | toggle-chain |
      | style-false |
      | direct-off |
      | aliased |
      | multiple-runs |

  @id-docx-effective-run-formatting-refusal
  Scenario Outline: Refuse ambiguous effective formatting for <kind>
    Given an unsafe effective-formatting document <kind>
    When its plain paragraph run formatting is inspected
    Then effective formatting inspection refuses without changing package bytes
    Examples:
      | kind |
      | missing-style |
      | cycle |
      | duplicate-id |
      | duplicate-default |
      | wrong-type |
      | malformed-flag |
      | duplicate-flag |
      | character-style |
      | numbering |
      | table-context |
      | revision |
      | complex-script |
      | external-styles |
      | wrong-mime |
      | styles-effects |
      | stale-paragraph |
