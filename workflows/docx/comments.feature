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

  Rule: Word comment creation, inspection and thread resolution
    The comment authoring API may create missing commentsExtended metadata and
    resolve a reply through its root thread. These workflows use newly authored
    comments; existing-extension-only comment resolution has a separate profile.
    Response keys, filters and success flags are API predicates. Extension creation
    and reply-to-root resolution are editor policies, not universal format rules.
    @profile-authored-comment-response-api @id-python-comments-mixed-done
    Scenario: Resolve one of two authored comments and read mixed states
      Given a saved Word document has paragraphs "Alpha target" and "Beta target"
      And comment authoring adds "Comment alpha" by "Manuel" to the first target and "Comment beta" by "Rui Carmo" to the second
      And the two comment IDs are read in their returned order
      When the first comment ID is resolved in the saved document
      Then the resolve response reports success true
      And a fresh unfiltered comment read reports the first ID done true and the second ID done false

    @profile-authored-comment-response-api @id-python-comments-resolved-filter
    Scenario: Resolve an authored comment and read it through the resolved filter
      Given a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"
      And the first returned comment ID is selected
      When that comment ID is resolved in the saved document
      Then the resolve response reports success true and done true
      And a fresh resolved-filter comment read contains that ID with done true

    @profile-authored-comment-response-api @id-python-comments-reopen-filter
    Scenario: Reopen a resolved authored comment and read it through the open filter
      Given a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"
      And the first returned comment ID is selected
      When that comment ID is resolved in the saved document
      Then the resolve response reports success true
      And a resolved-filter read reports at least one comment
      When that comment ID is reopened in the saved document
      Then the reopen response reports success true and done false
      And a fresh open-filter comment read contains that ID with done false

    @profile-comment-thread-root-resolution @id-python-comments-reply-root-resolution
    Scenario: Resolving a reply marks its root thread done
      Given a saved Word document has paragraph "Resolve this thread"
      And comment authoring adds "Root comment" to that paragraph
      And a reply "Reply comment" is added to the root comment
      When the reply comment ID is resolved in the saved document
      Then the reply creation and resolve responses report success true
      And the resolve response identifies the original root comment ID
      And a fresh comment read reports the root comment done true

    @profile-comment-id-fallback @id-python-comments-ids-fallback
    Scenario: Inspect a comment's para ID through commentsIds when its first paragraph lacks paraId
      Given a saved Word document has paragraph "Legacy mapping target" and an authored comment "Legacy style comment"
      And its comment's first paragraph has no w14:paraId
      And word/commentsIds.xml maps that comment ID to para ID "0F0E0D0C"
      When Word comments are read from the modified saved package
      Then that comment's returned para_id equals "0F0E0D0C"

    @profile-comment-extension-authoring @id-python-comments-create-extension
    Scenario: Resolving an authored comment creates missing commentsExtended metadata
      Given a saved Word document has paragraph "No commentsExtended yet" and an authored comment "Needs follow-up"
      And word/commentsExtended.xml is absent from the saved package
      When that comment ID is resolved in the saved document
      Then the resolve response reports success true
      And a fresh comment read returns a nonempty para_id for that ID
      And the saved package contains word/commentsExtended.xml with a commentEx for that para ID and w15:done "1"

    @profile-authored-comment-response-api @id-python-comments-filter-predicates
    Scenario: Comment metadata and each filter satisfy the inspected predicates
      Given a saved Word document has paragraphs "Alpha target" and "Beta target" with comments authored by "Manuel" and "Rui Carmo"
      When all comments are read and the first returned ID is resolved in the saved document
      Then the first unfiltered comment has keys "done", "is_reply", "parent_id", and "para_id"
      And the resolve response reports success true
      And the open-filter, resolved-filter, and mine-filter results are each nonempty
      And every returned open-filter comment has done false
      And every returned resolved-filter comment has done true
      And every returned mine-filter comment for "Rui Carmo" has that author ignoring case

    @profile-comment-threaded-response-api @id-python-comments-threaded-reply
    Scenario: Threaded read groups an authored reply under its root
      Given a saved Word document has paragraph "Thread me" and an authored root comment "Root"
      And a reply "Reply" is added to the root comment
      When Word comments are read in threaded format from the saved document
      Then the reply creation response reports success true
      And the response has a threads field and thread_count at least 1
      And the first thread's root ID equals the original root ID
      And that first thread's replies contain the added reply ID

    @profile-comment-thread-root-resolution @id-python-comments-reply-auto-resolve
    Scenario: Adding a reply with auto-resolve marks the root done
      Given a saved Word document has paragraph "Auto resolve target" and an authored root comment "Needs action"
      When a reply "Done now" is added to that root comment with auto_resolve true
      Then the reply response reports success true and resolved true
      And a fresh resolved-filter comment read contains the root ID with done true

  @profile-existing-complete-thread
  Rule: Inspect and resolve complete threads using existing extension metadata
    These operations never author comments or extension parts and never change a root alone when replies exist.

    @id-docx-existing-thread-inspection
    Scenario Outline: Group immutable existing comments in source order without mutation
      Given fixture fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62 prepared as <layout> existing threads
      When existing comment threads are inspected
      Then the <layout> thread roots, flat replies, parent IDs and bodies match the pinned expectations
      And all returned thread records and unsupported findings are immutable detached snapshots
      And the existing-thread package and source archive are unchanged
      Examples:
        | layout     |
        | pinned     |
        | nested     |
        | reordered  |

    @id-docx-existing-thread-resolution
    Scenario Outline: Resolve every selected thread member and reopen the saved output
      Given fixture fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62 prepared as <layout> existing threads
      When existing thread member <id> is resolved and saved to a new path
      Then the receipt has root 1, members <members> and <changed> changed flags in the existing extension only
      And reopened selected members are resolved with their original parents and bodies while root 0 remains open
      And the reopened package differs only in selected done flags and the source archive is unchanged
      When the selected thread is reopened and saved again
      Then the original package member bytes are restored by the fresh read
      Examples:
        | layout | id | members | changed |
        | pinned | 1  | 1,2     | 2       |
        | pinned | 02 | 1,2     | 2       |
        | nested | 3  | 1,2,3   | 3       |

    @id-docx-existing-thread-noop
    Scenario: Mixed single-comment state becomes a complete thread and then an exact no-op
      Given fixture fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62 prepared as pinned existing threads
      When only comment 1 is resolved then thread member 2 is resolved twice
      Then the single-comment edit leaves reply 2 open, the first thread edit changes one flag and the second changes zero
      And the repeated thread edit preserves the exact current archive and original source archive

    @id-docx-existing-thread-refusal
    Scenario Outline: Refuse unsafe thread resolution before any mutation including a requested no-op
      Given fixture fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62 prepared with thread defect <defect>
      When thread member 2 is requested open
      Then a typed thread refusal returns no receipt
      And the existing-thread package and source archive are unchanged
      Examples:
        | defect             |
        | missing-root-entry |
        | missing-extension  |
        | duplicate-id       |
        | cycle              |
        | invalid-done       |
        | protected          |
        | external-settings  |
        | unsupported-body   |
        | unknown-target     |

    @id-docx-existing-thread-rollback
    Scenario Outline: Roll back reached thread publication faults with all prior package edits intact
      Given fixture fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62 prepared as nested existing threads
      And the main document has a prior unrelated edit
      When resolving member 3 fails after <stage>
      Then the injected fault was reached and no receipt is returned
      And the existing-thread package and source archive are unchanged
      Examples:
        | stage         |
        | part-write    |
        | serialization |

    @id-docx-existing-thread-encoding
    Scenario Outline: Preserve extension encoding namespace meaning and unrelated lexical bytes
      Given fixture fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62 prepared with <encoding> thread extension
      When existing thread member 3 is resolved and saved to a new path
      Then the reopened thread has three resolved members and preserves the extension marker and aliased namespace meaning
      And the reopened package differs only in selected done flags and the source archive is unchanged
      Examples:
        | encoding  |
        | UTF-8-BOM |
        | UTF-16LE  |
        | UTF-16BE  |

    @id-docx-existing-thread-unsupported
    Scenario: Explicit unsupported findings remain visible while mutation refuses
      Given fixture fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62 prepared with thread defect unsupported-body
      When existing comment threads are inspected
      Then two immutable root groups and a nonempty unsupported report are returned
      When thread member 2 is requested open
      Then a typed thread refusal returns no receipt
      And the existing-thread package and source archive are unchanged

    @id-docx-existing-thread-limit
    Scenario: Refuse 10001 comments rather than return a truncated thread result
      Given fixture fixture-ccdfb41723d543a8baf3444b16c3f8fa7d8473aead590e13825042ba6119da62 prepared with 10001 extension-free comments
      When thread inspection and member 0 resolution are attempted
      Then both operations return the comment limit refusal and no result
      And the existing-thread package and source archive are unchanged
