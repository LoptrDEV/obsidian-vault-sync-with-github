# Dependency Management

## Goals

Keep the repository close to the official Obsidian plugin tooling baseline, minimize niche add-ons, and close security issues without turning dependency maintenance into guesswork.

This document governs both package dependencies and other external resources used by the repository.

## Scope

Treat the following as external resources:

- npm packages and their transitive update pressure
- GitHub Actions used by workflows
- external APIs, SaaS services, and hosted endpoints
- vendored third-party code, templates, or copied scripts
- bundled third-party assets, schemas, or reference data

## Platform best practice first

For this repository, use the following decision order:

1. Obsidian platform guidance and the official sample-plugin baseline
2. standard browser and web platform APIs that are safe for Obsidian desktop and mobile
3. GitHub platform capabilities, including the REST API, GitHub App model, and official GitHub Actions where applicable
4. the repository's existing approved baseline
5. a new third-party dependency or service only after explicit maintainer approval

Current platform priorities for this repository are Obsidian, the browser/web platform, GitHub, and GitHub Actions.
Microsoft guidance is not a baseline input for this repository today because the plugin does not currently integrate with Microsoft services.

## Baseline policy

- prefer the official Obsidian plugin stack first:
  - `obsidian`
  - `esbuild`
  - `typescript`
  - `eslint`
  - `@eslint/js`
  - `@eslint/json`
  - `typescript-eslint`
  - `eslint-plugin-obsidianmd`
- prefer built-in browser/web APIs over helper libraries when they are already sufficient and keep the runtime mobile-safe
- prefer official GitHub capabilities over custom wrappers when the platform already solves the problem safely
- allow additional tools only when they provide clear value for this repository's real workflow
- remove unused or overlapping tooling instead of carrying it "just in case"
- treat runtime-impacting and build-tooling updates differently during review

## New external resource admission rules

- if Obsidian, the browser platform, GitHub, or GitHub Actions already provide the capability cleanly, use that instead of adding another dependency
- if the capability is small, local, and low-risk, evaluate whether it is simpler to implement and maintain directly inside the repository
- do not default to self-built replacements for security-sensitive or standards-heavy areas such as auth, crypto, HTTP signing, parsers, or protocol implementations when a platform or well-established implementation is the safer choice
- prefer one established tool with clear ownership over multiple overlapping packages
- any new third-party runtime dependency, GitHub Action outside the official vendor set, hosted service, vendored code drop, or bundled third-party asset requires explicit maintainer approval before landing
- approval should be visible in the PR, issue, or ADR so later maintenance work can see that the exception was intentional

## Security check for every external resource

Before adding or substantially changing any external resource, review:

- trust boundary impact, including whether new data, metadata, or credentials leave the device
- required permissions, scopes, and runtime access
- browser-safety and mobile-safety for Obsidian runtime code
- maintainer health, release cadence, and whether the project appears actively maintained
- license compatibility with this public repository
- disclosure needs in `README.md`, `docs/security-model.md`, and release notes
- whether the resource increases supply-chain risk more than the feature justifies

If the resource affects auth, token handling, sync scope, release automation, or user-visible network behavior, update tests and docs in the same change.

## Current update entry points

- `npm run deps:outdated` shows newer package versions without failing just because updates exist
- `npm run deps:audit` checks the full dependency tree, including maintainer tooling
- `npm run deps:audit:prod` checks production/runtime dependencies only
- `npm run deps:update` refreshes packages within the currently declared semver ranges
- `npm run deps:review` runs the standard local review sequence and only fails when a review step actually errors

## Automated updates

Dependabot is configured to:

- check npm dependencies weekly
- check GitHub Actions weekly
- group patch/minor updates so routine maintenance stays reviewable
- leave major-version changes separate for deliberate review

Security-related Dependabot PRs should be reviewed ahead of ordinary maintenance updates.

## Lifecycle management

- keep the current external-resource footprint documented in `docs/dependency-inventory.md`
- review npm and GitHub Actions updates regularly through Dependabot and the `deps:*` scripts
- before release, confirm that unresolved vulnerabilities are understood, triaged, and acceptable under current policy
- remove stale, unused, or redundant resources instead of carrying dead weight forward
- when removing an external resource, also remove associated docs, config, workflow references, and stale public disclosures
- when adding or removing an external resource category, update this document and any affected governance docs in the same change

## Review procedure

For each dependency-update PR, new external-resource proposal, or local update sweep:

1. classify the change:
   - Obsidian/platform tooling
   - browser/platform capability
   - GitHub or GitHub Actions capability
   - test-only tooling
   - GitHub Actions / repository automation
   - external service or hosted endpoint
   - vendored third-party code or assets
   - transitive security fix
2. read the release notes or changelog for majors and security-sensitive packages
3. run:

```bash
npm run deps:review
npm run validate
npm run typecheck
npm run lint
npm test
npm run build
npm run release:preflight
```

4. if the update changes build output, lint behavior, auth flows, or network behavior, review README and docs for drift
5. before release, confirm there are no unresolved runtime dependency vulnerabilities

## Triage rules

- patch and minor updates for the Obsidian baseline stack are preferred when validation stays green
- major updates require explicit review of migration notes and resulting repo changes
- runtime dependency vulnerabilities should block release readiness until fixed or intentionally downgraded by policy
- dev-tool-only vulnerabilities may be scheduled, but should not be ignored indefinitely in a public repository
- if a package repeatedly causes churn without meaningful value, prefer removing it over babysitting it
- if a proposed external resource would be easy to replace with a small local utility, prefer the simpler long-term ownership model
- if a proposed self-built solution would be harder to audit or maintain than an established dependency, prefer the established dependency with explicit approval instead of inventing infrastructure casually

## Stylelint note

This repository intentionally does not require `stylelint` as part of the baseline.

Reasons:

- Obsidian's official sample plugin baseline focuses on TypeScript, esbuild, and ESLint with `eslint-plugin-obsidianmd`
- this repository currently ships a single small `styles.css`
- CSS guidance still exists in `docs/coding-standards.md`, but the extra CSS-specific toolchain is optional rather than required for release hygiene

If the stylesheet grows substantially or CSS regressions become a real maintenance problem, reintroducing `stylelint` can still be revisited as a deliberate tradeoff.
