import { defineConfig } from "astro/config";

export default defineConfig({
  // URL pública. Canonical y sitemap salen de aquí. Cambiar al tener dominio definitivo.
  site: "https://genetic-councelor.vercel.app",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "ca", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
