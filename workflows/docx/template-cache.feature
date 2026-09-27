@planned
Feature: Word template metadata cache

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
