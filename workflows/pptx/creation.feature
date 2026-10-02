@planned
Feature: PPTX native title-slide authoring
  This slice authors conservative OOXML title slides that reopen through the
  native reader with validated relationships and content types. It does not
  claim visual or Office rendering validation.

  @profile-contract20 @id-pptx-create-new-minimal
  Scenario: Create two ordered title slides from scratch with an independently verified bounded support graph
    Given no input package is supplied to the production presentation creator
    When the production creator authors exactly two text slides with JSON [["Created title 1","Created subtitle 1"],["Created title 2","Created subtitle 2"]]
    Then the resulting presentation is saved to a new path and independently parsed and reopened
    And the reopened slide count is 2 with exactly one master and one title-layout definition
    And the exact ordered title and subtitle placeholder text equals JSON [["Created title 1","Created subtitle 1"],["Created title 2","Created subtitle 2"]]
    And the support graph follows contract20-creation-policy.json: exactly one presentation master title-layout and theme; optional presentation-properties view-properties table-style-definitions core-properties and application-properties have at most one part each, and no other roles or unknown edges exist
    And each slide owns exactly one resolved layout edge and the master and layout link to each other without duplicate IDs
    And no unrequested notes media external links tables or extra slides are authored
    And a failed save leaves an existing destination unchanged or a previously absent destination absent

  @profile-contract20 @id-pptx-create-anchor-preservation
  Scenario: Append a text slide and still use a held anchor on an unchanged original slide
    Given the contract20 derived PPTX recipe "title-subtitle-source" is created in memory from its sealed fixture
    And the first title anchor is held while its text is JSON "Original title" and original member identities are recorded
    When the production presentation editor appends title JSON "Appended title" and subtitle JSON "Appended subtitle"
    Then the original slide part and relationships remain literal and the held original title anchor remains valid
    When the production anchored editor uses that held anchor to replace JSON "Original title" with JSON "Edited original title"
    Then the result is saved to a distinct new path and independently parsed and reopened
    And the source fixture, caller archive and operation operands remain unchanged
    And only the sealed original member and lexical span allowances differ; all unrelated member payloads remain literal
    And all saved OPC relationships and content types resolve with original identities preserved
    And refusals and save faults publish no partial destination and leave the session and held unaffected targets usable
    And the exact reopened placeholder order equals JSON [["Edited original title","Original subtitle"],["Appended title","Appended subtitle"]]
    And the old slide retains its original IDs relationship IDs targets layout links and payload outside the selected title run
    And exactly one new slide and its one layout relationship part are added with unique valid identities; no member is removed
    And only original presentation list relationships content types and selected first-slide text spans may change

  @profile-contract20 @id-pptx-create-refusals
  Scenario: Invalid title text and an unsafe title layout each refuse atomically
    Given the production creator has a new empty session and a second session opens contract20 derived PPTX recipe "unsafe-title-layout"
    And both source session states and prior destination bytes are recorded
    And the new session attempts title JSON "bad\u0000" and subtitle JSON "Bad subtitle"
    And that operation returns exactly typed refusal category "PPTX_ARGUMENT_INVALID" with no new slide or partial result
    And the unsafe-layout session attempts append with title JSON "Unsafe next title" and subtitle JSON "Unsafe next subtitle"
    And that operation returns exactly typed refusal category "PPTX_LAYOUT_UNSAFE" with no changed result
    And both complete session member states and all source relationships remain unchanged
    And no refusal or save fault creates or replaces a destination and held unaffected reads remain usable

  @profile-retained-manipulation @id-pptx-manipulation-insert-start
  Scenario: insert title slide at start
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And the presentation slide list is selected by its original part and unique identity
    When production presentation editing APIs insert a title slide at zero-based index 0 with title JSON "First Slide" and subtitle JSON "Inserted subtitle"
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved the presentation slide list has exact properties JSON {"titles":["First Slide","Alpha","Beta","Gamma"],"insertedSubtitle":"Inserted subtitle","oldSlideIdentityOrder":[1,2,3]}
    And only original member payloads ["ppt/presentation.xml","ppt/_rels/presentation.xml.rels","[Content_Types].xml"] may change
    And exactly one slide XML part and its one layout relationship part are added with valid unique IDs and a resolved original layout; no members are removed
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-insert-middle
  Scenario: insert title slide at index one
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And the presentation slide list is selected by its original part and unique identity
    When production presentation editing APIs insert a title slide at zero-based index 1 with title JSON "Middle Slide" and subtitle JSON "Inserted subtitle"
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved the presentation slide list has exact properties JSON {"titles":["Alpha","Middle Slide","Beta","Gamma"],"insertedSubtitle":"Inserted subtitle","oldSlideIdentityOrder":[1,2,3]}
    And only original member payloads ["ppt/presentation.xml","ppt/_rels/presentation.xml.rels","[Content_Types].xml"] may change
    And exactly one slide XML part and its one layout relationship part are added with valid unique IDs and a resolved original layout; no members are removed
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links
