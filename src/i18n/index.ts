import { ca } from "./ca";
import { en } from "./en";
import { es } from "./es";
import type { Copy, Locale } from "./types";

export type { Copy, Locale } from "./types";

const dictionaries: Record<Locale, Copy> = { es, ca, en };

export const locales: { code: Locale; label: string }[] = [
  { code: "es", label: "Español" },
  { code: "ca", label: "Català" },
  { code: "en", label: "English" },
];

/** Textos del idioma actual de la página; ante un idioma desconocido, el español. */
export function getCopy(locale: string | undefined): Copy {
  return dictionaries[locale as Locale] ?? es;
}
