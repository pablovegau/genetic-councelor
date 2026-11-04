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
