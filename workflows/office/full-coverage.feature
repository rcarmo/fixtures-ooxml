@planned
Feature: OFFICE full coverage obligations
  Preserved predicates require separate per-consumer execution evidence.

  @id-parity-inherited
  Scenario Outline: Preserve complete <format> document behaviour
    Given the pinned <format> facts fixtures and behaviour contracts
    When every required operation has a native implementation
    Then each contract has executed Gherkin steps and saved reopened outcomes
    And no planned behaviour gaps remain for <format>
    Examples:
      | format |
      | docx   |
      | pptx   |
      | xlsx   |
