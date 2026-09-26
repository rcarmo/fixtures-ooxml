# Final Word section page geometry

The [feature](../workflows/docx/page-layout.feature) edits the existing final body
section's page size and margins in integer twips. Earlier sections, text, header
and footer relationships, unrelated section children and other package members
stay unchanged.

Dimensions, margins and orientation must be valid and mutually consistent.
Missing, ambiguous, revised, protected or stale geometry is rejected without
changing bytes or handle state. Numerically equivalent values preserve their
original spelling and archive bytes. Saved documents must reopen with the
requested geometry.

Section creation, header/footer editing, mirrored or book-fold layouts and
pagination are separate operations.
