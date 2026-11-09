// Noticias y entrevistas en las que aparece Sara (`src/data/press.json`), agrupadas por tema.
export interface PressEntry {
  id: string;
  group: "telomeres" | "other";
  /** Va primero en su grupo (por ejemplo, una entrevista a Sara). */
  featured?: boolean;
  kind?: "interview" | "hospital";
  outlet: string;
  /** ISO (`2025-09-04`); `null` si no se conoce. */
  date: string | null;
  lang: string;
  title: string;
  url: string;
  /** El titular se dedujo de la URL porque no se pudo leer la página: hay que confirmarlo. */
  titleFromUrl?: boolean;
}

/** Destacadas primero; luego de la más reciente a la más antigua, y las que no tienen fecha al final. */
export function orderPress(entries: PressEntry[]): PressEntry[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort(
      (a, b) =>
        Number(!!b.entry.featured) - Number(!!a.entry.featured) ||
        (b.entry.date ?? "").localeCompare(a.entry.date ?? "") ||
        a.index - b.index
    )
    .map(({ entry }) => entry);
}

export function pressGroup(
  entries: PressEntry[],
  group: PressEntry["group"]
): PressEntry[] {
  return orderPress(entries.filter((entry) => entry.group === group));
}
