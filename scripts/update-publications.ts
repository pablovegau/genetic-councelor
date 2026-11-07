// Descarga las publicaciones de Sara desde PubMed y las deja en src/data/publications.json.
// Se lanza a mano (`pnpm publications`) o desde .github/workflows/update-publications.yml.
// Si PubMed falla o devuelve menos de lo que ya hay, sale con error SIN tocar el fichero:
// es mejor publicar la última lista buena que una vacía.
import { readFileSync, writeFileSync } from "node:fs";
import {
  authorQuery,
  parsePublications,
  type Publication,
} from "../src/lib/publications.ts";

const base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const file = new URL("../src/data/publications.json", import.meta.url);

// PubMed pide identificarse (tool y, si hay, email) y limita las peticiones sin clave.
const identity = new URLSearchParams({ tool: "saratorresesquius-web" });
if (process.env.NCBI_EMAIL) identity.set("email", process.env.NCBI_EMAIL);
if (process.env.NCBI_API_KEY) identity.set("api_key", process.env.NCBI_API_KEY);

async function get(path: string, params: Record<string, string>) {
  const query = new URLSearchParams({ ...params, retmode: "json" });
  for (const [key, value] of identity) query.set(key, value);
  const response = await fetch(`${base}/${path}?${query}`);
  if (!response.ok) throw new Error(`PubMed ${path}: HTTP ${response.status}`);
  return response.json();
}

const search = await get("esearch.fcgi", {
  db: "pubmed",
  term: authorQuery,
  retmax: "200",
});
const ids: string[] = search.esearchresult?.idlist ?? [];
if (ids.length === 0) throw new Error("PubMed no devolvió ninguna publicación");

const summary = await get("esummary.fcgi", { db: "pubmed", id: ids.join(",") });
const publications = parsePublications(ids, summary.result ?? {});

const current: Publication[] = JSON.parse(readFileSync(file, "utf8"));
if (publications.length < current.length)
  throw new Error(
    `PubMed devolvió ${publications.length} publicaciones y ya hay ${current.length}: se revisa a mano`
  );

writeFileSync(file, `${JSON.stringify(publications, null, 2)}\n`);
console.log(`${publications.length} publicaciones (antes ${current.length})`);
