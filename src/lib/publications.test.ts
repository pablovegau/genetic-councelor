import { describe, expect, it } from "vitest";
import { cleanTitle, formatAuthors, parsePublications } from "./publications";

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
