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

## What to report

Please report issues such as:

- unauthorized access to repository or vault data
- token leakage, secret exposure, or missing redaction
- auth bypass, broken disconnect/revoke behavior, or refresh-token misuse
- sync behavior that writes outside the configured repository or vault scope
- destructive sync behavior that bypasses required preview/approval safeguards
- release, CI, or supply-chain issues that could compromise published plugin artifacts

## Reporting a vulnerability

Preferred channel: **GitHub Private Vulnerability Reporting** for this repository.

If private reporting is not yet enabled:

1. **Do not** open a public issue with exploit details.
2. Open a minimal issue that only asks for a private security contact, or contact the maintainer through the repository owner profile without including the exploit details publicly.
3. Wait for a private channel before sharing proof-of-concept material.

## Safe report contents

Please include, when possible:

- affected version or commit
- impact summary
- reproduction steps
- whether a secret, token, or private note content could be exposed

Please do **not** include:

- raw access tokens, refresh tokens, client secrets, or private keys
- full plugin `data.json` dumps unless they have been scrubbed
- private note content or attachments unless they are strictly necessary and sanitized
- screenshots or logs that still contain repository URLs, vault paths, or token-shaped strings

## Handling expectations

Maintainers will triage reports privately when possible and may ask for sanitized follow-up evidence.
Do not assume a fixed SLA for public updates; some fixes may need to land quietly before details are disclosed.

## Project-specific security rules

- least-privilege GitHub tokens only
- no telemetry or hidden exfiltration
- no secrets in tests, fixtures, logs, screenshots, or releases
- `.obsidian/` and other configuration files are treated as sensitive surfaces by default
- shared GitHub App trust-boundary changes require docs updates and explicit review
