@planned
Feature: Word tracking preference persistence and preservation
  ECMA-376 Part 1 clause 17.15.1.89 defines trackRevisions.
  The bounded settings editor keeps the revision author in session metadata.
  Saving the preference does not request implicit redlines from ordinary native edits.

  @profile-preserving-settings-editor
  Rule: Saved preferences and unrelated package custody
    @id-docx-tracking-settings-persistence
    Scenario Outline: Persist an explicit preference without serializing the session author
      Given a Word tracking package with text Retained text and an unrelated opaque payload
      When the settings editor saves tracking <enabled> with author Session reviewer and reopens the output
      Then the reopened tracking preference is <enabled> and the session author is empty
      And the output has one internal settings relationship with the Word settings content type
      And the reopened text and opaque payload equal the source and the source archive is unchanged
      Examples:
        | enabled |
        | true    |
        | false   |

    @id-docx-tracking-settings-custody
    Scenario Outline: Edit existing settings without replacing sibling metadata
      Given a Word tracking package with <layout> settings and text Retained text
      When the settings editor enables tracking with author Session reviewer and saves the output
      Then the reopened preference is true and the settings path and encoding match the source
      And removing only the added tracking element reproduces the original settings XML
      And every unrelated member and the source archive is unchanged
      Examples:
        | layout         |
        | custom-prefix  |
        | UTF-16         |
        | UTF-8-BOM      |

    @id-docx-tracking-settings-no-op
    Scenario Outline: Keep same-state archive bytes and session-only author changes
      Given a Word tracking package with <state> preference
      When the settings editor requests tracking <enabled> and changes the session author to Session reviewer
      Then the preference is <enabled> and the session author is Session reviewer
      And the complete archive is unchanged with zero changed parts
      Examples:
        | state   | enabled |
        | absent  | false   |
        | on      | true    |
        | off     | false   |
        | true    | true    |

    @id-docx-tracking-settings-refusal
    Scenario Outline: Refuse protected or ambiguous settings before any mutation
      Given a Word tracking package with <defect> settings and session author Previous
      When the settings editor attempts enabling and disabling tracking
      Then both requests refuse and the session author remains Previous
      And the archive and held paragraph text Retained text are unchanged
      Examples:
        | defect             |
        | protected          |
        | external           |
        | duplicate-link     |
        | orphan             |
        | wrong-content-type |
        | duplicate-flag     |
        | wrong-order        |
        | shared-owner       |

    @id-docx-tracking-settings-rollback
    Scenario Outline: Roll back failed settings publication including session metadata
      Given a Word tracking package without settings and with session author Previous
      When enabling tracking fails at <stage>
      Then the settings operation refuses and the session author remains Previous
      And the archive and held paragraph text Retained text are unchanged
      Examples:
        | stage              |
        | part-write         |
        | relationship-write |
        | serialization      |

    @id-docx-tracking-settings-plain-edit
    Scenario: Keep ordinary editing separate from the saved tracking preference
      Given a Word tracking package with text Retained text and an unrelated opaque payload
      When tracking is enabled and an ordinary text edit writes Explicit plain edit then saves and reopens
      Then the reopened text is Explicit plain edit and the tracking preference is true
      And the reopened document contains no revisions and the opaque payload is unchanged

    @id-docx-tracking-settings-author-refusal
    Scenario Outline: Refuse invalid session authors before creating settings
      Given a Word tracking package without settings and with session author Previous
      When the settings editor attempts to enable tracking with <author> author input
      Then the settings operation refuses and the session author remains Previous
      And the archive and held paragraph text Retained text are unchanged
      Examples:
        | author      |
        | blank       |
        | XML-control |
        | non-string  |
