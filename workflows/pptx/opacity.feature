@planned @local-candidate
Feature: Edit shape-fill opacity and picture transparency through distinct profiles
  Graphics item 19. Recipes: ledgers/pptx-opacity.json.
  Contract: contracts/pptx-opacity.md. All consumers remain planned.

  @id-pptx-graphics-opacity-shape
  Scenario Outline: Edit a solid shape fill alpha without resolving its colour
    Given shared opacity recipe "<variant>"
    When selected solid shape fill opacity is set to the recipe value
    Then readback and changed count match the literal opacity record
    And only its colour alpha may change with all other transforms and references literal
    And save and reopen retain opacity and every unrelated payload
    Examples:
      | variant        |
      | theme fill     |
      | transparent fill |
      | opaque no-op   |
      | existing alpha |
      | RGB fill       |

  @id-pptx-graphics-opacity-picture
  Scenario Outline: Edit picture alpha modulation without changing the image payload
    Given shared opacity recipe "<variant>"
    When selected picture transparency is set to the recipe value
    Then readback and changed count match the literal transparency record
    And only its alphaModFix may change with crop transforms and other effects literal
    And embedded or linked dependencies remain unchanged without fetching
    And save and reopen retain transparency and all media payloads
    Examples:
      | variant               |
      | existing picture      |
      | picture no-op         |
      | opaque picture        |
      | transparent picture   |
      | absent picture effect |
      | grouped picture       |
      | linked picture        |

  @id-pptx-graphics-opacity-refusals
  Scenario Outline: Refuse invalid or competing alpha profiles atomically
    Given shared opacity refusal recipe with fault <fault>
    When the recipe opacity profile is edited
    Then the semantic error code matches the recipe
    And membership, payloads and handle version remain unchanged
    Examples:
      | fault                    |
      | negative opacity         |
      | excess opacity           |
      | fractional opacity       |
      | negative transparency    |
      | excess transparency      |
      | duplicate shape alpha    |
      | competing picture alpha  |
      | duplicate picture effect |
      | foreign alpha attribute  |
      | no solid fill            |
      | missing picture          |
      | protected presentation   |
