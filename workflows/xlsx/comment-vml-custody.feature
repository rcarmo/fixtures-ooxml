@planned
Feature: XLSX comment and VML relationship custody by operation and editor profile
  ECMA-376 Part 2 clause 6.5.3.4 defines Relationship Type and Target.
  Part 1 informative Annex L.2.6.3 illustrates comments stored separately from VML drawing data.
  Part 1 informative Annex L.5.1 calls VML deprecated for new drawings, not disposable in retained packages.
  Preservation row shifting and limited numeric editing have different admission policies.

  @id-xlsx-comment-vml-existing-graph
  Scenario: Inspect the two separate existing comment and VML drawing relationships
    Given fixture fixture-264be55e012d4bc2b3bf25e59824fdd30022e94f70869ea7d6ad960b803a902f
    When a namespace-aware reader opens xl/worksheets/sheet1.xml and its relationship part
    Then the legacyDrawing relationship ID is anysvml and resolves internally to xl/drawings/commentsDrawing1.vml
    And the corresponding relationship Type is http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing
    And a separate comments relationship resolves internally to xl/comments/comment1.xml
    And the comment part contains A2 with text This is the protagonist who creates the creature.
    And the comment part contains A3 with text Often mistakenly called 'Frankenstein' - that is the creator's name.

  @profile-preservation-row-editor @id-xlsx-comment-vml-disjoint-row-shift
  Scenario: A preservation row editor retains comment VML bytes after a disjoint insertion
    Given a newly made XLSX worksheet with a comment note at A1 and value tail at A5
    And it has been saved and reloaded in a preservation row editor with only comment VML shapes
    When the editor inserts a row at 5 and saves to a new XLSX path
    Then the reopened A1 comment text equals note and A6 value equals tail
    And the complete set of VML part names and payload bytes equals the saved source set

  @profile-preservation-row-editor @id-xlsx-comment-vml-affected-row-refusal
  Scenario: A preservation row editor refuses a shift that would affect a commented cell
    Given a newly made XLSX worksheet with a comment note at A5
    And it has been saved and reloaded in a preservation row editor
    When the editor tries to insert a row at 5
    Then the editor raises a comments-related refusal
    And the held A5 comment text still equals note

  @profile-preservation-row-editor @id-xlsx-comment-vml-control-shape-refusal
  Scenario: A preservation row editor refuses a disjoint shift with a non-comment VML control
    Given a saved XLSX whose A1 comment VML shape ObjectType has been changed from Note to Button
    And it has been reloaded in a preservation row editor
    When the editor tries to insert a row at 5
    Then the editor raises a legacy or VML refusal

  @profile-preservation-row-editor @id-xlsx-comment-vml-unknown-shape-refusal
  Scenario: A preservation row editor refuses a disjoint shift with an unknown VML shape
    Given a saved XLSX with an A1 comment and one added unknown VML shape
    And it has been reloaded in a preservation row editor
    When the editor tries to insert a row at 5
    Then the editor raises a legacy or VML refusal

  @profile-limited-number-editor @id-xlsx-comment-vml-limited-editor-refusal
  Scenario: A limited numeric editor refuses a comment VML dependency before replacement
    Given a generated ordinary Transitional XLSX with a numeric B2 and a comment at A1 linked to legacyDrawing
    And the limited preserved-package numeric editor finds a target at B2
    When the editor attempts to set that target to 8
    Then the edit refuses unsupported dependent structure before replacement
