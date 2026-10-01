@planned
Feature: Retained PowerPoint shape style editing

  Rule: Guarded retained single-target edits with full custody
    Exact direct values are checked after save and reopen; inherited rendering is outside this profile.

    @profile-retained-style-word @id-pptx-retained-shape-solid-fill
    Scenario: pptx shape solid fill changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 is uniquely selected with a held identity
      When production retained pptx editing applies shape-solid-fill patch JSON {"fill":"A1B2C3"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 has exact saved properties JSON {"fill":"A1B2C3"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-shape-no-fill
    Scenario: pptx shape no fill changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 is uniquely selected with a held identity
      When production retained pptx editing applies shape-no-fill patch JSON {"fill":"none"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 has exact saved properties JSON {"fill":"none"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-shape-inherit-fill
    Scenario: pptx shape inherit fill changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 is uniquely selected with a held identity
      When production retained pptx editing applies shape-inherit-fill patch JSON {"fill":null}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 has exact saved properties JSON {"absent":["solidFill","noFill"]}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-line-color
    Scenario: pptx line color changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 is uniquely selected with a held identity
      When production retained pptx editing applies line-color patch JSON {"lineColor":"334455"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 has exact saved properties JSON {"lineColor":"334455"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-line-width
    Scenario: pptx line width changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 is uniquely selected with a held identity
      When production retained pptx editing applies line-width patch JSON {"lineWidth":25400}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 has exact saved properties JSON {"lineWidth":25400}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-line-dash
    Scenario: pptx line dash changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 is uniquely selected with a held identity
      When production retained pptx editing applies line-dash patch JSON {"lineDash":"dash"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 has exact saved properties JSON {"lineDash":"dash"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-line-no-fill
    Scenario: pptx line no fill changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 is uniquely selected with a held identity
      When production retained pptx editing applies line-no-fill patch JSON {"lineColor":"none"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 has exact saved properties JSON {"lineColor":"none"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["ppt/slides/slide2.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-pptx-retained-style-refusal
    Scenario: pptx style refusal changes only its selected direct properties
      Given retained pptx input fixture-b4e7fd03880f9a392038fa81b8f646ab03c45992f5a1852211779473f954ee3d has its sealed original property and identity snapshot
      And retained edit target slide 2 shape ID 4 is uniquely selected with a held identity
      When production retained pptx editing applies style-refusal patch JSON {"lineColor":"334455","lineWidth":-1}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target slide 2 shape ID 4 has exact saved properties JSON {"refusal":"invalid-style"}
      And saved direct property children remain in schema order
      And the exact changed original member set is [] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged
      And refusal reason invalid-style preserves session bytes and held target usability before save
