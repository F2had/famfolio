import config from '@config'
import type { Project } from '@/types/config'

// Helper to resolve project code URL from repo name or full code URL
const resolveCodeUrl = (links: { repo?: string; code?: string }): string | undefined => {
  if (links.code) return links.code
  if (links.repo && config.defaults?.codeForge) {
    return `${config.defaults.codeForge}/${links.repo}`
  }
  return undefined
}

// Projects with resolved code URLs
const resolvedProjects =
  config.projects?.map((project: Project) => ({
    ...project,
    links: {
      ...project.links,
      code: resolveCodeUrl(project.links || {}),
    },
  })) || []

export const useConfig = () => {
  return {
    site: config.site,
    defaults: config.defaults,
    personal: config.personal,
    socials: config.socials,
    sections: config.sections,
    about: config.about,
    skills: config.skills,
    projects: resolvedProjects,
    blog: config.blog,
    theme: config.theme,
    typography: config.typography,
    animations: config.animations,
    security: config.security,
  }
}
