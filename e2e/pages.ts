// Páginas del sitio (no del catálogo), en los tres idiomas: las usan axe y la regresión visual.
const locales = [
  { code: "es", prefix: "" },
  { code: "ca", prefix: "/ca" },
  { code: "en", prefix: "/en" },
];

export const sitePages = [
  "reservar",
  "contacto",
  "sobre-mi",
  "aviso-legal",
  "politica-de-privacidad",
  "politica-de-cookies",
  "condiciones-de-reserva",
].flatMap((slug) =>
  locales.map(({ code, prefix }) => ({
    name: `${slug}-${code}`,
    path: `${prefix}/${slug}/`,
  }))
);
