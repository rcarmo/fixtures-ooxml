@planned
Feature: Presentation anchored text editing

  Rule: PPTX relationship-ordered reads and anchored text replacement
    The first PPTX slice opens real packages, reads existing notes without creating
    missing notes parts, and performs exact anchored text replacement across runs.

    @id-pptx-readable-unsupported-topology
    Scenario: Read line breaks and field text faithfully but refuse editing that topology
      Given PPTX line-break and field text fixture is prepared from a real template
      When PPTX inspects the paragraph text and attempts an anchored edit on that topology
      Then PPTX exposes line breaks and field text faithfully and refuses the unsupported edit without mutation

    @id-pptx-cross-run-replace
    Scenario: Replace exact anchored text across runs and preserve unrelated members after reopen
      Given PPTX fragmented title fixture is prepared from a real template and an untouched ZIP member
      When PPTX replaces anchored cross-run text and saves then reopens the package
      Then PPTX preserves the replacement text, the starting run formatting, and unrelated ZIP member bytes

    @id-pptx-stale-anchor-refusal
    Scenario: Refuse a stale anchored replacement without mutation
      Given PPTX stale-anchor fixture is prepared from a real template
      When PPTX replaces anchored text once and retries with the stale anchor
      Then PPTX refuses the stale anchor and keeps the post-success bytes unchanged

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
