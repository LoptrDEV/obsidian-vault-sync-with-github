# Security Policy

## Supported versions

This repository is maintained as an independent continuation of the upstream project.
The current independent plugin line has no published releases yet.
Historical inherited tags may still exist because this repository started from upstream history, but they are not supported releases of this independent plugin line.

| Version | Supported |
| --- | --- |
| `main` | :white_check_mark: active development |
| inherited historical tags | :x: unsupported |
| future tagged releases of this plugin line | :x: none published yet |

## Reporting a vulnerability

Preferred channel: **GitHub Private Vulnerability Reporting** for this repository.

If private reporting is not yet enabled:

1. **Do not** open a public issue with exploit details.
2. Open a minimal issue that only asks for a private security contact, or contact the maintainer through the repository owner profile without including the exploit details publicly.
3. Wait for a private channel before sharing proof-of-concept material.

## Handling expectations

Please include, when possible:

- affected version or commit
- impact summary
- reproduction steps
- whether a secret, token, or private note content could be exposed

## Project-specific security rules

- least-privilege GitHub tokens only
- no telemetry or hidden exfiltration
- no secrets in tests, fixtures, logs, screenshots, or releases
- `.obsidian/` and other configuration files are treated as sensitive surfaces by default
