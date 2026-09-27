@planned
Feature: XLSX style readback obligations
  Preserved predicates require separate per-consumer execution evidence.

  @id-office-xlsx-independent-style-reader
  Scenario: An independent reader accepts every referenced cell style
    Given a saved workbook containing a newly introduced cell style
    When an independent reader opens the workbook
    Then it reads the edited cell without an invalid style index
    And its identity and version are recorded separately from the writer
