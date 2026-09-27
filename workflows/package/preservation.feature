@planned
Feature: OPC package custody, transactions and save destinations

  Rule: OPC package custody and transactional part edits
    The shared OPC layer preserves whole-archive bytes on no-op saves, rolls back
    failed transactional edits, and keeps unrelated payload bytes opaque.
    @id-opc-package-corpus-noop
    Scenario: Opening and reopening the fixture corpora without edits preserves whole archives
      Given the go-ooxml and python-office-mcp-server fixture corpora are enumerated
      When each OOXML fixture package is opened and serialized without edits through the OPC layer
      Then every reopened package matches its original whole-archive bytes
      And both fixture corpora contribute their exact known nonzero fixture counts

    @id-opc-package-transaction-rollback
    Scenario: A failed transactional edit rolls back every changed part
      Given a valid OPC package with XML and opaque payload parts
      When a transactional edit changes multiple parts and then fails
      Then the package reverts to the original bytes and parts after the refusal

    @id-opc-package-preserve-unrelated
    Scenario: Changing one part preserves unrelated payload after reopen
      Given a valid OPC package with a main XML part and an unrelated binary payload
      When the main XML part text is changed and the package is reopened
      Then the edited part contains the new text after reopen
      And the unrelated payload bytes remain unchanged

  Rule: OPC byte custody, transaction callbacks and safe save destinations
    These examples define package API behaviour without asserting Word schema validity.
    The base package has three members, UTF-8 XML declarations and no extra payloads.
    Exact OoxmlError, code and message predicates use the error API profile.
    Async callbacks and thenable identity use a JavaScript-specific transaction
    profile; these are API policies, not general OPC format requirements.
    Background:
      Given a ZIP contains word/document.xml with UTF-8 XML text <?xml version="1.0" encoding="UTF-8"?><document>Alpha</document>
      And its content types use namespace http://schemas.openxmlformats.org/package/2006/content-types
      And its content types have these defaults and overrides
        | kind     | key                | content_type                                                            |
        | Default  | rels               | application/vnd.openxmlformats-package.relationships+xml                 |
        | Default  | xml                | application/xml                                                         |
        | Override | /word/document.xml | application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml |
      And _rels/.rels uses namespace http://schemas.openxmlformats.org/package/2006/relationships
      And its root relationship is rId1 of type http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument targeting word/document.xml

    @profile-ooxml-error-api @id-bun-opc-open-refusal
    Scenario Outline: Reject <variant> with the documented error
      Given the base package has the mutation <mutation>
      When the package editor opens its archive bytes
      Then it throws an OoxmlError with code <code>
      And the error message contains <message>
      Examples:
        | variant               | mutation                                                                   | code                            | message                            |
        | escaped part name     | rename the document, content-type override and relationship target to word/%66oo.xml | opc-part-name-invalid   | Noncanonical part name             |
        | escaped target        | change only the root relationship target to word/%66oo.xml                 | opc-target-invalid              | Percent-encoded                    |
        | duplicate default     | replace the xml default with a second rels default of type application/xml  | opc-content-types-invalid       | Duplicate/missing default extension |
        | missing target        | change only the root relationship target to word/missing.xml               | opc-relationship-target-missing  | Missing target                     |
        | duplicate relation ID | duplicate the complete rId1 root relationship                              | opc-relationship-duplicate       | Duplicate relationship id          |

    @profile-opc-byte-custody @id-bun-opc-detached-byte-copies
    Scenario: Caller and returned byte arrays cannot modify an opened package
      When the package editor opens the base archive bytes
      And every byte in the caller's original archive array is overwritten with zero
      And every byte in the array returned by get for word/document.xml is overwritten with zero
      Then a fresh get of word/document.xml contains the UTF-8 text Alpha
      And serializing the package returns the exact original archive bytes

    @profile-opc-byte-custody @id-bun-opc-preserve-utf16le-edit
    Scenario: Writing edited text preserves the original UTF-16 encoding
      Given word/document.xml instead has a little-endian BOM and UTF-16LE text <?xml version="1.0" encoding="UTF-16"?><document>Alpha</document>
      When the package editor opens the package and sets word/document.xml to its decoded text with Alpha replaced by Beta
      And its serialized archive is read through the ZIP layer
      Then the saved document member starts with hexadecimal bytes FF FE
      And decoding the member as UTF-16LE contains Beta and encoding="UTF-16"

    @profile-javascript-sync-transactions @profile-ooxml-error-api @id-bun-opc-async-transaction-refusal
    Scenario: Async callbacks are rejected before their body runs
      Given the package editor has opened the base archive bytes
      When its transaction is called with an async callback that would replace Alpha with Beta and set a ran flag
      Then it throws an OoxmlError with code opc-async-transaction
      And the error message contains synchronous edits
      And the ran flag is false and the document text still contains Alpha

    @profile-javascript-sync-transactions @id-bun-opc-thenable-transaction-result
    Scenario: A synchronous callback returns its thenable unchanged
      Given the package editor has opened the base archive bytes
      And a thenable object has a then function that throws if invoked
      When a synchronous transaction replaces Alpha with Beta and returns that thenable object
      Then the transaction returns the same object by identity without invoking then
      And the document text contains Beta

    @profile-ooxml-error-api @id-bun-opc-save-invalid-target-custody
    Scenario: A failed validation leaves an existing output file untouched
      Given an existing destination file contains the base package archive bytes
      And the package editor has opened those bytes and deleted word/document.xml
      When the package is saved to the existing destination
      Then it throws an OoxmlError with code opc-relationship-target-missing
      And the error message contains Missing target
      And the destination file bytes equal the original archive bytes

    @profile-ooxml-error-api @id-bun-opc-symlink-destination-refusal
    Scenario: A symlink destination is refused without changing its target
      Given a regular destination file contains the base package archive bytes
      And a symlink points to that file
      And the package editor has opened the base archive bytes
      When the unchanged package is saved through the symlink path
      Then it throws an OoxmlError with code opc-symlink-destination
      And the error message contains Symlink
      And the regular destination file bytes equal the original archive bytes
