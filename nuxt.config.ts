import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 5174,
    host: "127.0.0.1",
  },
  nitro: {
    preset: 'netlify'
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.css"],
  app: {
    head: {
      title: 'Mobilní masér Michael',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap' }
      ]
    }
  },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxtjs/supabase",],
  pinia: {
    storesDirs: ["@/stores/**"],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: ['/reservations', '/reservations-test', '/profile', '/myReservations'],
      exclude: ['/', '/contacts', '/massages', '/about'],
      saveRedirectToCookie: true,
    },
  },
  

  runtimeConfig: {

    // SERVER‑ONLY (nikdy neposílat do clienta)
    GCAL_SERVICE_ACCOUNT_KEY_B64: process.env.GCAL_SERVICE_ACCOUNT_KEY_B64,
    GCAL_CALENDAR_ID: process.env.GCAL_CALENDAR_ID,
    GCAL_TIMEZONE: process.env.GCAL_TIMEZONE || 'Europe/Warsaw',
    GCAL_DEBUG: process.env.GCAL_DEBUG || '0',

    // SMTP (server‑only)
    // smtpHost: process.env.SMTP_HOST,
    // smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    // smtpUser: process.env.SMTP_USER,
    // smtpPass: process.env.SMTP_PASS,
    // mailFrom: process.env.MAIL_FROM || 'no-reply@example.com',
    // mailReplyTo: process.env.MAIL_REPLY_TO || undefined,

    // PUBLIC (může číst prohlížeč)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '', // může zůstat prázdné, Nuxt použije stejné origin
    }
  },
});
