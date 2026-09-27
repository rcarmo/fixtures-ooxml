@planned
Feature: XLSX structural edits obligations
  Preserved predicates require separate per-consumer execution evidence.

  @id-parity-xlsx-structure
  Scenario: Structural spreadsheet edits rewrite all supported references
    Given formulas names charts tables and validation ranges across sheets
    When rows columns sheets or ranges are changed
    Then dependent references and address remaps agree after reopening
    And an unsupported reference refuses the entire edit without mutation
