@planned
Feature: XLSX calculation engine obligations
  Preserved predicates require separate per-consumer execution evidence.

  @id-parity-native-oracle
  Scenario: Native calculation replaces the external Office subprocess
    Given a frozen workbook and independent calculated reference outputs
    When the native calculation oracle evaluates the supported calculation contract
    Then values errors and exclusions match the pinned comparison corpus
    And no foreign runtime or Office subprocess executes
