@planned
Feature: XML parsing and value inspection

  Rule: Strict XML parsing and offset-safe edits
    XML parts are parsed natively with preserved UTF-16 source offsets so OPC code
    can inspect and patch OOXML parts without losing untouched bytes.

    @id-xml-parse-offsets
    Scenario: Parse namespaces, mixed content and preserved offsets
      Given an XML document with a declaration, comments, processing instructions and namespaces
      When the document is parsed
      Then the root element and descendants expose decoded text, decoded attributes and namespace URIs
      And each element exposes UTF-16 source offsets, parent links, child links, root links and self-closing state

    @id-xml-normalise-line-endings
    Scenario: Decode XML line endings without changing source offsets
      Given XML text and attributes containing raw CRLF and character references
      When that XML is parsed without rewriting the source
      Then decoded text normalises raw line endings but preserves referenced carriage returns
      And decoded attributes normalise literal whitespace while preserving referenced whitespace
      And element offsets still address the original source string

    @id-xml-parse-refusals
    Scenario: Refuse malformed or unsafe XML constructs
      Given XML containing a malformed declaration or processing instruction
      And XML containing invalid comment termination or missing attribute whitespace
      And XML containing reserved namespace misuse, a DTD or an undeclared entity
      And XML containing a duplicate attribute, an unbound prefix or a mismatched tag
      When the document is parsed
      Then parsing is refused with a stable XML error code

    @id-xml-parse-bounds
    Scenario: Bound untrusted XML resources
      Given XML whose nesting depth, node count or input length exceeds the configured parser limits
      When the document is parsed
      Then parsing is refused before returning a partial tree

  Rule: XML values, namespace lookup and safe escaping
    XML 1.0 sections 2.6, 2.11, 3.3.3 and 4.6 define processing instructions,
    line endings, attribute normalisation and predefined entities.
    Namespaces in XML defines expanded attribute names and the implicit xml prefix.
    JSON arguments preserve the distinction between literal characters and references.

    @id-xml-entity-values
    Scenario: Decode predefined entities and decimal and hexadecimal references
      Given XML values input encoded as JSON "<r a=\"&quot;&apos;\">&#x41;&#65;&amp;&lt;&gt;</r>"
      When the XML values input is parsed
      Then the root attribute a equals JSON "\"'"
      And the root text equals JSON "AA&<>"

    @id-xml-stylesheet-processing-instruction
    Scenario: Accept a stylesheet processing instruction before the root
      Given XML values input encoded as JSON "<?xml-stylesheet href=\"style.xsl\"?><r/>"
      When the XML values input is parsed
      Then the root qualified name equals r

    @id-xml-expanded-attribute-lookup
    Scenario: Attribute lookup respects local prefix rebinding and unqualified names
      Given XML values input encoded as JSON "<r xmlns=\"urn:default\" xmlns:a=\"urn:a\" xmlns:r=\"urn:a\" id=\"plain\" a:id=\"outer\"><child xmlns:r=\"urn:b\" r:id=\"inner\" xml:lang=\"en\"/><other r:id=\"sibling\"/></r>"
      When the XML values input is parsed
      Then expanded attribute lookups return these JSON values
        | element | local | namespace                                      | value_json |
        | root    | id    |                                                | "plain"    |
        | root    | id    | urn:default                                    | null       |
        | root    | id    | urn:a                                          | "outer"    |
        | child   | id    | urn:b                                          | "inner"    |
        | child   | id    | urn:a                                          | null       |
        | other   | id    | urn:a                                          | "sibling"  |
        | child   | lang  | http://www.w3.org/XML/1998/namespace             | "en"       |

    @id-xml-implicit-xml-prefix
    Scenario: The xml prefix is bound without a namespace declaration
      Given XML values input encoded as JSON "<r xml:lang=\"en\"/>"
      When the XML values input is parsed
      Then the root namespace URI equals JSON ""
      And the root attribute xml:lang equals JSON "en"
      And the implicit xml namespace URI is http://www.w3.org/XML/1998/namespace

    @profile-javascript-xml-model @id-xml-prototype-safe-attributes
    Scenario: XML attribute names cannot set an object's prototype
      Given XML values input encoded as JSON "<r __proto__=\"polluted\" constructor=\"safe\"/>"
      When the XML values input is parsed
      Then the root attribute map has a null prototype
      And __proto__ is an own attribute with value polluted
      And constructor is an own attribute with value safe

    @profile-javascript-xml-model @id-xml-immutable-namespace-metadata
    Scenario: Attribute namespace metadata is detached from JavaScript prototypes
      Given XML values input encoded as JSON "<r xmlns:a=\"urn:a\" a:id=\"outer\"/>"
      When the XML values input is parsed
      Then the namespace recorded for a:id is urn:a
      And the attribute namespace map is frozen and has a null prototype

    @profile-bun-xml-escaping @id-xml-escaping-values
    Scenario Outline: Escape <context> content without changing its value
      Given an XML escaping value encoded as JSON <input_json>
      When the value is escaped for XML <context> content
      Then the escaped string equals JSON <escaped_json>
      Examples:
        | context   | input_json | escaped_json                         |
        | text      | "5 < 7 & 9 > 4" | "5 &lt; 7 &amp; 9 &gt; 4"       |
        | attribute | "'\"<&>" | "&apos;&quot;&lt;&amp;&gt;"         |

    @id-xml-escaping-invalid-character
    Scenario: Refuse an invalid XML character rather than emit it
      Given an XML escaping value encoded as JSON "\u0001"
      When the value is escaped for XML text content
      Then escaping refuses the invalid XML character

    @id-xml-escaping-whitespace-roundtrip
    Scenario: Escaped whitespace survives text and attribute parsing
      Given an XML escaping value encoded as JSON "x\r\n\ty"
      When the value is escaped separately as text and as an attribute and both are parsed
      Then the decoded text and attribute both equal JSON "x\r\n\ty"

    @profile-bun-xml-errors @id-xml-typed-parse-error
    Scenario: Malformed XML returns the documented error type
      Given XML values input encoded as JSON "<a></b>"
      When the XML values input is parsed
      Then parsing throws an OoxmlError instance
