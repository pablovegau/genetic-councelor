import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // URL pública (dominio definitivo). Canonical y sitemap salen de aquí.
  site: "https://www.saratorresesquius.com",
  integrations: [react()],
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
