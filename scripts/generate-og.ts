#!/usr/bin/env bun
/**
 * OG Image Generator
 *
 * Generates Open Graph images using site.config.yaml values.
 * Uses Bun for runtime and sharp for image generation.
 *
 * Usage:
 *   bun run scripts/generate-og.ts
 *   bun run scripts/generate-og.ts --theme=dark
 *   bun run scripts/generate-og.ts --locale=ar
 */

import { parseArgs } from 'util'
import sharp from 'sharp'
import { parse as parseYaml } from 'yaml'

// Parse CLI arguments
const { values: args } = parseArgs({
  args: Bun.argv,
  options: {
    theme: { type: 'string', default: 'both' },
    locale: { type: 'string', default: 'en' },
    output: { type: 'string', default: 'public' },
  },
  strict: true,
  allowPositionals: true,
})

// Load and parse config
const configPath = new URL('../config/site.config.yaml', import.meta.url)
const configFile = await Bun.file(configPath).text()
const config = parseYaml(configFile)

type ThemeColors = {
  bgPrimary: string
  bgSecondary: string
  textPrimary: string
  textSecondary: string
  accent: string
  accentHover: string
  accentSubtle: string
  border: string
}

type SiteConfig = {
  site: {
    title: string
    description: string
    url: string
    defaultLocale: string
    supportedLocales: Array<{ code: string; name: string; nativeName: string; dir: string }>
  }
  personal: {
    name: Record<string, string>
    lastName: Record<string, string>
    title: Record<string, string>
    tagline: Record<string, string>
  }
  theme: {
    colors: {
      light: ThemeColors
      dark: ThemeColors
    }
  }
  typography: {
    fonts: Record<string, { display: string; body: string }>
  }
}

const typedConfig = config as SiteConfig

// Get localized value
const getLocalized = (obj: Record<string, string>, locale: string): string =>
  obj[locale] || obj[typedConfig.site.defaultLocale] || Object.values(obj)[0]

// Generate SVG for OG image
const generateSVG = (colors: ThemeColors, locale: string): string => {
  const name = getLocalized(typedConfig.personal.name, locale)
  const lastName = getLocalized(typedConfig.personal.lastName, locale)
  const title = getLocalized(typedConfig.personal.title, locale)
  const tagline = getLocalized(typedConfig.personal.tagline, locale)

  // Font family based on locale
  const fonts = typedConfig.typography.fonts[locale] || typedConfig.typography.fonts.en
  const displayFont = fonts.display
  const bodyFont = fonts.body

  // Full name (combined)
  const fullName = `${name} ${lastName}`

  return `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="${colors.bgPrimary}"/>

  <!-- Decorative shapes -->
  <circle cx="100" cy="100" r="150" fill="${colors.accent}" opacity="0.1"/>
  <circle cx="1100" cy="530" r="200" fill="${colors.accent}" opacity="0.1"/>
  <circle cx="900" cy="150" r="100" fill="${colors.accent}" opacity="0.15"/>

  <!-- Content (centered) -->
  <text
    x="600"
    y="250"
    font-family="${displayFont}, system-ui, sans-serif"
    font-size="72"
    font-weight="bold"
    fill="${colors.textPrimary}"
    text-anchor="middle"
  >${fullName}</text>

  <text
    x="600"
    y="340"
    font-family="${bodyFont}, system-ui, sans-serif"
    font-size="36"
    fill="${colors.accent}"
    text-anchor="middle"
  >${title}</text>

  <!-- Tagline -->
  <text
    x="600"
    y="420"
    font-family="${bodyFont}, system-ui, sans-serif"
    font-size="24"
    fill="${colors.textSecondary}"
    text-anchor="middle"
  >${tagline}</text>

  <!-- URL -->
  <text
    x="600"
    y="570"
    font-family="${bodyFont}, system-ui, sans-serif"
    font-size="20"
    fill="${colors.textSecondary}"
    opacity="0.7"
    text-anchor="middle"
  >${new URL(typedConfig.site.url).hostname}</text>
</svg>
`
}

// Generate image
const generateImage = async (themeName: 'light' | 'dark', locale: string): Promise<void> => {
  const colors = typedConfig.theme.colors[themeName]
  const localeConfig = typedConfig.site.supportedLocales.find((l) => l.code === locale)
  const isRTL = localeConfig?.dir === 'rtl'

  const svg = generateSVG(colors, locale, isRTL)

  // Generate filename
  const suffix = locale !== typedConfig.site.defaultLocale ? `-${locale}` : ''
  const themeSuffix = themeName === 'dark' ? '-dark' : ''
  const filename = `og-image${suffix}${themeSuffix}.png`
  const outputPath = `${args.output}/${filename}`

  // Convert SVG to PNG
  await sharp(Buffer.from(svg)).png().toFile(outputPath)

  console.log(`Generated: ${outputPath}`)
}

// Main execution
const main = async () => {
  console.log('Generating OG images...\n')

  const themes: Array<'light' | 'dark'> =
    args.theme === 'both' ? ['light', 'dark'] : [args.theme as 'light' | 'dark']

  const locales =
    args.locale === 'all' ? typedConfig.site.supportedLocales.map((l) => l.code) : [args.locale!]

  for (const theme of themes) {
    for (const locale of locales) {
      await generateImage(theme, locale)
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)
