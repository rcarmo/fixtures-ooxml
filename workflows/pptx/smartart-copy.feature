@planned @local-candidate
Feature: Copy admitted SmartArt graphs with isolated parts and remapped identities
  Graphics item 14. Recipes: ledgers/pptx-smartart-copy.json.
  Contract: contracts/pptx-smartart-copy.md. All consumers remain planned.

  @id-pptx-graphics-smartart-copy-copy
  Scenario Outline: Copy an admitted SmartArt dependency closure
    Given shared SmartArt copy recipe "<variant>"
    When the exact source frame is copied to the enrolled destination slide
    Then frame identity and copied part counts match the shared record
    And all diagram model identities and drawing shape identities are remapped consistently
    And every internal copied graph edge resolves inside the copied closure
    And external targets and opaque media bytes remain literal without fetching
    And all source and unrelated destination payloads remain unchanged
    And save and reopen retain the copied graph and remapped identities
    Examples:
      | variant             |
      | cross presentation  |
      | same slide          |
      | cyclic media closure |

  @id-pptx-graphics-smartart-copy-refusals
  Scenario Outline: Refuse an unsupported SmartArt copy atomically
    Given shared SmartArt copy refusal recipe with fault <fault>
    When the exact source frame is copied to the enrolled destination slide
    Then the semantic error code matches the recipe
    And both packages and destination handle version remain unchanged
    Examples:
      | fault                    |
      | missing frame            |
      | unsupported dependency   |
      | duplicate model identity |
      | dangling model reference |
      | protected destination    |
