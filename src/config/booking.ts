// Reserva con Cal.com (cal.eu cerró el 1 de noviembre de 2026). Aquí vive todo lo de Cal.com: el
// usuario, los eventos y el interruptor. Ninguna página ni componente repite sus URL.
/**
 * Interruptor de seguridad. Mientras no sea "true", /reservar/ no muestra el calendario, ni enlaza a
 * Cal.com ni carga nada suyo: avisa de que las reservas se abrirán pronto. Es una variable PUBLIC_:
 * se incrusta al compilar, así que cambiarla en Vercel exige redesplegar.
 */
export const bookingEnabled =
  import.meta.env.PUBLIC_CAL_BOOKING_ENABLED === "true";

export const cal = {
  /** Origen de Cal.com. */
  origin: "https://cal.com",
  /** Script del embed, que solo se carga cuando la persona elige un hueco. */
  embedScript: "https://app.cal.com/embed/embed.js",
  /** Usuario de Sara en Cal.com (cal.com/saratorresesquius). */
  user: "saratorresesquius",
} as const;

export type VisitKey = "first" | "followup";

/** Precio en euros (visible en la web) y slug del evento en Cal.com (60 y 45 minutos, por Google Meet). */
export const visits: Record<VisitKey, { slug: string; price: number }> = {
  first: { slug: "primera-visita", price: 120 },
  followup: { slug: "seguimiento", price: 90 },
};

/** Ruta de Cal.com de un evento: la que usa el embed y el enlace directo. */
export const calLink = (key: VisitKey) => `${cal.user}/${visits[key].slug}`;
export const calUrl = (key: VisitKey) => `${cal.origin}/${calLink(key)}`;
