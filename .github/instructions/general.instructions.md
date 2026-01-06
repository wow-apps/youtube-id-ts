---
applyTo: "**/*"
---

# General Project Instructions

## Project Overview

youtube-like-id is a TypeScript library for generating YouTube-style short IDs from numbers.
Lightweight, fast, and reversible base62 encoder with optional obfuscation.

## Tech Stack

- Node.js 18+
- npm for dependency management
- TypeScript for type safety
- ESLint for linting
- Vitest for testing
- tsup for building (ESM + CJS dual output)
- markdownlint for markdown linting

## Quality Requirements

All code must pass automated quality checks before merging:

1. `npm run lint` - no linting errors
2. `npm run typecheck` - no type errors
3. `npm test` - tests pass
4. 95%+ coverage for core modules

## Branch Naming

- `feature/` - new features
- `fix/` - bug fixes
- `docs/` - documentation updates
- `refactor/` - code refactoring
- `test/` - test additions

## PR Title Format

Must start with one of: `feature/`, `fix/`, `docs/`, `refactor/`, `test/`
(case-insensitive)

## Important Notes

- Do NOT suggest changes that conflict with ESLint rules
- ESLint is the authority for TypeScript code style, not manual preferences
- All TypeScript code must have type annotations
- Zero external dependencies in production code
