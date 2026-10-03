@planned @local-candidate
Feature: Append embedded PowerPoint pictures with exact payload and placement
  Graphics item 2. Recipes: ledgers/pptx-picture-insertion.json.
  Contract: contracts/pptx-picture-insertion.md. All consumers remain planned.

  @id-pptx-graphics-picture-insertion-add
  Scenario Outline: Append an embedded image
    Given shared picture insertion recipe for <kind>
    When an embedded picture is appended at the recipe EMU rectangle
    Then its identity, name, description, relationship, content type and placement match the literal record
    And the media payload exactly matches the source fixture member
    And save and reopen preserve the record and all unrelated member payloads
    Examples:
      | kind |
      | PNG  |
      | JPEG |

  @id-pptx-graphics-picture-insertion-repeat
  Scenario: Allocate independent identities and media for repeated insertion
    Given shared picture insertion recipe "repeat-png"
    When the same payload is appended twice at the recipe EMU rectangle
    Then both identities and relationships match the two literal records
    And both media members retain the exact source payload without deduplication
    And save and reopen preserve all preexisting shapes and unrelated member payloads

  @id-pptx-graphics-picture-insertion-collision
  Scenario: Preserve case-insensitive orphan media collisions
    Given shared picture insertion recipe "orphan-collision"
    When an embedded picture is appended at the recipe EMU rectangle
    Then its allocated identity and media part match the literal record
    And the existing orphan member and original media members remain unchanged
    And save and reopen preserve the record and all unrelated member payloads

  @id-pptx-graphics-picture-insertion-content-types
  Scenario: Preserve a conflicting default MIME declaration
    Given shared picture insertion recipe "conflicting-MIME"
    When an embedded picture is appended at the recipe EMU rectangle
    Then its specific image MIME override matches the literal record
    And the conflicting default declaration and original media remain unchanged
    And save and reopen retain the new exact media payload and placement

  @id-pptx-graphics-picture-insertion-extension
  Scenario: Append before an unknown terminal shape-tree extension
    Given shared picture insertion recipe "terminal-extension"
    When an embedded picture is appended at the recipe EMU rectangle
    Then its allocated identity and placement match the literal record
    And the new picture precedes the terminal extension with every original shape unchanged
    And save and reopen retain the complete unknown extension payload

  @id-pptx-graphics-picture-insertion-refusals
  Scenario Outline: Refuse an invalid insertion atomically
    Given shared picture insertion refusal recipe with fault <fault>
    When an embedded picture insertion is attempted
    Then the semantic error code matches the recipe and no receipt is returned
    And the complete member set and every payload remain unchanged
    And existing slide handles remain usable
    Examples:
      | fault                      |
      | empty payload              |
      | MIME mismatch              |
      | unsupported MIME           |
      | fractional position        |
      | zero extent                |
      | out of range position      |
      | unknown option             |
      | invalid XML name           |
      | duplicate identity         |
      | nonidentity root transform |
      | protected presentation     |
      | exhausted identity         |
