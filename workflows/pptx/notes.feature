@planned
Feature: Presentation notes inspection and editing

  Rule: PPTX relationship-ordered reads and anchored text replacement
    These reads follow presentation relationships and retain existing notes.
    Reading missing notes does not create a notes part.

    @id-pptx-order-notes-read
    Scenario: Follow presentation relationships and keep notes reads non-mutating
      Given PPTX ordered notes fixtures are prepared
      When PPTX opens the reordered notes fixture and probes notes reads
      Then PPTX keeps slide order, notes blank lines, and notes reads non-mutating without creating missing notes parts

  Rule: Read an authored collection without creating notes for a slide that lacks them
    This collection profile returns nonempty speaker notes in presentation order.
    It does not cover relationship permutations or preserving blank lines inside notes.

    @profile-notes-collection @id-pptx-notes-collection-read
    Scenario Outline: Read three notes and one absent note from a <variant> four-slide presentation
      Given the sealed blank presentation fixture-c54a7b746c0328fc1930525edd91387eedbbca69a6f388f7ec024150187b6bab has no slides
      And a temporary copy has four slides appended in order using layout index 1
      And slides 1, 2 and 3 have notes text "Notes for slide 1", "Notes for slide 2" and "Notes for slide 3" respectively
      And the four slide title placeholders contain <titles>; slide 4 has no notes slide or notes relationship
      And this authored copy is saved and reopened before its archive SHA-256 and every member payload are recorded
      When all-slide notes, each slide's notes, and out-of-range slides 0 and 5 are read without writing
      Then the all-slide result equals {"file":"notes-collection.pptx","slides_with_notes":3,"total_slides":4,"notes":[{"slide_number":1,"notes":"Notes for slide 1"},{"slide_number":2,"notes":"Notes for slide 2"},{"slide_number":3,"notes":"Notes for slide 3"}]}
      And slides 1, 2 and 3 each return their exact one-based slide number, has_notes true and matching literal notes
      And slide 4 returns {"file":"notes-collection.pptx","slide_number":4,"has_notes":false,"notes":""}
      And slides 0 and 5 return exactly "Slide 0 not found. Presentation has 4 slides." and "Slide 5 not found. Presentation has 4 slides." as errors
      And after every read or refusal the authored source archive SHA-256, bytes, every member payload and relationship equal the recorded values
      And no slide-4 notes part or slide-4 notes relationship has been created
      And the sealed blank presentation fixture bytes remain unchanged

      Examples:
        | variant  | titles                                |
        | untitled | ["","","",""]                       |
        | titled   | ["Slide 1","Slide 2","Slide 3","Slide 4"] |

  Rule: Edit existing slide notes while retaining unrelated presentation payloads
    An existing notes slide is selected by its related slide part. Notes edits and
    refusals use existing-part targets; creating a notes part is outside this profile.

    @profile-existing-notes @id-pptx-go-notes-exact-splice
    Scenario: Replace existing speaker text with one changed notes part after save and reopen
      Given fixture fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc
      And the notes for ppt/slides/slide1.xml read Remember to emphasize the Gothic elements
      When those notes are replaced with Updated speaker notes and saved to a new PPTX path
      Then the in-memory ppt/notesSlides/notesSlide1.xml payload equals one replacement of the original speaker text
      And the save receipt lists exactly ppt/notesSlides/notesSlide1.xml as its only changed part
      And every other part in the original package graph has the same delivered payload bytes
      And reopening the saved PPTX reads Updated speaker notes for ppt/slides/slide1.xml

    @profile-existing-notes @id-pptx-go-notes-refusal-and-noop-custody
    Scenario: Foreign and invalid notes writes refuse before an identical-text no-op
      Given two presentation edit sessions open fixture fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc
      And the first session holds notes for ppt/slides/slide1.xml
      When the other session attempts to write foreign through that target
      And the first session attempts JSON notes text "bad\u0000", one invalid UTF-8 byte FF, and JSON text "two\tcolumns"
      Then each foreign or invalid write returns an error
      And replacing through the held target with its unchanged text succeeds
      And serialising the first session at that point gives the exact original fixture archive bytes

    @profile-existing-notes @id-pptx-go-notes-clear-stale-refill
    Scenario: Clear existing notes and refuse another held target before refilling
      Given a presentation edit session holds a notes target for ppt/slides/slide1.xml from fixture fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc
      And a second notes target is found in the same session before clearing
      When the first target replaces its notes with the empty string
      Then replacement through the second held target with stale returns an error
      And a newly found notes target reads the empty string
      And replacing through that fresh target with refilled succeeds

    @profile-existing-notes @id-pptx-go-notes-part-fingerprint-refusal
    Scenario: A changed notes-part fingerprint refuses a held target
      Given a presentation edit session holds notes for ppt/slides/slide1.xml from fixture fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc
      When the session's retained ppt/notesSlides/notesSlide1.xml payload is directly replaced by changing Gothic to Victorian
      And the older target attempts to replace notes with stale
      Then that notes replacement returns an error

    @profile-existing-notes @id-pptx-go-notes-self-closing-fill
    Scenario: Fill a self-closing notes text leaf and read back the result
      Given the pinned notes fixture's first notes paragraph is replaced in memory by <a:p><a:r><a:rPr b="1"/><a:t/></a:r></a:p>
      When the editor replaces its notes with filled
      Then a newly found notes target for ppt/slides/slide1.xml reads filled

    @profile-existing-notes @id-pptx-go-notes-edge-space-preserve
    Scenario: Edge-spaced notes text receives xml:space preserve in the notes XML
      Given the pinned notes fixture's first notes paragraph is replaced in memory by <a:p><a:r><a:t xml:space="default">old</a:t></a:r></a:p>
      When the editor replaces its notes with JSON " leading "
      Then the parsed ppt/notesSlides/notesSlide1.xml has a DrawingML text leaf equal to JSON " leading "
      And that same text leaf has an XML-namespace space attribute equal to preserve

    @profile-existing-notes @id-pptx-go-notes-multiline-template
    Scenario: A multiline replacement retains boundary empty paragraphs without borrowing later bold
      Given the pinned notes fixture's first notes paragraph is replaced in memory by <a:p><a:pPr algn="ctr"/><a:r><a:t>one</a:t></a:r><a:r><a:rPr b="1"/><a:t>two</a:t></a:r></a:p>
      When an identical-text replacement is applied to that notes target
      Then the notes part payload bytes are unchanged
      When the editor replaces through that target with JSON "\n A&B \n雪\n"
      Then a newly found notes target reads JSON "\n A&B \n雪\n" across four paragraphs
      And the complete notes part has no literal b="1" attribute

    @profile-existing-notes @id-pptx-go-notes-template-fragments
    Scenario: A two-line replacement repeats only the selected template property fragments
      Given the pinned notes fixture's first notes paragraph is replaced in memory by <a:p><a:pPr algn="ctr"><a:buChar char="•"/><a:defRPr sz="1200"/></a:pPr><a:r><a:rPr b="1"><a:solidFill><a:srgbClr val="112233"/></a:solidFill><a:latin typeface="F&amp;F"/></a:rPr><a:t>old</a:t></a:r><a:endParaRPr lang="en-US"/></a:p>
      When the editor replaces its notes with JSON "a\nb"
      Then the notes XML contains exactly two copies each of val="112233", typeface="F&amp;F", lang="en-US" and char="•"

  @profile-retained-manipulation @id-pptx-manipulation-set-notes
  Scenario: edit existing speaker text
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 existing notes body is selected by its original part and unique identity
    When production presentation editing APIs replace notes with JSON "These are speaker notes"
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 existing notes body has exact properties JSON {"text":"These are speaker notes","paragraphs":["These are speaker notes"]}
    And only original member payloads ["ppt/notesSlides/notesSlide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-notes-readback
  Scenario: multiline notes save/reopen
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And slide 1 existing notes body is selected by its original part and unique identity
    When production presentation editing APIs replace notes with JSON "Speaker notes content\nsecond line"
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved slide 1 existing notes body has exact properties JSON {"text":"Speaker notes content\nsecond line","paragraphs":["Speaker notes content","second line"]}
    And only original member payloads ["ppt/notesSlides/notesSlide1.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links
