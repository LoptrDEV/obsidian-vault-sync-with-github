# Obsidian Community Submission

Use this document for the initial plugin-directory submission to `obsidianmd/obsidian-releases`.

## Current target

- target version: `1.1.0`
- plugin ID: `vault-sync-with-github`
- repository: `LoptrDEV/obsidian-vault-sync-with-github`

## Local preflight

Run these commands before opening the submission PR:

```bash
npm run ci
npm run submission:preflight
```

`npm run submission:preflight` prints the exact `community-plugins.json` entry for the current manifest and repository metadata.

## Release prerequisites

Before submitting, make sure the `1.1.0` GitHub release exists and attaches:

- `main.js`
- `manifest.json`
- `styles.css`

The Git tag, `manifest.json` version, `package.json` version, and root `versions.json` entry must all match.

## `community-plugins.json` entry

Append this entry to the end of `community-plugins.json`:

```json
{
  "id": "vault-sync-with-github",
  "name": "Vault Sync with GitHub",
  "author": "Loptr",
  "description": "Bidirectional vault sync for Obsidian with GitHub.",
  "repo": "LoptrDEV/obsidian-vault-sync-with-github"
}
```

Before opening the PR, search the file once more to confirm that the plugin ID is still unique.

## PR checklist

When you open the PR in `obsidianmd/obsidian-releases`:

1. title it `Add plugin: Vault Sync with GitHub`
2. choose the `Preview` and `Community Plugin` labels/options requested by the template
3. complete every checklist item in the PR body
4. link the public GitHub release `1.1.0`
5. mention that the plugin is an independent continuation with plugin ID `vault-sync-with-github`

## Manual verification to have on hand

Have the following evidence ready in case reviewers ask for it:

- Windows desktop smoke pass
- macOS desktop smoke pass
- at least one mobile smoke pass
- GitHub App device-flow login working on desktop and mobile
- migration from `github-api-sync`, `obsidian-github-api-sync`, and old local `obsidian-vault-sync-with-github` test installs into `vault-sync-with-github`
- preview, approve-and-run, health, repair, and conflict flows behaving correctly

## Remaining external actions

These steps are not fully automatable from this repository:

- publish the `1.1.0` GitHub release after the tag workflow completes
- open the PR against `obsidianmd/obsidian-releases`
- answer review comments on that PR
- verify Code Scanning visibility in the GitHub Security tab with an account that has the right scope
- optionally detach the repository from its fork relationship if you want the public GitHub presentation to look fully independent
