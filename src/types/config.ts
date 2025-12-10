// Single source of truth for supported locales
const LOCALES = ['en', 'ar'] as const

export type LocaleCode = (typeof LOCALES)[number]

export type LocalizedString = Record<LocaleCode, string>

export type SupportedLocale = {
  code: LocaleCode
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
}

export type FaviconConfig = {
  svg: string
  ico: string
}

export type LogoConfig = {
  enabled: boolean
  src: string
  alt: string
}

export type SiteMetadata = {
  title: string
  description: string
  url: string
  favicon: FaviconConfig
  logo: LogoConfig
  defaultLocale: LocaleCode
  supportedLocales: SupportedLocale[]
}

export type PersonalInfo = {
  name: LocalizedString
  lastName: LocalizedString
  title: LocalizedString
  tagline: LocalizedString
  email: string
  phone?: string
  telegram?: string
  whatsapp?: string
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
    showEmail?: boolean
    showPhone?: boolean
    showTelegram?: boolean
    showWhatsapp?: boolean
  }
}

export type AboutConfig = {
  content: LocalizedString
}

export type ProjectLinks = {
  live?: string
  code?: string
  codeIcon?: 'github' | 'gitlab' | 'bitbucket' | 'codeberg' | 'forgejo' | 'gitea'
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

export type TransitionsConfig = {
  theme: {
    enabled: boolean
  }
  locale: {
    enabled: boolean
    directionChange: 'pageFlip' | 'cardFlip'
    sameDirection: 'ripple' | 'fade'
  }
}

export type AnimationsConfig = {
  enabled: boolean
  respectReducedMotion: boolean
  hero: {
    toy: boolean
  }
  scrollReveal: boolean
  hoverEffects: boolean
  transitions: TransitionsConfig
}

export type DefaultsConfig = {
  codeForge: string
}

export type EmailSecurityConfig = {
  obfuscate: boolean
  clickToReveal: boolean
}

export type PhoneSecurityConfig = {
  obfuscate: boolean
  clickToReveal: boolean
}

export type TelegramSecurityConfig = {
  obfuscate: boolean
  clickToReveal: boolean
}

export type WhatsappSecurityConfig = {
  obfuscate: boolean
  clickToReveal: boolean
}

export type ContactSecurityConfig = {
  honeypot: boolean
}

export type ExternalLinksSecurityConfig = {
  noopener: boolean
  newTab: boolean
  confirmLeave: boolean
}

export type SecurityConfig = {
  email: EmailSecurityConfig
  phone: PhoneSecurityConfig
  telegram?: TelegramSecurityConfig
  whatsapp?: WhatsappSecurityConfig
  contact: ContactSecurityConfig
  externalLinks: ExternalLinksSecurityConfig
}

export type SiteConfig = {
  site: SiteMetadata
  defaults: DefaultsConfig
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
  security: SecurityConfig
}
