@planned @local-candidate
Feature: Reorder graphical sibling spans without rebuilding slide content
  Graphics item 17. Recipes: ledgers/pptx-z-order.json.
  Contract: contracts/pptx-z-order.md. All consumers remain planned.

  @id-pptx-graphics-z-order-reorder
  Scenario Outline: Reorder exact selected sibling IDs in their original slots
    Given shared graphical z-order recipe "<variant>"
    When the requested graphical IDs are reordered under the selected parent
    Then the before and after order and changed count match the literal record
    And every graphical element retains its complete literal XML span
    And unselected sibling slots, group metadata and terminal extensions remain unchanged
    And every relationship and unrelated member payload remains unchanged
    And save and reopen retain exact graphical order and content
    Examples:
      | variant               |
      | full reverse          |
      | selected picture swap |
      | no-op                 |
      | empty order           |
      | group siblings        |
      | terminal extension    |
      | mixed graphical spans |

  @id-pptx-graphics-z-order-refusals
  Scenario Outline: Refuse invalid sibling ordering atomically
    Given shared graphical z-order refusal recipe with fault <fault>
    When graphical reordering is attempted
    Then the semantic error code matches the recipe
    And complete membership, payloads and handle version remain unchanged
    Examples:
      | fault                     |
      | duplicate requested ID    |
      | missing requested ID      |
      | missing group             |
      | cross parent selection    |
      | metadata identity         |
      | duplicate source identity |
      | lexical barrier           |
      | protected presentation    |
