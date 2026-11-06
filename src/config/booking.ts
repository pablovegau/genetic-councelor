// Reserva con Cal.com (cal.eu cerró el 1 de noviembre de 2026). Los slugs de los eventos son los que hay que crear en la
// cuenta de Cal.com; hasta confirmarlos con Sara, el enlace puede no existir.
export const cal = {
  /** Origen de Cal.com. */
  origin: "https://cal.com",
  /** Script del embed, que solo se carga cuando la persona elige un hueco. */
  embedScript: "https://app.cal.com/embed/embed.js",
  /** Usuario de Sara en Cal.com. */
  user: "sara-torres-esquius",
} as const;

export type VisitKey = "first" | "followup";

/** Precio en euros (visible en la web) y slug del evento en Cal.com. */
export const visits: Record<VisitKey, { slug: string; price: number }> = {
  first: { slug: "primera-visita", price: 120 },
  followup: { slug: "seguimiento", price: 90 },
};

/** Ruta de Cal.com de un evento: la que usa el embed y el enlace directo. */
export const calLink = (key: VisitKey) => `${cal.user}/${visits[key].slug}`;
export const calUrl = (key: VisitKey) => `${cal.origin}/${calLink(key)}`;
