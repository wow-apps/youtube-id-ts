# Code of Conduct

This document describes the coding standards and best practices for the project.
All code must pass automated quality checks before merging to main.

## TypeScript

We use **ESLint** for linting and **TypeScript** for type checking.

### Rules

- Node.js 18+ required
- Use TypeScript strict mode
- Use type annotations for all public functions
- Use modern TypeScript/ES2022+ syntax

### Lint Rules (ESLint)

| Plugin              | Description                    |
|---------------------|--------------------------------|
| @eslint/js          | Core JavaScript rules          |
| typescript-eslint   | TypeScript-specific rules      |
| strict              | Strict type-checked rules      |
| stylistic           | Code style consistency         |

### Type Checking (TypeScript)

- Strict mode enabled
- All functions must have type annotations
- No implicit `any` types
- Exact optional property types enabled

### Commands

```bash
# Lint check
npm run lint

# Auto-fix
npm run lint:fix

# Type check
npm run typecheck
```

### Configuration

See `eslint.config.js` for ESLint rules and `tsconfig.json` for TypeScript settings.

### Useful Links

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [typescript-eslint](https://typescript-eslint.io/)

## Testing

We use **Vitest** for testing and coverage.

### Rules

- Minimum 95% code coverage required for core modules
- All public functions must have tests
- Use descriptive test names
- Group tests in `describe` blocks by functionality

### Commands

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npx vitest run tests/converter.test.ts
```

### Configuration

See `vitest.config.ts` for test configuration.

### Useful Links

- [Vitest Documentation](https://vitest.dev/)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)

## Markdown

We use **markdownlint** for linting.

### Rules

- Headings must have 1 blank line above
- Multiple headings with same content allowed at different levels
- No line length limit (MD013 disabled)

### Commands

```bash
# Lint markdown files
npx markdownlint-cli2 "**/*.md" "#node_modules" "#CLAUDE.md"
```

### Configuration

See `.markdownlint.json` for linting rules.

### Useful Links

- [markdownlint Documentation](https://github.com/DavidAnson/markdownlint)
- [Markdown Guide](https://www.markdownguide.org/)

## Git Workflow

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Fix bug" not "Fixes bug")
- Keep first line under 72 characters
- Reference issues when applicable

### Branch Naming

- `feature/` - new features
- `fix/` - bug fixes
- `docs/` - documentation updates
- `refactor/` - code refactoring

## Pre-commit Checklist

Before committing, ensure:

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] All new code has type annotations
- [ ] All new functions have tests
