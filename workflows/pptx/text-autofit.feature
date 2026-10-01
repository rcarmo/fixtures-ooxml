@planned
Feature: PPTX text autofit

  @profile-retained-manipulation @id-pptx-manipulation-autofit-shrink
  Scenario: shrink autofit
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 shape ID 2 is selected by its original part and unique identity
    When production presentation editing APIs set autofit to shrink
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 shape ID 2 has exact properties JSON {"text":"Alpha","autofit":"normAutofit","fitChildCount":1}
    And only original member payloads ["ppt/slides/slide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-autofit-none
  Scenario: disable autofit
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 shape ID 2 is selected by its original part and unique identity
    When production presentation editing APIs set autofit to none
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 shape ID 2 has exact properties JSON {"text":"Alpha","autofit":"noAutofit","fitChildCount":1}
    And only original member payloads ["ppt/slides/slide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-autofit-resize
  Scenario: resize shape autofit
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 shape ID 2 is selected by its original part and unique identity
    When production presentation editing APIs set autofit to resize
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 shape ID 2 has exact properties JSON {"text":"Alpha","autofit":"spAutoFit","fitChildCount":1}
    And only original member payloads ["ppt/slides/slide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links
