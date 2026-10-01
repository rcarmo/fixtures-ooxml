@planned
Feature: Retained PowerPoint text frame properties editing

  Rule: Guarded retained single-target edits with full custody
    Exact direct values are checked after save and reopen; inherited rendering is outside this profile.

    @profile-retained-style-word @id-pptx-retained-body-anchor
    Scenario: pptx body anchor changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 text frame is uniquely selected with a held identity
      When production retained pptx editing applies body-anchor patch JSON {"anchor":"ctr"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 text frame has exact saved properties JSON {"anchor":"ctr"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-body-direction
    Scenario: pptx body direction changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 text frame is uniquely selected with a held identity
      When production retained pptx editing applies body-direction patch JSON {"vert":"vert"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 text frame has exact saved properties JSON {"vert":"vert"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-body-wrap
    Scenario: pptx body wrap changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 text frame is uniquely selected with a held identity
      When production retained pptx editing applies body-wrap patch JSON {"wrap":"none"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 text frame has exact saved properties JSON {"wrap":"none"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-body-insets
    Scenario: pptx body insets changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 text frame is uniquely selected with a held identity
      When production retained pptx editing applies body-insets patch JSON {"lIns":91440,"tIns":45720,"rIns":91440,"bIns":45720}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 text frame has exact saved properties JSON {"lIns":91440,"tIns":45720,"rIns":91440,"bIns":45720}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-body-anchor-center
    Scenario: pptx body anchor center changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 text frame is uniquely selected with a held identity
      When production retained pptx editing applies body-anchor-center patch JSON {"anchorCtr":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 text frame has exact saved properties JSON {"anchorCtr":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-body-rotation
    Scenario: pptx body rotation changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 text frame is uniquely selected with a held identity
      When production retained pptx editing applies body-rotation patch JSON {"rot":5400000}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 text frame has exact saved properties JSON {"rot":5400000}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-body-columns
    Scenario: pptx body columns changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 text frame is uniquely selected with a held identity
      When production retained pptx editing applies body-columns patch JSON {"numCol":2,"spcCol":91440}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 text frame has exact saved properties JSON {"numCol":2,"spcCol":91440}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-body-rtl-columns
    Scenario: pptx body rtl columns changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 text frame is uniquely selected with a held identity
      When production retained pptx editing applies body-rtl-columns patch JSON {"rtlCol":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 text frame has exact saved properties JSON {"rtlCol":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged
