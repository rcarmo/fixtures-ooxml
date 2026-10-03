@planned @local-candidate
Feature: Replace one embedded picture without editing shared media
  Graphics item 3. Recipes: ledgers/pptx-picture-replacement.json.
  Contract: contracts/pptx-picture-replacement.md. All consumers remain planned.

  @id-pptx-graphics-picture-replacement-replace
  Scenario Outline: Replace an embedded payload while retaining picture properties
    Given shared picture replacement recipe for <kind>
    When picture 1026 receives the replacement payload
    Then the allocated media and relationship match the literal receipt
    And only that picture's embedded relationship value changes in slide XML
    And names, crop, transforms, effects, descriptions and ordering remain literal
    And save and reopen retain the new exact payload and every original media member
    Examples:
      | kind |
      | PNG  |
      | JPEG |

  @id-pptx-graphics-picture-replacement-isolation
  Scenario Outline: Isolate replacement from another picture sharing its dependency
    Given shared picture replacement isolation recipe for <kind>
    When picture 1026 receives the replacement payload
    Then picture 1028 retains its original relationship value and payload
    And every original relationship and media member stays unchanged
    And save and reopen retain the new exact payload and all picture properties
    Examples:
      | kind                |
      | shared relationship |
      | shared media        |

  @id-pptx-graphics-picture-replacement-prefix
  Scenario: Preserve lexical relationship attribute spelling
    Given shared picture replacement recipe "aliased-prefix"
    When picture 1026 receives the replacement payload
    Then only its expanded-name embed value changes with prefix whitespace and quotes preserved
    And save and reopen retain exact placement and all other slide XML

  @id-pptx-graphics-picture-replacement-grouped
  Scenario: Replace a grouped picture without changing coordinate mapping
    Given shared picture replacement recipe "grouped"
    When picture 1026 receives the replacement payload
    Then group ancestry, local transforms and every other picture property remain unchanged
    And save and reopen retain the new exact payload and the literal group XML

  @id-pptx-graphics-picture-replacement-refusals
  Scenario Outline: Refuse a missing or unsupported replacement target atomically
    Given shared picture replacement refusal recipe with fault <fault>
    When picture replacement is attempted
    Then the semantic error code matches the recipe and no receipt is returned
    And the complete member set, payloads and slide handle version remain unchanged
    Examples:
      | fault                  |
      | missing picture        |
      | nonpicture identity    |
      | linked picture         |
      | dual image assets      |
      | duplicate identity     |
      | MIME mismatch          |
      | protected presentation |
      | paired image extension |
