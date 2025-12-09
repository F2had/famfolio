<script setup lang="ts">
import { useSettings } from '@/composables/useSettings'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import BlogSection from '@/components/sections/BlogSection.vue'
import ResumeSection from '@/components/sections/ResumeSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

const {
  isHeroEnabled,
  isAboutEnabled,
  isProjectsEnabled,
  isBlogEnabled,
  isResumeEnabled,
  isContactEnabled,
} = useSettings()
</script>

<template>
  <main>
    <HeroSection v-if="isHeroEnabled" />
    <AboutSection v-if="isAboutEnabled" />
    <ProjectsSection v-if="isProjectsEnabled" />
    <BlogSection v-if="isBlogEnabled" />
    <ResumeSection v-if="isResumeEnabled" />
    <ContactSection v-if="isContactEnabled" />
  </main>
</template>
