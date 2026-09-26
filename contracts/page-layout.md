# Final Word section page geometry

The [shared feature](../workflows/docx/page-layout.feature) selects direct geometry
on the existing final body section. It changes page width/height/orientation and
seven margin/distance values in integer twips. Earlier paragraph sections, text,
header/footer relationships and unrelated parts remain unchanged.

A numeric no-op preserves exact archive bytes. Saved/reopened geometry must match
the requested values. Missing/duplicate/misplaced sections or geometry, malformed
attributes, section revisions, invalid content rectangles, protection and stale
state refuse atomically. This contract does not create sections, calculate mirrored
or printer-specific layout, or establish general pagination/rendering fidelity.

There are 8 positive and 14 refusal variants. These are canonical inputs/outcomes;
consumer-native execution and independent oracle results are recorded separately.
Reference-only adoption by Go or Python gives no page-layout execution credit.
