@planned
Feature: ZIP32 reading, writing and bounded admission

  Rule: Strict ZIP custody for OPC packages
    The shared ZIP layer reads OOXML package archives only when they have one
    unambiguous ZIP32 interpretation and stay within bounded resources.
    @id-zip-read-valid
    Scenario: Read a valid ZIP32 archive with stored, deflated, and directory entries
      Given a ZIP archive with canonical OPC member names
      And the archive contains stored and deflated file entries
      And the archive may contain zero-byte directory entries and a declared archive comment
      When the archive is read through the shared ZIP module
      Then file entries are returned in central-directory order
      And directory entries do not become package parts
      And each returned payload matches its declared CRC and size

    @id-zip-refuse-unsafe
    Scenario: Refuse ambiguous or unsafe ZIP structure
      Given a ZIP archive whose structure has no single safe reading
      When the archive is read through the shared ZIP module
      Then the module refuses duplicate member names
      And the module refuses ASCII case-colliding member names
      And the module refuses noncanonical member paths
      And the module refuses encrypted or unsupported-compression members
      And the module refuses multi-disk archives and ZIP64 sentinels without valid end records
      And the module refuses local-header metadata that disagrees with the central directory
      And the module refuses CRC failures, size mismatches, and undeclared trailing structure

    @id-zip-bounds
    Scenario: Refuse archives that exceed configured bounds before expansion
      Given a ZIP archive whose declared archive size, entry count, entry size, total expanded size, or compression ratio exceeds the configured limit
      When the archive is read through the shared ZIP module
      Then the module refuses before allocating unbounded output

    @id-zip-write-deterministic
    Scenario: Write deterministic UTF-8 ZIP32 output
      Given a map of canonical OPC member names and bytes
      When the map is written through the shared ZIP module twice
      Then both outputs are byte-identical ZIP32 archives
      And file entries use stored or deflated encoding
      And names are emitted with the UTF-8 ZIP flag
      And writer input that would collide by ASCII case is refused

  Rule: ZIP32 checksums and typed refusal policy
    Exact OoxmlError, code/message strings and resource-option names belong to
    the ZIP32 error API profile. They are compatibility policies, not ZIP format
    requirements. CRC32 uses the standard check vector without an API profile.
    Valid reading and deterministic writing use the existing ZIP32 workflow.
    Unless overridden, reader samples use UTF-8 names, raw DEFLATE and one disk.
    CRCs, sizes, offsets and directory records agree except for the named mutation.
    JSON payload strings are encoded as UTF-8 before building the archive.
    @id-zip-crc32-standard-vector
    Scenario: CRC32 matches the standard check value
      Given checksum input is the UTF-8 string "123456789"
      When its ZIP CRC32 is calculated
      Then the unsigned checksum equals hexadecimal CBF43926

    @profile-zip32-error-api @id-bun-zip32-reader-refusal
    Scenario Outline: Refuse <variant> with the documented error
      Given a ZIP32 reader sample with these ordered member and payload pairs encoded as JSON <entries_json>
      And the sample has the mutation <mutation>
      When the ZIP reader reads the sample with default limits
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

    @profile-zip32-error-api @id-bun-zip32-writer-refusal
    Scenario Outline: Refuse <variant> before returning an archive
      Given ordered writer entries are encoded as JSON <entries_json>
      When the ZIP writer writes the entries with default options
      Then it throws an OoxmlError with code <code>
      And the error message contains <message>
      Examples:
        | variant                   | entries_json                                              | code                        | message             |
        | ASCII case collision      | [["word/document.xml","one"],["WORD/document.xml","two"]] | zip-case-collision          | ASCII case-collides |
        | non-empty directory entry | [["word/","not empty"]]                                  | zip-directory-entry-invalid | must be empty       |

    @profile-zip32-error-api @id-bun-zip32-configured-bounds
    Scenario Outline: Refuse the configured <limit> threshold
      Given a raw-DEFLATE ZIP32 archive contains a.bin with 4096 A bytes followed by b.bin with two b bytes
      When the ZIP reader reads the archive with only <limit> set to <value>
      Then it throws an OoxmlError with code <code>
      And the error message contains <message>
      Examples:
        | limit               | value                      | code                           | message         |
        | maxArchiveBytes     | archive byte length minus 1 | zip-archive-too-large          | archive bytes   |
        | maxEntries          | 1                           | zip-too-many-entries           | entry limit     |
        | maxEntryBytes       | 8                           | zip-entry-too-large            | entry limit     |
        | maxTotalBytes       | 8                           | zip-total-too-large            | total expanded  |
        | maxCompressionRatio | 2                           | zip-compression-ratio-exceeded | compression ratio |
