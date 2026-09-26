# Existing slide permutation

The [shared feature](../workflows/pptx/slide-order.feature) specifies an exact
permutation of existing slides. Reordering changes only presentation slide-list
positions; slide IDs, relationship IDs, slide parts, notes and unrelated payloads
remain unchanged. Existing slide handles retain identity and report new indexes.

The saved deck must reopen in the requested title/notes order. A semantic no-op
retains exact archive bytes. Duplicate/missing/out-of-range/fractional indexes,
ambiguous IDs/targets/lists, wrong slide MIME, lexical barriers, unsupported
custom-show/extension metadata, protection and stale presentation state refuse
without changing bytes or handle order.

The 7 positive and 14 refusal variants are canonical contracts, not consumer
execution evidence. Clone/import/delete, additional order-dependent metadata and
Microsoft PowerPoint rendering are outside this slice. Reference-only adoption
by another consumer supplies no slide-reordering credit.
