@planned
Feature: Word template analysis and metadata caching

  Rule: Inspect Word template formatting and metadata
    The SOW case requires a dictionary without an error. Other direct-analysis
    cases check only response shape and can accept an error dictionary. Unified
    analysis exposes SOW metadata from a dedicated cache. Classification accuracy
    and document rendering are outside these cases.
    @id-python-word-template-analysis-sow-response
    Scenario: Analyzing the generated SOW template succeeds
      Given the Python SOW template has title, customer and project placeholders, guidance, and a Role/Hours table
      When the Python Word template-formatting analyzer reads that saved document
      Then its response is a dictionary without an "error" member

    @id-python-word-template-analysis-placeholder-response
    Scenario: Analyzing a template with plain placeholders returns a dictionary
      Given a saved Word document has a Template heading, boilerplate text, "<Placeholder>", and "[TBD]"
      When the Python Word template-formatting analyzer reads that saved document
      Then its response is a dictionary

    @id-python-word-template-analysis-colour-response
    Scenario: Analyzing the Word/PPTX advanced-operations sample returns a dictionary
      Given a saved Word document has a project heading, blue guidance run, standard text, and a customer placeholder
      When the Python Word template-formatting analyzer reads that saved document
      Then its response is a dictionary

    @id-python-word-template-analysis-plain-response
    Scenario: Analyzing a plain document returns a dictionary
      Given a saved Word document has one paragraph "Simple text"
      When the Python Word template-formatting analyzer reads that saved document
      Then its response is a dictionary

    @id-python-office-template-analysis-response
    Scenario: Unified Word template analysis returns no error
      Given a saved Word template has a title "Template for <Customer>"
      When the Python unified office template tool analyzes the saved document
      Then its response has no "error" member

    @id-python-office-template-analysis-cache
    Scenario: Unified Word template analysis exposes stored then cached metadata
      Given a saved Word template has Introduction and Delivery approach headings, customer and guidance placeholders, and a Role/Count table with Architect and 1
      And a dedicated empty Python template metadata cache is selected
      When the Python unified office template tool analyzes the saved document twice without editing it
      Then the first response has template metadata with cache reason "stored"
      And the second response has template metadata with cache reason "hit"
      And the second response's first template metadata table has purpose "staffing"

  Rule: Cache Word template metadata outside the document
    The Python metadata cache is selected in a dedicated directory. A cache key
    identifies the resolved Word source path and analysis type; its validity is
    checked against the source file's modification time and size. These cases
    do not compare source DOCX bytes before and after cache operations.
    @profile-python-template-cache @id-python-template-cache-key-stable
    Scenario: A Word template's unchanged identity produces the same cache key
      Given a saved Word template and a dedicated Python metadata cache directory
      When its "word" and "template_metadata" cache key is requested twice without changing the template
      Then the two cache keys are equal

    @profile-python-template-cache @id-python-template-cache-roundtrip
    Scenario: Stored metadata is returned on a cache hit
      Given a saved Word template and a dedicated Python metadata cache directory
      When metadata with section title "Intro" and an empty warnings list is stored for "word" and "template_metadata"
      And the same template metadata is loaded from that cache
      Then the load reports a cache hit
      And the loaded metadata equals the stored metadata

    @profile-python-template-cache @id-python-template-cache-source-change
    Scenario: A changed Word template makes its stored metadata stale
      Given a saved Word template and a dedicated Python metadata cache directory
      And metadata with section title "Intro" and an empty warnings list is stored for "word" and "template_metadata"
      When the same template is saved again with an additional paragraph "New content to change the file size"
      And its cached metadata is loaded
      Then no cached metadata is returned
      And the cache reason is "stale"

    @profile-python-template-cache @id-python-template-cache-corrupt
    Scenario: Invalid JSON cache content is rejected
      Given a saved Word template and a dedicated Python metadata cache directory
      And its "word" and "template_metadata" cache file contains "{not valid json"
      When its cached metadata is loaded
      Then no cached metadata is returned
      And the cache reason is "corrupt"

    @profile-python-template-cache @id-python-template-cache-schema-mismatch
    Scenario: A cache record with a different schema version is rejected
      Given a saved Word template and a dedicated Python metadata cache directory
      And its "word" and "template_metadata" cache file has schema version one greater than the current version and the current source identity
      When its cached metadata is loaded
      Then no cached metadata is returned
      And the cache reason is "schema_mismatch"

    @profile-python-template-cache @id-python-template-cache-sow-reuse
    Scenario: Parsing the same Word SOW twice reuses its cached metadata
      Given a saved Word SOW with Introduction and Delivery approach headings, customer and guidance placeholders, and a Role/Count table
      And a dedicated empty Python metadata cache directory
      When the Python Word SOW parser reads the unchanged template twice
      Then the first result has cache reason "stored"
      And the second result reports a cache hit with reason "hit"
      And both results have the same section count
      And the second result has nonempty anchors and nonempty warnings

    @profile-python-template-cache @id-python-template-cache-sow-regenerate
    Scenario: Editing the Word SOW causes metadata to be regenerated
      Given a saved Word SOW with Introduction and Delivery approach headings, customer and guidance placeholders, and a Role/Count table
      And a dedicated empty Python metadata cache directory
      When the Python Word SOW parser reads the template
      And the template is saved again with an additional paragraph "Architecture decisions"
      And the Python Word SOW parser reads the modified template
      Then both results have cache reason "stored"
      And the second result has an anchor whose text begins "Architecture decisions"
