@planned
Feature: Owned XLSX calculation-chain removal during dependent-cache invalidation
  A calculation chain records order metadata; it does not calculate formula results.
  This case uses a constructed, coherent package, not an Excel-authored original.

  @id-xlsx-owned-calculation-chain-invalidation
  Scenario: Changing a precedent removes its owned nonstandard chain and invalidates dependent caches
    Given a two-sheet XLSX package with Input!A1 numeric 1 and Calc!A1 formula "Input!A1*2" cached as 2
    And Calc!B1 formula "A1+1" is cached as 3 and unrelated Calc!C1 formula "42" is cached as 42
    And the workbook alone owns a calculation-chain relationship to xl/chains/order.xml
    And xl/chains/order.xml has the calculation-chain content type and entries for Calc!A1 and Calc!B1
    And all source package member payloads and bytes are recorded
    When Input!A1 is set to numeric 10 with explicit dependent-cache invalidation and the result is saved and reopened
    Then the source package bytes remain unchanged and reopened Input!A1 is numeric 10
    And the reopened Calc!A1 and Calc!B1 formulas are unchanged with absent or empty cached values
    And a data-only read of those cells cannot return the old cached values 2 and 3 as current
    And the reopened Calc!C1 formula and cached value 42 remain unchanged
    And the workbook requests full recalculation without claiming a computed result
    And xl/chains/order.xml, its workbook relationship and its content-type override are absent
    And every destination relationship and content-type target resolves
    And every source member payload outside the workbook, two worksheets, workbook relationships and content types remains byte-identical
