@planned
Feature: Preview details and per-placeholder match counts
  Previews identify requested edits without committing them. Match counts belong
  to individual targets. Native APIs and MCP adapters share these predicates.

  @id-office-preview-details
  Scenario: A dry-run preview describes the requested edit without committing it
    Given a presentation with the title "Original title"
    When a title change to "Changed by dry run" is previewed
    Then the preview identifies the original target and requested replacement
    And the preview reports zero committed changes

  @id-office-docx-exact-match-counts
  Scenario: Word match counts belong to each requested placeholder
    Given a document containing "<Present>" once and not containing "<Missing>"
    When both placeholders are resolved before mutation
    Then "<Present>" reports exactly one match
    And "<Missing>" reports exactly zero matches
