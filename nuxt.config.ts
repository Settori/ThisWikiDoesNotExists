// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    // '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  // typescript: {
  //   typeCheck: true
  // },
  runtimeConfig: {
    public: {
      openAiSecret: process.env.OPENAI_API_KEY || 'asd',
    }
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  css: [
    '@/assets/css/main.scss',
  ],
  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'pl', language: 'pl-PL' }
    ],
    defaultLocale: 'en',
  },
  imports: {
    dirs: ['types'],
  },
})