@planned @local-candidate
Feature: Edit a bounded picture source rectangle without changing placement
  Graphics item 5. Recipes: ledgers/pptx-picture-crop.json.
  Contract: contracts/pptx-picture-crop.md. All consumers remain planned.

  @id-pptx-graphics-picture-crop-roundtrip
  Scenario Outline: Read and write the exact bounded crop
    Given shared picture crop recipe "<variant>"
    When the selected picture crop is read and set to the recipe rectangle
    Then the before and after crop and changed count match the literal records
    And only the selected source rectangle may change with all other slide XML literal
    And geometry, ancestry, effects, relationships and media remain unchanged
    And save and reopen retain the exact crop and every unrelated member payload
    Examples:
      | variant     |
      | existing    |
      | reset       |
      | absent      |
      | no-op       |
      | absent-zero |
      | aliased     |
      | grouped     |
      | linked      |

  @id-pptx-graphics-picture-crop-refusals
  Scenario Outline: Refuse an invalid or ambiguous bounded crop atomically
    Given shared picture crop refusal recipe with fault <fault>
    When the selected picture crop is set to the recipe rectangle
    Then the semantic error code matches the recipe
    And the complete member set, payloads and handle version remain unchanged
    Examples:
      | fault                  |
      | negative side          |
      | fractional side        |
      | empty visible region   |
      | unknown crop field     |
      | missing picture        |
      | duplicate rectangle    |
      | foreign crop attribute |
      | negative source crop   |
      | protected presentation |
