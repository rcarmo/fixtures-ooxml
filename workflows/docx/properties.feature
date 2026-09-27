@planned
Feature: Word document core properties

  Rule: Document value API and selected save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Getter names and return conventions are
    API compatibility predicates, not general OOXML validity or rendering rules.

    @profile-document-value-api @id-docx-go-core-properties-getters
    Scenario: Core properties read back three selected fields in memory
      Given a new Word document
      When its core properties are set to title Doc Title, creator Doc Author and subject Doc Subject
      And description Doc Description, keywords one;two, category Category and language en-US are supplied
      And content status Draft, identifier urn:example:doc, last modifier Reviewer, revision 2 and version 1.0 are supplied
      And created, modified and last-printed W3CDTF timestamps are supplied for 2026-02-03T00:00:00Z, 2026-02-03T01:00:00Z and 2026-02-03T02:00:00Z
      Then the setter and getter return no error
      And only the in-memory title creator and subject are compared to Doc Title, Doc Author and Doc Subject
