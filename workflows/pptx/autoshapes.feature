@planned @local-candidate
Feature: Author bounded editable AutoShapes with preset adjustments
  Graphics item 15. Recipes and preset policy: ledgers/pptx-autoshapes.json.
  Contract: contracts/pptx-autoshapes.md. All consumers remain planned.

  @id-pptx-graphics-autoshapes-author
  Scenario Outline: Author an explicit preset shape
    Given shared AutoShape recipe "<variant>"
    When the requested preset is authored at the recipe EMU rectangle
    Then identity, geometry, preset and literal adjustment guides match the shared record
    And direct text, fill and outline match explicit options or documented defaults
    And every original shape, relationship and payload remains unchanged
    And save and reopen retain editable geometry text and style
    Examples:
      | variant           |
      | rect              |
      | ellipse           |
      | triangle          |
      | diamond           |
      | roundRect         |
      | roundRect zero    |
      | roundRect maximum |
      | default metadata  |

  @id-pptx-graphics-autoshapes-refusals
  Scenario Outline: Refuse an unsupported preset request atomically
    Given shared AutoShape refusal recipe with fault <fault>
    When AutoShape authoring is attempted
    Then the semantic error code matches the recipe
    And complete membership, payloads and handle version remain unchanged
    Examples:
      | fault                       |
      | unsupported preset          |
      | unknown adjustment          |
      | adjustment on fixed preset  |
      | negative adjustment         |
      | excess adjustment           |
      | fractional adjustment       |
      | zero extent                 |
      | invalid fill                |
      | invalid text                |
      | protected presentation      |
