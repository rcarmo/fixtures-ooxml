@planned
Feature: Office relationship attributes use expanded XML names
  Package relationship elements and officeDocument relationship attributes use
  different namespace URIs. Prefix spellings never establish attribute identity.

  @id-office-relationship-prefix-alias
  Scenario Outline: A valid alternate relationship prefix survives <format> editing
    Given Office relationship fixture <fixture_id> for <format> has its main-part officeDocument relationship prefix renamed from r to link without changing the namespace URI
    When the production <format> editor sets <target> to JSON <value_json> and saves then reopens
    Then the exact value JSON <value_json> is read at <target> and every internal relationship target resolves
    And the saved main part retains link:id attributes without r:id attributes and the caller's archive bytes remain unchanged
    Examples:
      | format | fixture_id                                                               | target                  | value_json       |
      | pptx   | fixture-2aec94471f93c300d56ca4789106a974411085d1588f3424155362a06dd043f3 | first slide first text  | "Edited title"   |
      | xlsx   | fixture-38c2ed936696179d3b2359e9107ad2b8d62d71d69296f8f60bdfe1fe8f7f2439 | Sheet!A1 with wrap text  | "Edited\ncell"   |

  @id-office-relationship-wrong-uri
  Scenario Outline: A relationship attribute in the wrong namespace refuses for <format>
    Given Office relationship fixture <fixture_id> for <format> has only the main-part r namespace URI changed from officeDocument relationships to package relationships
    When the production <format> reader attempts to open the namespace-mismatched document
    Then the reader refuses with structured reason <reason> and no document result
    And the supplied archive bytes remain unchanged
    Examples:
      | format | fixture_id                                                               | reason                    |
      | pptx   | fixture-2aec94471f93c300d56ca4789106a974411085d1588f3424155362a06dd043f3 | PPTX_PRESENTATION_INVALID |
      | xlsx   | fixture-38c2ed936696179d3b2359e9107ad2b8d62d71d69296f8f60bdfe1fe8f7f2439 | xlsx-workbook-invalid      |
