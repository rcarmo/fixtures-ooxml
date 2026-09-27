@planned
Feature: DOCX review integration obligations
  Preserved predicates require separate per-consumer execution evidence.

  @id-docx-review-multistory-resolution
  Scenario: Accept and reject revisions across supported document stories
    Given a document with body header footer and footnote revisions
    When supported insertion deletion move and formatting revisions are resolved
    Then accepting yields the revised content in every selected story
    And rejecting yields the original content in every selected story
    And unsupported revision forms are reported without partial mutation

  @id-parity-docx-review
  Scenario: Native Word reviews survive accept and reject
    Given documents with supported tracked changes and comment threads
    When the native compare and review APIs edit them
    Then accepting yields the revised document and rejecting yields the original
    And thread anchors and unrelated parts survive reopening
