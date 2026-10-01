@planned
Feature: Retained PPTX text formatting editing

  @profile-retained-formatting @id-pptx-formatting-run-bold
  Scenario: run bold preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 run 1 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set direct run bold=true
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 run 1 has exact saved properties JSON {"b":"1"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-run-unbold
  Scenario: run unbold preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 run 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set direct run bold=false
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 run 0 has exact saved properties JSON {"b":"0"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-run-italic
  Scenario: run italic preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 run 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set direct run italic=true
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 run 0 has exact saved properties JSON {"i":"1"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-run-underline
  Scenario: run underline preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 run 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set direct run underline=none
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 run 0 has exact saved properties JSON {"u":"none"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-run-size
  Scenario: run size preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 run 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set direct run font size to 2400 hundredths of a point
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 run 0 has exact saved properties JSON {"sz":"2400"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-run-font
  Scenario: run font preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 run 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set direct Latin typeface to JSON "Aptos Display"
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 run 0 has exact saved properties JSON {"typeface":"Aptos Display"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-run-color
  Scenario: run color preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 run 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set direct sRGB text color to A1B2C3
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 run 0 has exact saved properties JSON {"color":"A1B2C3"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-run-inherit
  Scenario: run inherit preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 run 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs remove direct bold italic underline size Latin typeface and solid color
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 run 0 has exact saved properties JSON {"absent":["b","i","u","sz","latin","solidFill"],"retainedLanguage":"en-US"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody
