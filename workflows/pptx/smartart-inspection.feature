@planned @local-candidate
Feature: Inspect SmartArt dependency graphs without editing or evaluating layout
  Graphics item 13. Recipes: ledgers/pptx-smartart-inspection.json.
  Contract: contracts/pptx-smartart-inspection.md. All consumers remain planned.

  @id-pptx-graphics-smartart-inspection-read
  Scenario Outline: Read the exact SmartArt dependency inventory
    Given shared SmartArt inspection recipe "<variant>"
    When the slide SmartArt dependency inspector reads the package
    Then frame identities, four role roots, graph parts and edges match the literal record
    And drawing dependencies and external targets are reported without fetching
    And explicit limits refuse any inference of data editing layout evaluation or drawing regeneration
    And returned records are detached with every package payload unchanged
    And save and reopen retain the exact record and all members
    Examples:
      | variant          |
      | dependency graph |
      | cyclic transitive graph |
      | empty            |

  @id-pptx-graphics-smartart-inspection-refusals
  Scenario Outline: Refuse ambiguous or mismatched SmartArt metadata
    Given shared SmartArt inspection refusal recipe with fault <fault>
    When the slide SmartArt dependency inspector reads the package
    Then it refuses with PPTX_SMARTART_UNSUPPORTED and no partial report
    And complete membership and every payload remain unchanged
    Examples:
      | fault                          |
      | duplicate frame identity       |
      | wrong role relationship        |
      | wrong content type             |
      | wrong root namespace           |
      | foreign relationship attribute |
      | duplicate relIds               |
      | stale drawing metadata         |
      | external role root             |
      | wrong drawing content type     |
