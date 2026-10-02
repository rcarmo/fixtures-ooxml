@planned
Feature: PPTX native rectangular tables
  Native PPTX table authoring preserves geometry, conservative cell formatting,
  and refusal atomicity for stale and unsupported table topologies.

  @profile-contract20 @id-pptx-table-roundtrip-geometry
  Scenario: Author a two-by-three table with exact last-remainder geometry and cell text
    Given the production creator authors a new presentation with one title slide JSON "Tables"
    When the production table editor authors a 2-row 3-column table at EMU x=120 y=240 width=1001 height=1003
    Then the first cell text is set to JSON "  <Alpha & Beta>  " and all other cells remain blank
    And the result is saved to a new path and independently parsed and reopened
    And the saved table has 2 rows 3 columns x=120 y=240 width=1001 height=1003
    And the exact grid widths equal JSON [333,333,335] and exact row heights equal JSON [501,502]
    And the exact cell matrix equals JSON [["  <Alpha & Beta>  ","",""],["","",""]]
    And the title remains JSON "Tables" and every table name ID namespace and schema-ordered body/property child is valid within the sealed profile
    And all created relationships and content types resolve inside the bounded creation support graph
    And caller geometry/text operands remain unchanged and save faults leave destination state intact

  @profile-contract20 @id-pptx-table-formatting
  Scenario: Change only the selected styled table cell text and retain every original property
    Given the contract20 derived PPTX recipe "styled-table" is created in memory from its sealed fixture
    And the unique table frame ID 4 cell 0,0 reads JSON "Galvanic battery" with its sealed literal property snapshot
    And the source member payloads, relationships and caller archive are recorded
    When the production retained table-cell editor replaces that cell text with JSON "updated value"
    Then the result is saved to a distinct new path and independently parsed and reopened
    And the source fixture, caller archive and operation operands remain unchanged
    And only the sealed original member and lexical span allowances differ; all unrelated member payloads remain literal
    And all saved OPC relationships and content types resolve with original identities preserved
    And refusals and save faults publish no partial destination and leave the session and held unaffected targets usable
    And the reopened cell text equals JSON "updated value"
    And the saved properties equal JSON {"bodyPr":{"wrap":"square"},"tcPr":{"marL":"111"},"fill":"FFFF00","paragraph":{"algn":"r"},"firstRun":{"b":"1","sz":"1800"},"endParaRPr":{"lang":"en-US"}}
    And the exact changed member set is JSON ["ppt/slides/slide1.xml"] without additions or removals
    And only selected original text leaf content may differ; all bodyPr tcPr pPr rPr endParaRPr attributes children and sibling spans retain literal bytes

  @profile-contract20 @id-pptx-table-stale-handle
  Scenario: Adding another table to the same slide stales the held first table cell
    Given the contract20 derived PPTX recipe "stale-table" is created in memory from its sealed fixture
    When the production editor holds table frame ID 4 cell 0,0 with its original empty text
    When the production editor adds a second 1-row 1-column table at EMU x=1200 y=100 width=900 height=600
    Then the complete post-add member state and prior destination are recorded
    And the old first-table cell handle attempts JSON "stale write"
    And the operation returns exactly typed refusal category "PPTX_STALE_TABLE_HANDLE" and no changed result
    And every post-add member payload and graph identity, caller input and prior destination remains unchanged
    And saving and independently reopening still finds exactly two tables with both first cells empty
    And a freshly found first-table cell is usable and any invalid late patch refuses without consuming it

  @profile-contract20 @id-pptx-table-atomic-refusals
  Scenario Outline: A <case> table topology refuses a cell text mutation without partial output
    Given the contract20 derived PPTX recipe "<recipe>" is created in memory from its sealed fixture
    And the source and prior destination bytes and all member payloads are recorded
    When the production package open and target selection of table frame ID 4 cell 0,0 succeed without mutation or intake refusal
    When the production table-cell editor attempts JSON "x" at the selected target
    Then only that cell-text edit preflight returns exactly typed refusal category "<code>" and no changed result
    And every source member, selected table property and relationship remains unchanged
    And saving the refused session retains all original members without additions or removals
    And no refusal or save fault changes source caller operands or any prior destination
    And an independently constructed unmerged same-shape control permits the identical cell mutation and retains unrelated bytes
    Examples:
      | case | recipe | code |
      | merged-cell | merged-table | PPTX_TABLE_MERGE_UNSUPPORTED |
      | malformed-merge | malformed-table | PPTX_TABLE_STRUCTURE_UNSUPPORTED |

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

  Rule: Guarded retained table-target edits with full custody
    Exact direct values are checked after save and reopen; inherited rendering is outside this profile.

    @profile-retained-table-properties @id-pptx-table-properties-cell-fill
    Scenario: pptx cell fill changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies cell-fill patch JSON {"fill":"A1B2C3"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"fill":"A1B2C3"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-cell-no-fill
    Scenario: pptx cell no fill changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies cell-no-fill patch JSON {"fill":"none"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"fill":"none"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-cell-inherit-fill
    Scenario: pptx cell inherit fill changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies cell-inherit-fill patch JSON {"fill":null}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"absent":["solidFill","noFill"]}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-border-left
    Scenario: pptx border left changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies border-left patch JSON {"border":{"side":"left","color":"334455","width":25400}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"border":{"side":"left","color":"334455","width":25400,"dash":"solid"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-border-right
    Scenario: pptx border right changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies border-right patch JSON {"border":{"side":"right","color":"334455","width":25400}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"border":{"side":"right","color":"334455","width":25400,"dash":"solid"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-border-top
    Scenario: pptx border top changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies border-top patch JSON {"border":{"side":"top","color":"334455","width":25400}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"border":{"side":"top","color":"334455","width":25400,"dash":"solid"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-border-bottom
    Scenario: pptx border bottom changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies border-bottom patch JSON {"border":{"side":"bottom","color":"334455","width":25400}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"border":{"side":"bottom","color":"334455","width":25400,"dash":"solid"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-border-no-fill
    Scenario: pptx border no fill changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies border-no-fill patch JSON {"border":{"side":"top","color":"none"}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"border":{"side":"top","fill":"none","width":12700,"dash":"solid"}}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-border-remove
    Scenario: pptx border remove changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies border-remove patch JSON {"border":{"side":"left","remove":true}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"absent":["lnL"]}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-cell-margins
    Scenario: pptx cell margins changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies cell-margins patch JSON {"margins":{"left":91440,"right":91440,"top":45720,"bottom":45720}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"marL":91440,"marR":91440,"marT":45720,"marB":45720}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-cell-anchor
    Scenario: pptx cell anchor changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies cell-anchor patch JSON {"anchor":"ctr"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"anchor":"ctr"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-cell-direction
    Scenario: pptx cell direction changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies cell-direction patch JSON {"vert":"vert"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"vert":"vert"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-cell-anchor-center
    Scenario: pptx cell anchor center changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies cell-anchor-center patch JSON {"anchorCtr":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"anchorCtr":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-column-width
    Scenario: pptx column width changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 is uniquely selected with a held identity
      When production retained pptx editing applies column-width patch JSON {"column":0,"width":3657600}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 has exact saved properties JSON {"columnWidths":[3657600,2743200,2743200],"frameWidth":9144000}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-row-height
    Scenario: pptx row height changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 is uniquely selected with a held identity
      When production retained pptx editing applies row-height patch JSON {"row":0,"height":914400}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 has exact saved properties JSON {"rowHeights":[914400,609600,609600,609600,609600,609600],"frameHeight":3962400}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-first-row-off
    Scenario: pptx first row off changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 is uniquely selected with a held identity
      When production retained pptx editing applies first-row-off patch JSON {"firstRow":false}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 has exact saved properties JSON {"firstRow":false}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-band-row-off
    Scenario: pptx band row off changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 is uniquely selected with a held identity
      When production retained pptx editing applies band-row-off patch JSON {"bandRow":false}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 has exact saved properties JSON {"bandRow":false}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-frame-position
    Scenario: pptx frame position changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 is uniquely selected with a held identity
      When production retained pptx editing applies frame-position patch JSON {"x":914400,"y":1828800}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 has exact saved properties JSON {"x":914400,"y":1828800,"width":8229600,"height":3657600}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-cell-unbold
    Scenario: pptx cell unbold changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 paragraph 0 run 0 is uniquely selected with a held identity
      When production retained pptx editing applies cell-unbold patch JSON {"bold":false}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 paragraph 0 run 0 has exact saved properties JSON {"bold":false}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide1.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-table-properties @id-pptx-table-properties-refusal
    Scenario: pptx refusal changes only its selected direct properties
      Given retained pptx input fixture-ce68a5cbf3d3c25053ecc9b327b6776b35267f5b134346366e4b351ffda66abf has its sealed original property and identity snapshot
      And retained edit target slide 1 table frame ID 3 cell 0,0 is uniquely selected with a held identity
      When production retained pptx editing applies refusal patch JSON {"fill":"A1B2C3","border":{"side":"top","width":-1,"color":"334455"}}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 1 table frame ID 3 cell 0,0 has exact saved properties JSON {"refusal":"invalid-table-properties"}
      And saved direct property children remain in schema order
      And the exact changed original member set is [] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged
      And refusal reason invalid-table-properties preserves session bytes and held target usability before save
