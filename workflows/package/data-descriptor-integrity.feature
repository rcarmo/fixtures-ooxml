@planned
Feature: ZIP data-descriptor integrity with ambiguous signature bytes
  ZIP descriptor shape comes from its physical extent. A CRC32 value whose bytes
  equal the optional descriptor signature does not itself add a signature field.
  This malformed-payload profile is separate from the valid ZIP32 read and
  generic CRC-refusal cases in zip32.feature.

  @id-zip-unsigned-descriptor-signature-collision
  Scenario: Unsigned descriptor geometry cannot excuse a corrupted payload
    Given a single-disk ZIP32 archive has one DEFLATED data.bin member with declared size 7 and stored payload "payload"
    And its unsigned twelve-byte data descriptor and central directory both declare CRC32 08074B50, equal to the optional descriptor signature value
    And independent CRC32 of the decompressed payload differs from 08074B50
    When ZIP admission validates the descriptor shape and then opens the archive with default bounds
    Then the unsigned descriptor is recognised as twelve bytes without borrowing a four-byte signature or central-directory bytes
    And complete admission refuses the corrupt payload as a CRC or invalid-package failure, not as an ambiguous descriptor-shape failure
    And no package or member payloads are delivered
    And the caller's original archive bytes remain unchanged
