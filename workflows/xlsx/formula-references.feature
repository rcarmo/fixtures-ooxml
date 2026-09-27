@planned
Feature: Static formula references and insertion remaps

  Rule: Bounded static formula references and insertion remaps
    This profile analyses supported static A1 expressions and direct ranges without
    evaluating formulas. Unsupported syntax refuses without a partial result.
    Byte spans, zero absent-axis coordinates and empty-result refusals are API
    policies. String remaps do not edit a workbook or establish Excel compatibility.
    @profile-static-reference-api @id-xlsx-go-formula-analysis-counts
    Scenario Outline: Count static references in <variant> without treating strings as references
      Given the formula source is JSON <source_json>
      When the static formula analyser reads the source
      Then it returns <count> reference records without error
      And every reference has a nonempty byte span inside the original source
      Examples:
        | variant              | source_json                                         | count |
        | mixed formula        | "IF(A1=\"B2\",'O''Brien'!$C$4,SUM(D1:E2))"     | 3     |
        | only strings         | "\"A1\"&\"Sheet1!B2\""                  | 0     |
        | numeric exponent     | "LOG10(A1)+1E10"                                  | 1     |
        | unary arithmetic     | "=-(A1+B2)^2%"                                    | 2     |
        | boolean literal      | "TRUE"                                            | 0     |
        | Unicode sheet        | "'α sheet'!A1"                                    | 1     |

    @profile-static-reference-api @id-xlsx-go-formula-quoted-sheet-flags
    Scenario: Decode a quoted sheet and independent absolute reference flags
      Given the formula source is JSON "'O''Brien'!$B2:C$4"
      When the static formula analyser reads the source
      Then its one reference spans every byte of the original source
      And the sheet is O'Brien with first cell column 2 row 2 and absolute column only
      And the last cell is column 3 row 4 with absolute row only

    @profile-static-reference-api @id-xlsx-go-formula-analysis-refusal
    Scenario Outline: Refuse unsupported static formula syntax <variant> without partial references
      Given the formula source is JSON <source_json>
      When the static formula analyser reads the source
      Then it returns an error and zero reference records
      Examples:
        | variant               | source_json           |
        | dynamic function      | "INDIRECT(A1)"       |
        | unresolved name       | "Name+1"             |
        | out-of-grid column    | "XFE1"               |
        | out-of-grid row       | "A1048577"           |
        | open quoted sheet     | "'unclosed!A1"       |
        | unsupported spill     | "@A1"               |
        | unfinished function   | "A1+SUM(2"          |

    @profile-static-reference-api @id-xlsx-go-formula-literal-punctuation
    Scenario Outline: <variant> string punctuation has a bounded parse outcome
      Given the formula source is JSON <source_json>
      When the static formula analyser reads the source
      Then the analysis is <result>
      Examples:
        | variant                    | source_json                | result                              |
        | adjacent string operator   | "A1 \"+\" B1"          | refused with zero references        |
        | adjacent string range      | "A1 \":\" B2"          | refused with zero references        |
        | quoted close in SUM        | "SUM(\")\",A1)"        | accepted without error              |
        | quoted percent in SUM      | "SUM(\"%\",A1)"        | accepted without error              |
        | quoted equality only       | "\"=\""                | accepted without error              |

    @profile-static-reference-api @id-xlsx-go-direct-range-parsing
    Scenario Outline: A <variant> direct range yields bounded axis and first coordinate
      Given the direct range source is JSON <source_json>
      When the direct-range parser reads the source
      Then its sheet is JSON <sheet_json> and its axis is <axis>
      And its first coordinate has row <row> and column <col>
      Examples:
        | variant              | source_json            | sheet_json | axis   | row | col |
        | absolute column      | "$B:$B"               | ""         | column | 0   | 2   |
        | reversed whole rows  | "$3:$1"               | ""         | row    | 3   | 0   |
        | quoted column        | "'O''Brien'!$B:$B"     | "O'Brien"  | column | 0   | 2   |
        | reversed rectangle   | "A3:B1"               | ""         | cell   | 3   | 1   |
        | sheet absolute cell  | "Sheet!$A$1"          | "Sheet"    | cell   | 1   | 1   |
        | numeric sheet name   | "'3'!1:1"             | "3"        | row    | 1   | 0   |

    @profile-static-reference-api @id-xlsx-go-direct-range-refusal
    Scenario Outline: A <variant> input is not a direct range in this profile
      Given the direct range source is JSON <source_json>
      When the direct-range parser reads the source
      Then it returns an error
      Examples:
        | variant             | source_json          |
        | mixed endpoint      | "A:B1"              |
        | formula expression  | "SUM(A1)"           |
        | external book       | "[Book]Sheet!A1"    |
        | sheet span          | "Sheet1:Sheet2!A1"  |
        | spill reference     | "A1#"               |
        | union               | "A1,B2"             |
        | invalid whole axis  | "XFE:XFE"           |

    @profile-static-reference-api @id-xlsx-go-static-remap-exact
    Scenario Outline: Inserting a <axis> at <at> by <count> rewrites only supported references
      Given the formula source is JSON <source_json> in context sheet Main
      When the static remapper inserts <axis> at <at> by <count> on sheet JSON <change_sheet_json>
      Then the complete replacement expression equals JSON <expected_json>
      Examples:
        | axis   | at | count | change_sheet_json | source_json                             | expected_json                            |
        | row    | 2  | 1     | "Main"            | "IF(A1=\"A2\",A2,Other!A2)"       | "IF(A1=\"A2\",A3,Other!A2)"         |
        | column | 2  | 1     | "Main"            | "'O''Brien'!$b$2 + Main!c1"            | "'O''Brien'!$b$2 + Main!D1"             |
        | row    | 3  | 2     | "Main"            | "SUM(A5:A1)"                           | "SUM(A7:A1)"                            |
        | row    | 3  | 2     | "Main"            | "a1 + Other!b2"                        | "a1 + Other!b2"                         |
        | row    | 2  | 1     | "main"            | "Main!A1:A3"                           | "Main!A1:A4"                            |

    @profile-static-reference-api @id-xlsx-go-static-remap-refusal
    Scenario Outline: A <variant> insertion refuses without a partial replacement
      Given the formula source is JSON <source_json> in context sheet Main
      When the static remapper inserts <axis> at <at> by <count> on sheet JSON <change_sheet_json>
      Then it returns an error and an empty replacement expression
      Examples:
        | variant               | source_json     | axis   | at | count | change_sheet_json |
        | invalid axis          | "A1+B1"        | bad    | 1  | 1     | "Main"            |
        | zero coordinate       | "A1+B1"        | row    | 0  | 1     | "Main"            |
        | zero count            | "A1+B1"        | column | 1  | 0     | "Main"            |
        | blank sheet           | "A1+B1"        | row    | 1  | 1     | ""                |
        | row overflow          | "A1048576"     | row    | 1  | 1     | "Main"            |
        | column overflow       | "XFD1"         | column | 1  | 1     | "Main"            |
        | dynamic reference     | "INDIRECT(A1)" | row    | 1  | 1     | "Main"            |

    @profile-static-reference-api @id-xlsx-go-static-reference-properties
    Scenario: Static reference slices and unaffected remaps remain stable in a finite expression matrix
      Given cell tokens A1, $B2, C$3 and $XFD$9
      And optional prefixes empty, Main! and 'Input Data'! with operators +, -, *, /, & and >=
      When the static analyser checks all 3 by 4 by 4 by 6 source expressions
      Then every expression has two references whose source slices each parse as one matching reference
      And inserting one row at 100 on Main leaves each original expression byte-identical
      And wrapping each expression in SUM preserves its references after adjusting their byte spans
