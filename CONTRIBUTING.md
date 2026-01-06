# Contributing

Thank you for your interest in contributing to youtube-id! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/your-username/youtube-id-ts.git
   cd youtube-id-ts
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the package:

   ```bash
   npm run build
   ```

## Development Workflow

### Making Changes

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [Code of Conduct](CODE_OF_CONDUCT.md)

3. Run quality checks:

   ```bash
   # Lint
   npm run lint

   # Type check
   npm run typecheck

   # Tests with coverage
   npm run test:coverage
   ```

4. Commit your changes:

   ```bash
   git add .
   git commit -m "Add your descriptive message"
   ```

### Code Quality Requirements

All contributions must:

- Pass `npm run lint` with no errors
- Pass `npm run typecheck` with no errors
- Maintain 95%+ test coverage for core modules
- Include type annotations for all public functions
- Include tests for new functionality

## Pull Request Process

1. Update documentation if needed
2. Ensure all checks pass
3. Create a pull request with a clear description
4. Link any related issues

### PR Title Format

- `feat: Add new feature`
- `fix: Fix bug description`
- `docs: Update documentation`
- `refactor: Refactor code`
- `test: Add tests`

## Branch Naming

| Prefix      | Purpose          |
|-------------|------------------|
| `feature/`  | New features     |
| `fix/`      | Bug fixes        |
| `docs/`     | Documentation    |
| `refactor/` | Code refactoring |
| `test/`     | Test additions   |

## Reporting Issues

When reporting issues, please include:

- Node.js version
- Operating system
- Minimal code example to reproduce
- Expected vs actual behavior

## Questions?

Feel free to open an issue for any questions or suggestions.
