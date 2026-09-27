@planned
Feature: Word template analysis

  Rule: Inspect Word template formatting and metadata
    The SOW case requires a dictionary without an error. Other direct-analysis
    cases check only response shape and can accept an error dictionary. Unified
    analysis exposes SOW metadata from a dedicated cache. Classification accuracy
    and document rendering are outside these cases.

    @profile-template-response-status-api @id-python-word-template-analysis-sow-response
    Scenario: Analyzing the generated SOW template succeeds
      Given the SOW template has title, customer and project placeholders, guidance, and a Role/Hours table
      When the Word template-formatting analyzer reads that saved document
      Then its response is a dictionary without an "error" member

    @profile-template-response-shape-api @id-python-word-template-analysis-placeholder-response
    Scenario: Analyzing a template with plain placeholders returns a dictionary
      Given a saved Word document has a Template heading, boilerplate text, "<Placeholder>", and "[TBD]"
      When the Word template-formatting analyzer reads that saved document
      Then its response is a dictionary

    @profile-template-response-shape-api @id-python-word-template-analysis-colour-response
    Scenario: Analyzing the Word/PPTX advanced-operations sample returns a dictionary
      Given a saved Word document has a project heading, blue guidance run, standard text, and a customer placeholder
      When the Word template-formatting analyzer reads that saved document
      Then its response is a dictionary

    @profile-template-response-shape-api @id-python-word-template-analysis-plain-response
    Scenario: Analyzing a plain document returns a dictionary
      Given a saved Word document has one paragraph "Simple text"
      When the Word template-formatting analyzer reads that saved document
      Then its response is a dictionary

    @profile-template-response-status-api @id-python-office-template-analysis-response
    Scenario: Unified Word template analysis returns no error
      Given a saved Word template has a title "Template for <Customer>"
      When the unified office template tool analyzes the saved document
      Then its response has no "error" member

    @profile-template-metadata-response-api @id-python-office-template-analysis-cache
    Scenario: Unified Word template analysis exposes stored then cached metadata
      Given a saved Word template has Introduction and Delivery approach headings, customer and guidance placeholders, and a Role/Count table with Architect and 1
      And a dedicated empty template metadata cache is selected
      When the unified office template tool analyzes the saved document twice without editing it
      Then the first response has template metadata with cache reason "stored"
      And the second response has template metadata with cache reason "hit"
      And the second response's first template metadata table has purpose "staffing"
