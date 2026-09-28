@planned
Feature: PowerPoint slide visibility by slide identity
  Slide order and visibility are separate properties. Package-level visibility
  can be checked on committed files; application-confirmed hidden state needs
  an untouched PowerPoint export and reopen evidence.

  @id-pptx-slide-visibility-retained-inputs
  Scenario: A retained four-slide input identifies a hidden third slide and a fully visible control
    Given the committed fixture fixture-e01ded1106a28f94a3439e8368f9a12ec360891f4a9e2810f6504c4c328ed79c is loaded without editing
    And the committed fixture fixture-fa245a3df00fef7f7bf4739921ee840194040161e06490589e3d52cc9fa7a71d is loaded as a visible control
    When their four ordered slide identities and root visibility attributes are inspected
    Then the source fixture has exactly four slides with slide 3 marked p:show="0" and slides 1, 2 and 4 unmarked
    And the visible control has exactly four slides without a hidden visibility attribute
    And both source archive bytes remain unchanged
    And the reported slide numbers refer to the same slide relationships as the inspected parts

  @id-pptx-office-hidden-slide-positive
  Scenario: An untouched PowerPoint export confirms hidden slide 3 of four on reopen
    Given an untouched PowerPoint-authored four-slide presentation with slide 3 hidden is registered with version and platform provenance
    And a separately visible control is registered with original bytes
    When both originals are reopened in PowerPoint and inspected through an independent OOXML reader
    Then slide 3 alone is hidden in the original presentation and slides 1, 2 and 4 remain visible
    And every control slide remains visible
    And the identity of each visible or hidden slide matches its slide relationship and part
    And both original archive bytes remain unchanged
