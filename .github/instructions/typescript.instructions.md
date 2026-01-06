---
applyTo: "**/*.ts"
---

# TypeScript Code Instructions

## Formatting Authority

**ESLint is the single source of truth for code formatting and linting.**

- Do NOT suggest formatting changes that conflict with ESLint
- Do NOT suggest style changes based on personal preferences
- Run `npm run lint` to verify linting before suggesting changes
- Run `npm run typecheck` to verify types before suggesting changes

## Code Style

- Node.js 18+ required
- TypeScript strict mode enabled
- Use modern TypeScript/ES2022+ syntax
- Use `enum` for enumerations
- Use type annotations for all public functions

## Linting Rules (ESLint)

Enabled configurations:
- `@eslint/js` - Core JavaScript rules
- `typescript-eslint/strict` - Strict TypeScript rules
- `typescript-eslint/stylistic` - Code style consistency

## Type Checking (TypeScript)

- Strict mode enabled
- All functions must have type annotations
- No implicit `any` types
- Use `string | null` instead of complex union types where possible
- Exact optional property types enabled

## Testing

- Vitest for testing
- Minimum 95% code coverage required for core modules
- All public functions must have tests
- Use descriptive test names

## Commands

```bash
# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Type check
npm run typecheck

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```
