@planned @local-candidate
Feature: Delete pictures and conservatively collect proven unreferenced media
  Graphics item 8. Recipes: ledgers/pptx-picture-delete.json.
  Contract: contracts/pptx-picture-delete.md. All consumers remain planned.

  @id-pptx-graphics-picture-delete-custody
  Scenario Outline: Delete one exact picture with bounded dependency custody
    Given shared picture deletion recipe "<variant>"
    When the selected picture is deleted with the recipe collection policy
    Then removed relationship IDs and media members match the literal receipt
    And slide XML equals the original with only the selected picture removed
    And shared dependencies and every unselected member payload remain unchanged
    And save and reopen retain remaining pictures and a complete relationship graph
    Examples:
      | variant               |
      | retain dependencies   |
      | collect unique        |
      | shared relationship   |
      | shared media          |
      | other owner reference |
      | grouped               |
      | linked                |
      | SVG pair              |
      | opaque reference      |
      | opaque text           |
      | comment reference     |

  @id-pptx-graphics-picture-delete-refusals
  Scenario Outline: Refuse invalid deletion atomically
    Given shared picture deletion refusal recipe with fault <fault>
    When picture deletion is attempted
    Then the semantic error code matches the recipe and no receipt is returned
    And complete membership, payloads and handle version remain unchanged
    Examples:
      | fault                    |
      | missing picture          |
      | duplicate identity       |
      | wrong image relationship |
      | nonboolean collection    |
      | protected presentation   |
      | attached connector       |
