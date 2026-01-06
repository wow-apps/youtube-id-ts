---
applyTo: "**/*.md"
---

# Markdown Instructions

## Linting

We use **markdownlint** for markdown linting.

## Rules

- Headings must have 1 blank line above
- Multiple headings with same content allowed at different levels (MD024)
- No line length limit (MD013 disabled)

## Excluded Files

- `CLAUDE.md` is excluded from linting

## Commands

```bash
# Lint markdown files
npx markdownlint-cli2 "**/*.md" "#node_modules" "#CLAUDE.md"
```

## Configuration

See `.markdownlint.json` for linting rules.
