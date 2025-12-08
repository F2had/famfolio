import config from '@config'

export const useConfig = () => {
  return {
    site: config.site,
    personal: config.personal,
    socials: config.socials,
    sections: config.sections,
    about: config.about,
    skills: config.skills,
    projects: config.projects,
    blog: config.blog,
    theme: config.theme,
    typography: config.typography,
    animations: config.animations,
  }
}
