@planned
Feature: Physical horizontal Word table merges with retained content
  ECMA-376 Part 1 clauses 17.4.17 and 17.4.71 define gridSpan and preferred cell width.
  The preserving editor merges only plain unmerged cells and refuses content loss.

  @profile-preserving-horizontal-merge
  Rule: Physical merge output and atomic admission
    @id-docx-horizontal-merge-roundtrip
    Scenario Outline: Save a horizontal merge while retaining source and unrelated content
      Given a saved Word horizontal merge source with a two by four table
      When row <row> columns <first> through <last> are merged and saved to a new path
      Then the reopened table has two rows and four grid columns with a gridSpan of <span> at row <row> column <first>
      And the merged width is <width> twips and that row has <cells> physical cells
      And the reopened retained paragraph sequence matches the source minus only the absorbed empty paragraphs
      And the grid, unselected cells and rows, unrelated members and source archive are unchanged
      Examples:
        | row | first | last | span | width | cells |
        | 0   | 0     | 2    | 3    | 6480  | 2     |
        | 0   | 0     | 3    | 4    | 8640  | 1     |
        | 1   | 1     | 2    | 2    | 4320  | 3     |

    @id-docx-horizontal-merge-content-refusal
    Scenario Outline: Refuse to discard absorbed cell content or metadata
      Given a saved Word horizontal merge source whose absorbed cell has <content>
      When row zero columns zero through two are merged
      Then the merge refuses and the archive and held source handles are unchanged
      Examples:
        | content          |
        | text             |
        | space-text       |
        | cell-shading     |
        | paragraph-format |
        | empty-run        |
        | lexical-comment  |

    @id-docx-horizontal-merge-structure-refusal
    Scenario Outline: Refuse unsupported structure anywhere in the table
      Given a saved Word horizontal merge source with <structure>
      When row zero columns zero through two are merged
      Then the merge refuses and the archive and held source handles are unchanged
      Examples:
        | structure          |
        | existing-vertical  |
        | missing-grid       |
        | width-mismatch     |
        | nested-unselected  |
        | protected          |
        | external-settings  |

    @id-docx-horizontal-merge-coordinate-refusal
    Scenario Outline: Refuse invalid horizontal ranges before mutation
      Given a saved Word horizontal merge source with a two by four table
      When the merge is requested with <coordinates> coordinates
      Then the merge refuses and the archive and held source handles are unchanged
      Examples:
        | coordinates |
        | singleton   |
        | reversed    |
        | outside     |
        | fractional  |

    @id-docx-horizontal-merge-rollback
    Scenario Outline: Roll back write or serialization faults without invalidating handles
      Given a saved Word horizontal merge source with a two by four table
      When the merge fails after <stage>
      Then the merge refuses and the archive and held source handles are unchanged
      Examples:
        | stage         |
        | part-write    |
        | serialization |

    @id-docx-horizontal-merge-encoding
    Scenario Outline: Preserve XML encoding and retained content across merge save and reopen
      Given a saved Word horizontal merge source encoded as <encoding>
      When row zero columns zero through two are merged and saved to a new path
      Then the reopened encoding marker and namespace meaning match the source
      And the reopened retained paragraph sequence matches the source minus only the absorbed empty paragraphs
      And the grid, unselected cells and rows, unrelated members and source archive are unchanged
      Examples:
        | encoding   |
        | UTF-8-BOM  |
        | UTF-16LE   |
        | UTF-16BE   |

    @id-docx-horizontal-merge-stale
    Scenario Outline: Retain refusal boundaries after a successful physical merge
      Given a saved Word horizontal merge source with a two by four table
      When row zero columns zero through two are merged in the editing session
      Then <target> operations refuse without changing the merged archive
      And the current unmerged tail cell still reads Tail
      Examples:
        | target       |
        | old-handles  |
        | merged-cells |

  @profile-preserving-vertical-merge
  Rule: Single-column vertical merges retain physical cells and content
    ECMA-376 Part 1 clause 17.4.84 defines vMerge restart and continue markers.

    @id-docx-vertical-merge-roundtrip
    Scenario Outline: Save a single-column merge without removing physical cells
      Given a saved Word vertical merge source with a three by three table
      When column <column> rows <first> through <last> are merged and saved to a new path
      Then the reopened table has three rows, three grid columns and nine physical cells
      And column <column> has restart at row <first> and explicit continue through row <last>
      And removing only the inserted vertical markers reproduces the complete source document XML
      And the reopened paragraph sequence, unrelated members and source archive are unchanged
      Examples:
        | column | first | last |
        | 1      | 0     | 2    |
        | 0      | 1     | 2    |
        | 2      | 0     | 1    |

    @id-docx-vertical-merge-content-refusal
    Scenario Outline: Refuse to hide continuation cell content or metadata
      Given a saved Word vertical merge source whose continuation cell has <content>
      When column one rows zero through two are merged
      Then the vertical merge refuses and the archive and held source handles are unchanged
      Examples:
        | content          |
        | text             |
        | space-text       |
        | cell-shading     |
        | paragraph-format |
        | empty-run        |
        | lexical-comment  |

    @id-docx-vertical-merge-structure-refusal
    Scenario Outline: Refuse unsupported structure outside the selected column too
      Given a saved Word vertical merge source with <structure>
      When column one rows zero through two are merged
      Then the vertical merge refuses and the archive and held source handles are unchanged
      Examples:
        | structure          |
        | existing-vertical  |
        | missing-grid       |
        | width-mismatch     |
        | nested-unselected  |
        | protected          |
        | external-settings  |

    @id-docx-vertical-merge-coordinate-refusal
    Scenario Outline: Refuse invalid vertical merge ranges before mutation
      Given a saved Word vertical merge source with a three by three table
      When the vertical merge is requested with <coordinates> coordinates
      Then the vertical merge refuses and the archive and held source handles are unchanged
      Examples:
        | coordinates |
        | singleton   |
        | reversed    |
        | outside     |
        | fractional  |

    @id-docx-vertical-merge-rollback
    Scenario Outline: Roll back vertical marker publication without invalidating held handles
      Given a saved Word vertical merge source with a three by three table
      When the vertical merge fails after <stage>
      Then the vertical merge refuses and the archive and held source handles are unchanged
      Examples:
        | stage         |
        | part-write    |
        | serialization |

    @id-docx-vertical-merge-encoding
    Scenario Outline: Retain byte order and namespace meaning when saving vertical merges
      Given a saved Word vertical merge source encoded as <encoding>
      When column one rows zero through two are merged and saved to a new path
      Then the reopened vertical encoding marker and namespace meaning match the source
      And column 1 has restart at row 0 and explicit continue through row 2
      And removing only the inserted vertical markers reproduces the complete source document XML
      And the reopened paragraph sequence, unrelated members and source archive are unchanged
      Examples:
        | encoding   |
        | UTF-8-BOM  |
        | UTF-16LE   |
        | UTF-16BE   |

    @id-docx-vertical-merge-stale
    Scenario Outline: Keep post-merge refusal boundaries without changing retained cells
      Given a saved Word vertical merge source with a three by three table
      When column one rows zero through two are merged in the editing session
      Then vertical <target> operations refuse without changing the merged archive
      And the current unmerged vertical tail cell still reads Tail
      Examples:
        | target       |
        | old-handles  |
        | merged-cells |
