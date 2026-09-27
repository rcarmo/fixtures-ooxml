@planned
Feature: Word batch preview, target counts and atomic refusal

  Rule: Shared OOXML mutation safety
    Acceptance adapters translate these document operations to native APIs or MCP tools.
    Planned scenarios are inventory only and cannot count as executed passes.

    @id-docx-dry-run-no-mutation
    Scenario Outline: Previewing a Word replacement with <destination> leaves files unchanged
      Given fixture "present-placeholder.docx" verified against the fixture manifest
      And destination state is "<destination>"
      And source bytes, destination bytes and document-directory entries are recorded
      When previewing this batch without committing:
        | target    | value_json |
        | <Present> | "changed"  |
      Then committed change count is 0
      And source bytes, destination bytes and document-directory entries equal the recorded state
      And the reopened source current body text is "<Present>"
      Examples:
        | destination       |
        | source            |
        | distinct-absent   |
        | distinct-existing |

    @id-docx-strict-batch-per-target-results
    Scenario Outline: A matched placeholder cannot conceal an unmatched placeholder with <destination>
      Given fixture "present-placeholder.docx" verified against the fixture manifest
      And destination state is "<destination>"
      And source bytes, destination bytes and document-directory entries are recorded
      When committing this batch with all-targets-required policy:
        | target    | value_json       |
        | <Present> | "changed"        |
        | <Missing> | "never inserted" |
      Then the operation is refused for unmatched target "<Missing>"
      And "<Missing>" is never reported applied
      And committed change count is 0
      And source bytes, destination bytes and document-directory entries equal the recorded state
      And the reopened source current body text is "<Present>"
      Examples:
        | destination       |
        | source            |
        | distinct-absent   |
        | distinct-existing |

  Rule: Preview details and per-placeholder match counts
    Previews identify requested edits without committing them. Match counts belong
    to individual targets. Native APIs and MCP adapters share these predicates.

    @id-office-docx-exact-match-counts
    Scenario: Word match counts belong to each requested placeholder
      Given a document containing "<Present>" once and not containing "<Missing>"
      When both placeholders are resolved before mutation
      Then "<Present>" reports exactly one match
      And "<Missing>" reports exactly zero matches
