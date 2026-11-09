import { describe, expect, it } from "vitest";
import notes from "../data/publication-notes.json";
import publications from "../data/publications.json";
import {
  cleanTitle,
  formatAuthors,
  orderPublications,
  parsePublications,
  type PublicationNotes,
} from "./publications";

const article = (overrides: Record<string, unknown> = {}) => ({
  title: "A study of BRCA2 variants.",
  fulljournalname: "Journal of Genetics",
  pubdate: "2024 Mar",
  sortpubdate: "2024/03/01 00:00",
  authors: [{ name: "Torres-Esquius S" }, { name: "Rossi M" }],
  articleids: [
    { idtype: "pubmed", value: "1" },
    { idtype: "doi", value: "10.1000/abc" },
  ],
  pubtype: ["Journal Article"],
  ...overrides,
});

describe("cleanTitle", () => {
  it("quita el punto final, las etiquetas y los espacios repetidos", () => {
    expect(cleanTitle("  Variants in <i>BRCA2</i>   and risk. ")).toBe(
      "Variants in BRCA2 and risk"
    );
  });

  it("conserva los puntos que no son el final", () => {
    expect(cleanTitle("Type 2.5 diabetes")).toBe("Type 2.5 diabetes");
  });
});

describe("formatAuthors", () => {
  it("con tres autores o menos los muestra todos", () => {
    expect(formatAuthors(["A", "B", "C"])).toBe("A, B, C");
  });

  it("con más de tres muestra tres y et al.", () => {
    expect(formatAuthors(["A", "B", "C", "D"])).toBe("A, B, C et al.");
  });
});

describe("parsePublications", () => {
  it("construye la publicación con título limpio, año, revista, DOI y enlace a PubMed", () => {
    expect(parsePublications(["1"], { "1": article() })).toEqual([
      {
        id: "1",
        title: "A study of BRCA2 variants",
        journal: "Journal of Genetics",
        year: "2024",
        authors: ["Torres-Esquius S", "Rossi M"],
        doi: "10.1000/abc",
        url: "https://pubmed.ncbi.nlm.nih.gov/1/",
      },
    ]);
  });

  it("ordena de la más reciente a la más antigua, sin fiarse del orden de PubMed", () => {
    const result = parsePublications(["1", "2", "3"], {
      "1": article({ sortpubdate: "2019/05/01 00:00", pubdate: "2019 May" }),
      "2": article({ sortpubdate: "2024/01/01 00:00", pubdate: "2024 Jan" }),
      "3": article({ sortpubdate: "2022/07/01 00:00", pubdate: "2022 Jul" }),
    });
    expect(result.map(({ year }) => year)).toEqual(["2024", "2022", "2019"]);
  });

  it("descarta las fe de erratas y los comentarios, que no son artículos suyos", () => {
    const result = parsePublications(["1", "2", "3"], {
      "1": article(),
      "2": article({ pubtype: ["Published Erratum"] }),
      "3": article({ pubtype: ["Journal Article", "Comment"] }),
    });
    expect(result.map(({ id }) => id)).toEqual(["1"]);
  });

  it("ignora los ids sin resumen y los repetidos", () => {
    const result = parsePublications(["1", "1", "9"], { "1": article() });
    expect(result).toHaveLength(1);
  });

  it("sin DOI no escribe la clave", () => {
    const [publication] = parsePublications(["1"], {
      "1": article({ articleids: [{ idtype: "pubmed", value: "1" }] }),
    });
    expect(publication).not.toHaveProperty("doi");
  });

  it("usa la abreviatura de la revista si no hay nombre completo", () => {
    const [publication] = parsePublications(["1"], {
      "1": article({ fulljournalname: undefined, source: "J Genet" }),
    });
    expect(publication!.journal).toBe("J Genet");
  });
});

describe("orderPublications", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const summary = { es: "", ca: "", en: "" };

  it("las destacadas van primero por su valor y el resto sigue en su orden", () => {
    const ordered = orderPublications(items, {
      d: { featured: 1, summary },
      b: { featured: 2, summary },
    });
    expect(ordered.map(({ id }) => id)).toEqual(["d", "b", "a", "c"]);
  });

  it("sin destacadas conserva el orden y no modifica la lista original", () => {
    const ordered = orderPublications(items, { a: { summary } });
    expect(ordered.map(({ id }) => id)).toEqual(["a", "b", "c", "d"]);
    expect(ordered).not.toBe(items);
  });
});

describe("publication-notes.json", () => {
  const data = notes as PublicationNotes;
  const ids = new Set(publications.map(({ id }) => id));

  it("cada nota es de una publicación que existe y tiene el resumen en los tres idiomas", () => {
    for (const [id, note] of Object.entries(data)) {
      expect(
        ids.has(id),
        `la nota ${id} no corresponde a ninguna publicación`
      ).toBe(true);
      for (const locale of ["es", "ca", "en"] as const) {
        expect(
          note.summary[locale].trim().length,
          `${id} ${locale}`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("los resúmenes caben en tres líneas: 210 caracteres como máximo", () => {
    for (const [id, note] of Object.entries(data)) {
      for (const locale of ["es", "ca", "en"] as const) {
        expect(
          note.summary[locale].length,
          `${id} ${locale}`
        ).toBeLessThanOrEqual(210);
      }
    }
  });

  it("los valores de destacada son enteros positivos y no se repiten", () => {
    const featured = Object.values(data).flatMap((note) =>
      note.featured === undefined ? [] : [note.featured]
    );
    expect(featured.every((n) => Number.isInteger(n) && n > 0)).toBe(true);
    expect(new Set(featured).size).toBe(featured.length);
  });

  it("la primera destacada es el artículo de Blood Advances y le siguen las demás primeras autorías", () => {
    const ordered = orderPublications(publications, data);
    expect(ordered.slice(0, 3).map(({ id }) => id)).toEqual([
      "41954619",
      "38648056",
      "38639421",
    ]);
    expect(ordered[0]!.journal).toBe("Blood advances");
  });
});
