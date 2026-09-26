@planned
Feature: XML parsing, values and source-preserving edits

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

    @id-xml-apply-edits
    Scenario: Apply only disjoint edits that preserve full-document safety
      Given a well-formed XML document and source offsets for text or element content
      When disjoint edits are applied with escaped replacement text or XML fragments
      Then the resulting XML stays well formed and DTD free
      But overlapping edits or edits that leave malformed or DTD-bearing XML are refused before returning changed text

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

  Rule: Go lexical XML edits preserve untouched source and refuse ambiguous targets
    Parsing, QName, line-ending and value-escaping operations have separate workflows.
    @id-xml-go-attribute-splice-custody
    Scenario Outline: Update one attribute without reserialising its neighbours
      Given the XML source is <source>
      When a Go lexical edit sets the attribute <name> of the first t element to <value>
      Then the complete output bytes equal <output>
      Examples:
        | name   | value | source                                                   | output                                                           |
        | a      | x'y&z | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r> | <r xmlns:p="urn:p"><t a = 'x&#39;y&amp;z' p:n="old"/><t>text</t></r> |
        | p:n    | new   | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r> | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="new"/><t>text</t></r>    |
        | fresh  | value | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r> | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old" fresh="value"/><t>text</t></r> |

    @id-xml-go-attribute-batch-refusal
    Scenario: Duplicate edits to one attribute refuse the batch
      Given the XML source is <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r>
      When one Go lexical edit batch sets a of the first t element to x and to y
      Then the edit returns an error instead of accepting that batch

    @id-xml-go-child-insertion-custody
    Scenario: Insert a child with independently scoped element and attribute names
      Given the XML source is <root xmlns="u" xmlns:n1="occupied"><a/><b>keep</b></root>
      When a Go structured edit inserts a new-namespace x child with an other-namespace a attribute and a plain text child under the existing a element
      Then reparsing finds expanded element names new/x and empty-namespace plain
      And the unedited sibling bytes <b>keep</b> remain in the output

    @id-xml-go-child-insertion-refusal
    Scenario: Overlapping insertion targets refuse and a separate no-op preserves bytes
      Given the XML source is <root xmlns="u" xmlns:n1="occupied"><a/><b>keep</b></root>
      When one Go structured insertion batch targets both the root and its nested a element
      Then the insertion returns an error
      But a separate empty insertion batch returns the exact original source bytes

    @id-xml-go-child-namespace-matrix
    Scenario: Inserted element and attribute meanings survive a bounded namespace matrix
      Given these four XML root sources, each interpreted as a JSON string
        | source_json                                                    |
        | "<r/>"                                                        |
        | "<r xmlns=\"u\"/>"                                           |
        | "<p:r xmlns:p=\"u\"/>"                                       |
        | "<r xmlns=\"u\" xmlns:n1=\"v\" xmlns:n2=\"occupied\"/>"  |
      And these five namespace URI choices independently for each child element and flag attribute
        | namespace_uri                            |
        |                                          |
        | u                                        |
        | v                                        |
        | fresh                                    |
        | http://www.w3.org/XML/1998/namespace     |
      When Go inserts child with a flag attribute of JSON value "\t\r\n & 😀" and a plain grandchild of JSON text "x\ry\nz" for all 4 by 5 by 5 choices
      Then reparsing preserves the root child and grandchild expanded names and the child attribute name and value for every choice
      And the grandchild text equals JSON "x\ry\nz" for every choice
      And a separate empty edit returns each exact original root source

    @id-xml-go-element-removal-custody
    Scenario: Remove two disjoint children without rewriting a comment or gap
      Given the XML source is <r xmlns:p="u"><!--keep--><p:a x = '1'><p:b>text</p:b></p:a> gap <p:c /></r>
      When Go removes the p:a subtree and the p:c element from one parsed snapshot
      Then the complete output bytes equal <r xmlns:p="u"><!--keep--> gap </r>
      And a separate empty removal returns the exact original source bytes

    @id-xml-go-element-removal-refusal
    Scenario Outline: A <selection> removal refuses
      Given the XML source is <r xmlns:p="u"><!--keep--><p:a x = '1'><p:b>text</p:b></p:a> gap <p:c /></r>
      When a Go removal batch selects <selection>
      Then the removal returns an error
      Examples:
        | selection                  |
        | root                       |
        | p:a and its nested p:b     |

    @id-xml-go-element-replacement-custody
    Scenario: Replace one subtree using its surviving parent namespace scope
      Given the XML source is <root xmlns="outer" xmlns:p="bound"><!--a--><p:old xmlns:p="inner" x='1'><p:child/></p:old> tail <last/></root>
      When Go replaces p:old with a bound-namespace new element containing value and an empty-namespace plain element
      Then the complete output bytes equal <root xmlns="outer" xmlns:p="bound"><!--a--><p:new>value</p:new><plain xmlns=""/> tail <last/></root>

    @id-xml-go-element-replacement-refusal
    Scenario Outline: A <selection> subtree replacement refuses without output
      Given the XML source is <root xmlns="outer" xmlns:p="bound"><!--a--><p:old xmlns:p="inner" x='1'><p:child/></p:old> tail <last/></root>
      When a Go replacement batch selects <selection>
      Then replacement returns an error and no edited output
      And a separate empty replacement returns the exact original source bytes
      Examples:
        | selection                    |
        | root                         |
        | p:old twice                  |
        | p:old and its nested p:child |

    @id-xml-go-immutable-leaf-seed
    Scenario: A seeded immutable parse and no-op leave the caller bytes and parsed snapshot intact
      Given the XML source is <r><t>hello</t></r>
      When Go parses a caller-owned byte slice and performs an empty edit
      Then the caller input bytes still equal the original XML source
      And the empty edit returns the exact original source bytes
