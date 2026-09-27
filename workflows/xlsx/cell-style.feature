@planned
Feature: Spreadsheet cell style selection and dependency closure

  Rule: Shared OOXML mutation safety
    Acceptance adapters translate these document operations to native APIs or MCP tools.
    Planned scenarios are inventory only and cannot count as executed passes.

    @id-xlsx-style-dependency-closure
    Scenario: A multiline cell edit includes its required style definition
      Given fixture "default-style.xlsx" verified against the fixture manifest
      And destination state is "distinct-absent"
      And source bytes are recorded
      When committing this batch with multiline wrap enabled:
        | target | value_json       |
        | A1     | "first\\nsecond" |
      Then committed change count is 1
      And source bytes equal the recorded state
      And the reopened destination active sheet cell A1 has value_json "first\nsecond"
      And that cell resolves to a style with wrapText enabled
      And every cell style index is below the output cellXfs count
      And all destination relationship and content-type references resolve
      And destination member payloads outside the manifest change allowance are byte-identical

  Rule: Select existing cell styles without changing cell content
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
