@planned
Feature: Inspect presentation slide layouts for content placement

  Rule: Rank existing layouts without editing the presentation
    This is a recommendation API profile. Layout names, indices, classifications,
    scores and tie order are fixed for the pinned presentation; they do not define
    how an Office renderer must place slide content.

    @profile-layout-ranking @id-pptx-layout-recommendation-ranked
    Scenario Outline: Recommend an existing layout for <content_type> with exact ranking
      Given fixture fixture-c54a7b746c0328fc1930525edd91387eedbbca69a6f388f7ec024150187b6bab is an unchanged PPTX with eleven layouts in presentation order
      When the saved presentation's layouts are recommended for content type "<content_type>"
      Then the result's content_type equals "<content_type>"
      And its recommended index, name, classification and score equal <recommended>
      And its first three alternatives equal <alternatives> in order, including zero-score ties
      And its next_tools list equals ["pptx_add_slide"]
      And the source archive bytes and every member payload still equal the sealed input

      Examples:
        | content_type | recommended                              | alternatives                                                                                                                            |
        | title        | [0,"Title Slide","title_slide",2]       | [[2,"Section Header","section_header",1],[1,"Title and Content","title_and_content",0],[3,"Two Content","two_content",0]]       |
        | bullets      | [1,"Title and Content","title_and_content",2] | [[9,"Title and Vertical Text","title_and_vertical_text",1],[10,"Vertical Title and Text","title_and_vertical_text",1],[0,"Title Slide","title_slide",0]] |
        | table        | [1,"Title and Content","title_and_content",3] | [[5,"Title Only","title_only",2],[6,"Blank","blank",1],[0,"Title Slide","title_slide",0]]                                  |
        | comparison   | [4,"Comparison","comparison",2]         | [[3,"Two Content","two_content",1],[0,"Title Slide","title_slide",0],[1,"Title and Content","title_and_content",0]]             |
        | blank        | [6,"Blank","blank",2]                   | [[5,"Title Only","title_only",1],[0,"Title Slide","title_slide",0],[1,"Title and Content","title_and_content",0]]               |

    @profile-layout-ranking @id-pptx-layout-recommendation-missing-file
    Scenario: A missing presentation refuses before any layout inspection or output
      Given the sealed eleven-layout PPTX remains available for a subsequent read
      When a layout recommendation for title is requested from an absent sibling path named missing-layout-recommendation.pptx
      Then the result reports File not found with the exact absent path
      And no output archive is created and the sealed presentation's archive bytes remain unchanged
