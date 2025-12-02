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
    "@nuxt/image",
    "nuxt-charts",
    "@nuxtjs/seo",
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

  runtimeConfig: {
    public: {
      // App
      mainAppUrl:
        process.env.NUXT_PUBLIC_MAIN_APP_URL || "http://localhost:3000",
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3001",
      // API
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
      storageBaseUrl:
        process.env.NUXT_PUBLIC_STORAGE_BASE_URL ||
        "http://localhost:8000/storage",
      // Midtrans
      midtransClientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    },
  },

  // --- OPTIMASI SEO & SECURITY ---
  site: {
    url: "https://app.eainvitation.com",
    name: "EA Invitation Dashboard",
    indexable: true,
  },

  // 1. Robots.txt: Gunakan logic Folder Level
  // "Disallow: /invitation" otomatis memblokir "/invitation/create", "/invitation/123", dll.
  robots: {
    allow: ["/login", "/register", "/forgot-password"],
    disallow: [
      "/dashboard",
      "/invitation", // Memblokir semua sub-path invitation
      "/themes", // Memblokir semua sub-path themes
      "/packages",
      "/musics",
      "/transaction",
      "/profile",
      "/auth",
      "/api",
      "/admin",
      "/_nuxt", // Best practice: blokir file internal nuxt
    ],
  },

  // 2. Sitemap: Gunakan Wildcard (**)
  sitemap: {
    // Hanya masukkan halaman publik. Sisanya exclude dengan pattern.
    exclude: [
      "/dashboard/**", // ** artinya: folder ini dan semua isinya sedalam apapun
      "/invitation/**",
      "/themes/**",
      "/packages/**",
      "/musics/**",
      "/transaction/**",
      "/profile/**",
      "/auth/**",
      "/api/**",
      "/admin/**",
    ],
  },

  // 3. BONUS: Route Rules (Security Layer Tambahan)
  // Ini memaksa server mengirim header 'X-Robots-Tag: noindex' untuk route sensitif.
  // Lebih kuat daripada robots.txt (karena robots.txt hanya himbauan, ini perintah server).
  routeRules: {
    "/dashboard/**": { robots: false },
    "/invitation/**": { robots: false },
    "/profile/**": { robots: false },
    "/transaction/**": { robots: false },
    // Pastikan Login/Register tetap bisa diakses
    "/login": { robots: true },
    "/register": { robots: true },
  },
});
