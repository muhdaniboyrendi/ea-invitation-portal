// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "bootstrap-icons/font/bootstrap-icons.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/seo",
    "@nuxt/image",
    "nuxt-charts",
  ],
  colorMode: {
    preference: "system",
    fallback: "light",
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },
  nitro: {
    compressPublicAssets: true,
  },
  app: {
    head: {
      title: "EA Invitation Dashboard", // default fallback title
      htmlAttrs: {
        lang: "id",
      },
    },
  },
  runtimeConfig: {
    public: {
      // App
      mainAppUrl: process.env.MAIN_APP_URL || "http://localhost:3000",
      appUrl: process.env.APP_URL || "http://localhost:3001",

      // API
      apiBaseUrl: process.env.API_BASE_URL || "http://127.0.0.1:8000/api",
      storageBaseUrl:
        process.env.STORAGE_BASE_URL || "http://127.0.0.1:8000/storage",

      // Midtrans
      midtransClientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    },
  },
  site: {
    url: "https://ea-invitation-landing.portal.app", // Ganti dengan domain Anda
    name: "EA Invitation",
    description:
      "Platform undangan pernikahan digital yang elegan dan interaktif. Wujudkan momen bahagia pernikahan Anda dengan undangan digital modern.",
    defaultLocale: "id",
  },
  seo: {
    redirectToCanonicalSiteUrl: true,
    meta: {
      themeColor: "#1c98ed", // Sesuaikan dengan brand color
    },
  },
  sitemap: {
    enabled: true,
    strictNuxtContentPaths: true,
    autoLastmod: true,
    defaults: {
      changefreq: "weekly",
      priority: 0.5,
    },
  },
  robots: {
    enabled: true,
    allow: "/",
  },
  ogImage: {
    enabled: true,
    defaults: {
      width: 1200,
      height: 630,
      component: "OgImage",
    },
  },
  schemaOrg: {
    enabled: true,
    identity: {
      type: "Organization",
      name: "EA Invitation",
      url: process.env.APP_URL || "http://localhost:3000",
      logo: "/favicon.ico",
      sameAs: [
        "https://instagram.com/ea_invitation",
        "https://tiktok.com/ea-invitation",
        "https://twitter.com/ea_invitation",
      ],
    },
  },
  linkChecker: {
    enabled: true,
    excludeLinks: ["https://instagram.com/**"],
  },
});
