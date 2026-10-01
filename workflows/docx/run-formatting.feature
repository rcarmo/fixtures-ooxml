@planned
Feature: Word direct run formatting

  Rule: Direct paragraph run formatting preserves text and unrelated properties
    Bold and italic apply to every direct text run in one supported paragraph.
    Null removes a direct override; false writes explicit off without evaluating styles.

    @id-docx-direct-run-formatting
    Scenario Outline: Apply the <operation> direct formatting policy
      Given a native Word paragraph split into two differently formatted text runs
      When paragraph formatting requests <operation>
      Then reopening preserves the paragraph text and the <operation> direct properties
      And formatting changes only the main document part and retains unrelated properties

      Examples:
        | operation |
        | enable    |
        | disable   |
        | remove    |
        | no-op     |

    @id-docx-direct-formatting-refusal
    Scenario Outline: Refuse formatting <variant> atomically
      Given a Word formatting refusal input <variant>
      When paragraph direct formatting is attempted
      Then formatting refuses before changing package bytes

      Examples:
        | variant            |
        | field              |
        | tracked            |
        | mixed-content      |
        | duplicate-property |
        | malformed-flag     |
        | wrong-namespace    |
        | property-revision  |
        | protected          |
        | external-settings  |
        | stale              |
        | invalid-option     |

  Rule: Document value API and selected save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Getter names and return conventions are
    API compatibility predicates, not general OOXML validity or rendering rules.

    @profile-document-value-api @id-docx-go-run-color-getter
    Scenario Outline: A <variant> run colour is normalised by its getter
      Given a new Word run
      When its colour is set to <input>
      Then its in-memory colour getter equals <want>
      Examples:
        | variant   | input   | want   |
        | red       | FF0000  | FF0000 |
        | hash-red  | #FF0000 | FF0000 |
        | lowercase | ff0000  | ff0000 |

    @profile-document-value-api @id-docx-go-run-boolean-formatting
    Scenario Outline: A <variant> run reads the three requested direct flags
      Given a new Word run containing Test
      When bold is set to <bold>, italic to <italic> and strike to <strike>
      Then Bold, Italic and Strike getters equal <bold>, <italic> and <strike>
      Examples:
        | variant     | bold  | italic | strike |
        | none        | false | false  | false  |
        | bold        | true  | false  | false  |
        | italic      | false | true   | false  |
        | strike      | false | false  | true   |
        | all         | true  | true   | true   |

    # Simultaneous flags are an in-memory API observation; conflicting effects are not a valid saved-format guarantee.
    @profile-in-memory-effects-api @id-docx-go-run-effects-getters
    Scenario: Eight direct run effects read true after setting them
      Given a new Word run
      When DoubleStrike, Caps, SmallCaps, Outline, Shadow, Emboss, Imprint and Vanish are set true
      Then all eight corresponding getters return true in memory

    @profile-document-value-api @id-docx-go-run-underline-style
    Scenario Outline: A <style> underline is reflected by direct getters
      Given a new Word run
      When its underline style is set to <style>
      Then Underline is true and UnderlineStyle equals <style>
      Examples:
        | style  |
        | single |
        | double |
        | thick  |
        | dotted |
        | dash   |
        | wave   |

    @profile-document-value-api @id-docx-go-run-font-name
    Scenario Outline: A run retains direct font name <font> in memory
      Given a new Word run
      When its font name is set to <font>
      Then its font-name getter equals <font>
      Examples:
        | font            |
        | Arial           |
        | Times New Roman |
        | Calibri         |
        | Courier New     |
        | Georgia         |
        | Verdana         |

    @profile-document-value-api @id-docx-go-run-highlight
    Scenario Outline: A run retains highlight name <colour> in memory
      Given a new Word run
      When highlight is set to <colour>
      Then the Highlight getter equals <colour>
      Examples:
        | colour      |
        | yellow      |
        | cyan        |
        | darkBlue    |
        | lightGray   |
        | black       |

    @profile-document-value-api @id-docx-go-run-vertical-align
    Scenario: Separate superscript and subscript runs have opposite flags
      Given two new Word runs
      When Superscript is enabled on the first and Subscript on the second
      Then the first reports superscript true and subscript false
      And the second reports subscript true and superscript false

    @profile-selected-formatting-readback @id-docx-go-roundtrip-selected-formatting
    Scenario: Selected direct run formatting survives save and reopen
      Given a new Word paragraph with three runs Bold-space, Italic-space and Colored
      And the first run is bold, the second italic, and the third has colour FF0000, font size 14 and font Arial
      When the document is saved and reopened
      Then at least one paragraph and three runs are readable
      And the first run is bold and the second italic
      And the third run reports colour FF0000, font size 14 and font Arial

  Rule: Guarded retained single-target edits with full custody
    Exact direct values are checked after save and reopen; inherited rendering is outside this profile.

    @profile-retained-style-word @id-docx-retained-run-strike
    Scenario: docx run strike changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-strike patch JSON {"strike":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"strike":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-underline
    Scenario: docx run underline changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-underline patch JSON {"underline":"double"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"underline":"double"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-color
    Scenario: docx run color changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-color patch JSON {"color":"A1B2C3"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"color":"A1B2C3"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-highlight
    Scenario: docx run highlight changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-highlight patch JSON {"highlight":"yellow"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"highlight":"yellow"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-size
    Scenario: docx run size changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-size patch JSON {"sizeHalfPoints":21}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"sizeHalfPoints":21}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-font
    Scenario: docx run font changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-font patch JSON {"font":"Aptos"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"ascii":"Aptos","hAnsi":"Aptos"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-superscript
    Scenario: docx run superscript changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-superscript patch JSON {"verticalAlign":"superscript"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"verticalAlign":"superscript"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-subscript
    Scenario: docx run subscript changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-subscript patch JSON {"verticalAlign":"subscript"}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"verticalAlign":"subscript"}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-caps
    Scenario: docx run caps changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-caps patch JSON {"caps":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"caps":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-small-caps
    Scenario: docx run small caps changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-small-caps patch JSON {"smallCaps":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"smallCaps":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-hidden
    Scenario: docx run hidden changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-hidden patch JSON {"vanish":true}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"vanish":true}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged

    @profile-retained-style-word @id-docx-retained-run-inherit
    Scenario: docx run inherit changes only its selected direct properties
      Given retained docx input fixture-2d32cedb722efc62866a97e6d9f335d68977fcb270d0d241e60f0fc84bd55fd2 has its sealed original property and identity snapshot
      And retained edit target body paragraph 0 run 0 is uniquely selected with a held identity
      When production retained docx editing applies run-inherit patch JSON {"remove":["color","sz","highlight","u","vertAlign","rFonts"]}
      And the result or unchanged refusal session is saved and independently parsed and reopened
      Then retained target body paragraph 0 run 0 has exact saved properties JSON {"absent":["color","sz","highlight","u","vertAlign","rFonts"],"retained":["b","i","lang"]}
      And saved direct property children remain in schema order
      And the exact changed original member set is ["word/document.xml"] with no additions or removals
      And every unpatched selected-property attribute and child retains its literal original bytes
      And all other XML spans, text leaves, runs, paragraphs and unrelated member payloads retain custody
      And actual caller input, original identities, relationships and content-type graph are unchanged
