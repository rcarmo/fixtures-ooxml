@planned
Feature: Presentation archive preservation

  Rule: Open a presentation from a path or bytes without changing it
    The presentation API retains the input archive for a save with no edits.

    @profile-bun-presentation @id-pptx-bun-open-save-noop
    Scenario: Path and byte inputs retain the original presentation archive
      Given fixture fixture-1b848867cffb781112dc5778fa8cc7b9c9bd472c3636a348ec5d50005f05489e
      When Bun Presentation opens the fixture path and separately opens its archive bytes
      Then the path-opened presentation's first inspected paragraph on its first slide is Frankenstein
      And serializing the byte-opened presentation returns the exact original archive bytes
      When the path-opened presentation is saved without edits to a new PPTX path
      Then that destination file contains the exact original archive bytes
