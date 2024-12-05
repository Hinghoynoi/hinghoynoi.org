// https://nuxt.com/docs/api/configuration/nuxt-config
import "dotenv/config";

export default defineNuxtConfig({
  transpile: [
    "three"
  ],

  modules: ["@nuxtjs/i18n", "@nuxtjs/supabase", "@nuxt/image", "@vesp/nuxt-fontawesome", "@nuxt/image"],
  devtools: {enabled: true},

  css: [
    "@/assets/css/fonts.css",
    "@/assets/css/tailwind.css",
    "@/assets/css/global.css",
    "@/assets/css/markdown.css",
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        }
      ]
    },
    pageTransition: {
      name: "fade",
      mode: "out-in"
    },
    layoutTransition: {
      name: "slide",
      mode: "out-in"
    }
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    cookieOptions: {
      maxAge: 30 * (24 * (60 * 60)),
    }
  },

  nitro: {
    preset: "vercel"
  },

  fontawesome: {
    icons: {
      solid: ["house", "user", "newspaper", "comment", "handshake-angle", "book", "video", "caret-up", "flag"],
      brands: ["markdown", "twitter"],
    },
  },

  compatibilityDate: "2024-11-24",
});