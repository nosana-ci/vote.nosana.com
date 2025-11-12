// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ["~/assets/styles/global.scss"],
  modules: ['@nuxtjs/google-fonts'],
  app: {
    head: {
      title: 'Nosana Voting - NNP-0001',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
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
      apiUrl: 'https://voting-distributor.k8s.prd.nos.ci',
      yesAddress: 'YessuvqUauj9yW4B3eERcyRLWmQtWpFc2ERKmaedmCE',
      noAddress: 'NopXntmRdXhYNkoZaNTMUMShJ3aVG5RvwpiyPdd4bMh',
      // UTC timestamps, will be converted to CET in the interface
      snapshotIso: '2025-11-13T11:00:00Z'
    },
  }
});