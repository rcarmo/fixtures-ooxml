@planned
Feature: PPTX native rectangular tables
  Native PPTX table authoring preserves geometry, conservative cell formatting,
  and refusal atomicity for stale and unsupported table topologies.

  @id-pptx-table-roundtrip-geometry
  Scenario: Save and reopen an authored table while keeping exact geometry sums
    Given PPTX table round-trip scenario is prepared from a new presentation
    When PPTX authors a rectangular table and saves then reopens it
    Then PPTX preserves the table size, exact grid sums, and cell text after reopen

  @id-pptx-table-formatting
  Scenario: Preserve simple table cell formatting across update and reopen
    Given PPTX styled table fixture is prepared
    When PPTX replaces a styled table cell and saves then reopens the presentation
    Then PPTX preserves table cell formatting across the update and reopen

  @id-pptx-table-stale-handle
  Scenario: Refuse stale table cell handles atomically after slide mutation
    Given PPTX stale table handle scenario is prepared from a new presentation
    When PPTX mutates the slide and retries a stale table cell handle
    Then PPTX refuses the stale table handle without mutating the package

  @id-pptx-table-atomic-refusals
  Scenario Outline: Refuse unsupported table topology <case> atomically
    Given PPTX table refusal scenario "<case>" is prepared
    When PPTX attempts the table refusal "<case>"
    Then PPTX refusal "<code>" is returned atomically for table refusal "<case>"

    Examples:
      | case            | code                           |
      | merged-cell     | PPTX_TABLE_MERGE_UNSUPPORTED   |
      | malformed-merge | PPTX_TABLE_STRUCTURE_UNSUPPORTED |

  @profile-retained-manipulation @id-pptx-manipulation-table-values
  Scenario: author exact 3x3 table values
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 is selected by its original part and unique identity
    When production presentation editing APIs author a 3-row 3-column table at EMU x=914400 y=1828800 width=10058400 height=2743200 with rows [["Name","Value","Status"],["Item 1","100","OK"],["Item 2","200","Pending"]]
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 has exact properties JSON {"cells":[["Name","Value","Status"],["Item 1","100","OK"],["Item 2","200","Pending"]],"rows":3,"columns":3,"x":914400,"y":1828800,"width":10058400,"height":2743200}
    And only original member payloads ["ppt/slides/slide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-table-geometry
  Scenario: EMU geometry and grid sums
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 is selected by its original part and unique identity
    When production presentation editing APIs author a 2-row 2-column table at EMU x=914400 y=1828800 width=10058400 height=2743200
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 has exact properties JSON {"rows":2,"columns":2,"cells":[["",""],["",""]],"x":914400,"y":1828800,"width":10058400,"height":2743200,"columnWidths":[5029200,5029200],"rowHeights":[1371600,1371600]}
    And only original member payloads ["ppt/slides/slide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links
