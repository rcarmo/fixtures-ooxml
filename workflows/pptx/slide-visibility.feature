@planned
Feature: PowerPoint slide visibility by slide identity
  Slide order and visibility are separate properties. The retained source has
  a namespaced p:show marker, while CT_Slide defines unqualified show. Its
  application-visible hidden state is unproved; an Office-positive requires
  an untouched PowerPoint export and reopen evidence.

  @id-pptx-slide-visibility-retained-inputs
  Scenario: Retained four-slide inputs distinguish a namespaced marker from a visible control
    Given the committed fixture fixture-e01ded1106a28f94a3439e8368f9a12ec360891f4a9e2810f6504c4c328ed79c is loaded without editing
    And the committed fixture fixture-fa245a3df00fef7f7bf4739921ee840194040161e06490589e3d52cc9fa7a71d is loaded as a visible control
    When their four ordered slide identities and root visibility attributes are inspected
    Then the source fixture has exactly four slides with slide 3 marked namespaced p:show="0" and slides 1, 2 and 4 unmarked
    And the source fixture's four slides lack an unqualified show attribute
    And the visible control has exactly four slides without a hidden visibility attribute
    And no slide in either retained input is counted as an application-confirmed hidden slide
    And both source archive bytes remain unchanged
    And the reported slide numbers refer to the same slide relationships as the inspected parts

  @id-pptx-office-hidden-slide-positive
  Scenario: An untouched PowerPoint export confirms hidden slide 3 of four on reopen
    Given an untouched PowerPoint-authored four-slide presentation with slide 3 hidden is registered with version and platform provenance
    And a separately visible control is registered with original bytes
    When both originals are reopened in PowerPoint and inspected through an independent OOXML reader
    Then slide 3 alone is hidden in the original presentation and slides 1, 2 and 4 remain visible
    And every control slide remains visible
    And the identity of each visible or hidden slide matches its slide relationship and part
    And both original archive bytes remain unchanged

  Rule: Bounded unqualified slide visibility editing
    Direct show values and relationship-ordered identity are observed without rendering.

  @profile-retained-formatting @id-pptx-formatting-hide
  Scenario: hide preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 root has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set slide visibility to hidden
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 root has exact saved properties JSON {"show":"0","hidden":true}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-unhide
  Scenario: unhide preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 root has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs set slide visibility to hidden then visible
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 root has exact saved properties JSON {"show":"1","hidden":false}
    And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-visibility-order
  Scenario: visibility order preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target ordered slide identities has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs hide slide 2 then reorder by zero-based permutation [2,0,1] and read hidden identities
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target ordered slide identities has exact saved properties JSON {"titles":["Gamma","Alpha","Beta"],"hiddenParts":["ppt/slides/slide2.xml"],"hiddenOrdinals":[3]}
    And the exact changed original member set is ["ppt/slides/slide2.xml","ppt/presentation.xml"] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody

  @profile-retained-formatting @id-pptx-formatting-visibility-refusal
  Scenario: visibility refusal preserves direct properties and package custody
    Given retained formatting fixture fixture-84e7a8a3681d0e43d4c8a29c37e68386721dfb5df13a36b8bd17a3ebc1fb1fb2 has ordered slides ["Alpha","Beta","Gamma"]
    And formatting target slide 2 root has the exact original direct properties and lexical snapshot
    When production PPTX formatting APIs attempt visibility value JSON "hidden"
    And the result or unchanged refusal session is saved to a new path and independently parsed and reopened
    Then formatting target slide 2 root has exact saved properties JSON {"refusal":"invalid-visibility"}
    And the exact changed original member set is [] with no additions or removals
    And every original text leaf, unselected run, paragraph, shape and unrelated member retains its original bytes
    And only the selected property span may change and all unpatched attributes and child fragments retain their exact bytes
    And caller archive, original slide IDs, relationship IDs, targets, layout and notes links retain custody
    And refusal reason invalid-visibility leaves session bytes and held identities unchanged before save
