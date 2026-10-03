@planned @local-candidate
Feature: Author straight connectors attached to exact rectangle IDs and sites
  Graphics item 11. Recipes: ledgers/pptx-connectors.json.
  Contract: contracts/pptx-connectors.md. All consumers remain planned.

  @id-pptx-graphics-connectors-add
  Scenario Outline: Attach a straight connector to exact rectangle sites
    Given shared attached connector recipe "<variant>"
    When the recipe start and end IDs and sites receive a straight connector
    Then allocated identity, endpoints and transform match the literal receipt
    And start and end attachment metadata retain exact shape IDs and site indices
    And preset geometry and direct line style match the explicit request
    And every original shape, relationship and unrelated payload remains literal
    And save and reopen retain attachments and exact endpoint coordinates
    Examples:
      | variant           |
      | right to left     |
      | top to bottom     |
      | reverse endpoints |
      | bottom to top     |
      | decreasing direction |
      | odd midpoint      |

  @id-pptx-graphics-connectors-refusals
  Scenario Outline: Refuse unsafe or ambiguous connector endpoints atomically
    Given shared attached connector refusal recipe with fault <fault>
    When connector authoring is attempted
    Then the semantic error code matches the recipe
    And membership, payloads and handle version remain unchanged
    Examples:
      | fault                     |
      | missing endpoint          |
      | unknown site              |
      | same endpoint             |
      | invalid color             |
      | zero line width           |
      | rotated endpoint          |
      | unsupported preset        |
      | duplicate source identity |
      | protected presentation    |
