import { contactEmail } from "./contact";

// Datos del titular para el aviso legal y la política de privacidad. El NIF y el domicilio no se
// guardan en el repositorio (es público): se leen de variables de entorno que se fijan en Vercel
// (Production y Preview) y, en local, en `.env.local`.
const nif = import.meta.env.PUBLIC_LEGAL_NIF as string | undefined;
const address = import.meta.env.PUBLIC_LEGAL_ADDRESS as string | undefined;

// Publicar con datos del titular a medias sería un incumplimiento (LSSI-CE, art. 10): el build falla.
if (import.meta.env.PUBLIC_ALLOW_INDEXING === "true" && (!nif || !address)) {
  throw new Error(
    "Antes de quitar el noindex hay que fijar PUBLIC_LEGAL_NIF y PUBLIC_LEGAL_ADDRESS."
  );
}

export const owner = {
  name: "Sara Torres-Esquius",
  nif: nif || null,
  address: address || null,
  email: contactEmail,
  web: "saratorresesquius.com",
} as const;

/** Texto que se muestra mientras falte un dato del titular. */
export const pendingField = "Pendiente de completar";

/** Fecha de la última revisión de los textos legales (ISO). */
export const legalUpdated = "2026-11-07";

/** Rutas de las tres páginas legales, en el orden del pie (`footer.legalLinks`). */
export const legalSlugs = [
  "aviso-legal",
  "politica-de-privacidad",
  "politica-de-cookies",
] as const;
