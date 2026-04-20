# Contributing

Thanks for contributing.

## Start here

For non-trivial work, read:

- `AGENTS.md`
- `docs/architecture.md`
- `docs/security-model.md`
- `docs/testing.md`
- `docs/release.md`
- `docs/dependency-management.md` when dependencies, hosted services, or workflows are involved

## Ground rules

- prefer pull requests over direct pushes to `main`
- keep changes small and reviewable
- preserve existing plugin behavior unless the change intentionally updates behavior and documents it
- do not introduce real secrets, tokens, or private vault data into the repository, issues, screenshots, or tests
- do not change plugin identity (`id`, `name`, authoring/release identity) casually; see ADR-0007 first
- this repository is an independent continuation, not a mirror-sync fork; upstream PRs should be small and focused when they still apply cleanly there
- prefer browser-safe and mobile-safe runtime code; do not casually add Node/Electron-only runtime assumptions
- do not add telemetry, analytics, or hidden network traffic
- do not silently widen what leaves the local vault

## Before you open a PR

Run:

```bash
npm ci
npm run validate
npm run typecheck
npm run lint
npm test
npm run build
npm run release:preflight
```

If you are preparing the first catalog submission or a release candidate, also run:

```bash
npm run submission:preflight
```

## When docs are required

Update docs in the same change when you modify:

- auth or token handling
- network or trust boundaries
- conflict semantics
- release behavior
- mobile or platform assumptions
- user-visible settings or commands
- public trust-boundary disclosures for the shared GitHub App

## Testing expectations

- code changes should include tests or a clear explanation of why tests are not practical
- sync bugs should come with a regression test when feasible
- manual smoke checks are required before a release is published

## Dependency and workflow changes

- prefer Obsidian platform capabilities, browser APIs, GitHub, and official GitHub Actions before new third-party additions
- new third-party packages, hosted services, vendored drops, or non-official actions require explicit maintainer approval
- if a dependency or workflow change affects auth, token handling, release automation, or network behavior, update docs in the same PR

## Pull request quality bar

A good PR usually includes:

- a focused summary of the problem and change
- notes about user-visible impact
- relevant docs/ADR updates
- proof of validation commands
- confirmation that no secrets, private vault content, or unsafe logs were added
