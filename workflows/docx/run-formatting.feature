@planned
Feature: Direct paragraph run formatting preserves text and unrelated properties
  Bold and italic apply to every direct text run in one supported paragraph.
  Null removes a direct override; false writes explicit off without evaluating styles.

  @id-docx-direct-run-formatting
  Scenario Outline: Apply the <operation> direct formatting policy
    Given a native Word paragraph split into two differently formatted text runs
    When paragraph formatting requests <operation>
    Then reopening preserves the paragraph text and the <operation> direct properties
    And formatting changes only the main document part and retains unrelated properties

    Examples:
      | operation |
      | enable    |
      | disable   |
      | remove    |
      | no-op     |

  @id-docx-direct-formatting-refusal
  Scenario Outline: Refuse formatting <variant> atomically
    Given a Word formatting refusal input <variant>
    When paragraph direct formatting is attempted
    Then formatting refuses before changing package bytes

    Examples:
      | variant            |
      | field              |
      | tracked            |
      | mixed-content      |
      | duplicate-property |
      | malformed-flag     |
      | wrong-namespace    |
      | property-revision  |
      | protected          |
      | external-settings  |
      | stale              |
      | invalid-option     |
