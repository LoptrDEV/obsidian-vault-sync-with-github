# Vault Sync with GitHub

An Obsidian plugin for bidirectional vault sync with GitHub, without requiring a local Git client.

## Status

This repository is an independent continuation of the upstream `FreezingGod/obsidian-github-api-sync` project.
It started as a fork, but it now ships under its own plugin identity and release channel and is maintained by Loptr. The current identity decision is recorded in [ADR-0007](docs/decisions/0007-independent-plugin-identity-and-release-channel.md).

## Relationship To Upstream

- thanks to `FreezingGod` for creating `obsidian-github-api-sync` and publishing the original foundation this project builds on
- this repository started as a fork of `FreezingGod/obsidian-github-api-sync`
- upstream provenance remains credited in this repository and its history
- focused fixes that are still broadly useful upstream should still be proposed back as small, reviewable changes

## Why This Is Maintained Separately

This repository is no longer just a convenience fork with a couple of local commits on top.
It now carries its own plugin identity, release channel, GitHub App ownership, auth flow, safety UX, and repository governance.

That matters because the repo differs from upstream in ways that affect users and reviewers directly:

- it ships under the independent plugin ID `vault-sync-with-github`
- it uses the maintainer-owned shared GitHub App `obsidian-vault-sync-with-github`
- it includes device-flow auth, installed-repository discovery, token-refresh handling, and a separate local auth-state surface
- it adds preview-first destructive-sync approval, sync health, and baseline repair flows
- it maintains its own documentation, release checks, and public-repo security posture

Because those changes are broader than a small upstream patch series, this repository is maintained as its own line.
When a fix is still narrowly useful upstream, it is better sent back as a focused follow-up than bundled into the full downstream delta.

## What the plugin does

- syncs vault content against a GitHub repository through the GitHub REST API
- preserves folder structure and common file operations
- can initialize a newly created empty GitHub repository on the first successful push
- supports conflict handling and sync logs
- supports a configurable remote sync root and an optional local sync root
- supports sync previews, destructive-delete approval, health diagnostics, and baseline repair commands
- uses a built-in shared GitHub App and can suggest available repositories from the installed app
- is designed to stay usable on Obsidian desktop and mobile; `manifest.json` leaves mobile enabled with `isDesktopOnly: false`, but each release still needs manual smoke coverage on both

## Security and privacy disclosures

### Network access

Yes. The plugin talks to the GitHub API when the user configures GitHub credentials and runs or schedules sync.

### No custom backend

No. The plugin sends requests directly from Obsidian to GitHub endpoints such as `https://github.com/login/*` and `https://api.github.com`. This repository does not run a separate sync relay, token broker, or telemetry collector for the plugin runtime.

### Account requirement

Yes. You need a GitHub account plus the built-in shared GitHub App installed on the target repository.

### Data leaves your device

Yes. The plugin sends data to GitHub for auth, repository discovery, and sync operations.

During GitHub App login and refresh, GitHub receives the bundled public client ID, device-flow requests, authorization completion, and refresh-token exchanges.

During repository discovery, GitHub receives token-authenticated requests for the signed-in viewer, visible app installations, and visible repositories in those installations. That includes data such as your GitHub login, installation IDs, installation account logins, repository names/full names, and whether a listed repository is private.

During sync, GitHub receives the configured repository coordinates and branch, file paths, file contents and attachment bytes for uploaded files, delete/update intents, blob/tree/commit/ref operations, and commit messages created by the plugin. If Remote sync root is set to `Subfolder only`, synced content is constrained to that remote subfolder (for example `vault/`). If Local sync root is set, only that vault-relative subtree is scanned locally before upload planning.

### Secrets

GitHub App auth stores expiring access and refresh tokens locally inside plugin data so the plugin can refresh your login without sending you through the browser each time. This plugin does not send those locally stored tokens to a maintainer-operated backend because there is no such backend in the current design. Do **not** sync `.obsidian/` or plugin settings into a public repository when GitHub App auth is enabled.

### Telemetry

This repository does not define telemetry or analytics as an allowed feature. If that ever changes, it requires an ADR, explicit opt-in design, and disclosure updates.

### Mobile support

The plugin is intended to run on desktop and mobile. `isDesktopOnly: false` only keeps the mobile path available; release readiness still requires manual smoke coverage on both desktop and mobile.

### Shared GitHub App trust boundary

Using the bundled shared GitHub App means trusting both GitHub as the platform operator and the owner of that GitHub App registration.

GitHub can process the login flow, API traffic, and any repository data that you sync there, because the plugin talks directly to GitHub's hosted login and API endpoints.

The runtime user access token used by the plugin is limited to the intersection of what the signed-in user can access and what the app has been granted for the installation.

The shared app owner can change the app's metadata and requested permissions in GitHub. If the app later asks for broader permissions, GitHub requires installation owners to approve those permission increases before they take effect for an installation.

Because the app is maintainer-owned, the app owner could in principle generate installation access tokens outside this plugin and use the app's currently granted repository permissions against repositories where the app is installed. This repository does not ship a proxy or automation that does that for end users, but that trust boundary is inherent in using a third-party shared GitHub App.

The app owner does **not** automatically receive your local vault, your locally stored refresh token, or your plugin data from this plugin. Those stay local unless you sync them into GitHub yourself or share them manually.

If that trust model is not acceptable for a repository, do not install the shared app on that repository.

## Token permissions

The built-in shared app should have:

- repository contents: read/write
- repository metadata: read

## GitHub App setup

The plugin ships with the shared public GitHub App [`obsidian-vault-sync-with-github`](https://github.com/apps/obsidian-vault-sync-with-github), so end users do not need to copy a client ID or install URL into Obsidian.
The app keeps its existing public GitHub name even though the plugin ID is now `vault-sync-with-github`.
Its public client metadata is bundled directly into the plugin, including the client ID `Iv23limhVv4qHkdrM8PN`.

That shared app is expected to have:

- **Enable Device Flow**
- **Expire user authorization tokens** enabled
- `Contents: Read & write`
- `Metadata: Read`

For a public repository like this one, only non-secret app metadata such as the client ID or install URL should be stored in the repo or plugin bundle. Do not commit a client secret or private key.

In the plugin settings:

1. click **Install app** if the shared app is not installed on the target repository yet
2. click **Connect**
3. open GitHub, enter the shown device code, and return to Obsidian
4. if the shared app can see repositories already, pick the repository directly from the built-in repository dropdown

The plugin will store the resulting expiring user token locally and refresh it automatically.
The short code confirmation is a GitHub Device Flow requirement; removing that step would require a different web callback-based auth design.

## Repository map

- `src/` — plugin runtime code
- `tests/` — unit and integration tests
- `scripts/` — build, validation, and governance checks
- `docs/` — architecture, security, testing, release, and ADRs
- `.github/` — CI, security, templates, and maintenance workflows

## Remote and local sync roots

**Remote sync root** controls where the plugin reads and writes inside the GitHub repository.

- **Full repository** maps plugin paths directly to repository root.
- **Subfolder only** maps plugin paths into a configured remote subfolder such as `vault/`.

This is useful for monorepo layouts such as:

```text
second-brain/
├─ docs/
├─ policies/
└─ vault/
   ├─ 00 Inbox/
   └─ ...
```

In that setup, configure **Remote sync root = Subfolder only** and **Remote sync root path = vault** so Obsidian-sync content stays inside `vault/`.

**Local sync root (optional)** controls which vault-relative folder is scanned locally before anything is planned or uploaded.

- Leave it empty to sync the whole vault.
- Set it to a folder such as `Journal` if only that local subtree should participate in sync.
- Combine it with the remote setting when local and remote layout should differ.

Examples:

- `Remote sync root = Full repository`, `Local sync root = ""` syncs the entire vault against repository root.
- `Remote sync root = Subfolder only`, `Remote sync root path = vault`, `Local sync root = ""` syncs the entire vault into `vault/` on GitHub.
- `Remote sync root = Subfolder only`, `Remote sync root path = vault`, `Local sync root = Journal` syncs only `Journal/` locally and stores it under `vault/Journal/` remotely.

## Sync safety and diagnostics

The sync path now uses a preview-first safety model for suspicious delete sets and large remote changes:

- **Preview sync plan** stores a dry-run summary, diagnostics, conflicts, and the exact approval key for the current plan.
- **Approve destructive sync and run** is required when the current plan would delete a large share of local files or when the remote side appears unexpectedly wiped.
- **Show sync health** displays the latest preview/sync result plus recent diagnostics such as compare fallbacks, tree truncation fallback, and last seen GitHub rate-limit headers.
- **Repair sync baseline** rebuilds the stored baseline from the current local and remote state when an interrupted run or a large refactor leaves the baseline stale.
- the settings tab includes direct buttons for `Sync now`, `Preview plan`, `Show health`, `Show log`, `Conflicts`, and `Repair baseline`

Internally, the plugin prefers incremental remote fetches, but falls back to a full remote tree fetch when GitHub's compare or tree APIs may be incomplete.
Remote empty folders that are represented in GitHub by `.gitkeep` placeholders are preserved locally as empty folders; the plugin does not need to keep the `.gitkeep` file itself visible inside the vault.

The preview modal is designed as a human-readable decision surface rather than a raw dump: it summarizes what will happen, groups the planned changes by category, and exposes direct actions such as refresh, sync now, approve-and-run, and health lookup.

## Development

```bash
npm ci
npm run validate
npm run typecheck
npm run lint
npm test
npm run build
npm run release:preflight
```

Build artifacts land in `dist/`.

## Test without catalog submission

Yes — you can test this plugin locally without submitting to the Obsidian community catalog:

1. run `npm ci` and `npm run build`
2. copy `dist/main.js`, `dist/manifest.json`, and optional `dist/styles.css` into a local Obsidian plugin folder
3. enable the plugin in Obsidian (Settings → Community Plugins)

Use the folder name `vault-sync-with-github` for this independent plugin line. If you previously tested either the upstream plugin under `github-api-sync`, an earlier local fork under `obsidian-github-api-sync`, or a pre-submission build of this independent line under `obsidian-vault-sync-with-github`, remove or disable that older local install first so the plugin identities do not compete in the same vault.

If you want to keep existing plugin settings while moving between plugin IDs:

1. close or reload Obsidian so the old plugin is not actively writing state
2. copy the old `data.json` from `.obsidian/plugins/github-api-sync/`, `.obsidian/plugins/obsidian-github-api-sync/`, or `.obsidian/plugins/obsidian-vault-sync-with-github/`
3. place that file at `.obsidian/plugins/vault-sync-with-github/data.json`
4. start Obsidian again and verify the repository, auth state, and sync health

## Release process

This repository uses a draft-release workflow on SemVer tags. Release readiness requires version sync, passing CI, release assets, `versions.json`, and manual smoke checks. See `docs/release.md` for the full checklist.

## Governance docs

Start here for non-trivial work:

- `AGENTS.md`
- `docs/coding-standards.md`
- `docs/dependency-management.md`
- `docs/architecture.md`
- `docs/security-model.md`
- `docs/testing.md`
- `docs/release.md`
- `docs/github-repo-settings.md`
- `docs/decisions/`

## Support

- bugs: use the issue templates under `.github/ISSUE_TEMPLATE/`
- security issues: follow `SECURITY.md` and do not post exploit details publicly
