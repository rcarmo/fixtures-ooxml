@planned
Feature: Word comment inspection, resolution and thread policies

  Rule: Existing Word comment threads retain their package custody
    This slice reads existing comments and changes only existing commentsExtended done flags.
    @profile-existing-comments-extended @id-docx-comments-inspection
    Scenario: Inspecting the pinned threaded comments does not dirty the package
      Given the pinned threaded Word comments package is opened
      When existing Word comments are inspected
      Then the three comment bodies and reply parent match the pinned fixture
      And the Word comment package bytes remain unchanged

    @profile-existing-comments-extended @id-docx-comments-resolution
    Scenario: Resolve and reopen one comment without rewriting its body or anchors
      Given the pinned threaded Word comments package is opened
      When Word comment "1" is marked resolved
      Then saving and reopening shows that comment resolved and its reply link intact
      And only the existing commentsExtended part differs from the input
      When Word comment "1" is reopened
      Then the original comment package member bytes are restored

    @profile-existing-comments-extended @id-docx-comments-noop
    Scenario: An already-open comment is an exact archive no-op
      Given the pinned threaded Word comments package is opened
      When Word comment "1" is reopened
      Then the Word comment package bytes remain unchanged

    @profile-existing-comments-extended @id-docx-comments-refusal
    Scenario Outline: Unsafe comment resolution refuses before mutation for <case>
      Given an existing Word comment refusal package <case>
      When Word comment resolution is attempted
      Then a typed comment refusal leaves every package byte unchanged
      Examples:
        | case              |
        | missing-extension |
        | duplicate-id      |
        | duplicate-para    |
        | missing-parent    |
        | cycle             |
        | invalid-done      |
        | wrong-mime        |
        | external-link     |
        | protected         |
        | revision-body     |
        | orphan-entry      |

  Rule: Python Word comment creation, inspection and thread resolution
    The Python comment tools may create missing commentsExtended metadata and
    resolve a reply through its root thread. These workflows use newly authored
    comments; existing-extension-only comment resolution has a separate profile.
    @profile-python-comment-resolution @id-python-comments-mixed-done
    Scenario: Resolve one of two authored comments and read mixed states
      Given a saved Word document has paragraphs "Alpha target" and "Beta target"
      And Python comment authoring adds "Comment alpha" by "Manuel" to the first target and "Comment beta" by "Rui Carmo" to the second
      And the two comment IDs are read in their returned order
      When the first comment ID is resolved in the saved document
      Then the resolve response reports success true
      And a fresh unfiltered comment read reports the first ID done true and the second ID done false

    @profile-python-comment-resolution @id-python-comments-resolved-filter
    Scenario: Resolve an authored comment and read it through the resolved filter
      Given a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"
      And the first returned comment ID is selected
      When that comment ID is resolved in the saved document
      Then the resolve response reports success true and done true
      And a fresh resolved-filter comment read contains that ID with done true

    @profile-python-comment-resolution @id-python-comments-reopen-filter
    Scenario: Reopen a resolved authored comment and read it through the open filter
      Given a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"
      And the first returned comment ID is selected
      When that comment ID is resolved in the saved document
      Then the resolve response reports success true
      And a resolved-filter read reports at least one comment
      When that comment ID is reopened in the saved document
      Then the reopen response reports success true and done false
      And a fresh open-filter comment read contains that ID with done false

    @profile-python-comment-resolution @id-python-comments-reply-root-resolution
    Scenario: Resolving a reply marks its root thread done
      Given a saved Word document has paragraph "Resolve this thread"
      And Python comment authoring adds "Root comment" to that paragraph
      And a reply "Reply comment" is added to the root comment
      When the reply comment ID is resolved in the saved document
      Then the reply creation and resolve responses report success true
      And the resolve response identifies the original root comment ID
      And a fresh comment read reports the root comment done true

    @profile-python-comment-resolution @id-python-comments-ids-fallback
    Scenario: Inspect a comment's para ID through commentsIds when its first paragraph lacks paraId
      Given a saved Word document has paragraph "Legacy mapping target" and an authored comment "Legacy style comment"
      And its comment's first paragraph has no w14:paraId
      And word/commentsIds.xml maps that comment ID to para ID "0F0E0D0C"
      When Python Word comments are read from the modified saved package
      Then that comment's returned para_id equals "0F0E0D0C"

    @profile-python-comment-resolution @id-python-comments-create-extension
    Scenario: Resolving an authored comment creates missing commentsExtended metadata
      Given a saved Word document has paragraph "No commentsExtended yet" and an authored comment "Needs follow-up"
      And word/commentsExtended.xml is absent from the saved package
      When that comment ID is resolved in the saved document
      Then the resolve response reports success true
      And a fresh comment read returns a nonempty para_id for that ID
      And the saved package contains word/commentsExtended.xml with a commentEx for that para ID and w15:done "1"

    @profile-python-comment-resolution @id-python-comments-filter-predicates
    Scenario: Comment metadata and each filter satisfy the inspected predicates
      Given a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"
      When all comments are read and the first returned ID is resolved in the saved document
      Then the first unfiltered comment has keys "done", "is_reply", "parent_id", and "para_id"
      And the resolve response reports success true
      And the open-filter, resolved-filter, and mine-filter results are each nonempty
      And every returned open-filter comment has done false
      And every returned resolved-filter comment has done true
      And every returned mine-filter comment for "Rui Carmo" has that author ignoring case

    @profile-python-comment-resolution @id-python-comments-threaded-reply
    Scenario: Threaded read groups an authored reply under its root
      Given a saved Word document has paragraph "Thread me" and an authored root comment "Root"
      And a reply "Reply" is added to the root comment
      When Word comments are read in threaded format from the saved document
      Then the reply creation response reports success true
      And the response has a threads field and thread_count at least 1
      And the first thread's root ID equals the original root ID
      And that first thread's replies contain the added reply ID

    @profile-python-comment-resolution @id-python-comments-reply-auto-resolve
    Scenario: Adding a reply with auto-resolve marks the root done
      Given a saved Word document has paragraph "Auto resolve target" and an authored root comment "Needs action"
      When a reply "Done now" is added to that root comment with auto_resolve true
      Then the reply response reports success true and resolved true
      And a fresh resolved-filter comment read contains the root ID with done true
