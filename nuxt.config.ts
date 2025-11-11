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
      apiUrl: 'https://voting-distributor.k8s.prd.nos.ci',
      token: 'tvt6rcF7oMMaAcNW9FvfWhi6v7VxqaapdadoG6xjXUH',
      yesAddress: 'YessuvqUauj9yW4B3eERcyRLWmQtWpFc2ERKmaedmCE',
      noAddress: 'NopXntmRdXhYNkoZaNTMUMShJ3aVG5RvwpiyPdd4bMh',
      // UTC timestamps, will be converted to CET in the interface
      snapshotIso: '2025-11-13T11:00:00Z',
      votingStartIso: '2025-11-17T11:00:00Z',
      votingEndIso: '2025-11-21T11:00:00Z',
      resultsPublishedIso: '2025-11-21T17:00:00Z'
    },
  }
});