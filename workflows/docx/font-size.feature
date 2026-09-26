@planned
Feature: Write a direct Word run font size in half-points
  ECMA-376 Part 1 (2016) section 17.3.2.38 defines w:sz in half-points for
  non-complex-script characters. This operation writes a direct run property;
  it does not evaluate styles or rendered appearance.

  @id-docx-direct-font-size-half-points
  Scenario: A 10.5-point run stores 21 half-points after save and reopen
    Given a new Word document with one body paragraph and one run containing "Size sample"
    When that run's direct font size is set to 10.5 points
    And the Word document is saved and reopened
    Then the paragraph text is "Size sample"
    And the run has exactly one direct WordprocessingML w:sz element with w:val "21"
    And the reopened run's direct font size is 10.5 points
