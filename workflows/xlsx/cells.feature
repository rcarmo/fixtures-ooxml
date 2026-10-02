@planned
Feature: Spreadsheet cell reading and editing

  Rule: XLSX cell reads and style-preserving value edits
    Workbook cells are read from the preserved OOXML package and simple value edits
    patch only the required XML slots while keeping untouched package bytes intact.

    @profile-contract20 @id-xlsx-read-rel-linked-shared-strings
    Scenario: Read exact relationship-linked values without rewriting a two-sheet package
      Given the literal contract20 XLSX recipe "rel-values" is packed without workbook APIs
      And the source member payloads, relationships and caller archive are recorded
      When the production read API inspects worksheets in workbook sheet order and obtains literal cell and formula/cache values
      Then the ordered sheet identities equal JSON [{"name":"Alpha","part":"xl/worksheets/sheet2.xml"},{"name":"Beta","part":"xl/worksheets/sheet1.xml"}]
      And the exact read records equal JSON {"Alpha":{"A1":{"kind":"string","value":"alpha shared"},"B1":{"kind":"number","value":7},"C1":{"kind":"boolean","value":false},"D1":{"kind":"formula","formula":"B1+1","cached":8}},"Beta":{"A1":{"kind":"string","value":"beta shared"},"B1":{"kind":"number","value":42},"C1":{"kind":"boolean","value":true},"D1":{"kind":"formula","formula":"B1*2","cached":84}}}
      And all read calls leave the archive, every member payload and relationship unchanged and create no new members

    @id-xlsx-preserve-styled-cell-edit
    Scenario: Edit a styled existing cell without disturbing unrelated package parts
      Given the go-ooxml formatting workbook fixture
      When I change the styled cell A2 text to "Elizabeth Lavenza" and save and reopen the workbook
      Then the reopened cell keeps its style attributes and new value
      And unrelated ZIP parts still match the original bytes

    @profile-contract20 @id-xlsx-prefixed-namespace-safe-edits
    Scenario: Fill two prefixed styled blanks without rewriting intervening XML
      Given the literal contract20 XLSX recipe "prefixed-cells" includes sealed styles indexes 0 1 and 2
      And the source member payloads, relationships and caller archive are recorded
      When the production value editor writes JSON "Alpha" to Prefixed!A1 and numeric 7 to Prefixed!B1
      Then the result is saved to a distinct new path and independently parsed and reopened
      And the source fixture, caller archive and operation operands remain unchanged
      And only the sealed original member and lexical span allowances differ; all unrelated member payloads remain literal
      And all saved OPC relationships and content types resolve with original identities preserved
      And refusals and save faults publish no partial destination and leave the session and held unaffected targets usable
      And the saved A1 and B1 retain original r and style indexes 1 and 2 and read JSON "Alpha" and numeric 7
      And the saved value nodes are qualified x:is x:t and x:v with the original spreadsheet namespace
      And the saved C1 formula remains 1+1 and its x:v cache is absent
      And the saved workbook has exactly one x:calcPr with calcMode auto fullCalcOnLoad 1 and forceFullCalc 1
      And the exact changed member set is JSON ["xl/workbook.xml","xl/worksheets/sheet1.xml"] without additions or removals
      And only entire original A1 and B1 cell spans, original C1 x:v and the calcPr insertion site may differ; every intervening XML span retains literal bytes
      And the original styles.xml and all unpatched original cell attributes and properties retain literal bytes

    @profile-contract20 @id-xlsx-phonetic-guides-excluded
    Scenario: Read visible shared and inline rich text without phonetic guides
      Given the literal contract20 XLSX recipe "phonetic-strings" is packed without workbook APIs
      And the source member payloads, relationships and caller archive are recorded
      When the production reader reads Phonetics!A1 and Phonetics!B1
      Then the exact string values equal JSON {"A1":"Alpha Beta","B1":"Gamma Delta"}
      And no returned visible string includes JSON "Guide"
      And every original rich run and rPh XML span, member payload and caller archive remains unchanged

    @profile-contract20 @id-xlsx-styled-blank-cell-editable
    Scenario: Fill a styled blank while preserving the valid style registry and neighbour
      Given the literal contract20 XLSX recipe "styled-blank" includes sealed styles indexes 0 1 and 2
      And the original StyledBlank!A1 reads null with style index 1 and B1 reads numeric 5 with style index 2
      When the production value editor writes JSON "filled" to StyledBlank!A1
      Then the result is saved to a distinct new path and independently parsed and reopened
      And the source fixture, caller archive and operation operands remain unchanged
      And only the sealed original member and lexical span allowances differ; all unrelated member payloads remain literal
      And all saved OPC relationships and content types resolve with original identities preserved
      And refusals and save faults publish no partial destination and leave the session and held unaffected targets usable
      And the reopened StyledBlank!A1 reads JSON "filled" with original style index 1
      And the reopened StyledBlank!B1 reads numeric 5 with original style index 2
      And the exact changed member set is JSON ["xl/worksheets/sheet1.xml"] without additions or removals
      And only the selected original A1 cell element span may differ; styles.xml B1 and every other original XML span remain literal
      And every original style definition and relationship retains its original payload

    @profile-contract20 @id-xlsx-refuse-shared-formula-overwrite
    Scenario: A direct shared formula overwrite refuses before mutation
      Given the literal contract20 XLSX recipe "attributed-formulas" is packed without workbook APIs
      And the source and prior destination bytes, every member and held input-cell target are recorded
      When the production value editor attempts numeric 99 at Calc!B2
      Then the operation returns exactly typed refusal category "xlsx-shared-formula-edit-unsupported" and no edited result
      And the original formula anchors followers caches and all member payloads remain unchanged
      And saving the refused session to a new path preserves every original member without additions or removals
      And source caller operands and prior destination remain unchanged with no partial output
      And a held unrelated Calc!A2 target remains usable after the refusal

    @profile-contract20 @id-xlsx-refuse-array-formula-overwrite
    Scenario: A direct array formula overwrite refuses before mutation
      Given the literal contract20 XLSX recipe "attributed-formulas" is packed without workbook APIs
      And the source and prior destination bytes, every member and held input-cell target are recorded
      When the production value editor attempts numeric 99 at Calc!D2
      Then the operation returns exactly typed refusal category "xlsx-array-formula-edit-unsupported" and no edited result
      And the original formula anchors followers caches and all member payloads remain unchanged
      And saving the refused session to a new path preserves every original member without additions or removals
      And source caller operands and prior destination remain unchanged with no partial output
      And a held unrelated Calc!A2 target remains usable after the refusal
