@planned
Feature: SmartArt from a committed Microsoft PowerPoint source
  Register the Office-produced diagram encoding separately from synthetic graph probes.
  Structural and LibreOffice evidence do not establish Microsoft application acceptance.

  @id-pptx-smartart-office-source-inspection @profile-office-slide-drawing
  Scenario: Inspect a diagram with slide-owned drawing metadata
    Given the sealed Apache POI SmartArt fixture in "ledgers/pptx-smartart-office-source.json"
    When the SmartArt frame with exact identity 4 is inspected
    Then four diagram role roots and five transitive parts are reported
    And the drawing metadata relationship is resolved on the owning slide
    And the source membership and all member payloads remain unchanged after save and reopen

  @id-pptx-smartart-office-source-copy @profile-office-slide-drawing
  Scenario Outline: Copy an Office diagram into <destination>
    Given the sealed Apache POI SmartArt fixture in "ledgers/pptx-smartart-office-source.json"
    When the SmartArt frame with exact identity 4 is copied into <destination>
    Then the five diagram parts and five slide-owned relationships are isolated
    And all 46 instance model GUIDs and references are remapped consistently
    And numeric layout-template identities and the layout URI remain literal
    And the six zero-valued drawing identities become unique positive identities
    And drawing metadata points to the copied slide-owned relationship
    And the copied output is saved and reopened with unrelated source payloads unchanged
    Examples:
      | destination       |
      | a new presentation |
      | the same slide     |
