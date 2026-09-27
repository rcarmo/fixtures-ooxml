@planned
Feature: Spreadsheet formula cache invalidation and boundaries

  Rule: Shared OOXML mutation safety
    Acceptance adapters translate these document operations to native APIs or MCP tools.
    Planned scenarios are inventory only and cannot count as executed passes.

    @id-xlsx-cross-sheet-cache-invalidation
    Scenario: An input edit invalidates a cached answer on another sheet
      Given fixture "cross-sheet-cache.xlsx" verified against the fixture manifest
      And destination state is "distinct-absent"
      And source bytes are recorded
      And calculation policy is "invalidate-without-recalculation"
      When committing this batch to the distinct destination:
        | target   | value_json |
        | Input!A1 | 10         |
      Then committed change count is 1
      And source bytes equal the recorded state
      And the reopened destination Input!A1 is numeric 10
      And the reopened destination Calc!A1 formula is "=Input!A1*2"
      And the destination Calc!A1 cached value is absent or empty
      And calculation state is "recalculation-required"
      And a data-only read never returns the old cached value 2 as current
      And all destination relationship and content-type references resolve
      And destination member payloads outside the manifest change allowance are byte-identical

  Rule: XLSX cell reads and style-preserving value edits
    Workbook cells are read from the preserved OOXML package and simple value edits
    patch only the required XML slots while keeping untouched package bytes intact.

    @id-xlsx-clear-cross-sheet-caches
    Scenario: Editing an input cell clears formula caches across worksheets and enables recalculation
      Given a synthetic two-sheet XLSX fixture with cross-sheet cached formulas
      When I change the input cell A1 to 10 and save the workbook
      Then every formula cache is removed across the worksheets
      And workbook calculation flags request full recalculation

  Rule: Spreadsheet cache invalidation has explicit boundaries
    Clearing worksheet formula caches does not calculate or refresh every derived
    representation in an Office package. Unsupported result ranges must refuse.

    @id-xlsx-array-input-refusal
    Scenario Outline: A <topology> formula prevents unsafe input edits
      Given a two-sheet workbook with a <topology> formula and cached follower cells
      When an ordinary input value edit is attempted
      Then the edit refuses with code "xlsx-cache-topology-unsupported"
      And every workbook member and cached result remains byte-identical
      Examples:
        | topology  |
        | array     |
        | dataTable |

    @id-xlsx-cache-scope-opaque-parts
    Scenario: Worksheet invalidation preserves opaque chart and external-link caches without refreshing them
      Given a workbook with ordinary worksheet formulas and opaque chart and external-link caches
      When its input is changed and the workbook is saved and reopened
      Then worksheet formula cache values are cleared and their formulas retained
      And the opaque chart and external-link cache payloads remain unchanged
