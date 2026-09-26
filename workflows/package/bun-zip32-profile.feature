@planned @profile-bun-zip32
Feature: Bun ZIP32 checksums and typed refusal policy
  These examples define the Bun ZIP API's error and resource policies.
  Valid reading and deterministic writing use the existing ZIP32 workflow.
  Unless overridden, reader samples use UTF-8 names, raw DEFLATE and one disk.
  CRCs, sizes, offsets and directory records agree except for the named mutation.
  JSON payload strings are encoded as UTF-8 before building the archive.

  @id-zip-crc32-standard-vector
  Scenario: CRC32 matches the standard check value
    Given checksum input is the UTF-8 string "123456789"
    When its ZIP CRC32 is calculated
    Then the unsigned checksum equals hexadecimal CBF43926

  @id-bun-zip32-reader-refusal
  Scenario Outline: Refuse <variant> with the documented error
    Given a ZIP32 reader sample with these ordered member and payload pairs encoded as JSON <entries_json>
    And the sample has the mutation <mutation>
    When Bun readZip reads the sample with default limits
    Then it throws an OoxmlError with code <code>
    And the error message contains <message>
    Examples:
      | variant                  | entries_json                                                        | mutation                                                    | code                        | message                  |
      | duplicate names          | [["word/document.xml","one"],["word/document.xml","two"]]           | none                                                        | zip-duplicate-entry         | duplicate ZIP member     |
      | ASCII case collision     | [["word/document.xml","one"],["WORD/document.xml","two"]]           | none                                                        | zip-case-collision          | ASCII case-collides      |
      | parent traversal         | [["../word/document.xml","bad"]]                                    | none                                                        | zip-name-invalid            | noncanonical             |
      | encryption flag          | [["word/document.xml","secret"]]                                    | general-purpose bit 0 is set in both headers                 | zip-encryption-unsupported  | encrypted                |
      | unsupported method       | [["word/document.xml","x"]]                                         | both methods are 12 and payload bytes are stored uncompressed | zip-method-unsupported      | compression method       |
      | multiple disks           | [["word/document.xml","x"]]                                         | end record disk number is 1                                 | zip-multi-disk-unsupported   | multi-disk               |
      | missing ZIP64 records    | [["word/document.xml","x"]]                                         | both end-record counts are 65535 without ZIP64 records       | zip-structure-invalid       | ZIP64                    |
      | local name mismatch      | [["word/document.xml","x"]]                                         | local name is word/other.xml                                | zip-local-metadata-mismatch | local and central        |
      | CRC mismatch             | [["word/document.xml","payload"]]                                   | both CRC fields are hexadecimal DEADBEEF                     | zip-crc-mismatch            | CRC                      |
      | stored size mismatch     | [["word/document.xml","payload"]]                                   | method is STORED and all size fields are 99                  | zip-size-mismatch           | declared size            |
      | deflate size overrun     | [["word/document.xml","A"]]                                         | payload repeats A 4096 times but both expanded sizes are 32  | zip-size-mismatch           | declared size            |
      | undeclared trailing byte | [["word/document.xml","x"]]                                         | a newline byte follows the complete uncommented archive     | zip-end-record-missing      | end-of-central-directory |

  @id-bun-zip32-writer-refusal
  Scenario Outline: Refuse <variant> before returning an archive
    Given ordered writer entries are encoded as JSON <entries_json>
    When Bun writeZip writes the entries with default options
    Then it throws an OoxmlError with code <code>
    And the error message contains <message>
    Examples:
      | variant                   | entries_json                                              | code                        | message             |
      | ASCII case collision      | [["word/document.xml","one"],["WORD/document.xml","two"]] | zip-case-collision          | ASCII case-collides |
      | non-empty directory entry | [["word/","not empty"]]                                  | zip-directory-entry-invalid | must be empty       |

  @id-bun-zip32-configured-bounds
  Scenario Outline: Refuse the configured <limit> threshold
    Given a raw-DEFLATE ZIP32 archive contains a.bin with 4096 A bytes followed by b.bin with two b bytes
    When Bun readZip reads the archive with only <limit> set to <value>
    Then it throws an OoxmlError with code <code>
    And the error message contains <message>
    Examples:
      | limit               | value                      | code                           | message         |
      | maxArchiveBytes     | archive byte length minus 1 | zip-archive-too-large          | archive bytes   |
      | maxEntries          | 1                           | zip-too-many-entries           | entry limit     |
      | maxEntryBytes       | 8                           | zip-entry-too-large            | entry limit     |
      | maxTotalBytes       | 8                           | zip-total-too-large            | total expanded  |
      | maxCompressionRatio | 2                           | zip-compression-ratio-exceeded | compression ratio |
