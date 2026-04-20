# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- GitHub App device-flow auth with shared-app setup, local token refresh, and installed-repository discovery
- sync preview, sync health, destructive-delete approval, and baseline-repair workflows

### Changed

- the plugin now ships as the independent `obsidian-vault-sync-with-github` line maintained by Loptr instead of reusing the inherited fork identity
- the built-in shared GitHub App now points at `obsidian-vault-sync-with-github`
- settings now expose direct sync/preview/health/repair actions and a simpler shared-app repository picker
- preview output is grouped into human-readable sections instead of a raw text dump
