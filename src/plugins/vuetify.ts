import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import config from '@config'

const { light, dark } = config.theme.colors

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: light.bgPrimary,
          surface: light.bgSecondary,
          primary: light.accent,
          'primary-darken-1': light.accentHover,
          secondary: light.accentSubtle,
          'on-background': light.textPrimary,
          'on-surface': light.textPrimary,
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: dark.bgPrimary,
          surface: dark.bgSecondary,
          primary: dark.accent,
          'primary-darken-1': dark.accentHover,
          secondary: dark.accentSubtle,
          'on-background': dark.textPrimary,
          'on-surface': dark.textPrimary,
          error: '#CF6679',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
    },
    VCard: {
      rounded: 'lg',
      elevation: 0,
    },
  },
})
