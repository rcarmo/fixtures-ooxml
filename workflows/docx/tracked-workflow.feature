@planned
Feature: Word tracked editing and author settings

  Rule: Bounded tracked Word workflow dispatch reports observed revisions
    One unique plain-text replacement may be tracked with explicit author and UTC date.
    Preview and refusal never commit revisions; untracked workflows retain their behaviour.

    @id-docx-track-changes-option-outcome
    Scenario Outline: Report observed revisions for <operation>
      Given a tracked workflow package and an existing output sentinel
      When a <operation> Word replacement batch is requested
      Then the tracked workflow outcome is <outcome> with <committed> committed changes and <revisions> committed revisions
      And the tracked workflow source and unrelated members retain their bytes

      Examples:
        | operation | outcome   | committed | revisions |
        | tracked   | committed | 1         | 2         |
        | untracked | committed | 1         | 0         |
        | no-op     | committed | 0         | 0         |
        | preview   | preview   | 0         | 0         |
        | deletion  | committed | 1         | 1         |

    @id-docx-workflow-tracked-refusal
    Scenario Outline: Tracked dispatch refuses <variant> without output changes
      Given a tracked workflow refusal package <variant>
      When a tracked Word batch is attempted
      Then the tracked workflow refuses with zero committed revisions and unchanged files

      Examples:
        | variant          |
        | missing          |
        | ambiguous        |
        | drawing          |
        | existing         |
        | protected        |
        | external-settings|
        | multiple-targets |
        | invalid-author   |
        | invalid-date     |
        | non-docx         |
        | invalid-option   |
        | missing-metadata |

  Rule: Document value API and selected save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Getter names and return conventions are
    API compatibility predicates, not general OOXML validity or rendering rules.

    @profile-document-value-api @id-docx-go-track-author-toggle
    Scenario: Track Changes author and enabled flag follow a direct toggle sequence
      Given a new Word document with tracking disabled
      When tracking is enabled with Test Author and its author is changed to New Author
      Then tracking is enabled and TrackAuthor equals New Author
      And disabling tracking makes TrackChangesEnabled false
