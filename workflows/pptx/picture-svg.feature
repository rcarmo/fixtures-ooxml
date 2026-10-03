@planned @local-candidate
Feature: Author SVG pictures with caller-supplied raster fallback
  Graphics item 7. Recipes: ledgers/pptx-picture-svg.json.
  Contract: contracts/pptx-picture-svg.md. All consumers remain planned.

  @id-pptx-graphics-picture-svg-add
  Scenario Outline: Insert a passive SVG with its exact raster fallback
    Given shared SVG picture recipe for <kind>
    When SVG and fallback are inserted at the recipe EMU rectangle
    Then the picture identity and both allocated relationships match the literal receipt
    And the ordinary blip embeds raster fallback while its SVG extension embeds the vector asset
    And both content types and payloads remain exact after save and reopen
    And all preexisting shapes, relationships and unrelated payloads remain unchanged
    Examples:
      | kind |
      | PNG  |
      | JPEG |

  @id-pptx-graphics-picture-svg-refusals
  Scenario Outline: Refuse an active or unsupported SVG pair atomically
    Given shared SVG picture refusal recipe with fault <fault>
    When SVG and fallback insertion is attempted
    Then it refuses with PPTX_PICTURE_UNSUPPORTED and no receipt
    And complete membership, payloads and handle version remain unchanged
    Examples:
      | fault              |
      | script             |
      | external reference |
      | event handler      |
      | CSS style          |
      | paint URL          |
      | wrong namespace    |
      | malformed XML      |
      | DOCTYPE            |
      | invalid fallback   |
