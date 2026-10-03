@planned @local-candidate
Feature: Transform groups and map child coordinates without rewriting children
  Graphics item 10. Recipes: ledgers/pptx-group-transform.json.
  Contract: contracts/pptx-group-transform.md. All consumers remain planned.

  @id-pptx-graphics-group-transform-roundtrip
  Scenario Outline: Patch a direct group coordinate frame
    Given shared group transform recipe "<variant>"
    When the group receives the recipe transform patch
    Then direct transform values and changed count match the literal record
    And only the selected group transform may change with child XML literal
    And every relationship, media payload and unselected member stays unchanged
    And save and reopen retain the complete group coordinate frame
    Examples:
      | variant     |
      | translate   |
      | resize      |
      | child frame |
      | orientation |
      | no-op       |
      | empty patch |

  @id-pptx-graphics-group-transform-mapping
  Scenario Outline: Map child points through group frames and invert the mapping
    Given shared group coordinate mapping vector "<variant>"
    When the point is mapped from child to parent through the ordered group chain
    Then the result matches the literal vector within the shared numeric tolerance
    And inverse mapping recovers the original point within that tolerance
    Examples:
      | variant           |
      | scale translate   |
      | rotate clockwise  |
      | flip horizontal   |
      | rotate and flip   |
      | nested scales     |
      | fractional mapping |

  @id-pptx-graphics-group-transform-refusals
  Scenario Outline: Refuse malformed group frame edits atomically
    Given shared group transform refusal recipe with fault <fault>
    When the group receives the recipe transform patch
    Then the semantic error code matches the recipe
    And complete membership, payloads and handle version remain unchanged
    Examples:
      | fault                    |
      | zero parent extent       |
      | zero child extent        |
      | fractional coordinate    |
      | invalid rotation         |
      | unknown field            |
      | missing group            |
      | foreign child coordinate |
      | duplicate transform      |
      | protected presentation   |
