/// <reference types="vite/client" />

declare module '*.yaml' {
  const content: Record<string, unknown>
  export default content
}

declare module '@config' {
  import type { SiteConfig } from '@/types/config'
  const config: SiteConfig
  export default config
}
