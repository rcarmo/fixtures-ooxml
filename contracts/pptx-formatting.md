# Direct PPTX formatting and visibility

These 20 additional cases edit one retained package through production APIs in Bun, Go and Python. The previous 20 manipulation cases remain intact. All new consumer statuses are planned until separately executed.

## Input and identity

The derived fixture has the same three slide identities, parts, relationships, layouts and notes as the previous manipulation fixture. Only slide 2 Body shape ID 4 paragraphs were replaced during input preparation. Paragraph ordinals and run ordinals are zero-based, direct children only. Paragraph 0 has runs `Existing` and ` suffix`; paragraph 1 reads `Second paragraph`. Run 0 has language en-US, b=1, i=0, u=sng, sz=1800, solid sRGB 112233, Latin typeface Arial. Run 1 has no rPr. Paragraph 0 has alignment l, marL=0, indent=0, line spacing spcPct=100000, before/after spcPts=0. Original shape xfrm is x=1, y=2, cx=1000, cy=1000. No case changes text or run/paragraph counts.

## Direct properties

Visibility is the unqualified CT_Slide `show` Boolean. Hide writes `show="0"`; show writes `show="1"`. Absent means visible; native readers accept XML Boolean spellings 0/1/false/true. Foreign namespaced lookalikes do not define visibility, but ambiguity or malformed values refuse editing. This profile proves OOXML values and identity, without PowerPoint-rendering or application-confirmed hidden-slide credit. Existing retained-input and Office-positive scenarios remain separate.

Geometry patches select one ordinary ungrouped shape by unique cNvPr ID and its direct p:spPr/a:xfrm. x/y are integer EMU 0..100000000; width/height are integer EMU 1..100000000, with x+width and y+height at most 100000000. Rotation is integer DrawingML angle units 0..21599999, 60000 per degree; native controls cover 90 degrees (5400000). Flips are typed Booleans; explicit false differs from absent. Validate an entire geometry patch before writing. Refuse transformed/grouped/locked or ambiguous ownership, unsupported xfrm children and invalid scalar patches.

Run patches change only selected direct a:r/a:rPr. Bold/italic are typed Booleans encoded 1/0. Underline accepts direct `sng` or `none`. Font size is integer hundredths of a point 100..400000. Latin typeface is a nonempty XML-safe string of at most 128 characters. RGB is exactly six uppercase hex digits, encoded a:solidFill/a:srgbClr without theme, alpha or other transformations. An explicit remove operation deletes the selected attribute/child and restores inheritance; explicit false remains a direct override. Keep unpatched direct attributes (including lang), other children, text leaves and other runs byte-for-byte. If rPr is absent, insert it before a:t. Child order follows CT_TextCharacterProperties: solidFill before latin. Do not synthesise inherited appearance or rewrite theme/layout/default text.

Paragraph patches change only selected a:pPr. Alignment `ctr`, margin/indent EMU and spacing units are explicit. marL is integer 0..100000000; indent is integer -100000000..100000000. Point spacing uses a:spcBef/a:spcAft with a:spcPts integer 0..158400. Percent line spacing uses a:lnSpc/a:spcPct integer 1..13200000, 100000=100 percent. Insert missing pPr before the first run. Spacing child order is lnSpc, spcBef, spcAft, then existing bullet/tab/default properties. Keep all unaffected pPr metadata and every run/text byte.

## Custody and refusal

Every case independently parses the saved XML and reopens the presentation graph. Assert exact expected direct values and presence/absence, source archive bytes, exact changed-member set, original names and every unrelated member payload. Check all original slide IDs, rIds, targets, layout/notes links and unselected shapes.

Compare full original/saved XML bytes with only the exact edited span removed: selected opening root tag for visibility, selected xfrm for geometry, selected run rPr for run formatting, selected pPr for paragraph formatting. Within that span, compare every unpatched attribute/child lexical fragment. Visibility-order additionally changes only the presentation sldId list content, retaining literal old entry bytes and original graph identities. No members are added or removed.

Invalid visibility/geometry cases return documented reasons invalid-visibility/invalid-geometry (runtime typed-code mappings recorded) before mutation. No partial result, session change or held-target invalidation is permitted; save/reopen the unchanged session separately. Native controls cover wrong types, limits, stale/foreign/copied targets where supported, duplicate IDs, locks/protection, grouped shapes, hyperlinks/fields/extensions, ambiguous fit/fill/spacing topology and schema-order/namespace barriers. Unsupported inputs refuse before any write. Faults after staging/validation retain caller bytes and session/handles and preserve both existing and absent destinations.

## Provenance and boundaries

Seventeen cases are new project-authored production contracts derived from ECMA-376-1:2016; they have no native staged alias. Three visibility cases retain exact staged capture source IDs/blocks as stronger retained-input profiles, without retiring their weak declarations or awarding source credit. Source fixtures and previous canonical predicates remain sealed in history.

Normative references: §19.3.1.38 (sld); §20.1.7.6 (xfrm); §20.1.2.3.32 (srgbClr); §20.1.8.54 (solidFill); §21.1.2.3.7 (latin); §21.1.2.3.9 (rPr); §21.1.2.2.7 (pPr); §§21.1.2.2.9–12 (spacing). Bounds above are conservative editor policy where narrower than the format.

No new table APIs, slide deletion/duplication/import, charts, themes, rendering, line/branch coverage percentage, publication, pin changes or central execution credit is included. Required closure: exact 20-case receipt in each runtime, independently discriminating saved-output/custody assertions, native refusal/rollback controls, production fault-red/restored controls, full default/candidate gates and parent-reviewed clean local commits.
