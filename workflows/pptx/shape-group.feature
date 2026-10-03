@planned @local-candidate
Feature: Create editable groups without rewriting selected children
  Graphics item 9. Recipes: ledgers/pptx-shape-group.json.
  Contract: contracts/pptx-shape-group.md. All consumers remain planned.

  @id-pptx-graphics-shape-group-create
  Scenario Outline: Group a contiguous direct selection in source order
    Given shared shape group recipe "<variant>"
    When the selected shapes are grouped using the recipe rectangle and name
    Then the allocated group identity, coordinates and child order match the literal receipt
    And child coordinate mapping is identity with parent and child rectangles equal
    And selected child XML remains literal inside the new group
    And every unselected node, relationship and member payload remains unchanged
    And save and reopen retain editable children and exact group ancestry
    Examples:
      | variant            |
      | picture and text   |
      | source order       |
      | terminal extension |
      | default name       |

  @id-pptx-graphics-shape-group-refusals
  Scenario Outline: Refuse an unsafe group selection atomically
    Given shared shape group refusal recipe with fault <fault>
    When shape grouping is attempted
    Then the semantic error code matches the recipe
    And membership, payloads and handle version remain unchanged
    Examples:
      | fault                      |
      | noncontiguous selection    |
      | duplicate selection        |
      | missing identity           |
      | single child               |
      | zero group extent          |
      | duplicate source identity  |
      | nonidentity root transform |
      | protected presentation     |
      | exhausted identity         |
      | placeholder child          |
      | grouping lock              |
      | attached connector         |
