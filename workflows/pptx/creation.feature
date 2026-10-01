@planned
Feature: PPTX native title-slide authoring
  This slice authors conservative OOXML title slides that reopen through the
  native reader with validated relationships and content types. It does not
  claim visual or Office rendering validation.

  @id-pptx-create-new-minimal
  Scenario: Create a minimal presentation and reopen two authored text slides in order
    Given a new native PPTX presentation is created from scratch
    When PPTX adds two text slides and saves then reopens the package
    Then PPTX reopens both slides in order with title and subtitle placeholder text and valid minimal relationships

  @id-pptx-create-anchor-preservation
  Scenario: Append to a compatible existing deck without invalidating untouched slide anchors
    Given a compatible existing PPTX title-slide deck is prepared
    When PPTX appends a new text slide and edits the original title through its earlier anchor
    Then PPTX keeps the original slide content ordered and preserved except for the anchored edit and gives the new slide independent relationships

  @id-pptx-create-refusals
  Scenario: Refuse invalid arguments and unsafe existing layouts without mutation
    Given invalid-argument and unsafe-layout PPTX fixtures are prepared
    When PPTX attempts unsupported creation edits on those fixtures
    Then PPTX refuses both requests with rollback and leaves their package bytes unchanged

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
