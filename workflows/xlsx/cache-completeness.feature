@planned
Feature: XLSX cache completeness obligations
  Preserved predicates require separate per-consumer execution evidence.

  @id-xlsx-derived-cache-completeness
  Scenario: Broader spreadsheet caches require range and relationship awareness
    Given formula ranges chart caches external-link caches and calculation-chain metadata
    When a precedent input is changed under a declared cache policy
    Then every supported dependent representation is invalidated or recalculated correctly
    And an unowned dependency refuses before a successful freshness claim
