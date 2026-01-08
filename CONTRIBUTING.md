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

## Project Standards

- **Type-checked tests:** Vitest validates test types against your code.
- **Modern exports:** Proper `exports` field with type/import/default conditions.
- **Source maps:** Full debugging support in development.
- **Coverage thresholds:** Strict 100% coverage requirement.
