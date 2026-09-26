# Shared OOXML references

This repository owns shared facts, constants, provenance, fixtures, workflow
Gherkin and cross-language mapping ledgers for rcarmo OOXML implementations.
It does not implement document editing or confer parity on a consumer.

- Import committed source blobs only; retain their origin, revision, path,
  byte length and SHA-256. Never silently regenerate a fixture.
- Keep historical packs byte-for-byte, including their original lifecycle tags.
- Facts need evidence. Record disagreements; do not pick a value by source majority.
- Common workflow contracts have stable IDs and expected observable outcomes.
  Per-consumer implementation status and execution evidence are separate.
- Tags are immutable. Consumers pin the same tag's commit as a Git submodule;
  no runtime fetching, floating branches or copied fallback corpora.
- Validate hashes, registry references and workflow ledgers before tagging.
- Commit as Rui Carmo <rcarmo@users.noreply.github.com>, local/global configured.
- Never rebase or rewrite a published tag. Coordinate migrations across consumers.
