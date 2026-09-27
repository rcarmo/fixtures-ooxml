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

  Rule: Go document API getter and bounded save-reopen predicates
    The in-memory operations below check selected getters. Only scenarios that say
    save and reopen assert disk readback. Values name this API profile, not OOXML validity.

    @profile-go-document-api @id-docx-go-run-color-getter
    Scenario Outline: A <variant> run colour is normalised by its getter
      Given a new Go Word run
      When its colour is set to <input>
      Then its in-memory colour getter equals <want>
      Examples:
        | variant   | input   | want   |
        | red       | FF0000  | FF0000 |
        | hash-red  | #FF0000 | FF0000 |
        | lowercase | ff0000  | ff0000 |

    @profile-go-document-api @id-docx-go-run-boolean-formatting
    Scenario Outline: A <variant> run reads the three requested direct flags
      Given a new Go Word run containing Test
      When bold is set to <bold>, italic to <italic> and strike to <strike>
      Then Bold, Italic and Strike getters equal <bold>, <italic> and <strike>
      Examples:
        | variant     | bold  | italic | strike |
        | none        | false | false  | false  |
        | bold        | true  | false  | false  |
        | italic      | false | true   | false  |
        | strike      | false | false  | true   |
        | all         | true  | true   | true   |

    @profile-go-document-api @id-docx-go-run-effects-getters
    Scenario: Eight direct run effects read true after setting them
      Given a new Go Word run
      When DoubleStrike, Caps, SmallCaps, Outline, Shadow, Emboss, Imprint and Vanish are set true
      Then all eight corresponding getters return true in memory

    @profile-go-document-api @id-docx-go-run-underline-style
    Scenario Outline: A <style> underline is reflected by direct getters
      Given a new Go Word run
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

    @profile-go-document-api @id-docx-go-run-font-name
    Scenario Outline: A run retains direct font name <font> in memory
      Given a new Go Word run
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

    @profile-go-document-api @id-docx-go-run-highlight
    Scenario Outline: A run retains highlight name <colour> in memory
      Given a new Go Word run
      When highlight is set to <colour>
      Then the Highlight getter equals <colour>
      Examples:
        | colour      |
        | yellow      |
        | cyan        |
        | darkBlue    |
        | lightGray   |
        | black       |

    @profile-go-document-api @id-docx-go-run-vertical-align
    Scenario: Separate superscript and subscript runs have opposite flags
      Given two new Go Word runs
      When Superscript is enabled on the first and Subscript on the second
      Then the first reports superscript true and subscript false
      And the second reports subscript true and superscript false

    @profile-go-document-api @id-docx-go-roundtrip-selected-formatting
    Scenario: Selected direct run formatting survives save and reopen
      Given a new Go Word paragraph with three runs Bold-space, Italic-space and Colored
      And the first run is bold, the second italic, and the third has colour FF0000, font size 14 and font Arial
      When the document is saved and reopened
      Then at least one paragraph and three runs are readable
      And the first run is bold and the second italic
      And the third run reports colour FF0000, font size 14 and font Arial
