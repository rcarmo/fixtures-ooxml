@planned
Feature: Retained PPTX paragraph formatting editing

  @profile-retained-formatting @id-pptx-formatting-paragraph-align
  Scenario: paragraph align preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set direct paragraph alignment to center
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 has exact saved properties JSON {"algn":"ctr"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-paragraph-indent
  Scenario: paragraph indent preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set paragraph left margin=457200 and hanging indent=-228600 EMU
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 has exact saved properties JSON {"marL":"457200","indent":"-228600"}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-paragraph-spacing
  Scenario: paragraph spacing preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set space-before=1200 and space-after=600 hundredths of a point
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 has exact saved properties JSON {"before":1200,"after":600}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-paragraph-line
  Scenario: paragraph line preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 shape ID 4 paragraph 0 has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set line spacing to 150000 thousandths of a percent
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 shape ID 4 paragraph 0 has exact saved properties JSON {"linePercent":150000}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody
