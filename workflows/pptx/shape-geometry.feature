@planned
Feature: Retained PPTX shape geometry editing

  @profile-retained-formatting @id-pptx-formatting-move
  Scenario: move preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set shape position to EMU x=914400 y=1828800
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 has exact saved properties JSON {"x":914400,"y":1828800,"width":1000,"height":1000}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-resize
  Scenario: resize preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set shape extent to EMU width=3657600 height=1828800
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 has exact saved properties JSON {"x":1,"y":2,"width":3657600,"height":1828800}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-transform
  Scenario: transform preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set shape rotation to 5400000 angle units and flipH=true flipV=false
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 has exact saved properties JSON {"rotation":5400000,"flipH":true,"flipV":false,"x":1,"y":2,"width":1000,"height":1000}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-geometry-refusal
  Scenario: geometry refusal preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs attempt atomic shape position x=914400 and extent width=-1
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 has exact saved properties JSON {"refusal":"invalid-geometry"}
    And the exact changed original member set is [] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody
    And refusal reason invalid-geometry leaves session bytes and held identities unchanged before save
