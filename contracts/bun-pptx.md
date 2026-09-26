# Bun presentation reads and anchored edits

The [open/save profile](../workflows/native/pptx-text.feature) opens the same
presentation from a path and from bytes. A save without edits retains the exact
archive. The path input also exposes the first slide's `Frankenstein` title.

The [existing text workflow](../workflows/native/pptx-text.feature) covers
relationship-ordered slides, read-only notes, cross-run replacement and stale
anchor refusal. Missing notes stay missing. Reading line breaks and visible
field text is supported, while editing that mixed topology is refused.

Cross-run replacement saves and reopens the presentation before comparing the
new title and selected run attributes. The example also compares two unrelated
member payloads and the package's change list. The stale-anchor example retains
the successful first replacement when a second attempt fails.

The [source mapping](../ledgers/consumers/bun-pptx.json) pins the unit declarations,
operation helpers and fixture selection. It distinguishes the acceptance runner's
aggregate result from the direct title, attribute and archive-byte assertions.
These samples do not test rendering, full field evaluation or inherited style
resolution.
