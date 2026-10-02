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

    @profile-contract20 @id-xlsx-clear-cross-sheet-caches
    Scenario: A changed input clears all four ordinary caches including an unrelated formula
      Given the literal contract20 XLSX recipe "cross-caches" is packed without workbook APIs
      And Model!A1 is numeric 1 and the original source and all member payloads are recorded
      When the production value editor writes numeric 10 to Model!A1 under the invalidate-all-ordinary-caches profile
      Then the result is saved to a distinct new path and independently parsed and reopened
      And the source fixture, caller archive and operation operands remain unchanged
      And only the sealed original member and lexical span allowances differ; all unrelated member payloads remain literal
      And all saved OPC relationships and content types resolve with original identities preserved
      And refusals and save faults publish no partial destination and leave the session and held unaffected targets usable
      And the saved Model!A1 is numeric 10 and Model!A2 remains numeric 2
      And the four saved formula bodies equal JSON {"Model!B1":"A1+A2","Model!B2":"B1*2","Summary!A1":"Model!B1*3","Summary!B1":"40+2"}
      And all four formula cells have no value cache and data-only reads return null rather than original caches JSON [3,6,9,42]
      And the saved workbook has exactly one qualified calcPr with calcMode auto fullCalcOnLoad 1 and forceFullCalc 1
      And the exact changed member set is JSON ["xl/workbook.xml","xl/worksheets/sheet1.xml","xl/worksheets/sheet2.xml"] without additions or removals
      And an independent numeric-1 no-op on the original input retains every original member and all four caches and calculation flags

  Rule: Spreadsheet cache invalidation has explicit boundaries
    Clearing worksheet formula caches does not calculate or refresh every derived
    representation in an Office package. Unsupported result ranges must refuse.

    @profile-contract20 @id-xlsx-array-input-refusal
    Scenario Outline: An ordinary input mutation refuses an attributed <topology> result range
      Given the literal contract20 XLSX recipe "input-<topology>" is packed without workbook APIs
      And the original Model!A1 is numeric 1 and Summary!A1:A2 cached result values are JSON [1,2]
      And the source and prior destination bytes, every member and held input-cell target are recorded
      When the production value editor attempts numeric 10 at Model!A1 under the invalidate-all-ordinary-caches profile
      Then the operation returns exactly typed refusal category "xlsx-cache-topology-unsupported" before any expression evaluation and no edited result
      And all attributed formula metadata, follower cells, cached values and every member payload remain byte-identical
      And saving the refused session preserves every original member without additions or removals
      And source caller operands and prior destination remain unchanged with no partial output
      And a repeated numeric-1 no-op observation leaves the refused input and caches unchanged
      Examples:
        | topology |
        | array |
        | dataTable |

    @profile-contract20 @id-xlsx-cache-scope-opaque-parts
    Scenario: A bounded inert-cache profile clears worksheet caches and preserves opaque records
      Given the literal contract20 XLSX recipe "opaque-caches" is packed without workbook APIs
      And the exact inert root edges cache1 and cache2 and typed content overrides match the sealed recipe and no semantic chart or external owner edge exists
      And the source member payloads, relationships and caller archive are recorded
      When the production value editor explicitly opts into sealed-opaque-retention and writes numeric 10 to Model!A1
      Then the result is saved to a distinct new path and independently parsed and reopened
      And the source fixture, caller archive and operation operands remain unchanged
      And only the sealed original member and lexical span allowances differ; all unrelated member payloads remain literal
      And all saved OPC relationships and content types resolve with original identities preserved
      And refusals and save faults publish no partial destination and leave the session and held unaffected targets usable
      And all four ordinary formula bodies remain unchanged and all their cached values are absent
      And the saved workbook has exactly one qualified calcPr with calcMode auto fullCalcOnLoad 1 and forceFullCalc 1
      And both opaque cache payloads retain literal numeric 1 and every original byte
      And the exact changed member set is JSON ["xl/workbook.xml","xl/worksheets/sheet1.xml","xl/worksheets/sheet2.xml"] without additions or removals
      And an independent variant with an extra semantic chart or external owner relationship refuses before writing any member or destination
