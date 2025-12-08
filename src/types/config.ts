export type LocalizedString = {
  en: string
  ar: string
}

export type SupportedLocale = {
  code: 'en' | 'ar'
  name: string
  dir: 'ltr' | 'rtl'
}

export type SiteMetadata = {
  title: string
  description: string
  url: string
  defaultLocale: 'en' | 'ar'
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
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'instagram' | 'dribbble'
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
  fonts: {
    en: FontConfig
    ar: FontConfig
  }
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
