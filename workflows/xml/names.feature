@planned
Feature: XML namespace names require valid prefix and local components
  XML Name scanning alone cannot establish that both QName components are NCNames.

  @id-xml-invalid-qname-components
  Scenario Outline: Invalid <component> namespace names refuse
    Given the lexical XML input is JSON <source_json>
    When the lexical XML input is parsed without rewriting its source
    Then parsing returns category malformed-xml with no document result and unchanged source
    Examples:
      | component       | source_json                                     |
      | element-local   | "<p:1 xmlns:p=\"urn:test\"/>"                   |
      | attribute-local | "<r xmlns:p=\"urn:test\" p:1=\"x\"/>"           |
      | declared-prefix | "<r xmlns:1=\"urn:test\"/>"                     |

  @id-xml-unicode-qname-components
  Scenario: Unicode prefix and local names remain valid
    Given the lexical XML input is JSON "<π:名 xmlns:π=\"urn:unicode\" π:é=\"value\"><π:𐐀/></π:名>"
    When the lexical XML input is parsed without rewriting its source
    Then the root expanded name is urn:unicode/名 and its expanded attribute urn:unicode/é equals JSON "value"
    And its sole child expanded name is urn:unicode/𐐀 with UTF-16 range [39,46) slicing to JSON "<π:𐐀/>"
    And the root UTF-16 range is [0,52) and the original source is unchanged

  @id-xml-outside-root-nbsp
  Scenario Outline: A non-breaking space <position> the root refuses
    Given the lexical XML input is JSON <source_json>
    When the lexical XML input is parsed without rewriting its source
    Then parsing returns category malformed-xml with no document result and unchanged source
    Examples:
      | position | source_json     |
      | before   | "\u00a0<r/>"   |
      | after    | "<r/>\u00a0"   |
