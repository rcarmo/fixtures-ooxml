@planned
Feature: Spreadsheet batch preview and atomic refusal

  Rule: Shared OOXML mutation safety
    Acceptance adapters translate these document operations to native APIs or MCP tools.
    Planned scenarios are inventory only and cannot count as executed passes.

    @id-xlsx-dry-run-no-mutation
    Scenario Outline: Previewing a cell edit with <destination> leaves files unchanged
      Given fixture "default-style.xlsx" verified against the fixture manifest
      And destination state is "<destination>"
      And source bytes, destination bytes and document-directory entries are recorded
      When previewing this batch without committing:
        | target | value_json |
        | A1     | "after"    |
      Then committed change count is 0
      And source bytes, destination bytes and document-directory entries equal the recorded state
      And the reopened source active sheet cell A1 is "before"
      Examples:
        | destination       |
        | source            |
        | distinct-absent   |
        | distinct-existing |

    @id-xlsx-strict-batch-atomicity
    Scenario Outline: A missing worksheet prevents the strict batch with <destination>
      Given fixture "default-style.xlsx" verified against the fixture manifest
      And destination state is "<destination>"
      And source bytes, destination bytes and document-directory entries are recorded
      When committing this batch with all-targets-required policy:
        | target     | value_json |
        | A1         | "after"    |
        | Missing!B1 | 123        |
      Then the operation is refused for unmatched target "Missing!B1"
      And committed change count is 0
      And source bytes, destination bytes and document-directory entries equal the recorded state
      And the reopened source active sheet cell A1 is "before"
      Examples:
        | destination       |
        | source            |
        | distinct-absent   |
        | distinct-existing |
