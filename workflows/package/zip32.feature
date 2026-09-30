@planned
Feature: ZIP32 reading, writing and bounded admission

  Rule: Strict ZIP custody for OPC packages
    The shared ZIP layer reads OOXML package archives only when they have one
    unambiguous ZIP32 interpretation and stay within bounded resources.
    @id-zip-read-valid
    Scenario: Read a valid ZIP32 archive with stored, deflated, and directory entries
      Given a single-disk UTF-8 ZIP32 archive has these central-directory ordered members and no data descriptors
        | member | method   | payload_json |
        | z.bin  | STORED   | "z-last"     |
        | dir/   | STORED   | ""           |
        | a.xml  | DEFLATED | "<a/>"       |
        | m.bin  | STORED   | "middle"     |
      And its declared archive comment is JSON "kept as declared ZIP comment" and all CRC32 and sizes agree with the exact UTF-8 payloads
      When the production ZIP reader reads the archive with default limits
      Then returned file names are exactly ["z.bin","a.xml","m.bin"] in central-directory order and dir/ is absent
      And the three returned payloads equal their declared strings with lengths 6, 4 and 6 and matching independent CRC32 values
      And the caller's source archive bytes remain unchanged

    @id-zip-refuse-unsafe
    Scenario: Refuse ambiguous or unsafe ZIP structure
      Given the eleven strict ZIP32 unsafe-structure recipes duplicate, case-collision, traversal, encryption, method, multi-disk, missing-ZIP64, local-name, CRC, stored-size and trailing-byte
      When the production ZIP reader checks every recipe with default limits
      Then each recipe refuses with its exact documented zip reason and no member result
      And duplicate and case-collision refuse as zip-duplicate-entry and zip-case-collision
      And traversal refuses as zip-name-invalid
      And encryption and method refuse as zip-encryption-unsupported and zip-method-unsupported
      And multi-disk and missing-ZIP64 refuse as zip-multi-disk-unsupported and zip-structure-invalid
      And local-name refuses as zip-local-metadata-mismatch
      And CRC, stored-size and trailing-byte refuse as zip-crc-mismatch, zip-size-mismatch and zip-end-record-missing with every caller archive unchanged

    @id-zip-bounds
    Scenario: Refuse archives that exceed configured bounds before expansion
      Given a raw-DEFLATE ZIP32 budget archive contains a.bin with 4096 A bytes followed by b.bin with two b bytes
      And a sibling archive retains that declared geometry but replaces the compressed a.bin body with eight FF bytes
      When each archive is read separately with one limit maxArchiveBytes length-minus-one, maxEntries 1, maxEntryBytes 8, maxTotalBytes 8 or maxCompressionRatio 2
      Then both archives refuse the same respective reasons zip-archive-too-large, zip-too-many-entries, zip-entry-too-large, zip-total-too-large and zip-compression-ratio-exceeded before member output
      And default reading of the valid archive returns the two exact payloads and default reading of the invalid-DEFLATE sibling refuses a payload error
      And every caller archive remains unchanged

    @id-zip-write-deterministic
    Scenario: Write deterministic UTF-8 ZIP32 output
      Given ordered ZIP writer members are [Content_Types].xml with UTF-8 JSON "<Types/>", custom/data.bin with bytes 00 through FF and word/document.xml with UTF-8 <w:document> followed by 2048 A characters and </w:document>
      When the production ZIP writer writes the same members twice using its deterministic ZIP32 profile
      Then both outputs are byte-identical ZIP32 archives and reopen with the three exact member names and payloads
      And every file uses STORED or DEFLATED encoding and this input emits at least one of each method
      And every local and central member name uses the UTF-8 ZIP flag
      And an independent writer input word/document.xml=one and WORD/document.xml=two refuses as zip-case-collision with no archive and unchanged caller members

  Rule: ZIP32 checksums and structured refusal policy
    Machine-readable refusal reasons and resource semantics belong to the shared
    ZIP32 admission profile. Bindings map the named limits to native options;
    exception class names, diagnostic wording and native option spellings vary. CRC32 uses the standard check vector without an API profile.
    Valid reading and deterministic writing use the existing ZIP32 workflow.
    Unless overridden, reader samples use UTF-8 names, raw DEFLATE and one disk.
    CRCs, sizes, offsets and directory records agree except for the named mutation.
    JSON payload strings are encoded as UTF-8 before building the archive.
    @id-zip-crc32-standard-vector
    Scenario: CRC32 matches the standard check value
      Given checksum input is the UTF-8 string "123456789"
      When its ZIP CRC32 is calculated
      Then the unsigned checksum equals hexadecimal CBF43926

    @profile-zip32-refusal-reasons @id-bun-zip32-reader-refusal
    Scenario Outline: Refuse <variant> with its structured ZIP32 reason
      Given a ZIP32 reader sample with these ordered member and payload pairs encoded as JSON <entries_json>
      And the sample has the mutation <mutation>
      When the ZIP reader reads the sample with default limits
      Then reading refuses with reason <code> and no member payload result
      And the caller's original archive bytes remain unchanged
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

    @profile-zip32-refusal-reasons @id-bun-zip32-writer-refusal
    Scenario Outline: Refuse <variant> before returning an archive
      Given ordered writer entries are encoded as JSON <entries_json>
      When the ZIP writer writes the entries with default options
      Then writing refuses with reason <code> and no archive result
      And the ordered caller entry names and payload bytes remain unchanged
      Examples:
        | variant                   | entries_json                                              | code                        | message             |
        | ASCII case collision      | [["word/document.xml","one"],["WORD/document.xml","two"]] | zip-case-collision          | ASCII case-collides |
        | non-empty directory entry | [["word/","not empty"]]                                  | zip-directory-entry-invalid | must be empty       |

    @profile-zip32-refusal-reasons @id-bun-zip32-configured-bounds
    Scenario Outline: Refuse the configured <limit> threshold
      Given a raw-DEFLATE ZIP32 archive contains a.bin with 4096 A bytes followed by b.bin with two b bytes
      When the ZIP reader reads the archive with only <limit> set to <value>
      Then reading refuses with reason <code> and no member payload result
      And the caller's original archive bytes remain unchanged
      Examples:
        | limit               | value                      | code                           | message         |
        | maxArchiveBytes     | archive byte length minus 1 | zip-archive-too-large          | archive bytes   |
        | maxEntries          | 1                           | zip-too-many-entries           | entry limit     |
        | maxEntryBytes       | 8                           | zip-entry-too-large            | entry limit     |
        | maxTotalBytes       | 8                           | zip-total-too-large            | total expanded  |
        | maxCompressionRatio | 2                           | zip-compression-ratio-exceeded | compression ratio |
