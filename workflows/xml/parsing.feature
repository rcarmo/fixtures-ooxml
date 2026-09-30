@planned
Feature: XML parsing and value inspection

  Rule: Strict XML parsing and offset-safe edits
    XML parts are parsed natively with preserved UTF-16 source offsets so OPC code
    can inspect and patch OOXML parts without losing untouched bytes.

    @id-xml-parse-offsets
    Scenario: Parse namespaces, mixed content and preserved offsets
      Given the lexical XML input is JSON "<?xml version=\"1.0\"?><!--😀--><?pi ok?><p:r xmlns=\"urn:default\" xmlns:p=\"urn:p\" xmlns:x=\"urn:x\" a=\"1 &amp; 2\">pre😀<x:c x:b=\"v\"/>mid<![CDATA[<tail>]]></p:r><!--after-->"
      When the lexical XML input is parsed without rewriting its source
      Then exactly two elements expose these decoded values and UTF-16 half-open offsets
        | element | qualified_name | local_name | namespace_uri | text_json          | start | open_end | close_start | end | self_closing |
        | root    | p:r            | r          | urn:p         | "pre😀mid<tail>"   | 39    | 110      | 150         | 156 | false        |
        | child   | x:c            | c          | urn:x         | ""                 | 115   | 129      | 129         | 129 | true         |
      And the root attribute a equals JSON "1 & 2" and the child expanded attribute urn:x/b equals JSON "v"
      And the root has no parent, its sole child links back to it, and both root links identify that same root
      And slicing the original source at each returned range yields its exact element markup and the source is unchanged

    @id-xml-normalise-line-endings
    Scenario: Decode XML line endings without changing source offsets
      Given the lexical XML input is JSON "<!--😀--><r a=\"x\r\ny\tz&#xD;&#xA;&#x9;\">u\r\nv\rw&#xD;<![CDATA[c\r\nd]]><s/></r>"
      When the lexical XML input is parsed without rewriting its source
      Then the root decoded text equals JSON "u\nv\nw\rc\nd"
      And the root attribute a equals JSON "x y z\r\n\t"
      And the child s range is UTF-16 [65,69) and slices the original source to JSON "<s/>"
      And the original source including its raw line endings is unchanged

    @id-xml-parse-refusals
    Scenario: Refuse malformed or unsafe XML constructs
      Given these exact XML refusal inputs and documented categories
        | variant                    | source_json                                                     | category             |
        | declaration extra          | "<?xml version=\"1.0\" extra=\"x\"?><r/>"                  | malformed-xml        |
        | invalid standalone         | "<?xml version=\"1.0\" standalone=\"maybe\"?><r/>"          | malformed-xml        |
        | processing instruction     | "<?pi/?><r/>"                                                  | malformed-xml        |
        | comment interior           | "<r><!-- bad -- --></r>"                                        | malformed-xml        |
        | comment termination        | "<r><!--bad---></r>"                                            | malformed-xml        |
        | attribute whitespace       | "<r a='1'b='2'/>"                                              | malformed-xml        |
        | reserved element prefix    | "<xmlns:r/>"                                                   | malformed-xml        |
        | reserved default namespace | "<r xmlns=\"http://www.w3.org/XML/1998/namespace\"/>"          | malformed-xml        |
        | DTD                        | "<!DOCTYPE r><r/>"                                             | dtd-forbidden        |
        | undeclared entity          | "<r>&custom;</r>"                                               | entity-forbidden     |
        | lexical duplicate          | "<r a='1' a='2'/>"                                              | duplicate-attribute  |
        | expanded duplicate         | "<r xmlns:x=\"u\" xmlns:y=\"u\" x:a=\"1\" y:a=\"2\"/>" | duplicate-attribute  |
        | unbound prefix             | "<x:r/>"                                                       | unbound-prefix       |
        | mismatched tag             | "<a></b>"                                                      | mismatched-tag       |
        | invalid character          | "<r>\u0001</r>"                                                | invalid-character    |
      When every refusal input is parsed through the production lexical XML API
      Then every input returns its documented category with no document result
      And every original source remains unchanged

    @id-xml-parse-bounds
    Scenario: Bound untrusted XML resources
      Given XML parser limits maxDepth 4, maxNodes 6 and maxSourceUnits 64 measured in UTF-16 units
      And these exact XML resource-limit recipes
        | recipe                                     | category        |
        | five nested n elements                     | depth-limit     |
        | root r with six self-closing n children     | node-limit      |
        | root r containing fifty-eight x characters | input-too-large |
      When every recipe is parsed through the production lexical XML API with those limits
      Then every recipe returns its documented category with no partial document
      And independent depth-four, six-node and sixty-four-source-unit controls each parse successfully
      And every original source remains unchanged

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

    @profile-xml-model-safety @id-xml-prototype-safe-attributes
    Scenario: Special-looking attribute names remain ordinary XML data
      Given XML values input encoded as JSON "<r __proto__=\"polluted\" constructor=\"safe\"/>"
      When the XML values input is parsed
      Then the root attributes are exactly __proto__=polluted and constructor=safe
      And the root remains r with no text and no children
      And fresh attribute reads and the original XML source are unchanged

    @profile-xml-model-safety @id-xml-immutable-namespace-metadata
    Scenario: Returned namespace metadata cannot corrupt the parsed XML model
      Given XML values input encoded as JSON "<r xmlns:a=\"urn:a\" a:id=\"outer\"/>"
      When the XML values input is parsed
      Then the namespace recorded for a:id is urn:a
      When changing a returned namespace snapshot to urn:changed and deleting a:id are attempted
      Then fresh namespace and attribute reads still return urn:a and outer
      And the parsed root structure and original XML source are unchanged

    @profile-xml-escaping-api @id-xml-escaping-values
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

    @profile-xml-failure-category @id-xml-typed-parse-error
    Scenario: Malformed XML returns a documented failure category without a partial document
      Given XML values input encoded as JSON "<a></b>"
      When the XML values input is parsed
      Then parsing fails with category malformed-xml and no document result
      And the original XML source is unchanged
