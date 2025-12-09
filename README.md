<div align="center">

# Famfolio

**A modern, configurable portfolio template with full RTL support and delightful animations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/F2had/famfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/F2had/famfolio/actions/workflows/ci.yml)
[![Lighthouse](https://github.com/F2had/famfolio/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/F2had/famfolio/actions/workflows/lighthouse.yml)
[![GitHub stars](https://img.shields.io/github/stars/F2had/famfolio)](https://github.com/F2had/famfolio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/F2had/famfolio)](https://github.com/F2had/famfolio/network/members)
[![GitHub issues](https://img.shields.io/github/issues/F2had/famfolio)](https://github.com/F2had/famfolio/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/F2had/famfolio)](https://github.com/F2had/famfolio/commits/master)

[![Node](https://img.shields.io/badge/Node-20%2B-green.svg)](https://nodejs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0%2B-f472b6.svg)](https://bun.sh/)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883.svg)](https://vuejs.org/)

[Demo](https://f2had.github.io/famfolio) · [Documentation](#configuration)

 <!-- · [العربية](docs/README.ar.md) -->

</div>

---

## Features

- **Single Configuration File** - Everything controlled via `config/site.config.yaml`
- **Full RTL Support** - Arabic and other RTL languages with automatic layout mirroring
- **Per-Locale Fonts** - Different font families for each language (e.g., Outfit for English, Tajawal for Arabic)
- **Dark/Light Themes** - System-aware with smooth animated transitions
- **Animated Transitions** - Mascot-driven theme switch, page flip locale change
- **Interactive Mascot** - Playful blob character that follows your cursor
- **Kinetic Typography** - Letter-by-letter animations (LTR) or word animations (RTL)
- **Self-Hosted Fonts** - No external dependencies (Fontsource)
- **Accessibility** - Respects `prefers-reduced-motion`, keyboard navigation, ARIA labels
- **OG Image Generation** - Auto-generate social images for all themes/locales
- **Security Features** - Email obfuscation, honeypot spam protection, CSP headers, secure external links

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ or 22+
- [Bun](https://bun.sh/) 1.0+ (recommended) or npm/pnpm

### Installation

```bash
git clone https://github.com/F2had/famfolio.git  # HTTPS
git clone git@github.com:F2had/famfolio.git      # SSH (requires keys)

cd famfolio
bun install  # Install dependencies
bun dev      # Start development server
```

### Configure Your Portfolio

Edit `config/site.config.yaml`:

```yaml
personal:
  name:
    en: 'Your Name'
    ar: 'اسمك'
  title:
    en: 'Software Engineer'
    ar: 'مهندس برمجيات'
```

### Build for Production

```bash
bun run build
```

Output will be in the `dist/` folder, ready for static hosting.

---

## Use as Template

Famfolio is designed to be used as a template for your own portfolio. Here's how to create your own and keep it updated with new features.

### Option 1: GitHub Template (Recommended)

1. Click **"Use this template"** → **"Create a new repository"** on GitHub
2. Clone your new repository
3. Edit `config/site.config.yaml` with your information
4. Push and deploy!

### Option 2: Fork

1. **Fork** this repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/F2had/famfolio.git portfolio
   cd portfolio
   ```
3. Edit `config/site.config.yaml` and customize as needed
4. Push to your repository

### Syncing Updates from Template

To get new features, bug fixes, and improvements from the original template:

```bash
# Add the original repo as a remote (only once)
git remote add template https://github.com/F2had/famfolio.git

# Fetch and merge updates
git fetch template
git merge template/master --allow-unrelated-histories

# Resolve any conflicts, then push
git push
```

**Tips for smooth updates:**

- Keep your customizations organized (fonts in one commit, config in another)
- The main conflict areas are `config/site.config.yaml` and custom fonts/styles
- Review the template's changelog before merging major updates

### What You'll Typically Customize

| File/Folder                          | What to Change                                 |
| ------------------------------------ | ---------------------------------------------- |
| `config/site.config.yaml`            | All your personal info, projects, colors, etc. |
| `src/locales/*.json`                 | UI text if adding new languages                |
| `src/assets/styles/_typography.scss` | If adding custom fonts                         |
| `public/`                            | Your images, resume PDF, favicon               |

---

## Configuration

All configuration is in `config/site.config.yaml`. Here's the complete reference:

### Site Metadata

```yaml
site:
  title: 'Your Name | Software Engineer' # Browser tab title
  description: 'Portfolio description' # Meta description for SEO
  url: 'https://yoursite.dev' # Production URL
  defaultLocale: 'en' # Initial language
  supportedLocales:
    - code: 'en'
      name: 'English'
      nativeName: 'English'
      dir: 'ltr'
    - code: 'ar'
      name: 'Arabic'
      nativeName: 'العربية'
      dir: 'rtl' # Right-to-left
```

### Personal Information

All text fields support localization:

```yaml
personal:
  name:
    en: 'Jane'
    ar: 'جين'
  lastName:
    en: 'Doe'
    ar: 'دو'
  title:
    en: 'Software Engineer'
    ar: 'مهندسة برمجيات'
  tagline:
    en: 'Building things that matter.'
    ar: 'أبني أشياء ذات قيمة.'
  email: 'hello@example.com'
  location:
    en: 'Mecca, Saudi Arabia'
    ar: 'مكة المكرمة'
  avatar:
    enabled: false # Show/hide avatar
    src: '/images/avatar.jpg' # Path in public folder
```

### Social Links

```yaml
socials:
  - platform: 'github'
    url: 'https://github.com/username'
    icon: 'github' # Lucide icon name
  - platform: 'linkedin'
    url: 'https://linkedin.com/in/username'
    icon: 'linkedin'
  - platform: 'twitter'
    url: 'https://twitter.com/username'
    icon: 'twitter'
  - platform: 'email'
    url: 'mailto:hello@example.com'
    icon: 'mail'
  - platform: 'telegram'
    url: 'https://t.me/username' # Or https://t.me/+1234567890 for phone
    icon: 'telegram'
  - platform: 'whatsapp'
    url: 'https://wa.me/1234567890' # Phone number without + or spaces
    icon: 'whatsapp'
```

### Sections Toggle

Enable or disable any section:

```yaml
sections:
  hero:
    enabled: true
  about:
    enabled: true
  projects:
    enabled: true
  blog:
    enabled: false # Disabled by default
  resume:
    enabled: true
    pdfPath: '/resume.pdf' # Path in public folder
  contact:
    enabled: true
    showForm: false # Show form or just info
```

### Projects

```yaml
defaults:
  codeForge: 'https://github.com/username' # Base URL for repos

projects:
  - id: 'project-1'
    title:
      en: 'Project Name'
      ar: 'اسم المشروع'
    description:
      en: 'Project description here.'
      ar: 'وصف المشروع هنا.'
    image: 'https://example.com/image.jpg'
    tech:
      - 'Vue'
      - 'TypeScript'
    links:
      live: 'https://project.dev'
      repo: 'project-name' # Appends to defaults.codeForge
    featured: true

  - id: 'project-2'
    # ... same structure
    links:
      code: 'https://gitlab.com/user/repo' # Full URL (overrides default)
```

### Theme Colors

```yaml
theme:
  defaultMode: 'system' # "light", "dark", or "system"
  colors:
    light:
      bgPrimary: '#FFFDF9'
      bgSecondary: '#F7F4EE'
      textPrimary: '#2D2926'
      textSecondary: '#6B635A'
      accent: '#C8873D'
      accentHover: '#A66E2C'
      accentSubtle: '#FDF6ED'
      border: '#E8E4DC'
    dark:
      bgPrimary: '#1A1816'
      bgSecondary: '#252220'
      textPrimary: '#F5F2ED'
      textSecondary: '#A69E94'
      accent: '#E9A54D'
      accentHover: '#F0B865'
      accentSubtle: '#2E2519'
      border: '#3A3632'
```

### Typography (Per-Locale Fonts)

```yaml
typography:
  fonts:
    en:
      display: 'Outfit' # Headings
      body: 'Source Sans 3' # Body text
    ar:
      display: 'Tajawal' # Arabic headings
      body: 'IBM Plex Sans Arabic' # Arabic body
```

### Animations

```yaml
animations:
  enabled: true # Master switch
  respectReducedMotion: true # Honor browser preference
  hero:
    toy: true # Mascot character
  scrollReveal: true
  hoverEffects: true
  transitions:
    theme:
      enabled: true # Mascot + ripple effect
    locale:
      enabled: true
      directionChange: 'pageFlip' # "pageFlip" or "cardFlip"
      sameDirection: 'fade' # "ripple" or "fade"
```

### Security

```yaml
security:
  email:
    obfuscate: true # Display as "hello [at] example [dot] com"
    clickToReveal: true # Require click to show real email
  contact:
    honeypot: true # Hidden field to catch spam bots
  externalLinks:
    noopener: true # Add rel="noopener noreferrer"
    newTab: true # Open in new tab (_blank)
```

**Server-Side Headers** (Docker deployments):

The included nginx and Caddy configs add these security headers:

- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

---

## Customization

### Adding a New Language

1. Add the locale to `config/site.config.yaml`:

```yaml
site:
  supportedLocales:
    - code: 'es'
      name: 'Spanish'
      nativeName: 'Español'
      dir: 'ltr'
```

2. Create translation file `src/locales/es.json`:

```json
{
  "nav": {
    "about": "Sobre mí",
    "projects": "Proyectos"
  }
}
```

3. Add localized content in config:

```yaml
personal:
  name:
    en: 'Jane'
    es: 'Juan'
```

4. (Optional) Add fonts for the new locale in `typography.fonts`.

### Adding Custom Fonts

1. Install from Fontsource:

```bash
bun add @fontsource/your-font
```

2. Import in `src/assets/styles/_typography.scss`:

```scss
@import '@fontsource/your-font/400.css';
@import '@fontsource/your-font/700.css';
```

3. Update `config/site.config.yaml`:

```yaml
typography:
  fonts:
    en:
      display: 'Your Font'
```

### Disabling Animations

Set the master switch to disable all animations:

```yaml
animations:
  enabled: false
```

Or disable specific features:

```yaml
animations:
  enabled: true
  hero:
    toy: false # Disable mascot only
  transitions:
    theme:
      enabled: false # Disable theme transition effect
```

---

## Development

### Available Scripts

```bash
bun dev                      # Start development server
bun dev:demo                 # Start dev server with demo config
bun run build                # Type-check and build for production
bun run build:demo           # Build with demo config
bun run preview              # Preview production build locally
bun run type-check           # Run TypeScript type checking
bun run lint                 # Run all linters (oxlint + eslint)
bun run format               # Format code with Prettier
bun run lighthouse           # Run Lighthouse audit locally
bun run generate:og          # Generate OG images (default locale)
bun run generate:og:all      # Generate OG images for all locales
bun run ci:test              # Test all CI jobs locally with act
bun run ci:test:lint         # Test lint & build job only
bun run ci:test:security     # Test security audit job only
bun run ci:test:lighthouse   # Test Lighthouse CI job only
```

### Project Structure

```
famfolio/
├── src/
│   ├── assets/styles/      # SCSS (variables, typography, animations)
│   ├── components/
│   │   ├── common/         # Reusable (BaseButton, ProjectCard, etc.)
│   │   ├── layout/         # Navigation, Footer, SectionWrapper
│   │   ├── sections/       # Hero, About, Projects, Contact, etc.
│   │   └── transitions/    # Theme and Locale transition effects
│   ├── composables/        # Vue composables (useTheme, useLocale, etc.)
│   ├── locales/            # Translation files (en.json, ar.json)
│   ├── plugins/            # Vuetify and i18n setup
│   ├── pages/              # Page components
│   └── types/              # TypeScript definitions
├── public/                 # Static assets (images, resume.pdf)
├── scripts/                # Build scripts (OG image generator)
├── config/                 # Configuration files
│   ├── site.config.yaml    # Main configuration
│   └── site.config.demo.yaml # Demo configuration
```

### Key Composables

| Composable          | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `useTheme`          | Dark/light mode state and toggle         |
| `useLocale`         | Language and RTL direction management    |
| `useConfig`         | Access to config/site.config.yaml values |
| `useSettings`       | Computed feature flags from config       |
| `useLocalizedValue` | Helper for localized strings             |

---

## Deployment

### GitHub Pages

The easiest way to deploy your portfolio:

1. Go to your repository **Settings** → **Pages**
2. Under "Build and deployment", select **GitHub Actions**
3. Push to `master` branch - the workflow will build and deploy automatically

Your site will be available at `https://YOUR_USERNAME.github.io/REPO_NAME/`

```sh
e.g. https://F2had.github.io/famfolio/
```

> **Note**: The build automatically sets the correct base URL for GitHub Pages subpath hosting.

### Cloudflare Pages

1. Push your code to GitHub/GitLab

2. In Cloudflare Dashboard, go to **Workers & Pages** → **Create application** → **Pages**

3. Connect your repository

4. Configure build settings:
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (or your project path)

5. Add environment variable (optional):
   - `NODE_VERSION`: `20`

6. Deploy!

Your site will be available at `https://your-project.pages.dev`

### Docker

Three profiles are available:

| Profile | Server | SSL        | Use Case              |
| ------- | ------ | ---------- | --------------------- |
| `nginx` | Nginx  | No         | Simple static hosting |
| `ssl`   | Caddy  | Yes (auto) | Production with HTTPS |
| `dev`   | Vite   | No         | Development with HMR  |

```bash
# Production with nginx
docker compose --profile nginx up -d

# Production with Caddy + automatic SSL
DOMAIN=yourdomain.com docker compose --profile ssl up -d

# Development with hot reload
docker compose --profile dev up dev

# Custom port for nginx (default: 80)
PORT=8080 docker compose --profile nginx up -d
```

#### Manual Build

```bash
docker build -t famfolio .
docker run -p 80:80 famfolio
```

---

## OG Image Generation

Famfolio includes an automated Open Graph image generator that creates social preview images from your `config/site.config.yaml` values.

### Generated Images

The script creates images for all theme/locale combinations:

| File                   | Theme | Locale       |
| ---------------------- | ----- | ------------ |
| `og-image.png`         | Light | Default (en) |
| `og-image-dark.png`    | Dark  | Default (en) |
| `og-image-ar.png`      | Light | Arabic       |
| `og-image-ar-dark.png` | Dark  | Arabic       |

### Usage

```bash
# Generate for default locale (both themes)
bun run generate:og

# Generate for all locales (both themes)
bun run generate:og:all

# Generate specific theme only
bun run scripts/generate-og.ts --theme=dark

# Generate specific locale only
bun run scripts/generate-og.ts --locale=ar

# Custom output directory
bun run scripts/generate-og.ts --output=dist
```

### CLI Options

| Option     | Values                  | Default  | Description                 |
| ---------- | ----------------------- | -------- | --------------------------- |
| `--theme`  | `light`, `dark`, `both` | `both`   | Which theme(s) to generate  |
| `--locale` | locale code or `all`    | `en`     | Which locale(s) to generate |
| `--output` | path                    | `public` | Output directory            |

### Features

- **Config-Driven**: Reads name, title, tagline, colors, and fonts from `config/site.config.yaml`
- **Centered Layout**: Content is centered regardless of locale
- **Theme-Aware**: Uses your exact light/dark theme colors
- **Per-Locale Fonts**: Uses the correct font family for each language
- **Localized Content**: Generates images with translated text for each locale

---

## Tech Stack

| Category     | Technology                                                               |
| ------------ | ------------------------------------------------------------------------ |
| Framework    | [Vue 3](https://vuejs.org/) (Composition API)                            |
| Build Tool   | [Vite](https://vite.dev/) (Rolldown)                                     |
| Language     | [TypeScript](https://www.typescriptlang.org/)                            |
| UI Framework | [Vuetify 3](https://vuetifyjs.com/)                                      |
| Styling      | SCSS + CSS Variables                                                     |
| i18n         | [Vue I18n](https://vue-i18n.intlify.dev/)                                |
| Animations   | [@vueuse/motion](https://motion.vueuse.org/)                             |
| Icons        | [Lucide](https://lucide.dev/) + [Simple Icons](https://simpleicons.org/) |
| Fonts        | [Fontsource](https://fontsource.org/) (self-hosted)                      |
| Config       | YAML                                                                     |
| Runtime      | [Bun](https://bun.sh/)                                                   |
| Linting      | [OXLint](https://oxc.rs/) + [ESLint](https://eslint.org/)                |
| Formatting   | [Prettier](https://prettier.io/)                                         |

---

## CI/CD

### GitHub Actions

The project includes automated workflows for:

| Workflow         | Trigger                   | Description                           |
| ---------------- | ------------------------- | ------------------------------------- |
| **CI**           | Push/PR to `master`       | Lint, auto-fix, build, security audit |
| **Lighthouse**   | Push/PR to `master`       | Performance, accessibility, SEO audit |
| **GitHub Pages** | Push to `master` / Manual | Build and deploy to GitHub Pages      |
| **Docker Build** | Push to `master` / Manual | Build and push image to GHCR          |

#### Choosing Configuration

The **GitHub Pages** and **Docker Build** workflows support choosing which config to use:

1. Go to **Actions** → select workflow
2. Click **Run workflow**
3. Choose config:
   - Empty (default) → uses `config/site.config.yaml`
   - `demo` → uses `config/site.config.demo.yaml`

On push to `master`, workflows use the default config. Manual runs let you choose.

#### Docker Image

Images are automatically built and pushed to GitHub Container Registry on every push to `master`:

```bash
# Pull the latest image
docker pull ghcr.io/f2had/famfolio:latest

# Or a specific commit
docker pull ghcr.io/f2had/famfolio:abc1234
```

### Testing CI Locally with act

You can test GitHub Actions locally using [act](https://github.com/nektos/act):

```bash

# For installation instructions, see: https://nektosact.com/installation/index.html

# Run all CI jobs
bun run ci:test

# Run specific job
bun run ci:test:lint      # Lint, format check & build
bun run ci:test:security  # Security audit
```

> **Note**: On Apple Silicon (M1/M2/M3), the scripts use `--container-architecture linux/amd64` for compatibility.

### Pre-commit Hooks

[Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) automatically run on every commit:

- **JS/TS/Vue files**: OXLint → ESLint → Prettier
- **JSON/MD/YAML/SCSS/CSS**: Prettier

Commits will fail if linting errors are found (`--max-warnings 1`).

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

## Roadmap

Planned features and improvements for future releases:

- [ ] **PWA Support** - Offline capability and installable app
- [ ] **Sitemap Generation** - Auto-generate sitemap.xml for SEO
- [ ] **Blog Integration** - Markdown-based blog with frontmatter
- [ ] **More Transition Effects** - Additional theme/locale transition options
- [ ] **Testimonials Section** - Display client/colleague testimonials
- [ ] **Skills Visualization** - Interactive skill charts/graphs

Want to contribute? Check out [CONTRIBUTING.md](CONTRIBUTING.md)!

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[⬆ Back to Top](#famfolio)**

Made with Vue 3 + TypeScript

</div>
