@planned @local-candidate
Feature: Read and write linear gradients with exact colour references
  Graphics item 18. Recipes: ledgers/pptx-gradients.json.
  Contract: contracts/pptx-gradients.md. All consumers remain planned.

  @id-pptx-graphics-gradients-write
  Scenario Outline: Author a bounded linear gradient without rewriting other properties
    Given shared linear gradient recipe "<variant>"
    When the selected shape receives the recipe linear gradient
    Then before and after gradient records and changed count match literal expectations
    And stop order, positions, angle, scaling and colour transform order remain exact
    And only the selected direct fill may change
    And theme definitions, style references, outline, text and dependencies remain literal
    And save and reopen retain exact gradient values and every unrelated payload
    Examples:
      | variant           |
      | RGB stops         |
      | theme references  |
      | replace gradient  |
      | exact no-op       |
      | aliased no-op     |
      | absent fill       |

  @id-pptx-graphics-gradients-refusals
  Scenario Outline: Refuse an unsupported or ambiguous gradient atomically
    Given shared linear gradient refusal recipe with fault <fault>
    When gradient editing is attempted
    Then the semantic error code matches the recipe
    And complete membership, payloads and handle version remain unchanged
    Examples:
      | fault                  |
      | one stop               |
      | unordered stops        |
      | duplicate positions    |
      | missing boundary       |
      | invalid angle          |
      | invalid RGB            |
      | unknown theme token    |
      | out of range transform |
      | duplicate source fills |
      | path gradient          |
      | missing shape          |
      | protected presentation |
