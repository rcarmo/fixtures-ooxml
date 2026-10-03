@planned @local-candidate
Feature: Author bounded editable node-and-edge diagrams
  Graphics item 12. Recipes: ledgers/pptx-diagrams.json.
  Contract: contracts/pptx-diagrams.md. All consumers remain planned.

  @id-pptx-graphics-diagrams-create
  Scenario Outline: Author a deterministic row or column diagram
    Given shared editable diagram recipe "<variant>"
    When the diagram is authored using explicit node size origin spacing and direction
    Then generated node keys, IDs and geometry match the literal receipt
    And edge IDs and exact shape/site attachments match the literal receipt
    And node text and direct rectangle styles remain editable
    And original XML, relationships and every unrelated payload remain unchanged
    And save and reopen retain exact labels placements and attachments
    Examples:
      | variant           |
      | row chain         |
      | column chain      |
      | reverse and cycle |
      | nodes only        |

  @id-pptx-graphics-diagrams-refusals
  Scenario Outline: Refuse an invalid bounded graph atomically
    Given shared editable diagram refusal recipe with fault <fault>
    When diagram authoring is attempted
    Then the semantic error code matches the recipe
    And complete membership, payloads and handle version remain unchanged
    Examples:
      | fault                  |
      | duplicate node key     |
      | missing edge node      |
      | self edge              |
      | duplicate edge         |
      | invalid label          |
      | invalid direction      |
      | negative gap           |
      | layout overflow        |
      | too many nodes         |
      | protected presentation |
