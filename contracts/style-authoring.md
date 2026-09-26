# Named paragraph-style authoring

The [shared feature](../workflows/docx/style-authoring.feature) defines creation
of one named custom paragraph style. Supply an existing paragraph
base and optional bold/italic properties. Omitted properties inherit; style
properties follow the specification's toggle rules. This operation writes the
definition without evaluating the effective formatting.

Create a linked styles part with the expected Word styles content type when no
registry exists. Preserve orphan members. When a registry exists, retain all old
definitions and unrelated package bytes. The new style must survive save/reopen
and be selectable on a paragraph without changing its text.

Refuse duplicate or malformed registry IDs, unresolved/non-paragraph/cyclic base
chains, duplicate/external style relationships, incorrect MIME/root, protection,
stale document state, invalid arguments and dual stylesWithEffects registries.
Refusals preserve archive bytes and handle state. Definition creation does not
change document XML or invalidate paragraph offsets.
