# Positioned slide text boxes

The [shared feature](../workflows/pptx/text-box.feature) specifies append-only
plain text-box authoring on a slide. The box has explicit nonnegative integer EMU
positions, positive extents, an allocated slide-local shape ID and optional direct
bold/italic flags. Geometry is bounded to 2,147,483,647 per component. Newline
sequences produce separate paragraphs, including empty lines.

Save/reopen must retain the requested geometry, name, text and direct flags.
Existing shapes and unrelated parts remain unchanged. Consumers must refuse
ambiguous shape trees/IDs, invalid arguments, exhausted IDs, nonzero root group
transforms, unsupported alternate content and presentation modification protection.
Refusal must preserve package bytes and mutation epochs.

There are 8 authoring and 15 refusal variants. They carry no execution credit
without native consumer bindings. The contract does not cover inherited layout
formatting, text fitting or independent PowerPoint rendering validation.
