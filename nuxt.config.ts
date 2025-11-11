// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ["~/assets/styles/global.scss"],
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    preload: true,
    families: {
      Outfit: [300, 400, 700],
      "Space Grotesk": [400],
    },
  },
   dir: {
    public: "static",
  },
  runtimeConfig: {
    public: {
      network: 'mainnet',
      apiUrl: 'https://voting-distributor.k8s.prd.nos.ci'
    },
  }
});