# Contributing to Temporal Kit

Thank you for your interest in contributing! We welcome contributions from the community.

## Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/KristjanESPERANTO/temporal-kit.git
    cd temporal-kit
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start development mode:**
    ```bash
    node --run dev          # Watch mode for development
    ```

## Quality Checks

We maintain high standards for code quality. Before submitting a PR, please ensure all checks pass:

```bash
node --run typecheck     # TypeScript type checking
node --run lint          # Biome linting
node --run test:run      # Run all tests once
node --run test:coverage # Coverage report (100% threshold)
```

You can also run the full CI pipeline locally:
```bash
node --run ci
```

## Testing

We use [Vitest](https://vitest.dev/) for testing.

```bash
node --run test         # Run tests in watch mode
node --run test:ui      # Open Vitest UI
```

## Release Management (Maintainers Only)

We use [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) to automate releases.

```bash
node --run release        # Auto-bump patch version (0.0.1 → 0.0.2)
node --run release:minor  # Bump minor version (0.0.2 → 0.1.0)
node --run release:major  # Bump major version (0.0.2 → 1.0.0)
```

This process automatically:
- Generates/updates `CHANGELOG.md` from conventional commits
- Bumps version in `package.json`
- Creates git commit and tag
- Updates the version in `docs/index.html`

### Publish Channels

- **Stable (`latest`)** is published via [.github/workflows/release.yml](./.github/workflows/release.yml) from GitHub Releases with tag `vX.Y.Z`.
- **Pre-release (`next`)** is published via [.github/workflows/release-next.yml](./.github/workflows/release-next.yml) from GitHub pre-releases (`vX.Y.Z-rc.N`, `-beta.N`, etc.).
- **Smoke mode:** `release-next.yml` supports manual `workflow_dispatch` with `dry_run: true`.

### Maintainer Release Flow

1. Run `node --run ci` locally and ensure branch CI is green.
2. Bump and tag using `node --run release` / `release:minor` / `release:major`.
3. Push commit and tags.
4. Create the appropriate GitHub Release type and tag format as defined in **Publish Channels** above.
5. Verify workflow success and npm package visibility.

For security requirements (token handling, provenance, incident response), see [SECURITY.md](./SECURITY.md).

## Project Standards

- **Type-checked tests:** Vitest validates test types against your code.
- **Modern exports:** Proper `exports` field with type/import/default conditions.
- **Source maps:** Full debugging support in development.
- **Coverage thresholds:** Strict 100% coverage requirement.
