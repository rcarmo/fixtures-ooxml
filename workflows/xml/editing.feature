@planned
Feature: XML lexical editing and byte custody

  Rule: Strict XML parsing and offset-safe edits
    XML parts are parsed natively with preserved UTF-16 source offsets so OPC code
    can inspect and patch OOXML parts without losing untouched bytes.

    @id-xml-apply-edits
    Scenario: Apply only disjoint edits that preserve full-document safety
      Given a well-formed XML document and source offsets for text or element content
      When disjoint edits are applied with escaped replacement text or XML fragments
      Then the resulting XML stays well formed and DTD free
      But overlapping edits or edits that leave malformed or DTD-bearing XML are refused before returning changed text

  Rule: Lexical XML edits preserve untouched source and refuse ambiguous targets
    Parsing, QName, line-ending and value-escaping operations have separate workflows.
    Exact quote/escape spellings and snapshot ownership are lexical API policies.
    These edits do not establish package custody, schema validity or rendering.

    @profile-lexical-snapshot-api @id-xml-go-attribute-splice-custody
    Scenario Outline: Update one attribute without reserialising its neighbours
      Given the XML source is <source>
      When a lexical edit sets the attribute <name> of the first t element to <value>
      Then the complete output bytes equal <output>
      Examples:
        | name   | value | source                                                   | output                                                           |
        | a      | x'y&z | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r> | <r xmlns:p="urn:p"><t a = 'x&#39;y&amp;z' p:n="old"/><t>text</t></r> |
        | p:n    | new   | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r> | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="new"/><t>text</t></r>    |
        | fresh  | value | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r> | <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old" fresh="value"/><t>text</t></r> |

    @profile-lexical-snapshot-api @id-xml-go-attribute-batch-refusal
    Scenario: Duplicate edits to one attribute refuse the batch
      Given the XML source is <r xmlns:p="urn:p"><t a = 'a&amp;b' p:n="old"/><t>text</t></r>
      When one lexical edit batch sets a of the first t element to x and to y
      Then the edit returns an error instead of accepting that batch

    @profile-lexical-snapshot-api @id-xml-go-child-insertion-custody
    Scenario: Insert a child with independently scoped element and attribute names
      Given the XML source is <root xmlns="u" xmlns:n1="occupied"><a/><b>keep</b></root>
      When a structured edit inserts a new-namespace x child with an other-namespace a attribute and a plain text child under the existing a element
      Then reparsing finds expanded element names new/x and empty-namespace plain
      And the unedited sibling bytes <b>keep</b> remain in the output

    @profile-lexical-snapshot-api @id-xml-go-child-insertion-refusal
    Scenario: Overlapping insertion targets refuse and a separate no-op preserves bytes
      Given the XML source is <root xmlns="u" xmlns:n1="occupied"><a/><b>keep</b></root>
      When one structured insertion batch targets both the root and its nested a element
      Then the insertion returns an error
      But a separate empty insertion batch returns the exact original source bytes

    @profile-lexical-snapshot-api @id-xml-go-child-namespace-matrix
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
      When the XML editor inserts child with a flag attribute of JSON value "\t\r\n & 😀" and a plain grandchild of JSON text "x\ry\nz" for all 4 by 5 by 5 choices
      Then reparsing preserves the root child and grandchild expanded names and the child attribute name and value for every choice
      And the grandchild text equals JSON "x\ry\nz" for every choice
      And a separate empty edit returns each exact original root source

    @profile-lexical-snapshot-api @id-xml-go-element-removal-custody
    Scenario: Remove two disjoint children without rewriting a comment or gap
      Given the XML source is <r xmlns:p="u"><!--keep--><p:a x = '1'><p:b>text</p:b></p:a> gap <p:c /></r>
      When the XML editor removes the p:a subtree and the p:c element from one parsed snapshot
      Then the complete output bytes equal <r xmlns:p="u"><!--keep--> gap </r>
      And a separate empty removal returns the exact original source bytes

    @profile-lexical-snapshot-api @id-xml-go-element-removal-refusal
    Scenario Outline: A <selection> removal refuses
      Given the XML source is <r xmlns:p="u"><!--keep--><p:a x = '1'><p:b>text</p:b></p:a> gap <p:c /></r>
      When a removal batch selects <selection>
      Then the removal returns an error
      Examples:
        | selection                  |
        | root                       |
        | p:a and its nested p:b     |

    @profile-lexical-snapshot-api @id-xml-go-element-replacement-custody
    Scenario: Replace one subtree using its surviving parent namespace scope
      Given the XML source is <root xmlns="outer" xmlns:p="bound"><!--a--><p:old xmlns:p="inner" x='1'><p:child/></p:old> tail <last/></root>
      When the XML editor replaces p:old with a bound-namespace new element containing value and an empty-namespace plain element
      Then the complete output bytes equal <root xmlns="outer" xmlns:p="bound"><!--a--><p:new>value</p:new><plain xmlns=""/> tail <last/></root>

    @profile-lexical-snapshot-api @id-xml-go-element-replacement-refusal
    Scenario Outline: A <selection> subtree replacement refuses without output
      Given the XML source is <root xmlns="outer" xmlns:p="bound"><!--a--><p:old xmlns:p="inner" x='1'><p:child/></p:old> tail <last/></root>
      When a replacement batch selects <selection>
      Then replacement returns an error and no edited output
      And a separate empty replacement returns the exact original source bytes
      Examples:
        | selection                    |
        | root                         |
        | p:old twice                  |
        | p:old and its nested p:child |

    @profile-lexical-snapshot-api @id-xml-go-immutable-leaf-seed
    Scenario: A seeded immutable parse and no-op leave the caller bytes and parsed snapshot intact
      Given the XML source is <r><t>hello</t></r>
      When the XML editor parses a caller-owned byte slice and performs an empty edit
      Then the caller input bytes still equal the original XML source
      And the empty edit returns the exact original source bytes
