// Soporte de los tests de tokens: lee los ficheros DTCG y aplica el resolver según la
// especificación 2025.10, sin depender de Terrazzo. TOKENS_ROOT permite apuntar a una copia.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export type Scheme = "light" | "dark";

export const tokensRoot =
  process.env.TOKENS_ROOT ?? fileURLToPath(new URL("..", import.meta.url));

export const readSource = (file: string) =>
  JSON.parse(readFileSync(join(tokensRoot, file), "utf8")) as Record<
    string,
    unknown
  >;

interface Source {
  $ref: string;
}
export interface Resolver {
  version: string;
  sets?: Record<string, { sources: Source[] }>;
  modifiers?: Record<
    string,
    { contexts: Record<string, Source[]>; default?: string }
  >;
  resolutionOrder: Source[];
}

export const readResolver = () =>
  readSource("tokens.resolver.json") as unknown as Resolver;

/** Ficheros de un esquema en orden de resolución: el último gana. */
export function sourceFilesFor(scheme: Scheme) {
  const resolver = readResolver();
  return resolver.resolutionOrder.flatMap(({ $ref }) => {
    const [, kind, name] = $ref.split("/");
    const sources =
      kind === "sets"
        ? resolver.sets?.[name!]?.sources
        : resolver.modifiers?.[name!]?.contexts[scheme];
    return (sources ?? []).map((source) => source.$ref);
  });
}

export const allSourceFiles = () => [
  ...new Set((["light", "dark"] as const).flatMap(sourceFilesFor)),
];

export interface Token {
  path: string;
  file: string;
  explicitType?: string;
  raw: unknown;
  alias?: string;
}

export interface ResolvedToken extends Token {
  type?: string;
  /** Valor literal tras seguir los alias. */
  value?: unknown;
  chain: string[];
  problem?: "missing" | "cycle";
}

const aliasOf = (value: unknown) =>
  typeof value === "string" ? /^\{([^{}]+)\}$/.exec(value)?.[1] : undefined;

function collect(
  node: Record<string, unknown>,
  path: string[],
  inheritedType: string | undefined,
  file: string,
  out: Map<string, Token>
) {
  const type = (node.$type as string | undefined) ?? inheritedType;
  if ("$value" in node) {
    out.set(path.join("."), {
      path: path.join("."),
      file,
      explicitType: type,
      raw: node.$value,
      alias: aliasOf(node.$value),
    });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$") || typeof child !== "object" || child === null)
      continue;
    collect(child as Record<string, unknown>, [...path, key], type, file, out);
  }
}

function resolveToken(token: Token, all: Map<string, Token>): ResolvedToken {
  const chain: string[] = [];
  let type = token.explicitType;
  let current = token;
  while (current.alias !== undefined) {
    if (chain.includes(current.alias) || current.alias === token.path)
      return { ...token, type, chain, problem: "cycle" };
    chain.push(current.alias);
    const target = all.get(current.alias);
    if (!target) return { ...token, type, chain, problem: "missing" };
    type ??= target.explicitType;
    current = target;
  }
  return {
    ...token,
    type: type ?? current.explicitType,
    value: current.raw,
    chain,
  };
}

/** Tokens de un esquema, con los alias resueltos. La clave es la ruta (`color.bg.page`). */
export function loadScheme(scheme: Scheme) {
  const raw = new Map<string, Token>();
  for (const file of sourceFilesFor(scheme))
    collect(readSource(file), [], undefined, file, raw);
  return new Map(
    [...raw.values()].map((token) => [token.path, resolveToken(token, raw)])
  );
}
