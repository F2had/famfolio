// Single source of truth for supported locales
export const LOCALES = ['en', 'ar'] as const

export type LocaleCode = (typeof LOCALES)[number]

export type LocalizedString = Record<LocaleCode, string>

export type SupportedLocale = {
  code: LocaleCode
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
}

export type SiteMetadata = {
  title: string
  description: string
  url: string
  defaultLocale: LocaleCode
  supportedLocales: SupportedLocale[]
}

export type PersonalInfo = {
  name: LocalizedString
  lastName: LocalizedString
  title: LocalizedString
  tagline: LocalizedString
  email: string
  location: LocalizedString
  avatar: {
    enabled: boolean
    src: string
  }
}

export type SocialLink = {
  platform: string
  url: string
  icon: string
}

export type SectionsConfig = {
  hero: { enabled: boolean }
  about: { enabled: boolean }
  projects: { enabled: boolean }
  blog: { enabled: boolean }
  resume: {
    enabled: boolean
    pdfPath: string
  }
  contact: {
    enabled: boolean
    showForm: boolean
  }
}

export type AboutConfig = {
  content: LocalizedString
}

export type ProjectLinks = {
  live?: string
  github?: string
}

export type Project = {
  id: string
  title: LocalizedString
  description: LocalizedString
  image: string
  tech: string[]
  links: ProjectLinks
  featured: boolean
}

export type BlogPost = {
  id: string
  title: LocalizedString
  date: string
  excerpt: LocalizedString
  url: string
}

export type BlogConfig = {
  posts: BlogPost[]
}

export type ThemeColors = {
  bgPrimary: string
  bgSecondary: string
  textPrimary: string
  textSecondary: string
  accent: string
  accentHover: string
  accentSubtle: string
  border: string
}

export type ThemeConfig = {
  defaultMode: 'light' | 'dark' | 'system'
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
}

export type FontConfig = {
  display: string
  body: string
}

export type TypographyConfig = {
  fonts: Record<LocaleCode, FontConfig>
}

export type AnimationsConfig = {
  enabled: boolean
  respectReducedMotion: boolean
  hero: {
    cursorFollow: boolean
    toy: boolean
  }
  scrollReveal: boolean
  hoverEffects: boolean
}

export type SiteConfig = {
  site: SiteMetadata
  personal: PersonalInfo
  socials: SocialLink[]
  sections: SectionsConfig
  about: AboutConfig
  skills: string[]
  projects: Project[]
  blog: BlogConfig
  theme: ThemeConfig
  typography: TypographyConfig
  animations: AnimationsConfig
}
