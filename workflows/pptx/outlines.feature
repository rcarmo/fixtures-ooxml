@planned @local-candidate
Feature: Edit direct outline decorations while preserving colours and attachments
  Graphics item 20. Recipes: ledgers/pptx-outlines.json.
  Contract: contracts/pptx-outlines.md. All consumers remain planned.

  @id-pptx-graphics-outlines-patch
  Scenario Outline: Patch explicit shape or connector line decorations
    Given shared outline recipe "<variant>"
    When the exact graphical ID receives the recipe outline patch
    Then before and after decoration records and changed count match literal expectations
    And cap compound join and arrowhead XML follow the explicit bounded request
    And all unrequested line attributes, fill colours, dashes and extensions remain literal
    And shape content, connector attachments, style references and dependencies remain unchanged
    And save and reopen retain exact line decorations and every unrelated payload
    Examples:
      | variant             |
      | shape arrows        |
      | miter and triple    |
      | bevel and thick thin |
      | thin thick          |
      | connector arrows    |
      | exact no-op         |
      | remove decorations  |
      | empty patch         |
      | colour dash extension custody |
      | aliased scalar update |

  @id-pptx-graphics-outlines-refusals
  Scenario Outline: Refuse unsupported or ambiguous line decoration edits atomically
    Given shared outline refusal recipe with fault <fault>
    When outline editing is attempted
    Then the semantic error code matches the recipe
    And membership, payloads and handle version remain unchanged
    Examples:
      | fault               |
      | invalid cap         |
      | invalid compound    |
      | invalid arrow       |
      | invalid arrow size  |
      | negative miter      |
      | unknown patch field |
      | duplicate join      |
      | foreign cap         |
      | missing line        |
      | missing shape       |
      | protected presentation |
