@planned @local-candidate
Feature: Author bounded editable move line and close paths
  Graphics item 16. Recipes: ledgers/pptx-freeform.json.
  Contract: contracts/pptx-freeform.md. All consumers remain planned.

  @id-pptx-graphics-freeform-author
  Scenario Outline: Author explicit custom vector geometry
    Given shared freeform recipe "<variant>"
    When the requested path is authored at the recipe EMU rectangle
    Then identity, transform, path dimensions and ordered commands match the literal receipt
    And custom geometry and direct fill and outline remain editable
    And removing the generated shape recovers complete original slide XML
    And every relationship and unrelated payload stays unchanged
    And save and reopen retain exact vector geometry and style
    Examples:
      | variant           |
      | closed triangle   |
      | open polyline     |
      | multiple subpaths |
      | boundary points   |
      | default metadata  |

  @id-pptx-graphics-freeform-refusals
  Scenario Outline: Refuse an unsupported or malformed vector path atomically
    Given shared freeform refusal recipe with fault <fault>
    When freeform authoring is attempted
    Then the semantic error code matches the recipe
    And complete membership, payloads and handle version remain unchanged
    Examples:
      | fault                  |
      | line before move       |
      | unsupported curve      |
      | point outside path     |
      | fractional point       |
      | degenerate subpath     |
      | unclosed filled path   |
      | zero path dimension    |
      | too many commands      |
      | unknown command field  |
      | protected presentation |
