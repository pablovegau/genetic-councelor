import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { defineConfig, fontProviders } from "astro/config";

// El catálogo del design system (src/pages/design-system) es una herramienta de trabajo: se ve en
// `astro dev` pero no se despliega. Las pruebas lo necesitan, y sus compilaciones lo piden con
// KEEP_CATALOG=true (test:e2e, CI y update-vrt).
const catalogOnlyInDev = {
  name: "catalog-only-in-dev",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      if (process.env.KEEP_CATALOG === "true") return;
      await rm(fileURLToPath(new URL("design-system/", dir)), {
        recursive: true,
        force: true,
      });
    },
  },
};

export default defineConfig({
  // El CSS (unos 40 KB) va dentro del HTML: sin peticiones que bloqueen el primer pintado.
  build: { inlineStylesheets: "always" },
  // URL pública (dominio definitivo). Canonical y sitemap salen de aquí.
  site: "https://www.saratorresesquius.com",
  integrations: [
    react(),
    catalogOnlyInDev,
    // El catálogo del design system no es una página del sitio: no entra en el sitemap.
    sitemap({
      filter: (page) => !page.includes("/design-system/"),
      i18n: {
        defaultLocale: "es",
        locales: { es: "es", ca: "ca", en: "en" },
      },
    }),
  ],
  // Fuentes servidas desde el propio dominio (se descargan en el build y se cachean). Funnel cubre
  // latin y latin-ext: ñ, ç, acentos y la l·l del catalán.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Funnel Display",
      cssVariable: "--font-funnel-display",
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: [
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ],
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.fontsource(),
      name: "Funnel Sans",
      cssVariable: "--font-funnel-sans",
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: [
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ],
      optimizedFallbacks: false,
    },
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "ca", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
