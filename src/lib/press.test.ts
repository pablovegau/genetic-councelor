import { describe, expect, it } from "vitest";
import press from "../data/press.json";
import { orderPress, pressGroup, type PressEntry } from "./press";

const entry = (overrides: Partial<PressEntry>): PressEntry => ({
  id: "x",
  group: "telomeres",
  outlet: "Medio",
  date: "2025-01-01",
  lang: "es",
  title: "Titular",
  url: "https://example.com",
  ...overrides,
});

describe("orderPress", () => {
  it("la destacada va primero y el resto de la más reciente a la más antigua", () => {
    const ordered = orderPress([
      entry({ id: "viejo", date: "2024-01-01" }),
      entry({ id: "entrevista", date: null, featured: true }),
      entry({ id: "nuevo", date: "2026-01-01" }),
    ]);
    expect(ordered.map(({ id }) => id)).toEqual([
      "entrevista",
      "nuevo",
      "viejo",
    ]);
  });

  it("sin fecha va después de las que sí la tienen, y el empate conserva el orden de entrada", () => {
    const ordered = orderPress([
      entry({ id: "sin-fecha", date: null }),
      entry({ id: "a", date: "2025-09-04" }),
      entry({ id: "b", date: "2025-09-04" }),
    ]);
    expect(ordered.map(({ id }) => id)).toEqual(["a", "b", "sin-fecha"]);
  });
});

describe("press.json", () => {
  const entries = press as PressEntry[];

  it("cada noticia tiene un enlace https y los ids no se repiten", () => {
    for (const { url } of entries) expect(url).toMatch(/^https:\/\//);
    const ids = entries.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("las fechas son ISO y el grupo de telómeros va con la entrevista a Sara primero", () => {
    for (const { date } of entries)
      if (date) expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const telomeres = pressGroup(entries, "telomeres");
    expect(telomeres.length).toBeGreaterThan(5);
    expect(telomeres[0]!.featured).toBe(true);
    expect(telomeres[1]!.outlet).toBe("La Vanguardia");
  });
});
