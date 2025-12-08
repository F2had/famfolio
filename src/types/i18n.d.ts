import type en from '@/locales/en.json'

type MessageSchema = typeof en

declare module 'vue-i18n' {
  export type DefineLocaleMessage = MessageSchema
}
