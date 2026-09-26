@planned @profile-python-anchor-discovery
Feature: Discover Word anchors and use a heading for insertion
  Anchor inspection returns headings and candidate paragraphs from a saved DOCX.
  Insertion by a discovered heading writes a paragraph after that heading.
  Section listing advertises discovery tools without extracting guidance.

  @id-python-word-anchor-headings-paragraphs
  Scenario: Headings and body text appear among discovered anchors
    Given a saved Word document has headings "Introduction" and "Delivery approach" and paragraphs "Customer context paragraph" and "Use iterative delivery"
    When Word anchors are listed without a query
    Then the anchor count is at least 4
    And an anchor has type "section_heading" and text "Introduction"
    And a "paragraph" anchor contains "Customer context" in its text

  @id-python-word-anchor-text-filter
  Scenario: A case-insensitive delivery query filters returned anchor text
    Given a saved Word document has headings "Introduction" and "Delivery approach" and paragraphs "Customer context paragraph" and "Use iterative delivery"
    When Word anchors are listed with query "delivery"
    Then the anchor count is at least 1
    And every returned anchor text contains "delivery" case-insensitively

  @id-python-word-anchor-document-map
  Scenario: A document map reports sections, table, placeholders and anchors
    Given a saved Word document has heading "Introduction", paragraph "<Customer Name>", and a 2x2 Role/Count table with Architect and 1
    When its Word document map is requested
    Then the map counts 1 section and 1 table
    And the map counts at least 1 placeholder and at least 2 anchors
    And the map has a nonempty anchors list

  @id-python-word-anchor-discover-insert
  Scenario: A discovered heading selects where text is inserted in the saved document
    Given a saved Word document has headings "Introduction" and "Delivery approach" with paragraphs "Current intro" and "Current delivery"
    When Word anchors are listed with query "delivery"
    And the anchor whose text equals "Delivery approach" is selected
    And "Inserted after discovered anchor" is inserted after that anchor in the source document
    Then the insertion response has success true
    And reading the saved Word document shows "Inserted after discovered anchor" immediately after "Delivery approach"

  @id-python-word-anchor-section-discovery-hints
  Scenario: Section listing advertises anchor and map discovery tools
    Given a saved Word document has heading "Introduction" and paragraph "Current intro"
    When its Word sections are listed
    Then the section-list response's next tools include "word_list_anchors" and "word_document_map"
