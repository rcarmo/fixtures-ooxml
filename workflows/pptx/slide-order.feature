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

  @profile-retained-manipulation @id-pptx-manipulation-reorder
  Scenario: relationship-ordered slides
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And the presentation slide list is selected by its original part and unique identity
    When production presentation editing APIs apply zero-based permutation [0,2,1]
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved the presentation slide list has exact properties JSON {"titles":["Alpha","Gamma","Beta"],"originalSlideIdentityOrder":[1,3,2]}
    And only original member payloads ["ppt/presentation.xml"] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes
    And all pre-existing slides retain their original IDs, relationship IDs, targets, layout links and notes links

  @profile-retained-manipulation @id-pptx-manipulation-reorder-refusal
  Scenario: invalid permutation atomic refusal
    Given the sealed PPTX fixture fixture-5ad4b68acc5a926c020dbc94154c95fa6c40c7353a55b2f82504879b392e9a45 with ordered titles ["Alpha","Beta","Gamma"]
    And the presentation slide list is selected by its original part and unique identity
    When production presentation editing APIs attempt zero-based permutation [0,1,2,3,4,5]
    And the resulting presentation is saved to a new path and independently parsed and reopened
    Then the saved the presentation slide list has exact properties JSON {"refusal":true,"reason":"invalid-permutation","titles":["Alpha","Beta","Gamma"],"unchangedSession":true,"unchangedHandles":true}
    And only original member payloads [] may change
    And the original member name set is unchanged
    And the supplied archive, unrelated member payloads and unaffected lexical XML spans retain their original bytes, and the refusal returns invalid-permutation without changing session or handles
