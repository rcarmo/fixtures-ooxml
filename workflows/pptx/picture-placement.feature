@planned @local-candidate
Feature: Place embedded pictures with explicit fit policies
  Graphics item 4. Recipes: ledgers/pptx-picture-placement.json.
  Contract: contracts/pptx-picture-placement.md. All consumers remain planned.

  @id-pptx-graphics-picture-placement-policies
  Scenario Outline: Place a picture with a bounded centred fit policy
    Given shared picture placement recipe "<variant>"
    When the image is inserted with the recipe box intrinsic dimensions and fit policy
    Then exact geometry and crop match the literal record
    And the allocated media payload and relationship retain source bytes
    And save and reopen retain all unrelated member payloads
    Examples:
      | variant           |
      | contain landscape |
      | contain portrait  |
      | cover landscape   |
      | cover portrait    |
      | stretch landscape |
      | equal aspect      |

  @id-pptx-graphics-picture-placement-rounding
  Scenario Outline: Apply the documented integer rounding policy
    Given shared picture placement recipe "<variant>"
    When the image is inserted with the recipe box intrinsic dimensions and fit policy
    Then exact geometry and crop match the literal rational rounding record
    And contained extents stay inside the box with at most one EMU scaling error
    And cover crop rounding has at most one percentage-unit error with a nonempty visible region
    And save and reopen retain placement and all media payloads
    Examples:
      | variant          |
      | contain odd      |
      | cover fractional |
      | large rational   |

  @id-pptx-graphics-picture-placement-refusals
  Scenario Outline: Refuse an unsupported or unrepresentable fit without edits
    Given shared picture placement refusal recipe with fault <fault>
    When fitted picture insertion is attempted
    Then it refuses with PPTX_PICTURE_UNSUPPORTED and no receipt
    And every member payload and slide handle version remain unchanged
    Examples:
      | fault                         |
      | unknown fit                   |
      | zero intrinsic dimension      |
      | fractional intrinsic dimension |
      | zero box extent               |
      | subunit contain extent        |
      | unrepresentable cover crop    |
      | centred coordinate overflow   |
