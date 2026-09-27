@planned
Feature: PPTX slide import obligations
  Preserved predicates require separate per-consumer execution evidence.

  @id-parity-pptx-composition
  Scenario: Slide imports preserve the chosen theme and relationship policy
    Given two presentations with shared media charts workbooks and notes
    When a slide is imported under an explicit reconciliation policy
    Then only the imported slide owns its independently editable chart workbook
    And the import report identifies each touched part and appearance change
