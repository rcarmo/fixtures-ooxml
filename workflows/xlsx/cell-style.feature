@planned
Feature: Select existing cell styles without changing cell content
  Style indexes refer to existing cellXfs entries. Explicit zero writes a direct
  style index; removal deletes only that attribute and may expose row/column
  defaults. This does not compute formatting or create cells or style definitions.

  @id-xlsx-cell-style-selection
  Scenario Outline: Select a cell style for <kind>
    Given a native workbook prepared for cell-style <kind>
    When the existing cell style is selected for <kind>
    Then reopened cell style and change receipt match <kind>
    And values formulas caches and unrelated package parts retain exact custody
    Examples:
      | kind |
      | assign |
      | replace |
      | explicit-zero |
      | remove |
      | no-op |
      | absent-removal |
      | formula |
      | blank |
      | aliased |

  @id-xlsx-cell-style-refusal
  Scenario Outline: Refuse unsafe cell-style selection for <kind>
    Given an unsafe cell-style selection input <kind>
    When its existing cell-style selection is attempted
    Then cell-style selection refuses without changing package bytes or cached cell state
    Examples:
      | kind |
      | missing-cell |
      | invalid-index |
      | missing-index |
      | duplicate-relationship |
      | external-styles |
      | wrong-mime |
      | wrong-root |
      | duplicate-cellxfs |
      | incorrect-count |
      | invalid-font |
      | invalid-base |
      | missing-number-format |
      | protected-sheet |
      | protected-workbook |
      | stale-sheet |
      | stale-relationship |
      | malformed-old-index |
      | worksheet-alias |
