@planned @local-candidate
Feature: Read PowerPoint picture identities, assets and direct placement
  Graphics item 1. Shared recipes and literal records: ledgers/pptx-picture-inspection.json.
  Shared contract: contracts/pptx-pictures.md. All consumers remain planned.
  Inspection never fetches linked assets, edits the package or infers inherited placement.

  @id-pptx-graphics-picture-inspection-literal
  Scenario: Inspect two sealed embedded pictures in source order
    Given shared picture inspection recipe "embedded" from the sealed image presentation
    When the production slide picture inspector reads the slide
    Then the picture IDs, names, relationships, MIME types and byte sizes match literal records
    And direct positions, extents and crop percentages match the original picture XML
    And every source member payload and relationship remains unchanged after save and reopen

  @id-pptx-graphics-picture-inspection-links
  Scenario: Inspect an external image link without reading its target
    Given shared picture inspection recipe "external" with a prefixed external image link
    When the production slide picture inspector reads the slide
    Then the literal external target is returned without resolved media bytes or network access
    And the package and caller archive remain unchanged

  @id-pptx-graphics-picture-inspection-groups
  Scenario: Preserve group ancestry and distinguish absent direct placement
    Given shared picture inspection recipe "grouped" has a picture in local group coordinates
    And another picture has no direct transform
    When the production slide picture inspector reads the slide
    Then group IDs and local group transforms are reported in ancestor order
    And missing direct placement is null without invented layout coordinates
    And modifying returned records cannot change the package or subsequent reads

  @id-pptx-graphics-picture-inspection-transformed
  Scenario: Inspect direct rotation, flips and coexisting embedded and linked assets
    Given shared picture inspection recipe "transformed-dual" has direct rotation and both flips
    And its first picture has embedded and linked assets with no direct crop rectangle
    When the production slide picture inspector reads the slide
    Then complete records match the literal direct transform and both asset relationships
    And absent crop sides are exactly zero without fetching the linked target
    And every source member payload and relationship remains unchanged after save and reopen

  @id-pptx-graphics-picture-inspection-empty
  Scenario: Inspect a slide without pictures
    Given shared picture inspection recipe "empty" removes both pictures
    When the production slide picture inspector reads the slide
    Then the picture collection is exactly empty
    And every source member payload and relationship remains unchanged after save and reopen

  @id-pptx-graphics-picture-inspection-refusals
  Scenario Outline: Refuse ambiguous picture metadata without a partial result
    Given the shared picture inspection refusal recipe with fault <fault>
    When the production slide picture inspector reads the slide
    Then it refuses with PPTX_PICTURE_INVALID and returns no picture collection
    And every source member payload and relationship remains unchanged
    Examples:
      | fault                     |
      | duplicate shape identity  |
      | duplicate image leaf      |
      | wrong relationship type   |
      | non-image content type    |
      | invalid transform extent  |
      | wrong attribute namespace |
      | misplaced picture owner   |
