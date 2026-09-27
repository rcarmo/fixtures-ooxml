@planned
Feature: Read a Word document's completion audit without modifying it

  Rule: Report issue counts and recommendations for concrete saved documents
    This is an audit API profile. A heading after an empty document start reports
    Document Start as an empty section, deducting five points even if the named
    section has body text. Do not infer a perfect score from a test name.

    @profile-completion-audit @id-docx-audit-completion-read
    Scenario Outline: Audit a <variant> completed document with its observed empty-start issue
      Given fixture fixture-b051c0c2ff43f2ab9213e19a52ccbc51217537cf3b336d54a68a91beb6670f9a is a blank Word document
      And a separate temporary copy contains Heading 1 "<heading>" and a Normal paragraph "<body>"
      And the authored copy is saved and reopened before recording its archive SHA-256, bytes, every member payload and relationships
      When the saved copy at its exact path is audited for completion without writing
      Then the result's file equals the exact authored input path and success is true
      And its status is READY, score is 95, recommendation is "Document appears complete and ready for review."
      And its summary equals {"placeholders_found":0,"empty_sections":1,"empty_table_cells":0,"instruction_remnants":0,"pending_changes":false}
      And its issues equal {"placeholders":[],"empty_sections":["Document Start"],"empty_table_cells":[],"instruction_remnants":[],"pending_track_changes":false}
      And its next_tools equals ["word_cleanup_sow"]
      And the authored archive SHA-256, full bytes, every member payload and relationships remain unchanged
      And the sealed blank document fixture bytes remain unchanged

      Examples:
        | variant  | heading          | body                                   |
        | deep     | Complete Project | All content is filled in properly.     |
        | workflow | Document         | Complete content without placeholders  |

    @profile-completion-audit @id-docx-audit-completion-placeholders
    Scenario: Placeholder issues retain their exact heading and paragraph contexts
      Given a temporary copy of fixture fixture-b051c0c2ff43f2ab9213e19a52ccbc51217537cf3b336d54a68a91beb6670f9a has Heading 1 "Project: <Name>" and Normal paragraph "Customer: [TBD]"
      And that copy is saved and reopened before its archive SHA-256, bytes, member payloads and relationships are recorded
      When the saved copy is audited for completion without writing
      Then its file equals the exact authored input path, success is true, status is NEEDS_REVIEW and score is 85
      And its summary equals {"placeholders_found":2,"empty_sections":1,"empty_table_cells":0,"instruction_remnants":0,"pending_changes":false}
      And its ordered placeholder issues are <Name> in Heading 1 context "Project: <Name>" and [TBD] in paragraph context "Customer: [TBD]", both located in "Project: <Name>"
      And its other issues contain only empty_sections ["Document Start"] with no empty_table_cells, instruction_remnants or pending_track_changes
      And its next_tools equals ["word_audit_sow","word_fix_split_placeholders","word_patch_placeholder"]
      And the authored archive SHA-256, full bytes, every member payload and relationships remain unchanged
      And the sealed blank document fixture bytes remain unchanged

    @profile-completion-audit @id-docx-audit-completion-missing-file
    Scenario: Missing audit input refuses without producing output
      Given the sealed blank Word fixture remains available and its archive bytes are recorded
      When completion is audited from an absent sibling path named missing-completion-audit.docx
      Then the result equals {"error":"File not found: <exact absent path>"}
      And no output document is created and the sealed blank fixture archive bytes remain unchanged
