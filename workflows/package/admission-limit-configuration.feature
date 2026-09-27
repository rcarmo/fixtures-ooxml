@planned
Feature: Package admission validates caller resource budgets
  This profile calls the direct bounded package-admission API, not an editing
  session. Invalid caller configuration refuses before source metadata reads or
  ZIP member inspection. Error type, field names and zero-budget effects remain
  separate API policies: zero is a valid configuration value, with effects
  defined by each admission API's budget contract.
  Resource limits on valid inputs remain in zip32.feature and zip-admission.feature.

  @id-package-admission-negative-budget
  Scenario Outline: A negative <budget> budget refuses before package intake
    Given the byte-sealed valid DOCX archive fixture-d9d6a313182a71a73d75a26a0ff3b7826dbd2e300e1d202114ec9f8fb018fda5 and a separate caller byte snapshot
    And only the <budget> admission budget is set to -1
    When bounded package admission checks that archive
    Then it refuses the invalid caller budget before reading source metadata or ZIP members and returns no package or parts
    And the refusal is an invalid-argument result, not a resource-limit or malformed-archive result
    And the caller's archive bytes remain unchanged

    Examples:
      | budget       |
      | source bytes |
      | entry count  |
