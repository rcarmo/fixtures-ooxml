@planned
Feature: Presentation batch preview and committed results

  Rule: Shared OOXML mutation safety
    Acceptance adapters translate these document operations to native APIs or MCP tools.
    Planned scenarios are inventory only and cannot count as executed passes.

    @id-pptx-dry-run-no-mutation
    Scenario Outline: Previewing a slide edit with <destination> leaves files unchanged
      Given fixture "title-and-subtitle.pptx" verified against the fixture manifest
      And destination state is "<destination>"
      And source bytes, destination bytes and document-directory entries are recorded
      When previewing this batch without committing:
        | target        | value_json             |
        | slide:1/title | "Changed by dry run"   |
      Then committed change count is 0
      And source bytes, destination bytes and document-directory entries equal the recorded state
      And the reopened source slide 1 title is "Original title"
      Examples:
        | destination       |
        | source            |
        | distinct-absent   |
        | distinct-existing |

    @id-pptx-batch-output-accumulates
    Scenario Outline: The committed <destination> contains every slide edit
      Given fixture "title-and-subtitle.pptx" verified against the fixture manifest
      And destination state is "<destination>"
      And source bytes are recorded
      When committing this batch to the distinct destination:
        | target           | value_json         |
        | slide:1/title    | "Changed title"    |
        | slide:1/subtitle | "Changed subtitle" |
      Then committed change count is 2
      And source bytes equal the recorded state
      And the reopened destination slide 1 title is "Changed title"
      And the reopened destination slide 1 subtitle is "Changed subtitle"
      And all destination relationship and content-type references resolve
      And destination member payloads outside the manifest change allowance are byte-identical
      Examples:
        | destination       |
        | distinct-absent   |
        | distinct-existing |

  Rule: Preview details and per-placeholder match counts
    Previews identify requested edits without committing them. Match counts belong
    to individual targets. Native APIs and MCP adapters share these predicates.

    @id-office-preview-details
    Scenario: A dry-run preview describes the requested edit without committing it
      Given a presentation with the title "Original title"
      When a title change to "Changed by dry run" is previewed
      Then the preview identifies the original target and requested replacement
      And the preview reports zero committed changes
