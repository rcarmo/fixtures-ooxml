@planned
Feature: Package relationship graph editing and payload differences

  Rule: OPC graph edits retain package custody
    Part and relationship edits validate before commit and never discard unrelated members.

    @id-opc-add-related-part
    Scenario: Add an opaque part with an exact content type and relationship
      Given graph fixture fixture-535910216e3531e4f70959cccf83038f1c51febbf4a149f9f46abfbfa8667d90 is opened through the production package editor
      When custom/data.bin with hexadecimal payload 070809 and type application/octet-stream is added with internal root relationship rIdData of type urn:test/data
      Then saving and reopening returns custom/data.bin with exact payload 070809, effective type application/octet-stream and root edge rIdData resolving to custom/data.bin
      And every original member except [Content_Types].xml and _rels/.rels retains its exact payload and no other member is added or removed

    @id-opc-graph-rollback
    Scenario: A referenced part cannot be removed alone
      Given graph fixture fixture-535910216e3531e4f70959cccf83038f1c51febbf4a149f9f46abfbfa8667d90 has custom/data.bin payload 070809 with type application/octet-stream and internal root edge rIdData of type urn:test/data
      When removal of custom/data.bin is attempted without detaching rIdData
      Then graph editing refuses with code "opc-part-referenced" and no successful edit result
      And the whole current archive and every current part remain exactly unchanged after the refusal

    @id-opc-remove-related-part
    Scenario: Explicitly detach then remove an opaque part
      Given graph fixture fixture-535910216e3531e4f70959cccf83038f1c51febbf4a149f9f46abfbfa8667d90 has custom/data.bin payload 070809 with type application/octet-stream and internal root edge rIdData of type urn:test/data
      When root relationship rIdData is explicitly detached and custom/data.bin is removed
      Then saving and reopening has no custom/data.bin, no /custom/data.bin content-type override and no rIdData root edge
      And every retained internal relationship target resolves and every original non-registry member retains its exact payload

    @id-opc-diff-content-type
    Scenario: A type-only change appears in the package diff
      Given graph fixture fixture-535910216e3531e4f70959cccf83038f1c51febbf4a149f9f46abfbfa8667d90 is opened twice as independent package snapshots
      When only the effective content type of word/document.xml in the second snapshot is set to application/vnd.test.document+xml
      Then the production payload-and-content-type diff reports changed members ["[Content_Types].xml","word/document.xml"] and no added or removed members
      And word/document.xml retains identical payload bytes and its original MIME changes to application/vnd.test.document+xml
      And all unrelated payloads, the first snapshot and caller input bytes remain unchanged
