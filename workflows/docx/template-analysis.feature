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

  @profile-concrete-template-inventory
  Rule: Read concrete main-body and rectangular-table inventory
    This inventory exposes literal content and direct metadata, with no semantic template classification.

    @id-docx-template-inventory-values
    Scenario: Inspect a saved document with concrete section table and placeholder values
      Given a saved concrete Word inventory sample
      When the concrete template reader inspects the saved document
      Then the inventory scope is main-body-and-tables with counts 8 paragraphs, 2 sections, 1 table and 3 placeholders
      And every paragraphIndex, body location, table coordinate, section level, table value and placeholder offset equals the concrete sample expectation
      And the source archive and held paragraph and table handles are unchanged

    @id-docx-template-inventory-empty
    Scenario Outline: Report explicit empty collections without inventing classifications
      Given a saved <kind> Word inventory source
      When the concrete template reader inspects the saved document
      Then the <kind> inventory has exact empty collections and literal paragraph values
      And the source archive is unchanged
      Examples:
        | kind  |
        | empty |
        | plain |

    @id-docx-template-inventory-placeholders
    Scenario: Keep literal placeholder occurrences and UTF-16 offsets across runs only
      Given a saved Word inventory source with split-run Unicode placeholders and paragraph boundaries
      When the concrete template reader inspects the saved document
      Then its two placeholder occurrences have names Customer and offsets 3 through 13 and 14 through 24 in paragraphIndex 0
      And no nested, blank, bracketed or cross-paragraph placeholder is reported
      And the source archive is unchanged

    @id-docx-template-inventory-refusal
    Scenario Outline: Refuse misleading or unsupported inventory rather than return partial success
      Given a saved concrete Word inventory sample with <defect>
      When the concrete template reader attempts inspection
      Then inspection refuses without returning an inventory
      And the source archive is unchanged
      Examples:
        | defect         |
        | late-field     |
        | body-control   |
        | nested-cell    |
        | merged-cell    |
        | row-before     |
        | row-after      |
        | width-mismatch |
        | missing-width  |
        | grid-comment   |
        | stale-wrapper  |

    @id-docx-template-inventory-bounds
    Scenario Outline: Refuse exceeded bounds instead of returning a truncated inventory
      Given a saved Word inventory source with <limit> above the supported bound
      When the concrete template reader attempts inspection
      Then inspection refuses with the template limit error and no inventory
      And the source archive is unchanged
      Examples:
        | limit              |
        | 10001-paragraphs   |
        | 10001-placeholders |
        | 1001-tables        |

    @id-docx-template-inventory-encoding
    Scenario Outline: Read aliased encoded template XML without altering its bytes
      Given a saved concrete Word inventory sample encoded as <encoding>
      When the concrete template reader inspects the saved document
      Then every paragraphIndex, body location, table coordinate, section level, table value and placeholder offset equals the concrete sample expectation
      And the source archive and encoding bytes are unchanged
      Examples:
        | encoding  |
        | UTF-8-BOM |
        | UTF-16BE  |

    @id-docx-template-inventory-snapshot
    Scenario: Retain an immutable inventory snapshot after later editing
      Given a saved concrete Word inventory sample
      When the concrete template reader returns a snapshot then the final paragraph becomes Changed <New>
      Then the prior snapshot remains deeply immutable with No placeholder and three placeholders
      And a new snapshot reports Changed <New> and four placeholders
      And the saved source archive is unchanged

    @id-docx-template-inventory-scope
    Scenario Outline: Keep read-only scope explicit for protection and unrelated stories
      Given a saved concrete Word inventory sample with <context> context
      When the concrete template reader inspects the saved document
      Then every paragraphIndex, body location, table coordinate, section level, table value and placeholder offset equals the concrete sample expectation
      And the source archive is unchanged
      Examples:
        | context   |
        | protected |
        | header    |
