@planned
Feature: Presentation notes inspection and editing

  Rule: PPTX relationship-ordered reads and anchored text replacement
    The first PPTX slice opens real packages, reads existing notes without creating
    missing notes parts, and performs exact anchored text replacement across runs.

    @id-pptx-order-notes-read
    Scenario: Follow presentation relationships and keep notes reads non-mutating
      Given PPTX ordered notes fixtures are prepared
      When PPTX opens the reordered notes fixture and probes notes reads
      Then PPTX keeps slide order, notes blank lines, and notes reads non-mutating without creating missing notes parts

  Rule: Edit existing slide notes while retaining unrelated presentation payloads
    An existing notes slide is selected by its related slide part. Notes edits and
    refusals below concern a bounded Go editor, not a general PPTX authoring rule.

    @profile-go-existing-notes @id-pptx-go-notes-exact-splice
    Scenario: Replace existing speaker text with one changed notes part after save and reopen
      Given fixture fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc
      And the notes for ppt/slides/slide1.xml read Remember to emphasize the Gothic elements
      When those notes are replaced with Updated speaker notes and saved to a new PPTX path
      Then the in-memory ppt/notesSlides/notesSlide1.xml payload equals one replacement of the original speaker text
      And the save receipt lists exactly ppt/notesSlides/notesSlide1.xml as its only changed part
      And every other part in the original package graph has the same delivered payload bytes
      And reopening the saved PPTX reads Updated speaker notes for ppt/slides/slide1.xml

    @profile-go-existing-notes @id-pptx-go-notes-refusal-and-noop-custody
    Scenario: Foreign and invalid notes writes refuse before an identical-text no-op
      Given two Go edit sessions open fixture fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc
      And the first session holds notes for ppt/slides/slide1.xml
      When the other session attempts to write foreign through that target
      And the first session attempts JSON notes text "bad\u0000", one invalid UTF-8 byte FF, and JSON text "two\tcolumns"
      Then each foreign or invalid write returns an error
      And replacing through the held target with its unchanged text succeeds
      And serialising the first session at that point gives the exact original fixture archive bytes

    @profile-go-existing-notes @id-pptx-go-notes-clear-stale-refill
    Scenario: Clear existing notes and refuse another held target before refilling
      Given a Go edit session holds a notes target for ppt/slides/slide1.xml from fixture fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc
      And a second notes target is found in the same session before clearing
      When the first target replaces its notes with the empty string
      Then replacement through the second held target with stale returns an error
      And a newly found notes target reads the empty string
      And replacing through that fresh target with refilled succeeds

    @profile-go-existing-notes @id-pptx-go-notes-part-fingerprint-refusal
    Scenario: A changed notes-part fingerprint refuses a held target
      Given a Go edit session holds notes for ppt/slides/slide1.xml from fixture fixture-04faba67841dda25dc3ff9e3e6e345e6feeeef1cf25a6b9065bf5fbdc83163dc
      When the session's retained ppt/notesSlides/notesSlide1.xml payload is directly replaced by changing Gothic to Victorian
      And the older target attempts to replace notes with stale
      Then that notes replacement returns an error

    @profile-go-existing-notes @id-pptx-go-notes-self-closing-fill
    Scenario: Fill a self-closing notes text leaf and read back the result
      Given the pinned notes fixture's first notes paragraph is replaced in memory by <a:p><a:r><a:rPr b="1"/><a:t/></a:r></a:p>
      When Go replaces its notes with filled
      Then a newly found notes target for ppt/slides/slide1.xml reads filled

    @profile-go-existing-notes @id-pptx-go-notes-edge-space-preserve
    Scenario: Edge-spaced notes text receives xml:space preserve in the notes XML
      Given the pinned notes fixture's first notes paragraph is replaced in memory by <a:p><a:r><a:t xml:space="default">old</a:t></a:r></a:p>
      When Go replaces its notes with JSON " leading "
      Then the parsed ppt/notesSlides/notesSlide1.xml has a DrawingML text leaf equal to JSON " leading "
      And that same text leaf has an XML-namespace space attribute equal to preserve

    @profile-go-existing-notes @id-pptx-go-notes-multiline-template
    Scenario: A multiline replacement retains boundary empty paragraphs without borrowing later bold
      Given the pinned notes fixture's first notes paragraph is replaced in memory by <a:p><a:pPr algn="ctr"/><a:r><a:t>one</a:t></a:r><a:r><a:rPr b="1"/><a:t>two</a:t></a:r></a:p>
      When an identical-text replacement is applied to that notes target
      Then the notes part payload bytes are unchanged
      When Go replaces through that target with JSON "\n A&B \n雪\n"
      Then a newly found notes target reads JSON "\n A&B \n雪\n" across four paragraphs
      And the complete notes part has no literal b="1" attribute

    @profile-go-existing-notes @id-pptx-go-notes-template-fragments
    Scenario: A two-line replacement repeats only the selected template property fragments
      Given the pinned notes fixture's first notes paragraph is replaced in memory by <a:p><a:pPr algn="ctr"><a:buChar char="•"/><a:defRPr sz="1200"/></a:pPr><a:r><a:rPr b="1"><a:solidFill><a:srgbClr val="112233"/></a:solidFill><a:latin typeface="F&amp;F"/></a:rPr><a:t>old</a:t></a:r><a:endParaRPr lang="en-US"/></a:p>
      When Go replaces its notes with JSON "a\nb"
      Then the notes XML contains exactly two copies each of val="112233", typeface="F&amp;F", lang="en-US" and char="•"
