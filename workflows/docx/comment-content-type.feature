@planned
Feature: DOCX comment content type obligations
  Preserved predicates require separate per-consumer execution evidence.

  @id-docx-commentsextended-content-type
  Scenario: Extended comments use an independently validated content type
    Given conflicting upstream commentsExtended content-type constants
    When the native implementation selects a content type for a fixture
    Then an authoritative schema or format reference supports that choice
    And an independent Office consumer accepts the saved comment thread
