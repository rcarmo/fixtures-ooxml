@planned
Feature: Word revision inspection, resolution and tracked replacement

  Rule: DOCX bounded revisions

    @id-docx-revisions-all-stories
    Scenario: accepting bounded revisions across every reachable supported story
      Given the synthetic DOCX revisions fixture "all-stories" is opened
      Then the DOCX revision story texts for view "current" are
        | part                | text                      |
        | word/document.xml   | Body modernized.          |
        | word/header1.xml    | Header modernized.        |
        | word/footer1.xml    | Footer modernized.        |
        | word/footer2.xml    | Nested footer modernized. |
        | word/footnotes.xml  | Footnote modernized.      |
        | word/endnotes.xml   | Endnote modernized.       |
        | word/comments.xml   | Comment modernized.       |
      And the DOCX revision story texts for view "original" are
        | part                | text                    |
        | word/document.xml   | Body historic.          |
        | word/header1.xml    | Header historic.        |
        | word/footer1.xml    | Footer historic.        |
        | word/footer2.xml    | Nested footer historic. |
        | word/footnotes.xml  | Footnote historic.      |
        | word/endnotes.xml   | Endnote historic.       |
        | word/comments.xml   | Comment historic.       |
      When all DOCX revisions are accepted
      And the DOCX revision package is saved and reopened
      Then the DOCX changed parts are
        | part               |
        | word/document.xml  |
        | word/header1.xml   |
        | word/footer1.xml   |
        | word/footer2.xml   |
        | word/footnotes.xml |
        | word/endnotes.xml  |
        | word/comments.xml  |
      And the DOCX revision count is 0
      And the DOCX revision story texts for view "all" are
        | part                | text                      |
        | word/document.xml   | Body modernized.          |
        | word/header1.xml    | Header modernized.        |
        | word/footer1.xml    | Footer modernized.        |
        | word/footer2.xml    | Nested footer modernized. |
        | word/footnotes.xml  | Footnote modernized.      |
        | word/endnotes.xml   | Endnote modernized.       |
        | word/comments.xml   | Comment modernized.       |

    @id-docx-revisions-rollback
    Scenario: a later unsupported selected nested story rolls the whole resolution back
      Given the synthetic DOCX revisions fixture "rollback-unsupported" is opened
      And the current DOCX revision bytes are remembered
      Then the DOCX revision story texts for view "current" are
        | part              | text       |
        | word/document.xml | Body safe. |
      And the DOCX revision story texts for view "original" are
        | part              | text      |
        | word/document.xml | Body old. |
      When DOCX revisions are accepted for parts
        | part             |
        | word/document.xml |
        | word/footer2.xml  |
      Then the DOCX revision refusal code equals "docx-revisions-unsupported"
      And the DOCX revision refusal mentions "word/footer2.xml"
      And the DOCX revision refusal mentions "format"
      And the DOCX revision saved bytes equal the remembered bytes
      And the DOCX revision count is 2
      And the DOCX revision story texts for view "current" are
        | part              | text       |
        | word/document.xml | Body safe. |
      And the DOCX revision story texts for view "original" are
        | part              | text      |
        | word/document.xml | Body old. |

    @id-docx-revisions-empty-deletion
    Scenario: Rejecting an empty deletion text node keeps well-formed saved XML
      Given the synthetic DOCX revisions fixture "empty-deletion" is opened
      When all DOCX revisions are rejected
      And the DOCX revision package is saved and reopened
      Then the DOCX revision count is 0
      And the DOCX revision story texts for view "all" are:
        | part              | text |
        | word/document.xml |      |

    @id-docx-revisions-protected
    Scenario: protected documents refuse resolution without mutating bytes
      Given the synthetic DOCX revisions fixture "protected" is opened
      And the current DOCX revision bytes are remembered
      When all DOCX revisions are accepted
      Then the DOCX revision refusal code equals "docx-revisions-protected"
      And the DOCX revision refusal mentions "documentProtection"
      And the DOCX revision saved bytes equal the remembered bytes
      And the DOCX revision count is 2

  Rule: Native Word tracked replacement has accept and reject outcomes
    This slice supports one exact match in a simple run paragraph, not general Word Compare.

    @id-docx-tracked-replace-roundtrip
    Scenario: A fragmented phrase becomes native insertion and deletion revisions
      Given a native Word package with a bold fragmented payment phrase
      When that phrase is replaced as tracked changes with an explicit author and date
      Then reopening exposes the original and current text in their review views
      And accepting yields the revised text while rejecting restores the original text
      And the starting run formatting and unrelated part bytes survive resolution

    @id-docx-tracked-replace-refusal
    Scenario Outline: Unsafe tracked edits leave all bytes unchanged for <case>
      Given a native Word tracked-edit refusal case <case>
      When the tracked replacement is attempted
      Then it refuses with a typed error and preserves the original archive bytes
      Examples:
        | case       |
        | ambiguous  |
        | drawing    |
        | existing   |
        | protected  |
        | bad-date   |

  @profile-text-and-run-properties
  Rule: Resolve complete previous direct-run property snapshots using an explicit profile
    The text-only profile keeps its formatting refusal. Moves and other property changes remain unsupported.

    @id-docx-run-property-revisions-roundtrip
    Scenario Outline: Resolve text and direct properties across seven reachable stories by <action>
      Given the all-stories revision package with one direct-run property snapshot per story saved as a source archive
      When the text-and-run-properties profile inspects all stories
      Then 21 revisions have exact source-ordered IDs, kinds, authors, dates and text with no unsupported findings
      And revision inspection leaves the package and source archive unchanged
      When all selected text and run-property revisions are resolved by <action> and saved to a new path
      Then the receipt resolves 21 revisions in all seven story parts
      And reopened story XML equals the exact <action> text and complete property expectations
      And every other member and the source archive retain their original bytes
      And repeated <action> resolution returns zero changes and keeps the exact current archive
      Examples:
        | action |
        | accept |
        | reject |

    @id-docx-run-property-revisions-scope
    Scenario Outline: Resolve only one story by <action> without touching an unsupported unselected snapshot
      Given an all-stories revision source saved with an unsupported body snapshot outside the selected header
      When only header1 revisions are resolved by <action> and saved to a new path
      Then the receipt resolves three header revisions and all unselected member bytes are unchanged
      And the header XML equals the exact <action> expectation while 17 supported revisions plus one unsupported body format finding remain visible
      And the source archive retains its original bytes
      Examples:
        | action |
        | accept |
        | reject |

    @id-docx-run-property-revisions-default
    Scenario: The default text-only profile still reports and refuses formatting revisions
      Given the all-stories revision package with one direct-run property snapshot per story saved as a source archive
      When the default text-only profile inspects and attempts resolution
      Then inspection returns 14 text revisions and seven format findings and both actions refuse without a receipt
      And revision inspection leaves the package and source archive unchanged

    @id-docx-run-property-revisions-refusal
    Scenario Outline: Reject unsafe later snapshots <defect> before resolving earlier stories
      Given the all-stories revision package with a later header snapshot defect <defect>
      When both property-profile resolution actions are attempted
      Then unsupported findings identify the header and both typed refusals return no receipt
      And revision inspection leaves the package and source archive unchanged
      Examples:
        | defect             |
        | missing-snapshot   |
        | duplicate-snapshot |
        | duplicate-change   |
        | nested-change      |
        | wrong-parent       |
        | non-text-run       |
        | unknown-property   |
        | duplicate-property |
        | decorated-property |
        | invalid-value      |
        | duplicate-id       |
        | property-order     |
        | mixed-content      |
        | missing-author     |
        | foreign-property   |
        | nested-insertion   |

    @id-docx-run-property-revisions-encoding
    Scenario Outline: Retain previous property namespace meaning and lexical bytes in <encoding>
      Given the all-stories revision package with an aliased <encoding> body property snapshot
      When only body revisions are rejected and saved to a new path
      Then the receipt resolves three body revisions and the exact expected aliased snapshot survives with its encoding marker
      And every other member and the source archive retain their original bytes
      Examples:
        | encoding  |
        | UTF-8-BOM |
        | UTF-16LE  |
        | UTF-16BE  |

    @id-docx-run-property-revisions-rollback
    Scenario Outline: Roll back a reached <stage> failure while retaining prior edits
      Given the all-stories revision package with one direct-run property snapshot per story saved as a source archive
      And a prior unrelated main-part edit is retained in memory
      When property-profile rejection fails after <stage>
      Then the injected hook was reached and no successful receipt is returned
      And revision inspection leaves the package and source archive unchanged
      Examples:
        | stage                 |
        | later-write           |
        | serialization         |
        | post-write-validation |

    @id-docx-run-property-revisions-empty
    Scenario Outline: Reject to a complete <snapshot> previous set without keeping current properties
      Given the all-stories revision package with a <snapshot> previous body property snapshot
      When only body revisions are rejected and saved to a new path
      Then the body properties equal only the <snapshot> previous set and the exact expected XML
      And every other member and the source archive retain their original bytes
      Examples:
        | snapshot          |
        | empty             |
        | shadowed-alias    |

    @id-docx-run-property-revisions-guards
    Scenario Outline: Validate <guard> even when no revisions remain
      Given a fully resolved revision package with guard <guard>
      When the extended revision profile is requested again
      Then a typed <guard> refusal returns no receipt
      And revision inspection leaves the package and source archive unchanged
      Examples:
        | guard             |
        | protection        |
        | external-settings |
        | malformed-settings|
        | invalid-profile   |
