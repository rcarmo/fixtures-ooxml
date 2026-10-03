@planned @local-candidate
Feature: Rotate and flip pictures without changing crop or dependencies
  Graphics item 6. Recipes: ledgers/pptx-picture-transform.json.
  Contract: contracts/pptx-picture-transform.md. All consumers remain planned.

  @id-pptx-graphics-picture-transform-roundtrip
  Scenario Outline: Patch direct picture rotation and flips
    Given shared picture transform recipe "<variant>"
    When the selected picture receives the recipe orientation patch
    Then direct transform values and changed count match the literal records
    And only selected transform opening-tag attributes may change
    And position, size, crop, group ancestry, effects, relationships and media stay unchanged
    And save and reopen retain exact orientation and all unrelated member payloads
    Examples:
      | variant     |
      | rotation    |
      | flips       |
      | reset       |
      | no-op       |
      | empty patch |
      | grouped     |
      | linked      |
      | aliased     |

  @id-pptx-graphics-picture-transform-refusals
  Scenario Outline: Refuse unsupported orientation edits atomically
    Given shared picture transform refusal recipe with fault <fault>
    When the selected picture receives the recipe orientation patch
    Then the semantic error code matches the recipe
    And the complete member set, payloads and handle version remain unchanged
    Examples:
      | fault                       |
      | negative rotation           |
      | full turn rotation          |
      | fractional rotation         |
      | nonboolean flip             |
      | unknown transform field     |
      | missing picture             |
      | missing direct transform    |
      | foreign rotation attribute  |
      | duplicate transform         |
      | protected presentation      |
