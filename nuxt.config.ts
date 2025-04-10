import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['./assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ["@nuxt/fonts", 'shadcn-nuxt', '@pinia/nuxt', '@nuxtjs/supabase'],

  router: {
    options: {
      linkActiveClass: 'underline underline-offset-[15px] decoration-4'
    }
  },

  fonts: {
    families: [{name: 'Montserrat', provider: 'google', display: 'swap'}]
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
});