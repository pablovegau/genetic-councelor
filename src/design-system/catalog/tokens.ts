// Ayudas del catálogo para mostrar tokens: nombre completo, variable CSS y valor.
export interface FlatToken {
  path: string;
  value: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Aplana un árbol DTCG a una lista de tokens con su ruta completa (`color.action.bg`). */
export function flattenTokens(
  tree: Record<string, unknown>,
  prefix: string[] = []
): FlatToken[] {
  return Object.entries(tree).flatMap(([key, child]) => {
    if (key.startsWith("$") || !isRecord(child)) return [];
    const path = [...prefix, key];
    return "$value" in child
      ? [{ path: path.join("."), value: child.$value }]
      : flattenTokens(child, path);
  });
}

/** Nombre de la variable CSS de un token: la ruta con los puntos convertidos en guiones. */
export const tokenVariable = (path: string) => `--${path.replaceAll(".", "-")}`;

/** Lo que se pega en el CSS para usar el token. */
export const tokenReference = (path: string) => `var(${tokenVariable(path)})`;

/** Ruta a la que apunta un alias DTCG: `{color.violet.600}` → `color.violet.600`. */
export const aliasTarget = (alias: string) => alias.replace(/^\{|\}$/g, "");

/** Texto de un color oklch de DTCG, tal como se escribiría en CSS. */
export const formatOklch = ([lightness, chroma, hue]: number[]) =>
  `oklch(${lightness} ${chroma} ${hue})`;

const isAlias = (value: unknown): value is string =>
  typeof value === "string" && /^\{.+\}$/.test(value);

/** Valor de un token tal como se escribiría en CSS (o `→ ruta` si es un alias). */
export function formatTokenValue(value: unknown): string {
  if (isAlias(value)) return `→ ${aliasTarget(value)}`;
  if (isRecord(value) && "unit" in value) return `${value.value}${value.unit}`;
  if (Array.isArray(value) && value.every((item) => typeof item === "number"))
    return `cubic-bezier(${value.join(", ")})`;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

/** Equivalente en píxeles de una dimensión en rem (con 1 rem = 16 px); undefined si ya va en px. */
export function pixelEquivalent(value: unknown): string | undefined {
  if (!isRecord(value) || value.unit !== "rem") return undefined;
  return `${Number(value.value) * 16}px`;
}

/** Valor final de un token, siguiendo los alias; undefined si alguno no existe. */
export function resolveValue(
  value: unknown,
  lookup: Map<string, unknown>
): unknown {
  let current = value;
  for (let hops = 0; isAlias(current) && hops < 20; hops++) {
    const next = lookup.get(aliasTarget(current));
    if (next === undefined) return undefined;
    current = next;
  }
  return current;
}

/** Líneas de detalle de un token: su valor, a qué apunta si es un alias y el equivalente en píxeles. */
export function describeValue(
  value: unknown,
  lookup: Map<string, unknown>
): string[] {
  const resolved = resolveValue(value, lookup);
  const lines = [formatTokenValue(value)];
  if (isAlias(value) && resolved !== undefined)
    lines.push(`= ${formatTokenValue(resolved)}`);
  const pixels = pixelEquivalent(resolved);
  if (pixels) lines.push(pixels);
  return lines;
}
