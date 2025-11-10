// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ["~/assets/styles/global.scss"],
  modules: ['@nuxtjs/google-fonts', '@nuxtjs/color-mode'],
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
      apiUrl:
        process.env.API_URL || (process.env.APP_ENV === "production"
          ? 'https://voting-distributor.k8s.prd.nos.ci'
          : "https://voting-distributor.k8s.dev.nos.ci"),
    },
  },
  colorMode: {
    preference: "light", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "-mode",
    storageKey: "nuxt-color-mode",
  },
});