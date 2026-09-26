@planned
Feature: Positioned text-box authoring on existing slides
  A plain text box has explicit integer EMU geometry, an allocated slide shape ID
  and optional direct bold/italic flags. Existing shapes and all other parts stay
  unchanged. This does not resolve layout inheritance or prove rendered fidelity.

  @id-pptx-text-box-authoring
  Scenario Outline: Author a text box with <kind>
    Given a native slide prepared for text-box <kind>
    When a positioned text box is appended for <kind>
    Then reopened text-box identity geometry and paragraphs match <kind>
    And existing slide shapes and unrelated package payloads are unchanged
    Examples:
      | kind |
      | plain |
      | multiline |
      | empty |
      | formatted |
      | alias |
      | default-namespace |
      | extension-tail |
      | nested-id |

  @id-pptx-text-box-refusal
  Scenario Outline: Refuse unsafe text-box authoring for <kind>
    Given an unsafe text-box authoring input <kind>
    When the unsafe positioned text box is attempted
    Then text-box creation refuses before package bytes or slide version change
    Examples:
      | kind |
      | negative-position |
      | zero-extent |
      | fractional-geometry |
      | oversized-geometry |
      | invalid-text |
      | invalid-options |
      | duplicate-id |
      | malformed-id |
      | exhausted-id |
      | duplicate-tree |
      | missing-prefix-properties |
      | misplaced-extension |
      | alternate-content |
      | transformed-tree |
      | protected-presentation |
