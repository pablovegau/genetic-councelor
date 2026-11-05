// Publicaciones de Sara desde PubMed (E-utilities). Esta parte es pura: la descarga la hace
// scripts/update-publications.ts, que deja el resultado en src/data/publications.json.
export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: string;
  authors: string[];
  doi?: string;
  url: string;
}

/** Autora en el formato del índice de autores de PubMed (apellido e inicial). */
export const authorQuery = '"Torres-Esquius S"[Author]';

/** Tipos de publicación que no son un artículo de la autora (fe de erratas, comentarios). */
const excludedTypes = new Set(["Published Erratum", "Comment"]);

interface SummaryArticle {
  uid?: string;
  title?: string;
  fulljournalname?: string;
  source?: string;
  pubdate?: string;
  sortpubdate?: string;
  authors?: { name: string }[];
  articleids?: { idtype: string; value: string }[];
  pubtype?: string[];
}

/** PubMed devuelve los títulos con punto final y a veces con etiquetas (<i>, <sub>). */
export function cleanTitle(title: string): string {
  return title
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.$/, "");
}

/** «A, B, C et al.» a partir de tres autores; con menos, todos. */
export function formatAuthors(authors: string[], shown = 3): string {
  if (authors.length <= shown) return authors.join(", ");
  return `${authors.slice(0, shown).join(", ")} et al.`;
}

/** Convierte la respuesta de esummary en publicaciones, de la más reciente a la más antigua. */
export function parsePublications(
  ids: string[],
  result: Record<string, SummaryArticle | undefined>
): Publication[] {
  const seen = new Set<string>();
  const entries = ids.flatMap((id) => {
    const article = result[id];
    if (!article || seen.has(id)) return [];
    if (article.pubtype?.some((type) => excludedTypes.has(type))) return [];
    seen.add(id);
    const date = article.sortpubdate ?? "";
    const year = (article.pubdate ?? date).match(/\d{4}/)?.[0] ?? "";
    const doi = article.articleids?.find(
      ({ idtype }) => idtype === "doi"
    )?.value;
    const publication: Publication = {
      id,
      title: cleanTitle(article.title ?? ""),
      journal: article.fulljournalname ?? article.source ?? "",
      year,
      authors: (article.authors ?? []).map(({ name }) => name),
      ...(doi ? { doi } : {}),
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
    };
    return [{ publication, date }];
  });
  return entries
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        b.publication.id.localeCompare(a.publication.id)
    )
    .map(({ publication }) => publication);
}
