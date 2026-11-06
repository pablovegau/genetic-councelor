// Páginas del sitio (no del catálogo), en los tres idiomas: las usan axe y la regresión visual.
const locales = [
  { code: "es", prefix: "" },
  { code: "ca", prefix: "/ca" },
  { code: "en", prefix: "/en" },
];

export const sitePages = ["reservar", "sobre-mi"].flatMap((slug) =>
  locales.map(({ code, prefix }) => ({
    name: `${slug}-${code}`,
    path: `${prefix}/${slug}/`,
  }))
);
