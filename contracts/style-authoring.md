# Named paragraph-style authoring

The [shared feature](../workflows/docx/style-authoring.feature) defines creation
of one named custom paragraph style. A consumer can supply an existing paragraph
base and direct bold/italic flags. Flags represent explicit on/off; omitted flags
add no override. Effective inheritance and rendering are outside this contract.

Create a linked styles part with the expected Word styles content type when no
registry exists. Preserve orphan members. When a registry exists, retain all old
definitions and unrelated package bytes. The new style must survive save/reopen
and be selectable on a paragraph without changing its text.

Refuse duplicate or malformed registry IDs, unresolved/non-paragraph/cyclic base
chains, duplicate/external style relationships, incorrect MIME/root, protection,
stale document state, invalid arguments and dual stylesWithEffects registries.
Refusals preserve archive bytes and handle state. Definition creation does not
change document XML or invalidate paragraph offsets.

The 7 creation variants and 17 refusal variants are contracts, not test results.
Consumer bindings and execution evidence remain local. Reference-only adoption
by another consumer does not establish style authoring support.
