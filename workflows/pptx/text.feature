@planned
Feature: Presentation anchored text editing

  Rule: PPTX relationship-ordered reads and anchored text replacement
    The first PPTX slice opens real packages, reads existing notes without creating
    missing notes parts, and performs exact anchored text replacement across runs.

    @profile-contract20 @id-pptx-readable-unsupported-topology
    Scenario: Inspect line breaks and visible field text but refuse an anchored edit of that paragraph
      Given the contract20 derived PPTX recipe "break-field-title" is created in memory from its sealed fixture
      And the source member payloads, relationships and caller archive are recorded
      When the production text inspector reads the uniquely selected first title paragraph and issues its owned anchor
      Then the exact paragraph text equals JSON "Chapter\n7 Notes"
      And the exact visible fragments and properties equal JSON [{"text":"Chapter","attributes":{"b":"1"}},{"text":"\n","attributes":{"lang":"en-US"}},{"text":"7","attributes":{"i":"1"}},{"text":" Notes","attributes":{"u":"sng"}}]
      When the production anchored editor attempts JSON "Chapter" to JSON "Section" through that anchor
      Then the operation returns exactly typed refusal category "PPTX_UNSUPPORTED_TEXT_TOPOLOGY" with no changed result
      And every original member, relationship, caller archive and prior destination remains unchanged
      And the held paragraph remains readable and a subsequent no-op observation leaves the source unchanged

    @profile-contract20 @id-pptx-cross-run-replace
    Scenario: Replace a substring spanning Fran and ken while retaining starting-run formatting
      Given the contract20 derived PPTX recipe "fragmented-title" is created in memory from its sealed fixture
      And the unique first title paragraph reads JSON "Frankenstein" with source runs JSON [{"text":"Fran","attributes":{"b":"1"}},{"text":"ken","attributes":{"i":"1"}},{"text":"stein","attributes":{"u":"sng"}}]
      And the source member payloads, relationships and caller archive are recorded
      When the production anchored editor replaces UTF-16 substring [2,7) JSON "anken" with JSON "iend"
      Then the result is saved to a distinct new path and independently parsed and reopened
      And the source fixture, caller archive and operation operands remain unchanged
      And only the sealed original member and lexical span allowances differ; all unrelated member payloads remain literal
      And all saved OPC relationships and content types resolve with original identities preserved
      And refusals and save faults publish no partial destination and leave the session and held unaffected targets usable
      And the reopened title text equals JSON "Friendstein"
      And the exact saved runs equal JSON [{"text":"Fr","attributes":{"b":"1"}},{"text":"iend","attributes":{"b":"1"}},{"text":"stein","attributes":{"u":"sng"}}]
      And the exact changed member set is JSON ["ppt/slides/slide1.xml"] without additions or removals
      And only consumed run text spans and the inherited replacement run may differ; every unrelated selected paragraph property and sibling span remains literal
      And custom/data.bin equals JSON "keep-me-safe" and every other member payload remains unchanged

    @profile-contract20 @id-pptx-stale-anchor-refusal
    Scenario: A consumed owned text anchor refuses a second replacement without undoing the first
      Given the contract20 derived PPTX recipe "plain-title" is created in memory from its sealed fixture
      When the production inspector holds the unique first title paragraph anchor reading JSON "Frankenstein"
      When the production anchored editor replaces JSON "Frankenstein" with JSON "Creature" through that anchor
      Then the complete post-success package member state and prior destination are recorded
      And the same old anchor attempts replacement JSON "Frankenstein" with JSON "Monster"
      And the operation returns exactly typed refusal category "PPTX_STALE_ANCHOR" and no changed result
      And the complete post-success member state, original caller input and prior destination remain unchanged
      And saving and independently reopening the retained session reads JSON "Creature"
      And a newly issued target for the first title remains usable and original relationships and unrelated members retain custody

  Rule: Edit a uniquely identified plain text shape in the retained package
    Whole-frame resets and paragraph appends retain unaffected lexical spans.

  @profile-retained-manipulation @id-pptx-manipulation-patch-title
  Scenario: title replacement
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 shape ID 2 is selected by its original part and unique identity
    When production presentation editing APIs replace all text with JSON "New Title"
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 shape ID 2 has exact properties JSON {"text":"New Title","paragraphs":["New Title"]}
    And only original member payloads ["ppt/slides/slide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-patch-body
  Scenario: body replacement
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 2 shape ID 4 is selected by its original part and unique identity
    When production presentation editing APIs replace all text with JSON "Updated bullet"
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 2 shape ID 4 has exact properties JSON {"text":"Updated bullet","paragraphs":["Updated bullet"]}
    And only original member payloads ["ppt/slides/slide2.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-patch-subtitle
  Scenario: subtitle replacement
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 shape ID 3 is selected by its original part and unique identity
    When production presentation editing APIs replace all text with JSON "New Subtitle"
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 shape ID 3 has exact properties JSON {"text":"New Subtitle","paragraphs":["New Subtitle"]}
    And only original member payloads ["ppt/slides/slide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-append-title
  Scenario: append title text
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 shape ID 2 is selected by its original part and unique identity
    When production presentation editing APIs append JSON " - Appended" as a new paragraph
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 shape ID 2 has exact properties JSON {"text":"Alpha\n - Appended","paragraphs":["Alpha"," - Appended"]}
    And only original member payloads ["ppt/slides/slide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links
