@planned
Feature: Bounded tracked Word workflow dispatch reports observed revisions
  One unique plain-text replacement may be tracked with explicit author and UTC date.
  Preview and refusal never commit revisions; untracked workflows retain their behaviour.

  @id-docx-track-changes-option-outcome
  Scenario Outline: Report observed revisions for <operation>
    Given a tracked workflow package and an existing output sentinel
    When a <operation> Word replacement batch is requested
    Then the tracked workflow outcome is <outcome> with <committed> committed changes and <revisions> committed revisions
    And the tracked workflow source and unrelated members retain their bytes

    Examples:
      | operation | outcome   | committed | revisions |
      | tracked   | committed | 1         | 2         |
      | untracked | committed | 1         | 0         |
      | no-op     | committed | 0         | 0         |
      | preview   | preview   | 0         | 0         |
      | deletion  | committed | 1         | 1         |

  @id-docx-workflow-tracked-refusal
  Scenario Outline: Tracked dispatch refuses <variant> without output changes
    Given a tracked workflow refusal package <variant>
    When a tracked Word batch is attempted
    Then the tracked workflow refuses with zero committed revisions and unchanged files

    Examples:
      | variant          |
      | missing          |
      | ambiguous        |
      | drawing          |
      | existing         |
      | protected        |
      | external-settings|
      | multiple-targets |
      | invalid-author   |
      | invalid-date     |
      | non-docx         |
      | invalid-option   |
      | missing-metadata |
