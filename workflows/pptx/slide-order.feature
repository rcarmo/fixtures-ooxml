@planned
Feature: Reorder existing slides by an exact permutation
  Reordering changes only presentation slide-list order. IDs, relationships,
  slide parts and other payloads are retained. Slide handles retain identity.
  This does not clone, delete, import or reconcile layout/theme metadata.

  @id-pptx-slide-permutation
  Scenario Outline: Reorder slides for <kind>
    Given a native deck prepared for slide-order <kind>
    When its slides are reordered for <kind>
    Then reopened slide order and change receipt match <kind>
    And slide identities and unrelated package bytes are retained
    Examples:
      | kind |
      | reverse |
      | rotate |
      | same |
      | empty |
      | aliased |
      | default-namespace |
      | notes |

  @id-pptx-slide-permutation-refusal
  Scenario Outline: Refuse unsafe slide order for <kind>
    Given an unsafe slide-order input <kind>
    When its slide permutation is attempted
    Then slide-order refusal preserves archive bytes and handle order
    Examples:
      | kind |
      | duplicate-index |
      | missing-index |
      | out-of-range |
      | fractional-index |
      | duplicate-id |
      | duplicate-target |
      | wrong-mime |
      | duplicate-list |
      | lexical-barrier |
      | custom-show |
      | extension-metadata |
      | protected |
      | stale-main |
      | stale-relationships |
