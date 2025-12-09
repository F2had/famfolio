# Contributing to Famfolio

Thanks for your interest in contributing! This document outlines how to get started.

## Development Setup

```bash
git clone https://github.com/F2had/famfolio.git  # HTTPS
git clone git@github.com:F2had/famfolio.git      # SSH (requires keys)

cd famfolio
bun install  # Install dependencies
bun dev      # Start development server
```

## Project Structure

```
src/
├── assets/styles/      # SCSS variables, typography, animations
├── components/
│   ├── common/         # Reusable components (BaseButton, etc.)
│   ├── layout/         # Navigation, Footer, SectionWrapper
│   ├── sections/       # Hero, About, Projects, Contact
│   └── transitions/    # Theme and locale transition effects
├── composables/        # Vue composables (useTheme, useLocale, etc.)
├── locales/            # Translation files (en.json, ar.json)
├── plugins/            # Vuetify and i18n setup
└── types/              # TypeScript definitions
```

## Code Style

- **Vue**: Composition API with `<script setup>`
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (runs automatically via pre-commit hook)
- **Linting**: OXLint + ESLint

Pre-commit hooks will automatically lint and format your code.

## Making Changes

### 1. Create a Branch

```bash
git switch -c feature/your-feature-name
```

### 2. Make Your Changes

- Follow existing code patterns
- Add TypeScript types for new features
- Test RTL layout if modifying UI components
- Respect `prefers-reduced-motion` for animations

### 3. Test Locally

```bash
# Run linters
bun run lint

# Type check
bun run type-check

# Test CI locally (requires act)
bun run ci:test
```

### 4. Commit

Commits are automatically linted. Use clear, descriptive messages:

```bash
git commit -m "feat: add new animation option"
git commit -m "fix: resolve RTL layout issue in nav"
git commit -m "docs: update configuration examples"
```

### 5. Submit PR

- Push your branch and open a PR
- Fill out the PR template
- Link any related issues

## Types of Contributions

### Bug Fixes

1. Check existing issues first
2. Create a minimal reproduction if possible
3. Submit a PR with the fix

### New Features

1. Open an issue first to discuss the feature
2. Wait for approval before starting work
3. Keep PRs focused on a single feature

### Documentation

- Fix typos, clarify explanations
- Add examples for configuration options
- Translate to new languages

### Translations

To add a new language:

1. Create `src/locales/{code}.json`
2. Add locale to `config/site.config.yaml`
3. Add fonts if needed in `_typography.scss`

## Testing RTL

Always test RTL when modifying layout:

1. Switch to Arabic in the locale toggle
2. Check text alignment, spacing, and icons
3. Verify animations work in both directions

## Questions?

- Open a [Discussion](https://github.com/USERNAME/famfolio/discussions)
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
