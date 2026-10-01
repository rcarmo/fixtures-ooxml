@planned
Feature: PPTX bullets

  @profile-retained-manipulation @id-pptx-manipulation-bullet-default
  Scenario: append body bullet
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 2 shape ID 4 is selected by its original part and unique identity
    When production presentation editing APIs append bullet JSON "New bullet point" at level 0
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 2 shape ID 4 has exact properties JSON {"text":"Existing\nNew bullet point","paragraphs":["Existing","New bullet point"],"bullet":{"character":"•","level":0}}
    And only original member payloads ["ppt/slides/slide2.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-bullet-sequence
  Scenario: append two ordered bullets
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 2 shape ID 4 is selected by its original part and unique identity
    When production presentation editing APIs clear text, append bullet JSON "First bullet", then append bullet JSON "Second bullet", both at level 0
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 2 shape ID 4 has exact properties JSON {"text":"First bullet\nSecond bullet","paragraphs":["First bullet","Second bullet"],"bullets":[{"character":"•","level":0},{"character":"•","level":0}]}
    And only original member payloads ["ppt/slides/slide2.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-bullet-level
  Scenario: direct bullet indentation
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 2 shape ID 4 is selected by its original part and unique identity
    When production presentation editing APIs append bullet JSON "Sub-bullet point" at level 1
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 2 shape ID 4 has exact properties JSON {"text":"Existing\nSub-bullet point","paragraphs":["Existing","Sub-bullet point"],"bullet":{"character":"•","level":1}}
    And only original member payloads ["ppt/slides/slide2.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-bullet-bold-label
  Scenario: bold label only
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 2 shape ID 4 is selected by its original part and unique identity
    When production presentation editing APIs append a level-0 bullet with bold label JSON "Key Point" and description JSON "This is the description"
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 2 shape ID 4 has exact properties JSON {"text":"Existing\nKey Point: This is the description","paragraphs":["Existing","Key Point: This is the description"],"bullet":{"character":"•","level":0},"runs":[{"text":"Key Point: ","bold":true},{"text":"This is the description","bold":false}]}
    And only original member payloads ["ppt/slides/slide2.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-clear-bullets
  Scenario: clear body paragraphs
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 2 shape ID 4 is selected by its original part and unique identity
    When production presentation editing APIs clear all text and bullet properties
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 2 shape ID 4 has exact properties JSON {"text":"","paragraphs":[""],"bulletCount":0}
    And only original member payloads ["ppt/slides/slide2.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links
