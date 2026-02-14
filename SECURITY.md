# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities via [GitHub Security Advisories](https://github.com/KristjanESPERANTO/temporal-kit/security/advisories/new).

**Note**: This is an open-source project maintained by volunteers. Response times may vary.

## Security Measures

- Automated dependency scanning (Dependabot)
- Weekly security audits via GitHub Actions
- npm audit & signature verification

## Supply-Chain Trust Model

This project uses a CI-driven publish model to improve package provenance and reduce release risk.

- Releases are published from GitHub Actions, not from local developer machines.
- npm packages are published with provenance attestations (`npm publish --provenance`).
- Release workflow uses least-privilege permissions and OIDC (`id-token: write`) for attestations.
- Release tags are verified against `package.json` version before publishing.

## Maintainer Checklist (Release Security)

Before publishing, verify these security controls:

1. `NPM_TOKEN` exists as a repository secret and npm account has 2FA enabled.
2. Publish is executed via GitHub Actions workflows (never local `npm publish`).
3. Provenance is present on npm after publish.
4. If any anomaly appears, revoke npm tokens and rotate credentials immediately.

For the operational release process (stable/`latest` vs pre-release/`next`), see [CONTRIBUTING.md](./CONTRIBUTING.md).
