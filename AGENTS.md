# Shared OOXML references

This repository owns shared facts, constants, provenance, fixtures, workflow
Gherkin and cross-language mapping ledgers for rcarmo OOXML implementations.
It does not implement document editing or confer parity on a consumer.

- Import committed source blobs only; retain their origin, revision, path,
  byte length and SHA-256. Never silently regenerate a fixture.
- Never change a published tag. Storage migrations receive a new distribution
  seal; preserve fixture hashes and scenario identities across the migration.
- Store fixtures once under fixtures/<format>/<scenario-group>/, regardless of
  origin. Reuse stable manifest IDs across scenarios, never copies or symlinks.
- Facts need evidence. Record disagreements; do not pick a value by source majority.
- Common workflow contracts have stable IDs and expected observable outcomes.
  Per-consumer implementation status and execution evidence are separate.
- Tags are immutable. Consumers pin the same tag's commit as a Git submodule;
  no runtime fetching, floating branches or copied fallback corpora.
- Validate hashes, registry references and workflow ledgers before tagging.
- Commit as Rui Carmo <rcarmo@users.noreply.github.com>, local/global configured.
- Never rebase or rewrite a published tag. Coordinate migrations across consumers.

## Priority coordination

Use `chat` with `target_agent_name: "@alias"` and explicit `mode: "steer"` for
scope changes, stop/hold requests, release corrections, safety blockers and
unblocking decisions. Reserve `mode: "queue"` for routine progress. Name the
current revision, requested action, owner and superseded notice. Receivers verify
current state and acknowledge once; delayed messages must not restart obsolete
work. Use `session_control` only for runtime/session operations.
